'use client';

import { useEffect, useRef, useState } from 'react';

import {
  adminAddBankAccount,
  adminRemoveBankAccount,
  adminSetPrimaryBankAccount,
  adminUpdateBankAccount,
} from '../api/bank-accounts.js';
import { updateUserSchema } from '../config/update-user-schema.js';
import { useAdminBankAccountsQuery } from './use-admin-bank-accounts-query.js';
import { useBankAccountRows } from './use-bank-account-rows.js';
import {
  useBranchesQuery,
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
  useVietnamBanksQuery,
} from './use-org-directory.js';
import { useUpdateUserMutation } from './use-update-user-mutation.js';
import { useUserDetailQuery } from './use-user-detail-query.js';

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Same cascade rules as `use-create-user-form.js`'s `applyFieldChange` —
 * see there for why.
 * @param {import('../types/index.js').EditUserFormValues} values
 * @param {keyof import('../types/index.js').EditUserFormValues} field
 * @param {string | number | undefined} value
 */
function applyFieldChange(values, field, value) {
  const next = { ...values, [field]: value };

  if (field === 'companyId') {
    next.branchId = '';
    next.departmentId = '';
  }
  if (field === 'branchId') {
    next.departmentId = '';
  }
  if (field === 'addressType' && value === 'NewUnits') {
    next.district = '';
  }

  return /** @type {import('../types/index.js').EditUserFormValues} */ (next);
}

/**
 * The form before the detail record arrives. Every field the API accepts must
 * appear here — a field missing from this object is one the form silently
 * cannot edit.
 * @type {import('../types/index.js').EditUserFormValues}
 */
const EMPTY_EDIT_VALUES = {
  firstName: '',
  lastName: '',
  yearOfBirth: undefined,
  gender: '',
  nationalIdIssueDate: '',
  nationalIdIssuePlace: '',
  passportNumber: '',
  phone: '',
  addressType: 'NewUnits',
  province: '',
  district: '',
  ward: '',
  addressDetail: '',
  positionId: '',
  companyId: '',
  branchId: '',
  departmentId: '',
};

/**
 * @param {import('../types/index.js').UserDetail} user
 * @returns {import('../types/index.js').EditUserFormValues}
 */
function toFormValues(user) {
  return {
    firstName: user.firstName,
    lastName: user.lastName,
    yearOfBirth: user.yearOfBirth ?? undefined,
    gender: user.gender ?? '',
    nationalIdIssueDate: user.nationalIdIssueDate ?? '',
    nationalIdIssuePlace: user.nationalIdIssuePlace ?? '',
    passportNumber: user.passportNumber ?? '',
    phone: user.phone ?? '',
    addressType: user.addressType ?? 'NewUnits',
    province: user.province ?? '',
    district: user.district ?? '',
    ward: user.ward ?? '',
    addressDetail: user.addressDetail ?? '',
    positionId: user.positionId ?? '',
    companyId: user.companyId ?? '',
    branchId: user.branchId ?? '',
    departmentId: user.departmentIds[0] ?? '',
  };
}

/**
 * @param {import('../types/index.js').BankAccountApiItem} account
 * @returns {import('../types/index.js').BankAccountRow}
 */
function toBankAccountRow(account) {
  return {
    rowKey: account.id,
    bankAccountId: account.id,
    vietnamBankId: account.vietnamBankId,
    accountNumber: account.accountNumber,
    branch: account.branch ?? '',
    isPrimary: account.isPrimary,
  };
}

/**
 * Persists the bank accounts grid's edits against the snapshot it was
 * loaded with: new rows (no `bankAccountId`) are added, changed existing
 * rows are updated, a newly-checked primary is set, and rows present in
 * the original snapshot but missing from `rows` are removed. Every step
 * that can fail is collected into the returned messages instead of
 * aborting partway — `UpdateUser` itself already succeeded by the time
 * this runs, so a bank account failure shouldn't look like the whole save
 * failed.
 * @param {string} userId
 * @param {import('../types/index.js').BankAccountRow[]} rows
 * @param {import('../types/index.js').BankAccountApiItem[]} originalAccounts
 * @returns {Promise<string[]>}
 */
async function persistBankAccountRowChanges(userId, rows, originalAccounts) {
  /** @type {string[]} */
  const failures = [];
  const originalById = new Map(originalAccounts.map((account) => [account.id, account]));
  const remainingIds = new Set(originalAccounts.map((account) => account.id));

  for (const row of rows) {
    if (!row.bankAccountId) {
      if (!row.vietnamBankId || !row.accountNumber.trim()) continue;

      const result = await adminAddBankAccount(userId, row);
      if (!result.success) {
        failures.push(`${row.accountNumber}: ${result.message}`);
      }
      continue;
    }

    remainingIds.delete(row.bankAccountId);
    const original = originalById.get(row.bankAccountId);

    if (
      original &&
      (original.vietnamBankId !== row.vietnamBankId ||
        original.accountNumber !== row.accountNumber ||
        (original.branch ?? '') !== row.branch)
    ) {
      const result = await adminUpdateBankAccount(userId, row.bankAccountId, row);
      if (!result.success) {
        failures.push(`${row.accountNumber}: ${result.message}`);
      }
    }

    if (row.isPrimary && !original?.isPrimary) {
      const result = await adminSetPrimaryBankAccount(userId, row.bankAccountId);
      if (!result.success) {
        failures.push(`${row.accountNumber}: ${result.message}`);
      }
    }
  }

  for (const removedId of remainingIds) {
    const result = await adminRemoveBankAccount(userId, removedId);
    if (!result.success) {
      const removedAccount = originalById.get(removedId);
      failures.push(`${removedAccount?.accountNumber ?? removedId}: ${result.message}`);
    }
  }

  return failures;
}

/**
 * @param {import('../types/index.js').UserListItem} user The list row that was
 *   clicked. Only its `id` is used — the form values come from the detail
 *   endpoint, because the row is a slim projection (see below).
 * @param {{ onSuccess?: () => void }} [options]
 */
export function useEditUserForm(user, { onSuccess } = {}) {
  // Starts blank rather than seeded from the list row. The row has no
  // passport number, CCCD issue date/place, year of birth or address
  // (docs/security.md, M-4), and `PUT` replaces everything — seeding from it
  // and saving before the detail arrives would erase those fields. The form
  // is gated on `isLoadingUser` until the real record lands.
  const [values, setValues] = useState(EMPTY_EDIT_VALUES);
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const companiesQuery = useCompaniesQuery();
  const branchesQuery = useBranchesQuery(values.companyId);
  const departmentsQuery = useDepartmentsQuery();
  const positionsQuery = usePositionsQuery();
  const vietnamBanksQuery = useVietnamBanksQuery();
  const bankAccountsQuery = useAdminBankAccountsQuery(user.id);
  const updateUserMutation = useUpdateUserMutation();

  // The list row is a slim projection — it has no passport number, national-ID
  // issue date/place, year of birth or address (docs/security.md, M-4). Seeding
  // the form from it and saving would write those blanks back over the real
  // values, so the full record is fetched and the form re-seeded once it lands.
  const userDetailQuery = useUserDetailQuery(user.id);
  const hasSeededFromDetailRef = useRef(false);
  // Derived from the query, not the seeding ref — a ref mutation does not
  // re-render, so the form would stay stuck on its loading state.
  const isLoadingUser = !userDetailQuery.data?.success;

  useEffect(() => {
    if (hasSeededFromDetailRef.current || !userDetailQuery.data?.success) return;

    setValues(toFormValues(userDetailQuery.data.user));
    hasSeededFromDetailRef.current = true;
  }, [userDetailQuery.data]);

  const departmentsInBranch = (departmentsQuery.data ?? []).filter(
    (department) => department.branchId === values.branchId,
  );

  const { rows: bankAccountRowsState, setRows: setBankAccountRows, addRow: addBankAccountRow, removeRow: removeBankAccountRow, clearRows: clearBankAccountRows, updateRowField: updateBankAccountRowField, setPrimaryRow: setPrimaryBankAccountRow } =
    useBankAccountRows();

  // The grid is seeded from the server exactly once, the first time the
  // list query resolves — re-seeding on every background refetch would
  // wipe out whatever the Admin is mid-editing in the grid.
  const hasSeededBankAccountRowsRef = useRef(false);
  const originalBankAccountsRef = useRef(
    /** @type {import('../types/index.js').BankAccountApiItem[]} */ ([]),
  );

  useEffect(() => {
    if (hasSeededBankAccountRowsRef.current || !bankAccountsQuery.data?.success) return;

    originalBankAccountsRef.current = bankAccountsQuery.data.bankAccounts;
    setBankAccountRows(bankAccountsQuery.data.bankAccounts.map(toBankAccountRow));
    hasSeededBankAccountRowsRef.current = true;
  }, [bankAccountsQuery.data, setBankAccountRows]);

  /**
   * @param {string} field
   * @param {string | number | undefined} value
   */
  function setField(field, value) {
    setValues((current) =>
      applyFieldChange(
        current,
        /** @type {keyof import('../types/index.js').EditUserFormValues} */ (
          field
        ),
        value,
      ),
    );
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const result = updateUserSchema.safeParse(values);
    if (!result.success) {
      /** @type {Record<string, string>} */
      const nextFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!nextFieldErrors[key]) {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    const updateResult = await updateUserMutation.mutateAsync({
      userId: user.id,
      values: result.data,
    });

    if (!updateResult.success) {
      setSubmitError(updateResult.message ?? 'Cập nhật người dùng thất bại');
      return;
    }

    const bankAccountFailures = await persistBankAccountRowChanges(
      user.id,
      bankAccountRowsState,
      originalBankAccountsRef.current,
    );

    if (bankAccountFailures.length > 0) {
      setSubmitSuccess(
        `Đã cập nhật người dùng, nhưng ${bankAccountFailures.length} tài khoản ngân hàng lưu thất bại: ${bankAccountFailures.join('; ')}`,
      );
    }

    onSuccess?.();
  }

  return {
    values,
    setField,
    isLoadingUser,
    fieldStatuses: {
      firstName: fieldStatus(fieldErrors.firstName),
      lastName: fieldStatus(fieldErrors.lastName),
      yearOfBirth: fieldStatus(fieldErrors.yearOfBirth),
      gender: fieldStatus(fieldErrors.gender),
      nationalIdIssueDate: fieldStatus(fieldErrors.nationalIdIssueDate),
      nationalIdIssuePlace: fieldStatus(fieldErrors.nationalIdIssuePlace),
      passportNumber: fieldStatus(fieldErrors.passportNumber),
      phone: fieldStatus(fieldErrors.phone),
      province: fieldStatus(fieldErrors.province),
      district: fieldStatus(fieldErrors.district),
      ward: fieldStatus(fieldErrors.ward),
      addressDetail: fieldStatus(fieldErrors.addressDetail),
      positionId: fieldStatus(fieldErrors.positionId),
      companyId: fieldStatus(fieldErrors.companyId),
      branchId: fieldStatus(fieldErrors.branchId),
      departmentId: fieldStatus(fieldErrors.departmentId),
    },
    submitError,
    submitSuccess,
    isSubmitting: updateUserMutation.isPending,
    companies: companiesQuery.data ?? [],
    branches: branchesQuery.data ?? [],
    departments: departmentsInBranch,
    positions: positionsQuery.data ?? [],
    vietnamBanks: vietnamBanksQuery.data ?? [],
    bankAccountRows: bankAccountRowsState,
    addBankAccountRow,
    removeBankAccountRow,
    clearBankAccountRows,
    updateBankAccountRowField,
    setPrimaryBankAccountRow,
    extraPermissions: userDetailQuery.data?.success
      ? userDetailQuery.data.user.extraPermissions
      : [],
    handleSubmit,
  };
}

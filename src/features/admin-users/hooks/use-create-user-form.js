'use client';

import { useState } from 'react';

import { adminAddBankAccount } from '../api/bank-accounts.js';
import { createUserSchema } from '../config/create-user-schema.js';
import { useBankAccountRows } from './use-bank-account-rows.js';
import { useCreateUserMutation } from './use-create-user-mutation.js';
import {
  useBranchesQuery,
  useCompaniesQuery,
  useDepartmentsQuery,
  usePositionsQuery,
  useVietnamBanksQuery,
} from './use-org-directory.js';

/** @type {import('../types/index.js').CreateUserFormValues} */
const EMPTY_VALUES = {
  nationalId: '',
  firstName: '',
  lastName: '',
  password: '',
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

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Company → Branch → Department is a cascade: picking a new Company clears
 * the (now stale) Branch and Department, and picking a new Branch clears
 * the (now stale) Department. Switching address type to `NewUnits` clears
 * `district` too, since the backend rejects a non-empty district for that
 * type (post-2025-merger units have no district level).
 * @param {import('../types/index.js').CreateUserFormValues} values
 * @param {keyof import('../types/index.js').CreateUserFormValues} field
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

  return /** @type {import('../types/index.js').CreateUserFormValues} */ (next);
}

/**
 * Persists every row that has both a bank and an account number (empty
 * rows the user added but never filled in are silently dropped, not an
 * error). Sent sequentially, not in parallel: the first one saved becomes
 * primary regardless of the row's local `isPrimary` flag (same "first
 * account is always primary" rule as the self-service API), so row order
 * must be preserved.
 * @param {string} userId
 * @param {import('../types/index.js').BankAccountRow[]} rows
 * @param {string} token
 * @returns {Promise<string[]>} human-readable messages for rows that failed to save
 */
async function addFilledBankAccountRows(userId, rows, token) {
  /** @type {string[]} */
  const failures = [];

  for (const row of rows) {
    if (!row.vietnamBankId || !row.accountNumber.trim()) continue;

    const result = await adminAddBankAccount(userId, row, token);
    if (!result.success) {
      failures.push(`${row.accountNumber}: ${result.message}`);
    }
  }

  return failures;
}

/**
 * @param {string} token
 * @param {{ onSuccess?: () => void }} [options]
 */
export function useCreateUserForm(token, { onSuccess } = {}) {
  const [values, setValues] = useState(EMPTY_VALUES);
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
  const createUserMutation = useCreateUserMutation(token);
  const bankAccountRows = useBankAccountRows();

  const departmentsInBranch = (departmentsQuery.data ?? []).filter(
    (department) => department.branchId === values.branchId,
  );

  /**
   * @param {string} field
   * @param {string | number | undefined} value
   */
  function setField(field, value) {
    setValues((current) =>
      applyFieldChange(
        current,
        /** @type {keyof import('../types/index.js').CreateUserFormValues} */ (
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

    const result = createUserSchema.safeParse(values);
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
    const createResult = await createUserMutation.mutateAsync(result.data);

    if (!createResult.success) {
      setSubmitError(createResult.message ?? 'Tạo người dùng thất bại');
      return;
    }

    const bankAccountFailures = await addFilledBankAccountRows(
      createResult.id,
      bankAccountRows.rows,
      token,
    );

    setSubmitSuccess(
      bankAccountFailures.length === 0
        ? 'Đã tạo người dùng thành công.'
        : `Đã tạo người dùng thành công, nhưng ${bankAccountFailures.length} tài khoản ngân hàng lưu thất bại: ${bankAccountFailures.join('; ')}`,
    );
    setValues(EMPTY_VALUES);
    bankAccountRows.clearRows();
    onSuccess?.();
  }

  return {
    values,
    setField,
    fieldStatuses: {
      nationalId: fieldStatus(fieldErrors.nationalId),
      firstName: fieldStatus(fieldErrors.firstName),
      lastName: fieldStatus(fieldErrors.lastName),
      password: fieldStatus(fieldErrors.password),
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
    isSubmitting: createUserMutation.isPending,
    companies: companiesQuery.data ?? [],
    branches: branchesQuery.data ?? [],
    departments: departmentsInBranch,
    positions: positionsQuery.data ?? [],
    vietnamBanks: vietnamBanksQuery.data ?? [],
    bankAccountRows: bankAccountRows.rows,
    addBankAccountRow: bankAccountRows.addRow,
    removeBankAccountRow: bankAccountRows.removeRow,
    clearBankAccountRows: bankAccountRows.clearRows,
    updateBankAccountRowField: bankAccountRows.updateRowField,
    setPrimaryBankAccountRow: bankAccountRows.setPrimaryRow,
    handleSubmit,
  };
}

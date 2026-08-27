'use client';

import { useState } from 'react';

import { contractSchema } from '../config/contract-schema.js';
import { DEFAULT_CURRENCY } from '../config/currencies.js';
import { useContractBanksQuery } from './use-contract-banks-query.js';
import { useContractNumberExistsQuery } from './use-contract-number-exists-query.js';
import {
  useCreateContractMutation,
  useUpdateContractMutation,
} from './use-contracts-query.js';
import { useCustomersQuery } from './use-customers-query.js';
import { useExtraFieldRows } from './use-extra-field-rows.js';
import { useBranchesQuery, useCompaniesQuery } from './use-org-directory.js';
import { usePaymentTermRows } from './use-payment-term-rows.js';

const TODAY_ISO = new Date().toISOString().slice(0, 10);
const CURRENT_YEAR = new Date().getFullYear();

/** @returns {import('../types/index.js').ContractFormValues} */
function emptyValues() {
  return {
    contractNumber: '',
    createdDate: TODAY_ISO,
    quotationDate: TODAY_ISO,
    projectName: '',
    category: '',
    exportCountry: '',
    portOfLoading: '',
    portOrPlaceOfDestination: '',
    contractValue: undefined,
    currency: DEFAULT_CURRENCY,
    incoterm: '',
    incotermYear: CURRENT_YEAR,
    companyId: '',
    branchId: '',
    sourceCustomerId: '',
    partyAInline: {
      companyName: '',
      representativeName: '',
      representativeTitle: '',
      address: '',
    },
    bankIds: [],
  };
}

/**
 * @param {import('../types/index.js').Contract} contract
 * @returns {import('../types/index.js').ContractFormValues}
 */
function valuesFromContract(contract) {
  return {
    contractNumber: contract.contractNumber,
    createdDate: contract.createdDate,
    quotationDate: contract.quotationDate,
    projectName: contract.projectName,
    category: contract.category,
    exportCountry: contract.exportCountry,
    portOfLoading: contract.portOfLoading,
    portOrPlaceOfDestination: contract.portOrPlaceOfDestination,
    contractValue: contract.contractValue,
    currency: contract.currency,
    incoterm: contract.incoterm,
    incotermYear: contract.incotermYear,
    // Branch is fixed after creation (the backend never accepts a changed
    // BranchId on update) — companyId is left blank since it only exists to
    // narrow the create-mode Branch selector.
    companyId: '',
    branchId: contract.branchId ?? '',
    sourceCustomerId: contract.partyA.sourceCustomerId ?? '',
    // RepresentativeName/RepresentativeTitle/Address are per-contract even
    // when linked to a source customer (only CompanyName is pinned to the
    // catalog) — always load the contract's own stored values, never blank
    // them out based on sourceCustomerId.
    partyAInline: {
      companyName: contract.partyA.sourceCustomerId
        ? ''
        : contract.partyA.companyName,
      representativeName: contract.partyA.representativeName ?? '',
      representativeTitle: contract.partyA.representativeTitle ?? '',
      address: contract.partyA.address ?? '',
    },
    bankIds: contract.bankIds,
  };
}

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Single hook backing both the create and edit Contract dialog — there is
 * no legacy version of this form to keep separate (unlike admin-users'
 * v1/v2 split), so one mode-aware hook is simplest.
 * @param {{ contract?: import('../types/index.js').Contract | null, onSuccess?: () => void }} [options]
 */
export function useContractForm({ contract = null, onSuccess } = {}) {
  const isEdit = Boolean(contract);

  const [values, setValues] = useState(
    contract ? valuesFromContract(contract) : emptyValues(),
  );
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState('');

  const companiesQuery = useCompaniesQuery();
  const branchesQuery = useBranchesQuery(values.companyId ?? '');
  const customersQuery = useCustomersQuery();
  const banksQuery = useContractBanksQuery();

  const paymentTermRows = usePaymentTermRows(
    contract
      ? contract.paymentTerms.map((term) => ({
          rowKey: term.id,
          paymentRatioPercent: term.paymentRatioPercent,
          paymentCondition: term.paymentCondition,
        }))
      : undefined,
  );
  const partyAExtraFieldRows = useExtraFieldRows(
    (contract?.partyA.extraFields ?? []).map((field) => ({
      rowKey: crypto.randomUUID(),
      key: field.key,
      value: field.value,
    })),
  );

  const createMutation = useCreateContractMutation();
  const updateMutation = useUpdateContractMutation();

  const contractNumberExistsQuery = useContractNumberExistsQuery({
    contractNumber: values.contractNumber,
    excludeContractId: contract?.id,
  });

  /**
   * @param {string} field
   * @param {string | number | undefined} value
   */
  function setField(field, value) {
    setValues((current) => {
      const next = { ...current, [field]: value };
      if (field === 'companyId') next.branchId = '';
      return next;
    });
  }

  /**
   * @param {'companyName' | 'representativeName' | 'representativeTitle' | 'address'} field
   * @param {string} value
   */
  function setPartyAInlineField(field, value) {
    setValues((current) => ({
      ...current,
      partyAInline: { ...current.partyAInline, [field]: value },
    }));
  }

  /**
   * Selecting an existing customer prefills representative/title/address/
   * extra fields from its current catalog record — a starting point the
   * user can still edit per contract, since only CompanyName stays pinned
   * to the catalog (see `docs/api/Contracts.md`, BE-kt-xnk). `knownCustomer`
   * lets a caller that already has the full record (the quick-create dialog,
   * whose freshly-created customer may not be in `customersQuery`'s cache
   * yet) skip the lookup.
   * @param {string} customerId
   * @param {import('../types/index.js').Customer} [knownCustomer]
   */
  function selectExistingCustomer(customerId, knownCustomer) {
    const customers = customersQuery.data?.success
      ? customersQuery.data.customers
      : [];
    const customer =
      knownCustomer ??
      customers.find((candidate) => candidate.id === customerId);

    setValues((current) => ({
      ...current,
      sourceCustomerId: customerId,
      partyAInline: {
        companyName: '',
        representativeName: customer?.representativeName ?? '',
        representativeTitle: customer?.representativeTitle ?? '',
        address: customer?.address ?? '',
      },
    }));
    partyAExtraFieldRows.setRows(
      (customer?.extraFields ?? []).map((field) => ({
        rowKey: crypto.randomUUID(),
        key: field.key,
        value: field.value,
      })),
    );
  }

  function switchToInlinePartyA() {
    setValues((current) => ({ ...current, sourceCustomerId: '' }));
  }

  /** @param {string[]} bankIds */
  function setBankIds(bankIds) {
    setValues((current) => ({ ...current, bankIds }));
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    setSubmitSuccess('');

    const candidate = {
      ...values,
      paymentTerms: paymentTermRows.rows.map((row) => ({
        paymentRatioPercent: row.paymentRatioPercent,
        paymentCondition: row.paymentCondition,
      })),
    };

    const result = contractSchema.safeParse(candidate);
    if (!result.success) {
      /** @type {Record<string, string>} */
      const nextFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join('.');
        if (!nextFieldErrors[key]) {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    const extra = {
      paymentTerms: result.data.paymentTerms,
      partyAExtraFieldRows: partyAExtraFieldRows.rows,
    };

    const mutationResult = contract
      ? await updateMutation.mutateAsync({
          contractId: contract.id,
          values: result.data,
          extra,
        })
      : await createMutation.mutateAsync({ values: result.data, extra });

    if (!mutationResult.success) {
      setSubmitError(mutationResult.message);
      return;
    }

    setSubmitSuccess(isEdit ? 'Đã cập nhật hợp đồng.' : 'Đã tạo hợp đồng.');
    onSuccess?.();
  }

  /** @type {Record<string, { type: 'error', message: string } | undefined>} */
  const baseFieldStatuses = Object.fromEntries(
    Object.entries(fieldErrors).map(([key, message]) => [
      key,
      fieldStatus(message),
    ]),
  );

  // Schema errors (e.g. "required") win over the duplicate-number check —
  // both would otherwise fight for the same status slot.
  /** @type {{ type: 'error', message: string } | undefined} */
  const contractNumberDuplicateStatus =
    contractNumberExistsQuery.result?.success &&
    contractNumberExistsQuery.result.exists
      ? { type: 'error', message: 'Số hợp đồng này đã được sử dụng' }
      : undefined;

  /** @type {Record<string, { type: 'error', message: string } | undefined>} */
  const fieldStatuses = {
    ...baseFieldStatuses,
    contractNumber:
      baseFieldStatuses.contractNumber ?? contractNumberDuplicateStatus,
  };

  return {
    mode: isEdit ? 'edit' : 'create',
    title: isEdit ? 'CẬP NHẬT HỢP ĐỒNG' : 'TẠO HỢP ĐỒNG',
    submitLabel: isEdit ? 'Lưu thay đổi' : 'Tạo hợp đồng',
    values,
    setField,
    setPartyAInlineField,
    selectExistingCustomer,
    switchToInlinePartyA,
    setBankIds,
    fieldStatuses,
    isCheckingContractNumber: contractNumberExistsQuery.isChecking,
    companies: companiesQuery.data ?? [],
    branches: branchesQuery.data ?? [],
    isBranchFixed: isEdit,
    fixedBranchId: contract?.branchId ?? null,
    customers: customersQuery.data?.success
      ? customersQuery.data.customers
      : [],
    banks: banksQuery.data?.success ? banksQuery.data.banks : [],
    paymentTermRows,
    partyAExtraFieldRows,
    submitError,
    submitSuccess,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
  };
}

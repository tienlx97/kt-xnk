'use client';

import { useState } from 'react';

import { serviceAgreementSchema } from '../config/service-agreement-schema.js';
import { useCustomersQuery } from './use-customers-query.js';
import { usePaymentTermRows } from './use-payment-term-rows.js';
import {
  useCreateServiceAgreementMutation,
  useUpdateServiceAgreementMutation,
} from './use-service-agreement-query.js';

const TODAY_ISO = new Date().toISOString().slice(0, 10);

/** @returns {import('../types/index.js').ServiceAgreementFormValues} */
function emptyValues() {
  return {
    signedDate: TODAY_ISO,
    partyCustomerId: '',
    value: undefined,
    sellerSigned: false,
    partySigned: false,
  };
}

/** @param {import('../types/index.js').ServiceAgreement} serviceAgreement */
function valuesFromServiceAgreement(serviceAgreement) {
  return {
    signedDate: serviceAgreement.signedDate,
    partyCustomerId: serviceAgreement.partyCustomerId,
    value: serviceAgreement.value,
    sellerSigned: serviceAgreement.sellerSigned,
    partySigned: serviceAgreement.partySigned,
  };
}

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Single hook backing both the create and edit Service Agreement dialog —
 * mirrors `useContractForm`'s create/edit merge. Pass `serviceAgreement` to
 * edit the existing one — a contract has at most one, so there is no list
 * to pick from, only "create" (none yet) or "edit" (one exists).
 * @param {{
 *   contractId: string,
 *   serviceAgreement?: import('../types/index.js').ServiceAgreement | null,
 *   onSuccess?: (serviceAgreement: import('../types/index.js').ServiceAgreement) => void,
 * }} options
 */
export function useServiceAgreementForm({
  contractId,
  serviceAgreement = null,
  onSuccess,
}) {
  const isEdit = Boolean(serviceAgreement);

  const [values, setValues] = useState(
    serviceAgreement
      ? valuesFromServiceAgreement(serviceAgreement)
      : emptyValues(),
  );
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  const customersQuery = useCustomersQuery();

  const paymentTermRows = usePaymentTermRows(
    serviceAgreement
      ? serviceAgreement.paymentTerms.map((term) => ({
          rowKey: term.id,
          paymentRatioPercent: term.paymentRatioPercent,
          paymentCondition: term.paymentCondition,
        }))
      : undefined,
  );

  const createMutation = useCreateServiceAgreementMutation(contractId);
  const updateMutation = useUpdateServiceAgreementMutation(contractId);

  /**
   * @template {keyof import('../types/index.js').ServiceAgreementFormValues} K
   * @param {K} field
   * @param {import('../types/index.js').ServiceAgreementFormValues[K]} value
   */
  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const candidate = {
      ...values,
      paymentTerms: paymentTermRows.rows.map((row) => ({
        paymentRatioPercent: row.paymentRatioPercent,
        paymentCondition: row.paymentCondition,
      })),
    };

    const result = serviceAgreementSchema.safeParse(candidate);
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

    const { paymentTerms, ...submittedValues } = result.data;
    const mutationResult = serviceAgreement
      ? await updateMutation.mutateAsync({
          values: submittedValues,
          paymentTerms,
        })
      : await createMutation.mutateAsync({
          values: submittedValues,
          paymentTerms,
        });

    if (!mutationResult.success) {
      setSubmitError(mutationResult.message);
      return;
    }

    onSuccess?.(mutationResult.serviceAgreement);
  }

  return {
    mode: isEdit ? 'edit' : 'create',
    title: isEdit ? 'CẬP NHẬT SERVICE AGREEMENT' : 'TẠO SERVICE AGREEMENT',
    submitLabel: isEdit ? 'Lưu thay đổi' : 'Tạo Service Agreement',
    values,
    setField,
    fieldStatuses: Object.fromEntries(
      Object.entries(fieldErrors).map(([key, message]) => [
        key,
        fieldStatus(message),
      ]),
    ),
    customers: customersQuery.data?.success
      ? customersQuery.data.customers
      : [],
    paymentTermRows,
    submitError,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
  };
}

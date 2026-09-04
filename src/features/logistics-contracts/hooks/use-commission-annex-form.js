'use client';

import { useState } from 'react';

import { commissionAnnexSchema } from '../config/commission-annex-schema.js';
import {
  useCreateCommissionAnnexMutation,
  useUpdateCommissionAnnexMutation,
} from './use-commission-annexes-query.js';

/** @returns {import('../types/index.js').CommissionAnnexFormValues} */
function emptyValues() {
  return {
    signedDate: '',
    type: '',
    amount: undefined,
    sellerSigned: false,
    partySigned: false,
  };
}

/** @param {import('../types/index.js').CommissionAnnex} annex */
function valuesFromAnnex(annex) {
  return {
    signedDate: annex.signedDate,
    type: annex.type,
    amount: annex.amount,
    sellerSigned: annex.sellerSigned,
    partySigned: annex.partySigned,
  };
}

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Form state for creating/updating a `CommissionAnnex`. Pass `annex`
 * to edit an existing one — `annexNumber`/`annexCode` are never editable
 * (backend-assigned), so they never appear in `values`.
 * @param {{
 *   contractId: string,
 *   annex?: import('../types/index.js').CommissionAnnex | null,
 *   onSuccess?: (annex: import('../types/index.js').CommissionAnnex) => void,
 * }} options
 */
export function useCommissionAnnexForm({
  contractId,
  annex = null,
  onSuccess,
}) {
  const [values, setValues] = useState(
    annex ? valuesFromAnnex(annex) : emptyValues(),
  );
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  const createMutation = useCreateCommissionAnnexMutation(contractId);
  const updateMutation = useUpdateCommissionAnnexMutation(contractId);

  /**
   * @template {keyof import('../types/index.js').CommissionAnnexFormValues} K
   * @param {K} field
   * @param {import('../types/index.js').CommissionAnnexFormValues[K]} value
   */
  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setValues(annex ? valuesFromAnnex(annex) : emptyValues());
    setFieldErrors({});
    setSubmitError('');
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} [event] */
  async function handleSubmit(event) {
    event?.preventDefault();
    setSubmitError('');

    const result = commissionAnnexSchema.safeParse(values);
    if (!result.success) {
      /** @type {Record<string, string>} */
      const nextFieldErrors = {};
      for (const issue of result.error.issues) {
        nextFieldErrors[String(issue.path[0])] = issue.message;
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});

    const mutationResult = annex
      ? await updateMutation.mutateAsync({
          annexId: annex.id,
          values: result.data,
        })
      : await createMutation.mutateAsync(result.data);

    if (!mutationResult.success) {
      setSubmitError(mutationResult.message);
      return;
    }

    onSuccess?.(mutationResult.annex);
    if (!annex) reset();
  }

  return {
    values,
    setField,
    fieldStatuses: Object.fromEntries(
      Object.entries(fieldErrors).map(([key, message]) => [
        key,
        fieldStatus(message),
      ]),
    ),
    submitError,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    handleSubmit,
    reset,
  };
}

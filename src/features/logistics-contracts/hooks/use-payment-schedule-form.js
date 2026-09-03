'use client';

import { useState } from 'react';

import { paymentScheduleSchema } from '../config/payment-schedule-schema.js';
import {
  useCreatePaymentScheduleMutation,
  useUpdatePaymentScheduleMutation,
} from './use-payment-schedules-query.js';

/** @returns {import('../types/index.js').PaymentScheduleFormValues} */
function emptyValues() {
  return {
    paymentDate: '',
    amount: undefined,
    type: '',
    note: '',
  };
}

/** @param {import('../types/index.js').PaymentSchedule} schedule */
function valuesFromSchedule(schedule) {
  return {
    paymentDate: schedule.paymentDate,
    amount: schedule.amount,
    type: schedule.type,
    note: schedule.note ?? '',
  };
}

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

/**
 * Form state for creating/updating a `PaymentSchedule`. Pass `schedule` to
 * edit an existing one — `paymentNumber`/`paymentCode` are never editable
 * (backend-assigned), so they never appear in `values`.
 * @param {{
 *   contractId: string,
 *   schedule?: import('../types/index.js').PaymentSchedule | null,
 *   onSuccess?: (schedule: import('../types/index.js').PaymentSchedule) => void,
 * }} options
 */
export function usePaymentScheduleForm({
  contractId,
  schedule = null,
  onSuccess,
}) {
  const [values, setValues] = useState(
    schedule ? valuesFromSchedule(schedule) : emptyValues(),
  );
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  const createMutation = useCreatePaymentScheduleMutation(contractId);
  const updateMutation = useUpdatePaymentScheduleMutation(contractId);

  /**
   * @template {keyof import('../types/index.js').PaymentScheduleFormValues} K
   * @param {K} field
   * @param {import('../types/index.js').PaymentScheduleFormValues[K]} value
   */
  function setField(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function reset() {
    setValues(schedule ? valuesFromSchedule(schedule) : emptyValues());
    setFieldErrors({});
    setSubmitError('');
  }

  /** @param {import('react').FormEvent<HTMLFormElement>} [event] */
  async function handleSubmit(event) {
    event?.preventDefault();
    setSubmitError('');

    const result = paymentScheduleSchema.safeParse(values);
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

    const mutationResult = schedule
      ? await updateMutation.mutateAsync({
          paymentScheduleId: schedule.id,
          values: result.data,
        })
      : await createMutation.mutateAsync(result.data);

    if (!mutationResult.success) {
      setSubmitError(mutationResult.message);
      return;
    }

    onSuccess?.(mutationResult.schedule);
    if (!schedule) reset();
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

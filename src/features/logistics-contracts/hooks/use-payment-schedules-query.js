'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createPaymentSchedule,
  listPaymentSchedules,
  updatePaymentSchedule,
} from '../api/payment-schedules.js';

/** @param {string} contractId */
const queryKey = (contractId) => [
  'logistics-contracts',
  'payment-schedules',
  contractId,
];

/**
 * Per-contract payment schedule list — only meaningful once a contract
 * exists, so disabled until `contractId` is set (e.g. before the row
 * expansion panel that owns this query has mounted).
 * @param {string | undefined} contractId
 */
export function usePaymentSchedulesQuery(contractId) {
  return useQuery({
    queryKey: queryKey(contractId ?? ''),
    queryFn: () => listPaymentSchedules(/** @type {string} */ (contractId)),
    enabled: Boolean(contractId),
  });
}

/** @param {string} contractId */
export function useCreatePaymentScheduleMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {import('../types/index.js').PaymentScheduleFormValues} */ values,
    ) => createPaymentSchedule(contractId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

/** @param {string} contractId */
export function useUpdatePaymentScheduleMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ paymentScheduleId: string, values: import('../types/index.js').PaymentScheduleFormValues }} */ {
        paymentScheduleId,
        values,
      },
    ) => updatePaymentSchedule(contractId, paymentScheduleId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

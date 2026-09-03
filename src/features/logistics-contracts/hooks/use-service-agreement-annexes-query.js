'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createServiceAgreementAnnex,
  listServiceAgreementAnnexes,
  updateServiceAgreementAnnex,
} from '../api/service-agreement-annexes.js';

/** @param {string} contractId */
const queryKey = (contractId) => [
  'logistics-contracts',
  'service-agreement-annexes',
  contractId,
];

/**
 * Per-contract annex list for the contract's `ServiceAgreement` — only
 * meaningful once one exists, so disabled until `contractId` is set.
 * @param {string | undefined} contractId
 */
export function useServiceAgreementAnnexesQuery(contractId) {
  return useQuery({
    queryKey: queryKey(contractId ?? ''),
    queryFn: () =>
      listServiceAgreementAnnexes(/** @type {string} */ (contractId)),
    enabled: Boolean(contractId),
  });
}

/** @param {string} contractId */
export function useCreateServiceAgreementAnnexMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {import('../types/index.js').ServiceAgreementAnnexFormValues} */ values,
    ) => createServiceAgreementAnnex(contractId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

/** @param {string} contractId */
export function useUpdateServiceAgreementAnnexMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ annexId: string, values: import('../types/index.js').ServiceAgreementAnnexFormValues }} */ {
        annexId,
        values,
      },
    ) => updateServiceAgreementAnnex(contractId, annexId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

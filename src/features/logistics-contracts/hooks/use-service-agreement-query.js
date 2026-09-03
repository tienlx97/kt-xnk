'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createServiceAgreement,
  getServiceAgreement,
  updateServiceAgreement,
} from '../api/service-agreements.js';

/** @param {string} contractId */
const queryKey = (contractId) => [
  'logistics-contracts',
  'service-agreement',
  contractId,
];

/**
 * At most one per contract, optional — a 404 folds into
 * `{ success: true, exists: false }` (see `api/service-agreements.js`), not
 * a query error. Disabled until `contractId` is set.
 * @param {string | undefined} contractId
 */
export function useServiceAgreementQuery(contractId) {
  return useQuery({
    queryKey: queryKey(contractId ?? ''),
    queryFn: () => getServiceAgreement(/** @type {string} */ (contractId)),
    enabled: Boolean(contractId),
  });
}

/** @param {string} contractId */
export function useCreateServiceAgreementMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').ServiceAgreementFormValues, paymentTerms: Parameters<typeof createServiceAgreement>[2] }} */ {
        values,
        paymentTerms,
      },
    ) => createServiceAgreement(contractId, values, paymentTerms),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

/** @param {string} contractId */
export function useUpdateServiceAgreementMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').ServiceAgreementFormValues, paymentTerms: Parameters<typeof updateServiceAgreement>[2] }} */ {
        values,
        paymentTerms,
      },
    ) => updateServiceAgreement(contractId, values, paymentTerms),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

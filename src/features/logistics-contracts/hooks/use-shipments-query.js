'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createShipment, listShipments, updateShipment } from '../api/shipments.js';

/** @param {string} contractId */
const queryKey = (contractId) => ['logistics-contracts', 'shipments', contractId];

/**
 * Per-contract shipment list — only meaningful once a contract exists, so
 * disabled until `contractId` is set (e.g. before the row expansion panel
 * that owns this query has mounted).
 * @param {string | undefined} contractId
 */
export function useShipmentsQuery(contractId) {
  return useQuery({
    queryKey: queryKey(contractId ?? ''),
    queryFn: () => listShipments(/** @type {string} */ (contractId)),
    enabled: Boolean(contractId),
  });
}

/** @param {string} contractId */
export function useCreateShipmentMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {import('../types/index.js').ShipmentFormValues} */ values,
    ) => createShipment(contractId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

/** @param {string} contractId */
export function useUpdateShipmentMutation(contractId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ shipmentId: string, values: import('../types/index.js').ShipmentFormValues }} */ {
        shipmentId,
        values,
      },
    ) => updateShipment(contractId, shipmentId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: queryKey(contractId) });
      }
    },
  });
}

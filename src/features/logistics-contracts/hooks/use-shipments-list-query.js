'use client';

import { useQuery } from '@tanstack/react-query';

import { listAllShipments } from '../api/shipments.js';

const QUERY_KEY = ['logistics-contracts', 'shipments-list'];

/**
 * System-wide, paginated Shipment list — separate from `useShipmentsQuery`
 * (`use-shipments-query.js`), which is per-contract and already owns that
 * name.
 * @param {{ page: number, pageSize: number }} params
 */
export function useShipmentsListQuery({ page, pageSize }) {
  return useQuery({
    queryKey: [...QUERY_KEY, page, pageSize],
    queryFn: () => listAllShipments({ page, pageSize }),
  });
}

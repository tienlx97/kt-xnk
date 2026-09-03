'use client';

import { useQuery } from '@tanstack/react-query';

import { listServiceAgreements } from '../api/service-agreements.js';

const QUERY_KEY = ['logistics-contracts', 'service-agreements-list'];

/** @param {{ page: number, pageSize: number }} params */
export function useServiceAgreementsQuery({ page, pageSize }) {
  return useQuery({
    queryKey: [...QUERY_KEY, page, pageSize],
    queryFn: () => listServiceAgreements({ page, pageSize }),
  });
}

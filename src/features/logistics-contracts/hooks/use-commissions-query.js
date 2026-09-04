'use client';

import { useQuery } from '@tanstack/react-query';

import { listCommissions } from '../api/commissions.js';

const QUERY_KEY = ['logistics-contracts', 'commissions-list'];

/** @param {{ page: number, pageSize: number }} params */
export function useCommissionsQuery({ page, pageSize }) {
  return useQuery({
    queryKey: [...QUERY_KEY, page, pageSize],
    queryFn: () => listCommissions({ page, pageSize }),
  });
}

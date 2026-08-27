'use client';

import { useQuery } from '@tanstack/react-query';

import { listBranches, listCompanies } from '../api/org-directory.js';

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ['logistics-contracts', 'companies'],
    queryFn: listCompanies,
  });
}

/** @param {string} companyId */
export function useBranchesQuery(companyId) {
  return useQuery({
    queryKey: ['logistics-contracts', 'branches', companyId],
    queryFn: () => listBranches(companyId),
    enabled: Boolean(companyId),
  });
}

'use client';

import { useQuery } from '@tanstack/react-query';

import { listVietnamBanks } from '../api/bank-accounts.js';
import {
  listBranches,
  listCompanies,
  listDepartments,
  listPositions,
} from '../api/org-directory.js';

export function useCompaniesQuery() {
  return useQuery({
    queryKey: ['admin-users', 'companies'],
    queryFn: listCompanies,
  });
}

/** @param {string} companyId */
export function useBranchesQuery(companyId) {
  return useQuery({
    queryKey: ['admin-users', 'branches', companyId],
    queryFn: () => listBranches(companyId),
    enabled: Boolean(companyId),
  });
}

export function useDepartmentsQuery() {
  return useQuery({
    queryKey: ['admin-users', 'departments'],
    queryFn: listDepartments,
  });
}

export function usePositionsQuery() {
  return useQuery({
    queryKey: ['admin-users', 'positions'],
    queryFn: listPositions,
  });
}

export function useVietnamBanksQuery() {
  return useQuery({
    queryKey: ['admin-users', 'vietnam-banks'],
    queryFn: listVietnamBanks,
  });
}

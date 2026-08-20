'use client';

import { useQuery } from '@tanstack/react-query';

import { listVietnamBanks } from '../api/bank-accounts.js';
import {
  listBranches,
  listCompanies,
  listDepartments,
  listPositions,
} from '../api/org-directory.js';

/**
 * Selector options for the create/edit user forms. No token is threaded
 * through: the `/api/backend` proxy attaches it from the HttpOnly session
 * cookie, so client code never handles credentials (docs/security.md, H-4).
 */

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

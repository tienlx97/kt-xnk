'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { listVietnamBanks } from '../api/bank-accounts.js';
import {
  createBranch,
  createCompany,
  createDepartment,
  createPosition,
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

/**
 * Backs the "+ Thêm mới" affordance next to each org-directory Selector in
 * `UserOrgFields`. Invalidating `['admin-users', 'companies']` on success
 * refreshes every consumer sharing this queryClient (this form's own
 * `useCompaniesQuery` and `UserList`'s) so the new company appears without a
 * manual refetch.
 */
export function useCreateCompanyMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (/** @type {string} */ name) => createCompany(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users', 'companies'] });
    },
  });
}

/** @param {string} companyId */
export function useCreateBranchMutation(companyId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (/** @type {string} */ name) => createBranch(companyId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-users', 'branches', companyId],
      });
    },
  });
}

export function useCreateDepartmentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ branchId: string, name: string }} */ { branchId, name },
    ) => createDepartment(branchId, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users', 'departments'] });
    },
  });
}

export function useCreatePositionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (/** @type {string} */ name) => createPosition(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users', 'positions'] });
    },
  });
}

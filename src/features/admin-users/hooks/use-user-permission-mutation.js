'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { grantUserPermission, revokeUserPermission } from '../api/permissions.js';

/**
 * Grant/revoke both rotate the target's `SecurityStamp` server-side and
 * change `extraPermissions` on `GET /users/{id}` — invalidating the detail
 * query re-seeds the switch from the real state instead of trusting the
 * client's optimistic guess.
 * @param {string} userId
 */
export function useGrantUserPermissionMutation(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (/** @type {string} */ permission) =>
      grantUserPermission(userId, permission),
    // Returned, not fire-and-forget: react-query awaits a promise from
    // onSettled before `mutateAsync` resolves, so the caller's pending state
    // covers the refetch too. Without the return, the switch would stop
    // showing "busy" while still rendering the pre-toggle value.
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-users', 'user', userId] }),
  });
}

/** @param {string} userId */
export function useRevokeUserPermissionMutation(userId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (/** @type {string} */ permission) =>
      revokeUserPermission(userId, permission),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['admin-users', 'user', userId] }),
  });
}

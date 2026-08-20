'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createGrantablePermission } from '../api/permissions.js';

/**
 * Adding to the catalog changes what the per-user "Quyền" tab can offer, so
 * the shared `grantable-permissions` query is invalidated too — otherwise a
 * permission created here would not appear as a switch until a full reload.
 */
export function useCreateGrantablePermissionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ key: string, description?: string }} */ { key, description },
    ) => createGrantablePermission(key, description),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['admin-users', 'grantable-permissions'],
      });
    },
  });
}

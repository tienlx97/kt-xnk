'use client';

import { useQuery } from '@tanstack/react-query';

import { listGrantablePermissions } from '../api/permissions.js';

/** Admin-only reference data — see `api/permissions.js`. */
export function useGrantablePermissionsQuery() {
  return useQuery({
    queryKey: ['admin-users', 'grantable-permissions'],
    queryFn: listGrantablePermissions,
  });
}

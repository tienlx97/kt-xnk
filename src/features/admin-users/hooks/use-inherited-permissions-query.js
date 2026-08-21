'use client';

import { useQuery } from '@tanstack/react-query';

import { previewInheritedPermissions } from '../api/permissions.js';

/** @param {string} departmentId */
export function useInheritedPermissionsQuery(departmentId) {
  return useQuery({
    queryKey: ['admin-users', 'inherited-permissions', departmentId],
    queryFn: () => previewInheritedPermissions(departmentId),
    enabled: Boolean(departmentId),
  });
}

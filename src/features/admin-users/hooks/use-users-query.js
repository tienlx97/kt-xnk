'use client';

import { useQuery } from '@tanstack/react-query';

import { listUsers } from '../api/users.js';

/**
 * One page of users. The endpoint is paginated, so the page number is part of
 * the query key — otherwise every page would overwrite the same cache entry.
 * @param {{ page?: number, pageSize?: number }} [options]
 */
export function useUsersQuery({ page = 1, pageSize = 25 } = {}) {
  return useQuery({
    queryKey: ['admin-users', 'users', page, pageSize],
    queryFn: () => listUsers({ page, pageSize }),
    placeholderData: (previous) => previous,
  });
}

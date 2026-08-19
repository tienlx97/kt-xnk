'use client';

import { useQuery } from '@tanstack/react-query';

import { listUsers } from '../api/users.js';

/** @param {string} token */
export function useUsersQuery(token) {
  return useQuery({
    queryKey: ['admin-users', 'users'],
    queryFn: () => listUsers(token),
  });
}

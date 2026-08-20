'use client';

import { useQuery } from '@tanstack/react-query';

import { getUser } from '../api/users.js';

/**
 * The full record for one user.
 *
 * The edit form cannot be populated from a list row any more: the list
 * projection deliberately omits passport number, national-ID issue date/place,
 * year of birth and the address (docs/security.md, M-4), and saving a form
 * built from those blanks would erase the real values.
 * @param {string | undefined} userId
 * @param {{ enabled?: boolean }} [options]
 */
export function useUserDetailQuery(userId, { enabled = true } = {}) {
  return useQuery({
    queryKey: ['admin-users', 'user', userId],
    queryFn: () => getUser(/** @type {string} */ (userId)),
    enabled: Boolean(userId) && enabled,
  });
}

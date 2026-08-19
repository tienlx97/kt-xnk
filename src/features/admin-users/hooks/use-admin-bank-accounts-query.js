'use client';

import { useQuery } from '@tanstack/react-query';

import { adminListBankAccounts } from '../api/bank-accounts.js';

/**
 * @param {string} userId
 * @param {string} token
 */
export function useAdminBankAccountsQuery(userId, token) {
  return useQuery({
    queryKey: ['admin-users', 'bank-accounts', userId],
    queryFn: () => adminListBankAccounts(userId, token),
    enabled: Boolean(userId),
  });
}

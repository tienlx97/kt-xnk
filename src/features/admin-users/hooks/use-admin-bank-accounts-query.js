'use client';

import { useQuery } from '@tanstack/react-query';

import { adminListBankAccounts } from '../api/bank-accounts.js';

/** @param {string} userId */
export function useAdminBankAccountsQuery(userId) {
  return useQuery({
    queryKey: ['admin-users', 'bank-accounts', userId],
    queryFn: () => adminListBankAccounts(userId),
    enabled: Boolean(userId),
  });
}

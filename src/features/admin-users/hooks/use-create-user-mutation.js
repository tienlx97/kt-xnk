'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerUser } from '../api/register.js';

/** @param {string} token */
export function useCreateUserMutation(token) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {import('../types/index.js').CreateUserFormValues} */ values,
    ) => registerUser(values, token),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users', 'users'] });
      }
    },
  });
}

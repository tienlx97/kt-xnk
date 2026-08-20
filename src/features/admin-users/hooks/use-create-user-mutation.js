'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { registerUser } from '../api/register.js';

export function useCreateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {import('../types/index.js').CreateUserFormValues} */ values,
    ) => registerUser(values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users', 'users'] });
      }
    },
  });
}

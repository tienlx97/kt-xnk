'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUser } from '../api/users.js';

/** @param {string} token */
export function useUpdateUserMutation(token) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ userId: string, values: import('../types/index.js').EditUserFormValues }} */ {
        userId,
        values,
      },
    ) => updateUser(userId, values, token),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users', 'users'] });
      }
    },
  });
}

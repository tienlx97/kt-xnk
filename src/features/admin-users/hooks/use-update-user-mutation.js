'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { updateUser } from '../api/users.js';

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ userId: string, values: import('../types/index.js').EditUserFormValues }} */ {
        userId,
        values,
      },
    ) => updateUser(userId, values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['admin-users', 'users'] });
      }
    },
  });
}

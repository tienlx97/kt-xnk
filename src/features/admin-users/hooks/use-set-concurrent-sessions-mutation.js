'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setConcurrentSessions } from '../api/users.js';

export function useSetConcurrentSessionsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ userId: string, allowed: boolean }} */ { userId, allowed },
    ) => setConcurrentSessions(userId, allowed),
    onSuccess: (result, { userId }) => {
      if (result.success) {
        queryClient.invalidateQueries({
          queryKey: ['admin-users', 'user', userId],
        });
      }
    },
  });
}

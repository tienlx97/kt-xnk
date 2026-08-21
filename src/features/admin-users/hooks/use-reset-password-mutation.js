'use client';

import { useMutation } from '@tanstack/react-query';

import { resetPassword } from '../api/users.js';

/**
 * No query invalidation on settle: a password reset doesn't change anything
 * `GET /users` or `GET /users/{id}` return, so there's nothing stale to
 * refetch.
 * @param {string} userId
 */
export function useResetPasswordMutation(userId) {
  return useMutation({
    mutationFn: (/** @type {string} */ newPassword) =>
      resetPassword(userId, newPassword),
  });
}

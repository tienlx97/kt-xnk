'use client';

import { useMutation } from '@tanstack/react-query';

import { login } from '../api/login.js';

export function useLoginMutation() {
  return useMutation({ mutationFn: login });
}

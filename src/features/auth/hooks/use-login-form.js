'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';

import { writeSession } from '../api/session.js';
import { loginSchema } from '../config/login-schema.js';
import { useLoginMutation } from './use-login-mutation.js';

const REMEMBERED_EMAIL_KEY = 'kt-xnk:remembered-email';

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

function subscribeToNothing() {
  return () => {};
}

function getRememberedEmail() {
  return window.localStorage.getItem(REMEMBERED_EMAIL_KEY) ?? '';
}

function getServerRememberedEmail() {
  return '';
}

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const loginMutation = useLoginMutation();

  // useSyncExternalStore reads localStorage as '' during SSR/hydration (so
  // the server and first client render match, no hydration-mismatch
  // warning) and React itself re-renders with the real client value right
  // after mount. Local overrides let the user freely edit the fields
  // without fighting that synced value.
  const rememberedEmail = useSyncExternalStore(
    subscribeToNothing,
    getRememberedEmail,
    getServerRememberedEmail,
  );
  const [emailOverride, setEmailOverride] = useState(
    /** @type {string | null} */ (null),
  );
  const [rememberMeOverride, setRememberMeOverride] = useState(
    /** @type {boolean | null} */ (null),
  );
  const email = emailOverride ?? rememberedEmail;
  const rememberMe = rememberMeOverride ?? rememberedEmail !== '';
  const setEmail = setEmailOverride;
  const setRememberMe = setRememberMeOverride;

  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const result = loginSchema.safeParse({ email, password, rememberMe });
    if (!result.success) {
      /** @type {Record<string, string>} */
      const nextFieldErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]);
        if (!nextFieldErrors[key]) {
          nextFieldErrors[key] = issue.message;
        }
      }
      setFieldErrors(nextFieldErrors);
      return;
    }

    setFieldErrors({});
    const loginResult = await loginMutation.mutateAsync(result.data);

    if (!loginResult.success) {
      setSubmitError(loginResult.message ?? 'Đăng nhập thất bại');
      return;
    }

    if (rememberMe) {
      window.localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
    } else {
      window.localStorage.removeItem(REMEMBERED_EMAIL_KEY);
    }

    writeSession({
      token: loginResult.token,
      email: loginResult.email,
      displayName: `${loginResult.firstName} ${loginResult.lastName}`.trim(),
    });
    router.replace(searchParams.get('next') || '/');
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    emailStatus: fieldStatus(fieldErrors.email),
    passwordStatus: fieldStatus(fieldErrors.password),
    submitError,
    isSubmitting: loginMutation.isPending,
    handleSubmit,
  };
}

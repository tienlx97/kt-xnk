'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';

import { login } from '../api/login.js';
import { writeSession } from '../api/session.js';
import { loginSchema } from '../config/login-schema.js';

const REMEMBERED_USERNAME_KEY = 'kt-xnk:remembered-username';

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

function subscribeToNothing() {
  return () => {};
}

function getRememberedUsername() {
  return window.localStorage.getItem(REMEMBERED_USERNAME_KEY) ?? '';
}

function getServerRememberedUsername() {
  return '';
}

export function useLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // useSyncExternalStore reads localStorage as '' during SSR/hydration (so
  // the server and first client render match, no hydration-mismatch
  // warning) and React itself re-renders with the real client value right
  // after mount. Local overrides let the user freely edit the fields
  // without fighting that synced value.
  const rememberedUsername = useSyncExternalStore(
    subscribeToNothing,
    getRememberedUsername,
    getServerRememberedUsername,
  );
  const [usernameOverride, setUsernameOverride] = useState(
    /** @type {string | null} */ (null),
  );
  const [rememberMeOverride, setRememberMeOverride] = useState(
    /** @type {boolean | null} */ (null),
  );
  const username = usernameOverride ?? rememberedUsername;
  const rememberMe = rememberMeOverride ?? rememberedUsername !== '';
  const setUsername = setUsernameOverride;
  const setRememberMe = setRememberMeOverride;

  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState(/** @type {Record<string, string>} */ ({}));
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');

    const result = loginSchema.safeParse({ username, password, rememberMe });
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
    setIsSubmitting(true);
    const loginResult = await login(result.data);
    setIsSubmitting(false);

    if (!loginResult.success) {
      setSubmitError(loginResult.message ?? 'Đăng nhập thất bại');
      return;
    }

    if (rememberMe) {
      window.localStorage.setItem(REMEMBERED_USERNAME_KEY, username);
    } else {
      window.localStorage.removeItem(REMEMBERED_USERNAME_KEY);
    }

    writeSession({
      accessToken: loginResult.accessToken,
      refreshToken: loginResult.refreshToken,
      username,
    });
    router.replace(searchParams.get('next') || '/');
  }

  return {
    username,
    setUsername,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    usernameStatus: fieldStatus(fieldErrors.username),
    passwordStatus: fieldStatus(fieldErrors.password),
    submitError,
    isSubmitting,
    handleSubmit,
  };
}

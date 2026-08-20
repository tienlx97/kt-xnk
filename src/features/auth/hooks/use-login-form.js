'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useSyncExternalStore } from 'react';

import { SESSION_EXPIRED_QUERY_PARAM } from '../../../shared/api/api-client.js';
import {
  decodeJwtPayload,
  normalizePermissions,
  normalizeRoles,
} from '../../../shared/api/jwt.js';
import { writeSession } from '../../../shared/api/session-cookies.js';
import { loginSchema } from '../config/login-schema.js';
import { useLoginMutation } from './use-login-mutation.js';

const REMEMBERED_NATIONAL_ID_KEY = 'kt-xnk:remembered-national-id';

/** @param {string} [message] @returns {{ type: 'error', message: string } | undefined} */
function fieldStatus(message) {
  return message ? { type: 'error', message } : undefined;
}

function subscribeToNothing() {
  return () => {};
}

function getRememberedNationalId() {
  return window.localStorage.getItem(REMEMBERED_NATIONAL_ID_KEY) ?? '';
}

function getServerRememberedNationalId() {
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
  const rememberedNationalId = useSyncExternalStore(
    subscribeToNothing,
    getRememberedNationalId,
    getServerRememberedNationalId,
  );
  const [nationalIdOverride, setNationalIdOverride] = useState(
    /** @type {string | null} */ (null),
  );
  const [rememberMeOverride, setRememberMeOverride] = useState(
    /** @type {boolean | null} */ (null),
  );
  const nationalId = nationalIdOverride ?? rememberedNationalId;
  const rememberMe = rememberMeOverride ?? rememberedNationalId !== '';
  const setNationalId = setNationalIdOverride;
  const setRememberMe = setRememberMeOverride;

  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState(
    /** @type {Record<string, string>} */ ({}),
  );
  const [submitError, setSubmitError] = useState('');

  // Set by `shared/api/api-client.js` when a request came back 401 and it
  // ended the session. Explains *why* the user is looking at the login page
  // again — without it an expired session reads as the app randomly logging
  // them out. Dismissed as soon as they submit, so it can't linger next to a
  // genuine "wrong password" error.
  const [isSessionExpiredNoticeDismissed, setIsSessionExpiredNoticeDismissed] =
    useState(false);
  const sessionExpiredNotice =
    !isSessionExpiredNoticeDismissed &&
    searchParams.get(SESSION_EXPIRED_QUERY_PARAM) === '1';

  /** @param {import('react').FormEvent<HTMLFormElement>} event */
  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError('');
    setIsSessionExpiredNoticeDismissed(true);

    const result = loginSchema.safeParse({ nationalId, password, rememberMe });
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
      window.localStorage.setItem(REMEMBERED_NATIONAL_ID_KEY, nationalId);
    } else {
      window.localStorage.removeItem(REMEMBERED_NATIONAL_ID_KEY);
    }

    const payload = decodeJwtPayload(loginResult.token);
    // Async now: only the server can set the HttpOnly token cookie, so this
    // posts to the /api/session route handler (docs/security.md, H-4).
    await writeSession({
      token: loginResult.token,
      nationalId: loginResult.nationalId,
      displayName: `${loginResult.firstName} ${loginResult.lastName}`.trim(),
      roles: normalizeRoles(payload),
      permissions: normalizePermissions(payload),
    });
    router.replace(searchParams.get('next') || '/');
  }

  return {
    nationalId,
    setNationalId,
    password,
    setPassword,
    rememberMe,
    setRememberMe,
    nationalIdStatus: fieldStatus(fieldErrors.nationalId),
    passwordStatus: fieldStatus(fieldErrors.password),
    submitError,
    sessionExpiredNotice,
    isSubmitting: loginMutation.isPending,
    handleSubmit,
  };
}

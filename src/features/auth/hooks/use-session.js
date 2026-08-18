'use client';

import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import {
  clearSession,
  readAccessToken,
  readSessionDisplayName,
  readSessionNationalId,
  SESSION_CHANGE_EVENT,
} from '../api/session.js';

/** @param {() => void} callback */
function subscribeToSessionChange(callback) {
  window.addEventListener(SESSION_CHANGE_EVENT, callback);
  return () => window.removeEventListener(SESSION_CHANGE_EVENT, callback);
}

function getIsAuthenticated() {
  return readAccessToken() !== null;
}

function getIsAuthenticatedServerSnapshot() {
  return false;
}

function getDisplayName() {
  return readSessionDisplayName();
}

function getDisplayNameServerSnapshot() {
  return '';
}

function getNationalId() {
  return readSessionNationalId();
}

function getNationalIdServerSnapshot() {
  return '';
}

export function useSession() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
    subscribeToSessionChange,
    getIsAuthenticated,
    getIsAuthenticatedServerSnapshot,
  );
  const displayName = useSyncExternalStore(
    subscribeToSessionChange,
    getDisplayName,
    getDisplayNameServerSnapshot,
  );
  const nationalId = useSyncExternalStore(
    subscribeToSessionChange,
    getNationalId,
    getNationalIdServerSnapshot,
  );

  function logout() {
    clearSession();
    router.push('/login');
  }

  return { isAuthenticated, displayName, nationalId, logout };
}

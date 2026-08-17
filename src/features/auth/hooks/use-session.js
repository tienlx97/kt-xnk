'use client';

import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import {
  clearSession,
  readAccessToken,
  readSessionDisplayName,
  readSessionEmail,
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

function getEmail() {
  return readSessionEmail();
}

function getEmailServerSnapshot() {
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
  const email = useSyncExternalStore(
    subscribeToSessionChange,
    getEmail,
    getEmailServerSnapshot,
  );

  function logout() {
    clearSession();
    router.push('/login');
  }

  return { isAuthenticated, displayName, email, logout };
}

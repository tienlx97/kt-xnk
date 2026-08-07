'use client';

import { useRouter } from 'next/navigation';
import { useSyncExternalStore } from 'react';

import {
  clearSession,
  readAccessToken,
  readSessionUsername,
  SESSION_CHANGE_EVENT,
} from '../api/session.js';

/** @param {() => void} callback */
function subscribeToStorage(callback) {
  window.addEventListener('storage', callback);
  window.addEventListener(SESSION_CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener(SESSION_CHANGE_EVENT, callback);
  };
}

function getIsAuthenticated() {
  return readAccessToken() !== null;
}

function getIsAuthenticatedServerSnapshot() {
  return false;
}

function getUsername() {
  return readSessionUsername();
}

function getUsernameServerSnapshot() {
  return '';
}

export function useSession() {
  const router = useRouter();
  const isAuthenticated = useSyncExternalStore(
    subscribeToStorage,
    getIsAuthenticated,
    getIsAuthenticatedServerSnapshot,
  );
  const username = useSyncExternalStore(subscribeToStorage, getUsername, getUsernameServerSnapshot);

  function logout() {
    clearSession();
    router.push('/login');
  }

  return { isAuthenticated, username, logout };
}

import { useSyncExternalStore } from 'react';

/** @param {() => void} onStoreChange */
function subscribe(onStoreChange) {
  window.addEventListener('scroll', onStoreChange, { passive: true });
  return () => window.removeEventListener('scroll', onStoreChange);
}

function getSnapshot() {
  return window.scrollY > 0;
}

function getServerSnapshot() {
  return false;
}

/**
 * Tracks only the boolean needed by react.dev's sticky TopNav shadow. Using an
 * external-store snapshot avoids an effect-driven initial state update and
 * rerenders only when the boolean result changes.
 */
export function useScrollShadow() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

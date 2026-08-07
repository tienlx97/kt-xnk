import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, SESSION_USERNAME_KEY } from '../config/session-keys.js';

// The native `storage` event only fires in *other* tabs, never the tab that
// made the write — so components subscribed via useSyncExternalStore (e.g.
// the header's user menu, which lives in the persistent layout and doesn't
// naturally re-render on same-tab client-side navigation) need an explicit
// same-tab signal after login/logout.
export const SESSION_CHANGE_EVENT = 'kt-xnk-session-change';

export function readAccessToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function readSessionUsername() {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.localStorage.getItem(SESSION_USERNAME_KEY) ?? '';
}

/**
 * Persists a session after a successful login. `refreshToken` is written to
 * localStorage here only because there is no backend yet — a real backend
 * should set it as an `httpOnly` cookie itself (via `Set-Cookie` on the
 * login response) so client JS never touches it.
 * @param {import('../types/index.js').Session} session
 */
export function writeSession({ accessToken, refreshToken, username }) {
  window.localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  window.localStorage.setItem(SESSION_USERNAME_KEY, username);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function clearSession() {
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
  window.localStorage.removeItem(SESSION_USERNAME_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

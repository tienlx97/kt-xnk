import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_USERNAME_KEY,
} from '../config/session-keys.js';

// The native `storage` event only fires in *other* tabs, never the tab that
// made the write — so components subscribed via useSyncExternalStore (e.g.
// the header's user menu, which lives in the persistent layout and doesn't
// naturally re-render on same-tab client-side navigation) need an explicit
// same-tab signal after login/logout.
export const SESSION_CHANGE_EVENT = 'kt-xnk-session-change';

/** @param {string} name */
function readCookie(name) {
  if (typeof document === 'undefined') {
    return null;
  }
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** @param {string} name @param {string} value */
function writeCookie(name, value) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${SESSION_COOKIE_MAX_AGE_SECONDS}; samesite=lax`;
}

/** @param {string} name */
function deleteCookie(name) {
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
}

export function readAccessToken() {
  return readCookie(ACCESS_TOKEN_KEY);
}

export function readSessionUsername() {
  return readCookie(SESSION_USERNAME_KEY) ?? '';
}

/**
 * Persists a session after a successful login, as cookies rather than
 * localStorage so `src/app/(protected)/layout.js` can read it server-side
 * and block rendering entirely for a logged-out visitor. The refresh token
 * is written here only because there is no backend yet — a real backend
 * should set it as an `httpOnly` cookie itself (via `Set-Cookie` on the
 * login response) so client JS never touches it.
 * @param {import('../types/index.js').Session} session
 */
export function writeSession({ accessToken, refreshToken, username }) {
  writeCookie(ACCESS_TOKEN_KEY, accessToken);
  writeCookie(REFRESH_TOKEN_KEY, refreshToken);
  writeCookie(SESSION_USERNAME_KEY, username);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function clearSession() {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(REFRESH_TOKEN_KEY);
  deleteCookie(SESSION_USERNAME_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

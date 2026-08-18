import { parsePermissionsCookie, parseRolesCookie } from '../../../shared/api/jwt.js';
import {
  ACCESS_TOKEN_KEY,
  SESSION_COOKIE_MAX_AGE_SECONDS,
  SESSION_DISPLAY_NAME_KEY,
  SESSION_NATIONAL_ID_KEY,
  SESSION_PERMISSIONS_KEY,
  SESSION_ROLES_KEY,
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

export function readSessionNationalId() {
  return readCookie(SESSION_NATIONAL_ID_KEY) ?? '';
}

export function readSessionDisplayName() {
  return readCookie(SESSION_DISPLAY_NAME_KEY) ?? '';
}

/** @returns {string[]} */
export function readSessionRoles() {
  return parseRolesCookie(readCookie(SESSION_ROLES_KEY));
}

/** @returns {string[]} */
export function readSessionPermissions() {
  return parsePermissionsCookie(readCookie(SESSION_PERMISSIONS_KEY));
}

/**
 * Persists a session after a successful login, as cookies rather than
 * localStorage so `src/app/(protected)/layout.js` can read it server-side
 * and block rendering entirely for a logged-out visitor.
 * @param {import('../types/index.js').Session} session
 */
export function writeSession({ token, nationalId, displayName, roles, permissions }) {
  writeCookie(ACCESS_TOKEN_KEY, token);
  writeCookie(SESSION_NATIONAL_ID_KEY, nationalId);
  writeCookie(SESSION_DISPLAY_NAME_KEY, displayName);
  writeCookie(SESSION_ROLES_KEY, JSON.stringify(roles ?? []));
  writeCookie(SESSION_PERMISSIONS_KEY, JSON.stringify(permissions ?? []));
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

export function clearSession() {
  deleteCookie(ACCESS_TOKEN_KEY);
  deleteCookie(SESSION_NATIONAL_ID_KEY);
  deleteCookie(SESSION_DISPLAY_NAME_KEY);
  deleteCookie(SESSION_ROLES_KEY);
  deleteCookie(SESSION_PERMISSIONS_KEY);
  window.dispatchEvent(new Event(SESSION_CHANGE_EVENT));
}

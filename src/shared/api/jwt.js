/**
 * Decodes a JWT's payload segment without verifying its signature — this
 * frontend never trusts the decoded claims for authorization, only for
 * UI-level nav/route gating (the backend re-enforces every role check for
 * real via `[Authorize(Roles = "...")]`). Works in both the browser and the
 * Next.js Edge middleware runtime, since both expose `atob` globally but
 * neither guarantees `Buffer`.
 * @param {string} token
 * @returns {Record<string, unknown> | null}
 */
export function decodeJwtPayload(token) {
  const segments = token.split('.');
  if (segments.length !== 3) return null;

  try {
    const base64 = segments[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );
    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

/**
 * The backend's `roles` JWT claim serializes as a bare string when the user
 * has exactly one role and as a JSON array when they have several (a
 * `System.IdentityModel.Tokens.Jwt.JwtSecurityToken` serialization quirk —
 * see `BE-kt-xnk`'s `JwtTokenGenerator`). Normalize both shapes to an array
 * so every caller downstream only ever deals with `string[]`.
 * @param {Record<string, unknown> | null} payload
 * @returns {string[]}
 */
export function normalizeRoles(payload) {
  const roles = payload?.roles;
  if (Array.isArray(roles)) return roles.filter((role) => typeof role === 'string');
  if (typeof roles === 'string') return [roles];
  return [];
}

/**
 * Parses the `SESSION_ROLES_KEY` cookie's raw value (a `JSON.stringify`d
 * `string[]`, written once at login — see `normalizeRoles`/`writeSession`).
 * Shared between `(protected)/layout.jsx` (Node runtime) and `middleware.js`
 * (Edge runtime) since neither Edge nor Node has any special requirement
 * here — it's plain `JSON.parse`. A missing/malformed cookie value just
 * means "no roles", not a broken page for every visitor.
 * @param {string | undefined} rawCookieValue
 * @returns {string[]}
 */
export function parseRolesCookie(rawCookieValue) {
  if (!rawCookieValue) return [];
  try {
    const parsed = JSON.parse(rawCookieValue);
    return Array.isArray(parsed)
      ? parsed.filter((role) => typeof role === 'string')
      : [];
  } catch {
    return [];
  }
}

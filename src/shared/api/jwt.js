/**
 * Decodes a JWT's payload segment without verifying its signature — this
 * frontend never trusts the decoded claims for authorization, only for
 * UI-level nav/route gating (the backend re-enforces every role/permission
 * check for real via `[Authorize(Roles = "...")]`/`[Authorize(Permissions =
 * "...")]`). Works in both the browser and the Next.js Edge middleware
 * runtime, since both expose `atob` globally but neither guarantees
 * `Buffer`.
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
 * The backend's JWT serializes a repeated claim (`roles`, `permissions`) as
 * a bare string when there's exactly one value and as a JSON array when
 * there are several (a `System.IdentityModel.Tokens.Jwt.JwtSecurityToken`
 * serialization quirk — see `BE-kt-xnk`'s `JwtTokenGenerator`). Normalize
 * both shapes to an array.
 * @param {unknown} claimValue
 * @returns {string[]}
 */
function normalizeStringClaim(claimValue) {
  if (Array.isArray(claimValue)) {
    return claimValue.filter((value) => typeof value === 'string');
  }
  if (typeof claimValue === 'string') return [claimValue];
  return [];
}

/**
 * @param {Record<string, unknown> | null} payload
 * @returns {string[]}
 */
export function normalizeRoles(payload) {
  return normalizeStringClaim(payload?.roles);
}

/**
 * @param {Record<string, unknown> | null} payload
 * @returns {string[]}
 */
export function normalizePermissions(payload) {
  return normalizeStringClaim(payload?.permissions);
}

/**
 * Parses a `JSON.stringify`d `string[]` cookie value (written once at
 * login — see `normalizeRoles`/`normalizePermissions`/`writeSession`).
 * Shared shape for both the roles and permissions cookies, and safe to call
 * from `(protected)/layout.jsx` (Node runtime) or `middleware.js` (Edge
 * runtime) — it's plain `JSON.parse`, no runtime-specific API. A missing or
 * malformed cookie value just means "none", not a broken page for every
 * visitor.
 * @param {string | null | undefined} rawCookieValue
 * @returns {string[]}
 */
function parseStringArrayCookie(rawCookieValue) {
  if (!rawCookieValue) return [];
  try {
    const parsed = JSON.parse(rawCookieValue);
    return Array.isArray(parsed)
      ? parsed.filter((value) => typeof value === 'string')
      : [];
  } catch {
    return [];
  }
}

/** @param {string | null | undefined} rawCookieValue @returns {string[]} */
export function parseRolesCookie(rawCookieValue) {
  return parseStringArrayCookie(rawCookieValue);
}

/** @param {string | null | undefined} rawCookieValue @returns {string[]} */
export function parsePermissionsCookie(rawCookieValue) {
  return parseStringArrayCookie(rawCookieValue);
}

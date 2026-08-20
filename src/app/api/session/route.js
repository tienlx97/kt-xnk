import { cookies } from 'next/headers';

import { decodeJwtPayload } from '../../../shared/api/jwt.js';
import {
  ACCESS_TOKEN_KEY,
  SESSION_DISPLAY_NAME_KEY,
  SESSION_NATIONAL_ID_KEY,
  SESSION_PERMISSIONS_KEY,
  SESSION_ROLES_KEY,
} from '../../../shared/config/session-keys.js';

/**
 * Owns the session cookies.
 *
 * They used to be written with `document.cookie` on the client, which cannot
 * set `HttpOnly` — so the access token was readable by any script on the page
 * (docs/security.md, H-4). Writing them here, server-side, is the only way to
 * mark the token `HttpOnly`.
 *
 * Only the token is `HttpOnly`. Display name, national ID, roles and
 * permissions stay readable: they are not credentials, the header and nav
 * render from them on the client, and the backend re-checks every role on
 * every request regardless of what the browser claims.
 */

const isProduction = process.env.NODE_ENV === 'production';

/**
 * The session must not outlive the token it carries. Previously the cookie was
 * pinned to 7 days while the token expired in 60 minutes, so the app kept
 * rendering as "signed in" for days against a dead token
 * (docs/security.md, M-1).
 * @param {string} token
 */
function maxAgeFromToken(token) {
  const payload = decodeJwtPayload(token);
  const expiresAt = typeof payload?.exp === 'number' ? payload.exp : null;

  if (expiresAt === null) {
    return null;
  }

  const seconds = expiresAt - Math.floor(Date.now() / 1000);

  return seconds > 0 ? seconds : null;
}

/** @param {Request} request */
export async function POST(request) {
  let session;
  try {
    session = await request.json();
  } catch {
    return Response.json({ detail: 'Malformed session payload' }, { status: 400 });
  }

  const { token, nationalId, displayName, roles, permissions } = session ?? {};

  if (typeof token !== 'string' || token.length === 0) {
    return Response.json({ detail: 'Missing token' }, { status: 400 });
  }

  const maxAge = maxAgeFromToken(token);

  if (maxAge === null) {
    return Response.json({ detail: 'Token is expired or has no expiry' }, { status: 400 });
  }

  const base = {
    path: '/',
    sameSite: /** @type {const} */ ('lax'),
    secure: isProduction,
    maxAge,
  };

  const cookieStore = await cookies();

  cookieStore.set(ACCESS_TOKEN_KEY, token, { ...base, httpOnly: true });
  cookieStore.set(SESSION_NATIONAL_ID_KEY, nationalId ?? '', base);
  cookieStore.set(SESSION_DISPLAY_NAME_KEY, displayName ?? '', base);
  cookieStore.set(SESSION_ROLES_KEY, JSON.stringify(roles ?? []), base);
  cookieStore.set(SESSION_PERMISSIONS_KEY, JSON.stringify(permissions ?? []), base);

  return Response.json({ ok: true });
}

export async function DELETE() {
  const cookieStore = await cookies();

  for (const key of [
    ACCESS_TOKEN_KEY,
    SESSION_NATIONAL_ID_KEY,
    SESSION_DISPLAY_NAME_KEY,
    SESSION_ROLES_KEY,
    SESSION_PERMISSIONS_KEY,
  ]) {
    cookieStore.set(key, '', { path: '/', maxAge: 0, sameSite: 'lax', secure: isProduction });
  }

  return Response.json({ ok: true });
}

export const dynamic = 'force-dynamic';

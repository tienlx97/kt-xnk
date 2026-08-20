import { cookies } from 'next/headers';

import {
  clearSessionCookies,
  writeSessionCookies,
} from '../../../shared/api/server-session.js';
import { resolveApiBaseUrl } from '../../../shared/config/api-config.js';
import { REFRESH_TOKEN_KEY } from '../../../shared/config/session-keys.js';

/**
 * Owns the session cookies.
 *
 * They used to be written with `document.cookie` on the client, which cannot
 * set `HttpOnly` — so the access token was readable by any script on the page
 * (the API's docs/security.md, H-4). Writing them server-side is the only way
 * to mark the tokens `HttpOnly`.
 *
 * Only the two tokens are `HttpOnly`. Display name, national ID, roles and
 * permissions stay readable: they are not credentials, the header and nav
 * render from them on the client, and the backend re-checks every role on
 * every request regardless.
 */

/** @param {Request} request */
export async function POST(request) {
  let session;
  try {
    session = await request.json();
  } catch {
    return Response.json({ detail: 'Malformed session payload' }, { status: 400 });
  }

  if (typeof session?.token !== 'string' || session.token.length === 0) {
    return Response.json({ detail: 'Missing token' }, { status: 400 });
  }

  const cookieStore = await cookies();

  if (!writeSessionCookies(cookieStore, session)) {
    return Response.json(
      { detail: 'Token is expired or has no expiry' },
      { status: 400 },
    );
  }

  return Response.json({ ok: true });
}

/**
 * Signs out. Revokes the refresh token at the backend *before* clearing the
 * cookies — deleting them locally only stops this browser from using the
 * session; anyone holding a copy of the refresh token would otherwise keep a
 * working one (the API's docs/security.md, H-2).
 */
export async function DELETE() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  if (refreshToken) {
    try {
      await fetch(`${resolveApiBaseUrl()}/api/v1/authentication/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ RefreshToken: refreshToken }),
        cache: 'no-store',
      });
    } catch {
      // The backend being unreachable must not strand the user in a
      // half-signed-in state; clear locally regardless. The token still
      // expires on its own.
    }
  }

  clearSessionCookies(cookieStore);

  return Response.json({ ok: true });
}

export const dynamic = 'force-dynamic';

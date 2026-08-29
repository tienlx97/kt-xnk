import { cookies } from 'next/headers';

import { clearSessionCookies } from '@/shared/api/server-session.js';
import { resolveApiBaseUrl } from '@/shared/config/api-config.js';
import { REFRESH_TOKEN_KEY } from '@/shared/config/session-keys.js';

/**
 * Ends a session. Signing *in* lives at `/api/session/login`, which never hands
 * the browser a token at all.
 *
 * There is deliberately **no `POST` here**. An earlier version accepted a
 * session payload from the client and stored it — which, besides meaning the
 * tokens had to pass through JavaScript, was an endpoint that wrote whatever
 * session it was handed. Now nothing outside this server can put a session
 * into a browser.
 */

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

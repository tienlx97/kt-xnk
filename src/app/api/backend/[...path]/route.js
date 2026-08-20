import { cookies } from 'next/headers';

import {
  sessionClaimsFromToken,
  writeSessionCookies,
} from '../../../../shared/api/server-session.js';
import { resolveApiBaseUrl } from '../../../../shared/config/api-config.js';
import {
  ACCESS_TOKEN_KEY,
  REFRESH_TOKEN_KEY,
} from '../../../../shared/config/session-keys.js';

/**
 * Backend-for-frontend proxy.
 *
 * The browser calls `/api/backend/api/v1/...` on this origin; this handler
 * attaches the bearer token from the **HttpOnly** session cookie and forwards
 * the request to the .NET API.
 *
 * Why it exists: the access token used to live in a cookie that JavaScript
 * could read, so any XSS — including one in a third-party dependency — could
 * lift it and impersonate the user for the life of the token (the API's
 * docs/security.md, H-4). Making the cookie HttpOnly means client code can no
 * longer attach the token itself, so the token has to be attached somewhere
 * the browser cannot reach: here.
 *
 * It also refreshes silently. Access tokens last 60 minutes; rather than
 * bouncing the user to the login page every hour, a 401 triggers one refresh
 * attempt and a replay of the original request. The client never sees it.
 *
 * Two things fall out for free — the browser never makes a cross-origin
 * request, so CORS stops being involved at all, and the backend's address is
 * no longer baked into the client bundle.
 */

const HOP_BY_HOP = new Set([
  'connection',
  'keep-alive',
  'transfer-encoding',
  'upgrade',
  'host',
  'content-length',
]);

/** Never proxied — refreshing a refresh call would recurse. */
const REFRESH_PATH = 'api/v1/authentication/refresh';

/**
 * @param {Request} request
 * @param {{ params: Promise<{ path: string[] }> }} context
 */
async function proxy(request, context) {
  const { path } = await context.params;
  const cookieStore = await cookies();

  const url = new URL(request.url);
  const target = `${resolveApiBaseUrl()}/${path.join('/')}${url.search}`;

  const headers = new Headers();
  request.headers.forEach((value, name) => {
    if (!HOP_BY_HOP.has(name.toLowerCase())) {
      headers.set(name, value);
    }
  });

  // Always set by us, never forwarded from the client — a caller must not be
  // able to present their own Authorization header through the proxy.
  headers.delete('authorization');

  // Buffered up front so the request can be replayed after a refresh; a
  // stream can only be consumed once.
  const body = ['GET', 'HEAD'].includes(request.method)
    ? undefined
    : await request.arrayBuffer();

  const accessToken = cookieStore.get(ACCESS_TOKEN_KEY)?.value;

  let response = await forward(target, request.method, headers, body, accessToken);

  if (response === null) {
    return badGateway();
  }

  const canRetry =
    response.status === 401 && path.join('/') !== REFRESH_PATH;

  if (canRetry) {
    const refreshed = await refreshAccessToken(cookieStore);

    if (refreshed !== null) {
      const retried = await forward(target, request.method, headers, body, refreshed);

      if (retried === null) {
        return badGateway();
      }

      response = retried;
    }
  }

  const responseHeaders = new Headers();
  const contentType = response.headers.get('content-type');
  if (contentType) {
    responseHeaders.set('content-type', contentType);
  }
  const retryAfter = response.headers.get('retry-after');
  if (retryAfter) {
    responseHeaders.set('retry-after', retryAfter);
  }

  return new Response(response.body, {
    status: response.status,
    headers: responseHeaders,
  });
}

/**
 * @param {string} target
 * @param {string} method
 * @param {Headers} headers
 * @param {ArrayBuffer | undefined} body
 * @param {string | undefined} accessToken
 * @returns {Promise<Response | null>} null when the backend is unreachable.
 */
async function forward(target, method, headers, body, accessToken) {
  const outgoing = new Headers(headers);

  if (accessToken) {
    outgoing.set('Authorization', `Bearer ${accessToken}`);
  }

  try {
    return await fetch(target, {
      method,
      headers: outgoing,
      body,
      redirect: 'manual',
      cache: 'no-store',
    });
  } catch {
    return null;
  }
}

/**
 * Redeems the refresh token for a new access token and writes both back.
 *
 * Refresh tokens are single-use and rotated, so the replacement must be
 * persisted — dropping it would leave the session holding a token the backend
 * has already spent.
 *
 * @param {Awaited<ReturnType<typeof cookies>>} cookieStore
 * @returns {Promise<string | null>} the new access token, or null if the
 *   session could not be renewed (the caller then returns the original 401 and
 *   the client-side api-client sends the user to `/login`).
 */
async function refreshAccessToken(cookieStore) {
  const refreshToken = cookieStore.get(REFRESH_TOKEN_KEY)?.value;

  if (!refreshToken) {
    return null;
  }

  let response;
  try {
    response = await fetch(`${resolveApiBaseUrl()}/${REFRESH_PATH}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ RefreshToken: refreshToken }),
      cache: 'no-store',
    });
  } catch {
    return null;
  }

  if (!response.ok) {
    return null;
  }

  const session = await response.json().catch(() => null);

  if (typeof session?.token !== 'string') {
    return null;
  }

  // Roles and permissions are re-derived from the new token: a refresh can
  // legitimately change them (an Admin grant rotates the security stamp, so
  // the next token carries different claims), and stale cookies would leave
  // the nav showing the old ones.
  writeSessionCookies(cookieStore, {
    token: session.token,
    refreshToken: session.refreshToken,
    ...sessionClaimsFromToken(session.token),
  });

  return session.token;
}

function badGateway() {
  return Response.json(
    {
      title: 'Bad Gateway',
      status: 502,
      detail: 'Không thể kết nối đến máy chủ',
    },
    { status: 502 },
  );
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

// The proxied data is per-user and must never be cached or prerendered.
export const dynamic = 'force-dynamic';

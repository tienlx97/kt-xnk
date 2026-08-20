import { cookies } from 'next/headers';

import { resolveApiBaseUrl } from '../../../../shared/config/api-config.js';
import { ACCESS_TOKEN_KEY } from '../../../../shared/config/session-keys.js';

/**
 * Backend-for-frontend proxy.
 *
 * The browser calls `/api/backend/api/v1/...` on this origin; this handler
 * attaches the bearer token from the **HttpOnly** session cookie and forwards
 * the request to the .NET API.
 *
 * Why it exists: the access token used to live in a cookie that JavaScript
 * could read, so any XSS — including one in a third-party dependency — could
 * lift it and impersonate the user for the life of the token
 * (docs/security.md, H-4). Making the cookie HttpOnly means client code can no
 * longer attach the token itself, so the token has to be attached somewhere
 * the browser cannot reach: here.
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

/**
 * @param {Request} request
 * @param {{ params: Promise<{ path: string[] }> }} context
 */
async function proxy(request, context) {
  const { path } = await context.params;
  const cookieStore = await cookies();
  const token = cookieStore.get(ACCESS_TOKEN_KEY)?.value;

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
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  let response;
  try {
    response = await fetch(target, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      redirect: 'manual',
      cache: 'no-store',
    });
  } catch {
    return Response.json(
      {
        title: 'Bad Gateway',
        status: 502,
        detail: 'Không thể kết nối đến máy chủ',
      },
      { status: 502 },
    );
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

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

// The proxied data is per-user and must never be cached or prerendered.
export const dynamic = 'force-dynamic';

/**
 * Where the .NET backend lives. **Server-side only** — read by the route
 * handlers under `src/app/api/`, never bundled into client code, because the
 * browser now talks to this app's own `/api/backend` proxy instead of the
 * backend directly (see `src/app/api/backend/[...path]/route.js`).
 *
 * Missing configuration used to fall back to `http://localhost:8080`, which
 * in a production build silently pointed every user's browser at their own
 * machine (docs/security.md). A deployed environment must be explicit.
 */
export function resolveApiBaseUrl() {
  const configured = process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;

  if (configured) {
    return configured.replace(/\/$/, '');
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'API_BASE_URL is not set. Point it at the CompanyManagement API before starting the server.',
    );
  }

  return 'http://localhost:8080';
}

/** Same-origin prefix the browser calls; proxied server-side. */
export const API_PROXY_PREFIX = '/api/backend';

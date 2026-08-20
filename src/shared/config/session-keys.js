// Cookies, not localStorage: `src/app/(protected)/layout.js` needs to read
// the session on the *server* (via `next/headers`) to block protected pages
// from ever being rendered for a logged-out visitor — localStorage isn't
// visible there.
export const ACCESS_TOKEN_KEY = 'kt-xnk-access-token';
export const SESSION_NATIONAL_ID_KEY = 'kt-xnk-session-national-id';
export const SESSION_DISPLAY_NAME_KEY = 'kt-xnk-session-display-name';
// JSON-stringified string[] — decoded once from the JWT's `roles`/
// `permissions` claims at login (see `hooks/use-login-form.js`) rather than
// re-decoded everywhere a check is needed, so `middleware.js` (Edge
// runtime) and `(protected)/layout.jsx` (Node runtime) both just read a
// plain cookie. `roles` is kept for display/metadata; nav/route gating
// itself checks `permissions` (see `shared/config/route-access.js`) — an
// abstract capability the backend maps from role, so renaming a
// department there never requires an FE change.
export const SESSION_ROLES_KEY = 'kt-xnk-session-roles';
export const SESSION_PERMISSIONS_KEY = 'kt-xnk-session-permissions';

// The backend's JWT already carries its own `exp` (see the `token` claims
// returned by `POST /api/v1/authentication/login`); this cookie just needs to
// outlive that so the client doesn't drop the session before the token
// itself expires.
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

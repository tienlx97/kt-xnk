// Cookies, not localStorage: `src/app/(protected)/layout.js` needs to read
// the session on the *server* (via `next/headers`) to block protected pages
// from ever being rendered for a logged-out visitor — localStorage isn't
// visible there.
export const ACCESS_TOKEN_KEY = 'kt-xnk-access-token';

// The refresh token. HttpOnly like the access token, and never read by client
// code — `/api/backend` redeems it server-side when the access token expires.
export const REFRESH_TOKEN_KEY = 'kt-xnk-refresh-token';
export const SESSION_EMPLOYEE_CODE_KEY = 'kt-xnk-session-employee-code';
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

// The session as a whole lasts as long as the refresh token, since that is
// what can still produce a working access token. The access-token cookie gets
// its own, much shorter lifetime from the JWT's `exp` — see
// `src/app/api/session/route.js`.
//
// These two used to be one value pinned at 7 days while the access token
// expired in 60 minutes, which left the app rendering as "signed in" for days
// against a dead token (the API's docs/security.md, M-1).
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Cookies, not localStorage: `src/app/(protected)/layout.js` needs to read
// the session on the *server* (via `next/headers`) to block protected pages
// from ever being rendered for a logged-out visitor — localStorage isn't
// visible there.
export const ACCESS_TOKEN_KEY = 'kt-xnk-access-token';
export const SESSION_NATIONAL_ID_KEY = 'kt-xnk-session-national-id';
export const SESSION_DISPLAY_NAME_KEY = 'kt-xnk-session-display-name';

// The backend's JWT already carries its own `exp` (see the `token` claims
// returned by `POST /api/v1/authentication/login`); this cookie just needs to
// outlive that so the client doesn't drop the session before the token
// itself expires.
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

// Mirrors the shape a real backend's JWT access/refresh token pair will
// have, so wiring in the real backend later is a localized edit to
// `api/login.js`/`api/session.js`, not a rename across the feature.
export const ACCESS_TOKEN_KEY = 'kt-xnk-access-token';
export const REFRESH_TOKEN_KEY = 'kt-xnk-refresh-token';
export const SESSION_USERNAME_KEY = 'kt-xnk-session-username';

// Cookies, not localStorage: `src/app/(protected)/layout.js` needs to read
// the session on the *server* (via `next/headers`) to block protected pages
// from ever being rendered for a logged-out visitor — localStorage isn't
// visible there. Client JS sets these directly since there's no backend to
// issue a real `Set-Cookie` yet.
export const SESSION_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

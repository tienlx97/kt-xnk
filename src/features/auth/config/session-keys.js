// Mirrors the shape a real backend's JWT access/refresh token pair will
// have, so wiring in the real backend later is a localized edit to
// `api/login.js`/`api/session.js`, not a rename across the feature.
export const ACCESS_TOKEN_KEY = 'kt-xnk-access-token';
export const REFRESH_TOKEN_KEY = 'kt-xnk-refresh-token';
export const SESSION_USERNAME_KEY = 'kt-xnk-session-username';

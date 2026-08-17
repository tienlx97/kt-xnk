# Proposal: Wire real auth backend into login

**Status:** done
**Created:** 2026-08-17

## Why

`login-username-password` shipped `src/features/auth/` against a mock
(`api/login.js` checking hardcoded `config/test-users.js`, opaque
`accessToken`/`refreshToken` pair). A real backend now exists
(`POST {host}/authentication/login`), and the user asked to wire it in,
prioritizing the backend's shape over the frontend's prior assumptions.
The backend differs from what the mock assumed in two ways: it authenticates
by `Email` (not a generic username) and returns a single opaque `token`
(no separate refresh token) alongside `id`/`firstName`/`lastName`/`email`.

## What changes

- `api/login.js` calls the real backend instead of `config/test-users.js`
  (deleted); parses the `problem+json` error body's `detail` for failed
  logins, and a generic message if the request itself fails (e.g. backend
  unreachable).
- The login call is exposed via a React Query `useMutation`
  (`hooks/use-login-mutation.js`) rather than a raw `await`, matching the
  user's stated preference for React Query on API calls.
- Auth is now by email, not a generic username: `config/login-schema.js`,
  `hooks/use-login-form.js`, and the login form's label/placeholder/input
  type all changed from "username" to "email".
- Session storage (`api/session.js`, `config/session-keys.js`) drops the
  `refreshToken` cookie (backend doesn't issue one) and stores the single
  `token` plus `email`/`displayName` (from `firstName`/`lastName`) instead
  of a bare username; `hooks/use-session.js` and `components/user-menu.jsx`
  read `displayName` for the avatar instead of `username`.
- `config/api-config.js` (new) holds the backend base URL, overridable via
  `NEXT_PUBLIC_API_BASE_URL`; defaults to `http://localhost:5209` for local
  dev against the backend the user is running.

## Out of scope

- Token refresh / expiry handling beyond what the JWT's own `exp` claim
  gives — the backend exposes no refresh endpoint yet.
- CORS configuration on the backend itself (separate project) — noted to
  the user as a likely blocker if the frontend dev origin isn't allowlisted
  there.
- Server-set `httpOnly` cookies for the token — the backend returns the
  token in the JSON body, not via `Set-Cookie`, so client JS still writes
  the cookie itself (same tradeoff the mock had, now for a real token).

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-17 | Frontend field names/shapes changed to match backend exactly (`email`, single `token`), rather than adapting the backend response to fit the old `username`/`accessToken`+`refreshToken` shape | User: "ưu tiên backend, frontend chỉnh theo backend" |
| 2026-08-17 | Login call wrapped in `useMutation` from `@tanstack/react-query` (already a project dependency, wired via `QueryProvider` in root layout, previously unused) | User: "dùng reactquery gọi api" |

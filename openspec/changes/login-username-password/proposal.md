# Proposal: Username/password login

**Status:** done
**Created:** 2026-08-07

## Why

The app has protected routes with no documented authentication story: no
spec exists for how a visitor logs in, how the server decides a route is
protected, or how a logged-in user signs out. The login feature was built
across 5 commits directly per user request without going through the
propose→spec→tasks flow, so `openspec/` currently has no record of it at
all. Separately, the username field was silently modeled as a Vietnamese
CCCD (12-digit Citizen ID) validated by a hidden regex, while every visible
label/copy called it a generic "username" — an undocumented mismatch
between behavior and intent. This proposal retroactively documents the
shipped feature as what it was always presented as (username + password)
and removes the CCCD-only constraint so the code matches that story.

## What changes

- Documents the existing `src/features/auth/` feature: login form with
  username/password/remember-me fields and client-side zod validation
  (`components/login-form.jsx`, `hooks/use-login-form.js`,
  `config/login-schema.js`), a mock login call against hardcoded test
  credentials (`api/login.js`, `config/test-users.js`), cookie-based session
  storage readable from both client and server
  (`api/session.js`, `config/session-keys.js`), a `useSession()` hook
  (`hooks/use-session.js`), and an avatar/logout dropdown
  (`components/user-menu.jsx`).
- Documents the server-side session gate: `src/app/(protected)/layout.jsx`
  reads the access-token cookie via `next/headers` and redirects
  unauthenticated visitors to `/login` before any protected page renders.
- Code change: `config/login-schema.js`'s username rule changes from a
  12-digit-only regex (undocumented CCCD assumption) to a generic
  `min(3)` string check — no character-class or format restriction.
- Code change: `config/test-users.js` placeholder credentials changed from
  CCCD-shaped digit strings (`001234567890`, `079198765432`) to plain
  usernames (`admin`, `testuser`) so local testing doesn't imply a format
  constraint that no longer exists.

## Out of scope

- Replacing the mock `api/login.js`/`config/test-users.js` with a real
  backend call — no backend exists yet; tracked as a known follow-up in
  `config/test-users.js`'s own comment, not repeated here.
- `middleware.js`-based route protection — the gate is implemented as a
  Server Component layout check (`src/app/(protected)/layout.jsx`), not
  Next.js middleware; changing that mechanism is a separate decision.
- Avatar initials/display-name derivation from the raw session username in
  `components/user-menu.jsx` — noted as a minor cosmetic gap (shows the raw
  username string, not a derived display name) but not in scope here.
- Adding automated tests for `features/auth` — none exist today; this
  change documents current behavior, it doesn't add test coverage.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-07 | Retroactive spec written after the fact, status `done` immediately | Feature already shipped across 5 commits; this closes a documentation gap rather than planning new work |
| 2026-08-07 | Username validation relaxed to `min(3)` with no regex, instead of replacing one fixed format with another | The point of "forget CCCD" is a genuinely generic username, not a differently-shaped hidden constraint |

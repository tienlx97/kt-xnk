## Approach

`src/features/auth/` follows the project's standard feature layering
(`types → config → api → hooks → components`). Session state lives in
cookies (not localStorage) specifically so the server-side gate in
`src/app/(protected)/layout.jsx` can read authentication state via
`next/headers` before rendering any protected page — no client-side flash
of protected content is possible. There is no real backend yet, so
`api/login.js` validates against a hardcoded `config/test-users.js` list
and returns mock tokens shaped like a real JWT pair would be, keeping the
eventual swap to a real backend localized to `api/login.js`/`api/session.js`.

The only functional change accompanying this write-up is narrowing
`config/login-schema.js`'s username rule from a 12-digit CCCD regex to a
plain minimum-length string check, and correspondingly updating the mock
test credentials to non-digit strings — no other layer changes.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `src/features/auth/types/index.js` | none — documents existing `LoginFormValues`/`Session` typedefs |
| config | `src/features/auth/config/login-schema.js` | CCCD regex removed, replaced with generic `min(3)` |
| config | `src/features/auth/config/test-users.js` | CCCD-shaped test usernames replaced with plain strings |
| config | `src/features/auth/config/session-keys.js` | none — already generic |
| api | `src/features/auth/api/login.js`, `api/session.js` | none — consumes schema-validated input, no format assumptions |
| hooks | `src/features/auth/hooks/use-login-form.js`, `hooks/use-session.js` | none |
| components | `src/features/auth/components/login-form.jsx`, `components/user-menu.jsx` | none — UI copy was already generic |
| app (route wiring) | `src/app/(protected)/layout.jsx` | none — cookie-presence check is format-agnostic |

## New dependencies

None.

## Risks & mitigations

- Loosening username validation could in theory accept usernames the
  (future) real backend rejects → mitigated by this staying a client-side
  UX check only; the real backend, once wired into `api/login.js`, is the
  actual source of truth and can return its own validation errors.
- Retroactive spec drifting from actual behavior over time if code changes
  without a matching proposal → mitigated by this proposal existing at all,
  so the next change to `features/auth` has a spec to diff against instead
  of starting from zero.

## Verification plan

- [ ] `./harness/verify.sh` passes (structure, lint, typecheck, harness
      tests, build, quality thresholds)
- [ ] Manual: `pnpm dev`, log in at `/login` with `admin` / `password123` →
      redirected out of `/login`, avatar shown, protected route renders
- [ ] Manual: log in with `testuser` / `testpass1` → same result
- [ ] Manual: attempt login with a username shorter than 3 chars → inline
      validation error, no request sent
- [ ] Manual: attempt a previously-valid-looking CCCD digit string that
      isn't a real test user (e.g. `001234567890`) → rejected as "invalid
      credentials" (proves the old digit format is no longer special-cased,
      just an arbitrary string that doesn't match a test user)
- [ ] Manual: log out via the user menu → session cookies cleared,
      redirected to `/login`, protected route now redirects again
- [ ] Manual: visit a protected route directly with no cookies (e.g. via
      an incognito window) → redirected to `/login`

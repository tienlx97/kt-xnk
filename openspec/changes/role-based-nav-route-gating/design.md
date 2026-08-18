# Design: Role-based nav/route gating mechanism

## Approach

Decode the JWT's `roles` claim once, right after login, and persist it as a
plain cookie alongside the existing `token`/`nationalId`/`displayName`
cookies (`api/session.js`'s established `writeSession` pattern). Every
consumer downstream — `(protected)/layout.jsx` for nav filtering,
`middleware.js` for route gating — just reads that cookie; neither needs to
touch the JWT again. This sidesteps the Edge-runtime `Buffer` gap entirely:
decoding happens once, client-side, where the browser's `atob` is always
available.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| shared/api | `shared/api/jwt.js` (new) | `decodeJwtPayload`, `normalizeRoles` (handles the backend's single-role-is-a-bare-string quirk), `parseRolesCookie` |
| shared/api | `shared/api/nav.js` | `filterNavLinksByRoles` |
| shared/config | `shared/config/route-access.js` (new) | `routeAccessRules`, empty by default |
| shared/types | `shared/types/index.js` | `NavLink.allowedRoles` |
| auth config | `features/auth/config/session-keys.js` | `SESSION_ROLES_KEY` |
| auth api | `features/auth/api/session.js` | `writeSession`/`clearSession` handle the roles cookie; new `readSessionRoles` |
| auth hooks | `features/auth/hooks/use-login-form.js` | decode + normalize roles from the login response's token, pass to `writeSession` |
| auth types | `features/auth/types/index.js` | `Session.roles` |
| auth index | `features/auth/index.js` | export `SESSION_ROLES_KEY` (needed by `layout.jsx` and `middleware.js` — both must import through the feature's `index.js`, not its internal `config/` path, per this repo's `no-deep-feature-imports` structure rule) |
| app | `app/(protected)/layout.jsx` | read + parse the roles cookie, filter `topNavLinks` before passing to `ProtectedAppShell` |
| root | `src/middleware.js` (new) | route-level redirect |

## New dependencies

None — `atob`/`JSON.parse` cover JWT payload decoding, no `jwt-decode`/
`jose` needed.

## Risks & mitigations

- A root-level `middleware.js` is the documented Next.js convention when a
  project has no `src/` directory, but this project does — a root-level
  file was silently never invoked (confirmed empirically: no compile log
  line, no redirect, no error). → Placed at `src/middleware.js` instead;
  confirmed via the dev server log ("Compiling middleware...",
  Next's own proxy-migration deprecation warning) and a live redirect test
  that it's genuinely running.
- `middleware.js` importing `features/auth/index.js` (rather than reaching
  into `config/session-keys.js` directly) pulls that index's other exports
  — `LoginForm`/`UserMenu`, both `'use client'` React components — into
  scope for the Edge bundle. Risk: bundle bloat or an Edge-incompatible
  transitive import breaking the build. → Verified with `pnpm build`
  (clean, no warnings about it) and `pnpm structure` (the
  `no-deep-feature-imports` rule requires this import shape anyway); no
  observed problem, but worth remembering if `LoginForm`/`UserMenu` ever
  grow a genuinely Node-only or heavy dependency.
- `routeAccessRules`/nav `allowedRoles` are unverified against real backend
  role strings until someone actually restricts a real route — a typo'd
  role name (e.g. `'Logisitcs'`) would just silently show nothing to
  everyone. No validation added for this (no schema/enum of valid role
  names exists on the frontend, and hardcoding the backend's department
  list here would immediately drift) — accepted as a known gap.

## Verification plan

- [x] `pnpm lint`, `pnpm structure` clean
- [x] `pnpm typecheck` — no new errors (pre-existing unrelated errors in
      `icon-canary.jsx`/`icon-rocket.jsx`/`react-dev-callouts.jsx`
      untouched)
- [x] `node --test 'src/**/*.test.js'` — 64/64 green, including new
      `shared/api/jwt.test.js` and the two new cases added to
      `shared/api/nav.test.js`
- [x] `pnpm build` — clean, `src/middleware.js` compiles and appears as
      `ƒ Proxy (Middleware)` in the route summary
- [x] Live `next dev` smoke test: temporarily set
      `routeAccessRules = [{ pathPrefix: '/design-system', allowedRoles: ['Admin'] }]`,
      confirmed via `curl` with synthetic `kt-xnk-access-token`/
      `kt-xnk-session-roles` cookies — a `Participant`-only cookie gets
      `307` to `/`, an `Admin` cookie gets `200`, no token at all still
      falls through to `layout.jsx`'s existing `307` to `/login`, and an
      unrelated route (`/docs`) with a non-matching role stays `200`
      (rule doesn't match, no effect). Reverted the temporary rule
      afterward — `routeAccessRules` ships empty.
- [ ] Manual login against a live `BE-kt-xnk` backend with a real
      department-role user — **not run this session**, no backend instance
      was up; the synthetic-cookie test above exercises the same code
      paths `layout.jsx`/`middleware.js` would hit either way.

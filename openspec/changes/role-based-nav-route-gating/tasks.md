# Tasks: Role-based nav/route gating mechanism

## 1. Capture roles at login

- [x] 1.1 `shared/api/jwt.js`: `decodeJwtPayload` + `normalizeRoles` — verify:
      `node --test src/shared/api/jwt.test.js` covers both the single-role
      (bare string) and multi-role (array) claim shapes
- [x] 1.2 `SESSION_ROLES_KEY` cookie wired through `session-keys.js`,
      `session.js` (`writeSession`/`readSessionRoles`/`clearSession`),
      `use-login-form.js` — verify: `grep -n roles
      src/features/auth/api/session.js` shows read/write/clear all handle it

## 2. Nav filtering

- [x] 2.1 `NavLink.allowedRoles` typedef + `filterNavLinksByRoles` in
      `shared/api/nav.js` — verify: `node --test src/shared/api/nav.test.js`
      covers an unrestricted link and a role-restricted one
- [x] 2.2 `(protected)/layout.jsx` filters `topNavLinks` before passing to
      `ProtectedAppShell` — verify: reading the diff, `navLinks` prop is no
      longer the raw `topNavLinks` import

## 3. Route gating

- [x] 3.1 `shared/config/route-access.js` (`routeAccessRules`, empty) +
      `src/middleware.js` — verify: `pnpm build` shows
      `ƒ Proxy (Middleware)` in the route summary
- [x] 3.2 Confirm the middleware actually runs and redirects correctly —
      verify: live `next dev` + `curl` smoke test with a temporary rule
      (see `design.md`'s verification plan) — done, rule reverted after

## 4. Wrap-up

- [x] 4.1 `pnpm lint && pnpm structure && node --test 'src/**/*.test.js' && pnpm build`
      all clean
- [ ] 4.2 Manual login against a live `BE-kt-xnk` backend — not run this
      session, flagged as follow-up

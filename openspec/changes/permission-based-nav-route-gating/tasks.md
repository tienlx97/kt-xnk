# Tasks: Switch nav/route gating from role names to permission strings

## 1. Capture permissions at login

- [x] 1.1 `shared/api/jwt.js`: `normalizePermissions` + `parsePermissionsCookie`,
      internal helpers deduplicated with the roles equivalents — verify:
      `node --test src/shared/api/jwt.test.js` covers single/multi/missing
      permission-claim shapes
- [x] 1.2 `SESSION_PERMISSIONS_KEY` cookie wired through `session-keys.js`,
      `session.js`, `use-login-form.js`, `features/auth/index.js` — verify:
      `grep -n permissions src/features/auth/api/session.js` shows
      read/write/clear all handle it

## 2. Switch gating to permissions

- [x] 2.1 `NavLink.allowedPermissions` + `filterNavLinksByPermissions` —
      verify: `node --test src/shared/api/nav.test.js` covers an
      unrestricted link and a permission-restricted one
- [x] 2.2 `(protected)/layout.jsx` filters by permissions —
      verify: reading the diff, no more `roles`/`filterNavLinksByRoles`
      reference in this file
- [x] 2.3 `route-access.js` + `src/middleware.js` gate by
      `allowedPermissions` — verify: live `next dev` + `curl` smoke test
      with a temporary rule (see `design.md`), reverted after

## 3. Wrap-up

- [x] 3.1 `pnpm lint && pnpm structure && pnpm typecheck && node --test 'src/**/*.test.js' && pnpm build`
      all clean
- [ ] 3.2 Manual login against a live `BE-kt-xnk` backend with a real
      `RolePermissions`-mapped user — not run this session, flagged as
      follow-up

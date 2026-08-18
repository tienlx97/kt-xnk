# Design: Switch nav/route gating from role names to permission strings

## Approach

Same shape as `role-based-nav-route-gating`'s roles plumbing — decode once
at login, cache as a cookie, read that cookie everywhere a check is needed.
`shared/api/jwt.js`'s claim-normalization and cookie-parsing logic was
generalized into shared internal helpers (`normalizeStringClaim`,
`parseStringArrayCookie`) so `normalizeRoles`/`normalizePermissions` and
`parseRolesCookie`/`parsePermissionsCookie` don't duplicate the same
bare-string-vs-array/JSON-parse logic twice.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| shared/api | `shared/api/jwt.js` | add `normalizePermissions`, `parsePermissionsCookie`; internal helpers deduplicated |
| shared/api | `shared/api/nav.js` | `filterNavLinksByRoles` → `filterNavLinksByPermissions` |
| shared/config | `shared/config/route-access.js` | `allowedRoles` → `allowedPermissions` |
| shared/config | `shared/config/site.js` | comment/example updated |
| shared/types | `shared/types/index.js` | `NavLink.allowedRoles` → `allowedPermissions` |
| auth config | `features/auth/config/session-keys.js` | add `SESSION_PERMISSIONS_KEY` |
| auth api | `features/auth/api/session.js` | `writeSession`/`clearSession` handle the permissions cookie too; new `readSessionPermissions` |
| auth hooks | `features/auth/hooks/use-login-form.js` | decode + normalize permissions, pass to `writeSession` |
| auth types | `features/auth/types/index.js` | `Session.permissions` |
| auth index | `features/auth/index.js` | export `SESSION_PERMISSIONS_KEY` |
| app | `app/(protected)/layout.jsx` | filter nav by permissions, not roles |
| root | `src/middleware.js` | gate by permissions, not roles |

## New dependencies

None.

## Risks & mitigations

- Permission strings are free-text on both ends (FE's `route-access.js`/
  `site.js`, BE's `RolePermissions.Map`) with no shared schema/enum — a
  typo on either side fails silently (nothing shown, or nothing gated), not
  a build/type error. Same accepted-gap shape as the role-name version;
  not solved here.
- `readSessionRoles`/`SESSION_ROLES_KEY` still exist but nothing currently
  reads them for gating — dead-ish code until something uses roles for
  display. Kept deliberately (see proposal's decision log), not considered
  premature/speculative since it already has one real caller
  (`use-login-form.js` still writes it every login).

## Verification plan

- [x] `pnpm lint`, `pnpm structure`, `pnpm typecheck` (no new errors —
      same pre-existing-only failures as last session)
- [x] `node --test 'src/**/*.test.js'` — 69/69 green, including new
      `normalizePermissions`/`parsePermissionsCookie` cases in
      `jwt.test.js` and updated permission-based cases in `nav.test.js`
- [x] `pnpm build` clean
- [x] Live `next dev` smoke test: temporarily set
      `routeAccessRules = [{ pathPrefix: '/design-system', allowedPermissions: ['logistics:view'] }]`,
      `curl`'d with synthetic `kt-xnk-access-token`/
      `kt-xnk-session-permissions` cookies — a `departments:manage`-only
      cookie gets `307` to `/`, a `logistics:view` cookie gets `200`, no
      token at all still falls through to `layout.jsx`'s `307` to
      `/login`. Reverted the temporary rule afterward.
- [ ] Manual login against a live `BE-kt-xnk` backend with a real
      `RolePermissions`-mapped user — **not run this session**, no backend
      instance was up. `BE-kt-xnk`'s own session this same day did verify
      the `permissions` claim shape live against Docker (both the
      multi-value-array and single-value-bare-string serializations) — see
      its `harness/PROGRESS.md`.

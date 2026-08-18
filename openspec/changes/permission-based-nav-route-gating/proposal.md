# Proposal: Switch nav/route gating from role names to permission strings

**Status:** done
**Created:** 2026-08-18

## Why

`role-based-nav-route-gating` (same day, earlier) built nav/route gating
keyed on role names (e.g. `'Logistics'`, a department name). Discussing how
other sites solve this, the user opted for permission-based gating instead:
the frontend checks an abstract capability string (`'logistics:view'`), and
only the backend's `RolePermissions.Map` (`BE-kt-xnk`) knows which roles
grant which permission. Renaming a department at the backend then never
requires an FE code change — the previous role-based design would have
broken silently (a stale role-name string in `allowedRoles` never matching
again).

## What changes

- Login now also decodes the JWT's `permissions` claim (already emitted by
  the backend's `JwtTokenGenerator`, previously always empty until this
  session's matching `BE-kt-xnk` change populated `RolePermissions.Map`)
  and caches it as a new `SESSION_PERMISSIONS_KEY` cookie, the same way
  `roles` already was.
- `NavLink.allowedRoles` → `NavLink.allowedPermissions`;
  `filterNavLinksByRoles` → `filterNavLinksByPermissions`.
- `routeAccessRules` entries: `allowedRoles` → `allowedPermissions`.
- `roles`/`SESSION_ROLES_KEY`/`readSessionRoles` are **kept**, not removed
  — still useful session metadata (e.g. a future "your role" display) —
  only the *gating* mechanism switched to permissions.

## Out of scope

- Same as `role-based-nav-route-gating`: no real restricted route/nav item
  ships — `routeAccessRules` stays empty, `site.js`'s two nav links stay
  unrestricted.
- A real end-to-end login test against a live `BE-kt-xnk` backend — see
  `design.md`'s verification plan for what was actually run instead.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-18 | Permission strings checked by FE (`'logistics:view'`), not role names, mirroring `BE-kt-xnk`'s newly-populated `RolePermissions.Map` | User: decouple "what the UI shows" from "what the org's department is literally named" — a renamed department shouldn't require an FE deploy |
| 2026-08-18 | Kept `roles` cookie/plumbing alongside the new `permissions` one, didn't replace it | Roles remain useful session metadata even once gating itself no longer reads them |

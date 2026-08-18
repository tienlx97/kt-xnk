# Proposal: Role-based nav/route gating mechanism

**Status:** done
**Created:** 2026-08-18

## Why

The backend (`BE-kt-xnk`) already embeds a `roles` claim in its JWT
(profile types like `Admin`, plus department names like `Logistics` — see
its `docs/api/Authentication.md`) and enforces role-based access server-side
via `[Authorize(Roles = "...")]`. This frontend has no concept of roles at
all yet: `(protected)/layout.jsx` only checks "is there an access-token
cookie", and `shared/config/site.js`'s nav is a fully static array. The user
asked for a mechanism — a nav item hidden from everyone except certain
roles, and a route only enterable by certain roles — described with a
hypothetical `/logistics` example, no such page exists yet.

## What changes

- Login now decodes the JWT's `roles` claim and stores it as a cookie
  alongside the token, so both a Server Component (`layout.jsx`, Node
  runtime) and `middleware.js` (Edge runtime) can read it without
  duplicating JWT-decode logic across two runtimes with different
  capabilities.
- `NavLink` gains an optional `allowedRoles` field; `layout.jsx` filters
  `topNavLinks` through it before rendering.
- New `middleware.js` (must live at `src/middleware.js`, not the repo
  root, for this project's `src/` layout — see file header comment) reads
  a `routeAccessRules` config (`{ pathPrefix, allowedRoles }[]`) and
  redirects to `/` when a matching route's caller lacks every allowed role.
  Layered on top of, not replacing, `layout.jsx`'s existing login check.

## Out of scope

- Any real restricted route or nav item — `routeAccessRules` ships empty,
  `site.js`'s two nav links stay unrestricted. Wiring up an actual
  `/logistics` page (or similar) is separate follow-up work once that page
  exists.
- A dedicated "403 Forbidden" page — the middleware redirects to `/` for
  now.
- Verifying end-to-end against a live `BE-kt-xnk` backend with a real
  department-role user — verified instead via `pnpm test` (new unit tests
  for the pure decode/filter functions) and a live `next dev` smoke test
  using synthetic cookies (temporarily restricting the existing
  `/design-system` page to `['Admin']`, confirming the redirect fires for
  a non-matching role and passes through for a matching one, then
  reverting) — see `design.md`'s verification plan for the exact commands.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-18 | Roles decoded once at login and cached as a cookie, rather than re-decoded from the JWT in `layout.jsx`/`middleware.js` | Edge runtime (`middleware.js`) doesn't guarantee `Buffer`; a plain cookie read works identically in both the Node and Edge runtimes with no duplicated decode logic |
| 2026-08-18 | `middleware.js` placed at `src/middleware.js`, not the repo root | Empirically confirmed during manual testing: a root-level `middleware.js` was silently never invoked by Next 16.2.11 in this `src/`-based project — moving it into `src/` fixed it |
| 2026-08-18 | Kept the `middleware.js` filename despite Next 16's `proxy.js` deprecation warning | `middleware.js` still fully works today (warning only); renaming is a trivial follow-up, not worth blocking this change on |

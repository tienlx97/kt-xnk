# Proposal: /admin nav + create-user form

**Status:** done
**Created:** 2026-08-18

## Why

User asked for an admin-only user-creation feature: a `/admin` topnav entry
and sidenav visible only to Admins, with a "Tạo người dùng" (create user)
page wired to the real backend's admin-only
`POST /api/v1/authentication/register`.

## What changes

- **Backend** (`BE-kt-xnk`): new `Permission.UsersManage = "users:manage"`,
  granted to `Admin` in `RolePermissions.Map` — FE-nav-gating only, same
  role as the existing `departments:manage`; no backend command checks it
  directly (`RegisterCommand` still gates on `[Authorize(Roles = "Admin")]`).
- `shared/config/site.js`: new `Quản trị` topnav link, `href: '/admin'`,
  `allowedPermissions: ['users:manage']`.
- `shared/config/route-access.js`: new `routeAccessRules` entry for
  `/admin` with the same permission — `src/middleware.js` now redirects a
  non-Admin visitor away from any `/admin/*` path before it renders.
- `shared/components/protected-app-shell.jsx`: `/admin` added to
  `SIDE_NAV_ROUTES`. The 2-column grid layout was previously driven by
  `hasMdxLayout` alone (coincidentally correct, since the only side-nav'd
  sections were also MDX ones) — introduced `hasSideNavLayout = hasSideNav
  || hasMdxLayout` so a non-MDX side-nav'd section like `/admin` gets the
  2-column grid *and* keeps `main`'s own padding (MDX content manages its
  own spacing; a plain form doesn't).
- New `src/sidebarAdmin.json` (one entry: "Tạo người dùng" →
  `/admin/users/new`), added to `(protected)/layout.jsx`'s
  `sideNavRouteTrees`.
- New feature `src/features/admin-users/`: `CreateUserForm` (all
  `RegisterRequest` fields — including the address-type/province/district/
  ward/detail fields and Company→Branch→Department cascading `Selector`s
  fetched from the public `GET /companies`, `GET /companies/{id}/branches`,
  `GET /departments` endpoints), `useCreateUserForm` (zod validation
  mirroring the backend's `RegisterCommandValidator`, including the same
  District-required-for-`OldUnits`/District-must-be-empty-for-`NewUnits`
  cross-field rule), `useCreateUserMutation` (React Query).
- New routes: `src/app/(protected)/admin/page.jsx` (redirects to
  `/admin/users/new` — the only admin feature today, no dashboard to build
  yet) and `src/app/(protected)/admin/users/new/page.jsx` (Server Component;
  reads the Admin's bearer token from the session cookie server-side and
  passes it down as a prop, since `features/admin-users` cannot import
  `features/auth` directly — `no-feature-to-feature` structural rule).
- `API_BASE_URL` is duplicated into `features/admin-users/config/
  api-config.js` rather than imported from `features/auth` — same
  structural-isolation reason, too small a constant to be worth promoting
  to `src/shared/` on its own.

## Out of scope

- No admin dashboard beyond the create-user page — `/admin` just redirects.
- No user list/edit/delete, no Position assignment, no bulk import.
- No client-side validation against a real Vietnamese province/ward
  dataset — `Province`/`District`/`Ward` are free-text inputs, matching the
  backend (`BE-kt-xnk`'s `add-address-to-registration` change).

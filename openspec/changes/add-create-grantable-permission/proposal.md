# Admin UI to create a grantable permission

**Status:** done
**Created:** 2026-08-20

## Why

`BE-kt-xnk`'s `add-create-grantable-permission` moved the individually-
grantable permission whitelist off a static array onto a real
`GrantablePermission` DB catalog, and added `POST /permissions/grantable`
so Admin can add a new one without a code change/deploy. It shipped
API-only, matching how `admin-user-permission-grants` (the grant/revoke UI)
also started API-only. This change adds the missing half: a page to
actually use that endpoint.

## What changes

- New `/admin/permissions` page (`PermissionCatalog` component) — a table
  of the current catalog plus a create form. On its own page rather than
  inside a per-user edit dialog: the catalog is global, and burying a
  global action in one user's form makes it read like it only affects
  that user.
- `validatePermissionKey` mirrors the backend's
  `CreateGrantablePermissionCommandValidator` regex client-side — catches
  an obvious typo before the round trip. The backend stays the actual
  authority; this only saves a 400.
- An explicit `Banner` on the page: adding a permission here does not, by
  itself, protect anything. It only makes the permission *grantable* (and
  therefore end up in a user's JWT `permissions` claim) — a business
  endpoint still needs its own `[Authorize(Permissions = ...)]` on the
  backend before that claim gates anything. Without saying this out loud,
  it would be easy to assume creating a catalog row here locks down a
  screen.
- `sidebarAdmin.json`: new "Phân quyền" nav group → "Quyền cấp riêng".
- `useCreateGrantablePermissionMutation` invalidates the
  `grantable-permissions` query on settle, so a permission created here
  shows up as a switch in the per-user "Quyền" tab immediately, not after
  a reload.

## Harness fix (same day, discovered while re-running verify for this change)

`harness/checks/quality.mjs` built its root path with
`new URL('../..', import.meta.url).pathname` — a URL component, not a
filesystem path. It percent-encodes (this checkout under `VIBE CODE`
became `VIBE%20CODE`) and on Windows leaves a leading slash before the
drive letter, so every path built from it missed and the gate had been
failing on *every* run this session regardless of whether a build
existed — it was never actually measuring anything. Fixed with
`fileURLToPath`; `./harness/verify.sh` now passes 10/10, and the bundle
size gate runs for real (168.7 kB against the 250 kB threshold).

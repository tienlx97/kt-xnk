# Admin UI for individual permission grants

**Status:** done
**Created:** 2026-08-20

## Why

`BE-kt-xnk`'s `add-user-permission-grants` change added
`POST/DELETE /users/{id}/permissions` — a way to grant a permission to one
specific user, independent of their role/department (e.g. `logistics:secret`
for a department head or one hand-picked employee). It shipped API-only, same
as `admin-role` before it. This change adds the Admin-facing UI so that
capability is actually usable without a raw HTTP client.

Complementary to, not overlapping with, `permission-based-nav-route-gating`
(same repo, earlier): that change makes the FE *read* the `permissions` JWT
claim to gate nav/routes; this change lets an Admin *set* what ends up in
that claim for one user.

## What changes

- New "Quyền" tab in `EditUserForm` (via `UserFormTabs`), alongside the
  existing Contact/Bank/Salary/Dependents tabs. Only shown when editing an
  existing user — `CreateUserForm` omits it, since granting to an
  account that doesn't exist yet is meaningless.
- Each grantable permission renders as a `Switch`. Toggling calls the
  grant/revoke API **immediately** — not staged behind the dialog's "Lưu
  thay đổi" button — because the backend applies it immediately too
  (rotates the target's `SecurityStamp`). Staging it behind a save button
  would misrepresent when the change actually takes effect.
- `UserDetail` type gains `extraPermissions: string[]` (and
  `allowConcurrentSessions`, which the backend response already carried but
  the FE type hadn't caught up to).

## Update 2026-08-20 (same day): fetched instead of hardcoded

Originally shipped with `GRANTABLE_PERMISSIONS` as a small hardcoded list
mirroring the backend's `Permission.Grantable` whitelist — explicitly
YAGNI, on the stated condition *"if the list grows, do it as a separate
change."* `BE-kt-xnk` added `GET /permissions/grantable`
(`add-grantable-permissions-endpoint`) once that condition was met; this FE
change now fetches it (`useGrantablePermissionsQuery`) instead.
`grantable-permissions.js` keeps only `PERMISSION_LABELS`, a local
Vietnamese-label fallback — a permission with no label entry still renders
(raw key as its own label) rather than disappearing.

## Out of scope

- No UI change to `admin-role` or `concurrent-sessions` — still API-only,
  a separate change if/when needed.

# Tasks

- [x] 1.1 `config/grantable-permissions.js` — `GRANTABLE_PERMISSIONS`
      mirroring the backend's `Permission.Grantable`.
- [x] 1.2 `api/permissions.js` — `grantUserPermission`/`revokeUserPermission`.
- [x] 1.3 `hooks/use-user-permission-mutation.js` — grant/revoke mutations,
      invalidate `['admin-users', 'user', userId]` on settle.
- [x] 1.4 `components/user-permissions-fields.jsx` — "Quyền" tab content, one
      `Switch` per grantable permission, `changeAction` calls the API
      immediately.
- [x] 1.5 `UserFormTabs` — new `permissions` tab, hidden when
      `permissionsFieldsProps` is omitted (i.e. `CreateUserForm`).
- [x] 1.6 `use-edit-user-form.js` — expose `extraPermissions` from the
      already-fetched user detail query. `EditUserForm` wires it into the
      new tab.
- [x] 1.7 `types/index.js` — `UserDetail.extraPermissions` /
      `allowConcurrentSessions`.
- [x] 1.8 `./harness/verify.sh` — lint/typecheck/structure/unit-tests/build
      all pass. `quality-thresholds` fails on a pre-existing path-encoding
      bug in `harness/checks/quality.mjs` when the repo lives under a
      directory with a space (`VIBE CODE`) — unrelated to this change,
      `build-manifest.json` verified to exist.

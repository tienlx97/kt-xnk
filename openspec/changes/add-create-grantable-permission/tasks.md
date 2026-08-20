# Tasks

- [x] 1.1 `hooks/use-create-grantable-permission-mutation.js` —
      invalidates `['admin-users', 'grantable-permissions']` on settle.
- [x] 1.2 `config/grantable-permissions.js`: `validatePermissionKey`
      (mirrors backend regex, Vietnamese error messages).
- [x] 1.3 `components/permission-catalog.jsx` — table (key + description,
      via `labelForPermission`) + create form, loading skeleton, explicit
      "this doesn't protect anything yet" banner.
- [x] 1.4 `app/(protected)/admin/permissions/page.jsx`, `index.js` export,
      `sidebarAdmin.json` nav entry.
- [x] 1.5 Harness fix: `harness/checks/quality.mjs` path resolution
      (`fileURLToPath` instead of `URL.pathname`) — see proposal.md.
- [x] 1.6 `./harness/verify.sh` passes 10/10 (first clean run of the
      session — previously always failed at `quality-thresholds` on the
      bug fixed in 1.5).

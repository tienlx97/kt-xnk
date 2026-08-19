# Tasks

- [x] 1.1 Backend: `Permission.UsersManage`, granted to `Admin` in
      `RolePermissions.Map`; updated `RolePermissionsTests`
- [x] 1.2 `shared/config/site.js` (+ `site.test.js`): `Quản trị` topnav link
      gated on `users:manage`
- [x] 1.3 `shared/config/route-access.js`: `/admin` route-access rule
- [x] 1.4 `shared/components/protected-app-shell.jsx`: `/admin` in
      `SIDE_NAV_ROUTES`; `hasSideNavLayout` so the 2-column grid + padded
      main apply to a non-MDX side-nav'd section
- [x] 1.5 `src/sidebarAdmin.json` + wired into `(protected)/layout.jsx`
- [x] 1.6 `features/admin-users/`: types, config (api-config,
      create-user-schema), api (org-directory, register), hooks
      (use-org-directory, use-create-user-mutation, use-create-user-form),
      components (CreateUserForm), index.js
- [x] 1.7 `app/(protected)/admin/{page.jsx,users/new/page.jsx}`
- [x] 1.8 Manual verification (no browser tool available in this session):
      curl with a real Admin JWT + `users:manage` permission cookie against
      the dev server confirmed (a) `/admin/users/new` renders 200 with all
      expected fields, (b) a non-Admin's session is redirected away by
      `middleware.js`, (c) the `Quản trị` topnav link is present only for
      `users:manage` and absent otherwise, (d) the exact JSON body
      `registerUser` sends round-trips successfully against the real
      backend (`POST /api/v1/authentication/register` → 200, new user
      persisted), including the `OldUnits`-without-`District` rejection
      the client-side schema also mirrors
- [x] 1.9 `./harness/verify.sh` — everything passes except `typecheck`,
      which fails on the same 3 pre-existing, untouched files as every
      prior session (`icon-canary.jsx`, `icon-rocket.jsx`,
      `react-dev-callouts.jsx` — confirmed identical error set before/after
      this change)
- [x] 1.10 (follow-up) Position (chức vụ) selector, sourced from the
      backend's new required `PositionId` on `Register`
      (`BE-kt-xnk`'s `add-position-to-registration`) — `listPositions`/
      `usePositionsQuery`, schema + form wiring, `Selector` in the "Nơi làm
      việc" section
- [x] 1.11 (follow-up) Random-password `Button` next to the password field
      (`config/generate-password.js`); switched that field to
      `type="text"` since the generated value needs to be readable for the
      Admin to hand off
- [x] 1.12 (follow-up) `/admin/users` list page: `Table` of users +
      "Tạo mới"/"Sửa" actions opening `CreateUserForm`/`EditUserForm` inside
      an Astryx `Dialog` (no Drawer component exists in Astryx — confirmed
      via search). New `api/users.js`, `use-users-query.js`,
      `use-update-user-mutation.js`, `use-edit-user-form.js`,
      `update-user-schema.js`, `edit-user-form.jsx`, `user-list.jsx`;
      extracted `user-org-address-fields.jsx` shared by both forms.
      Consolidated `admin/users/new` and `admin/page.jsx` into redirects to
      `/admin/users` now that creation is inline; removed the sidenav's
      separate "Tạo mới" entry. Backend: `BE-kt-xnk`'s
      `add-users-list-and-update` (`GET/PUT /users`)

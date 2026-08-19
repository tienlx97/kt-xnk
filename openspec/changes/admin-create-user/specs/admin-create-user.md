# Admin create-user

## ADDED Requirements

### Requirement: Admin-only /admin navigation
The system SHALL show a "Quản trị" topnav link and its sidenav only to a
visitor whose session `permissions` include `users:manage`, and SHALL
redirect any visitor without that permission away from `/admin` and every
sub-route back to `/`, before the route renders.

#### Scenario: Admin sees the nav
- **WHEN** a logged-in visitor's session permissions include `users:manage`
- **THEN** the topnav SHALL include a "Quản trị" link to `/admin`, and the
  sidenav on any `/admin/*` route SHALL include "Danh sách" (under a
  "Người dùng" group)

#### Scenario: Non-Admin does not see the nav and cannot reach the route
- **WHEN** a logged-in visitor's session permissions do not include
  `users:manage`
- **THEN** the topnav SHALL NOT include the "Quản trị" link, and a direct
  request to `/admin` or `/admin/users/new` SHALL redirect to `/`

### Requirement: Create user form
The system SHALL provide a create-user form, opened from a "Tạo mới" action
on `/admin/users` (rendered inside a modal dialog, not a dedicated page —
`/admin/users/new` redirects to `/admin/users` for any old link), that
submits every field the backend's `POST /authentication/register` requires
(national ID, first/last name, password, phone, address type + province +
district + ward + detail, position, company, branch, department) using the
Admin's own bearer token, and SHALL client-side validate the same rules the
backend enforces before submitting.

#### Scenario: Successful creation
- **WHEN** an Admin fills every required field with values passing
  validation and submits
- **THEN** the form SHALL call `POST /authentication/register` with the
  Admin's bearer token and show a success message on a 2xx response

#### Scenario: Address type governs the district field
- **WHEN** the Admin selects "Trước sáp nhập" (`OldUnits`)
- **THEN** the district field SHALL be shown and required
- **WHEN** the Admin selects "Sau sáp nhập" (`NewUnits`)
- **THEN** the district field SHALL be hidden and cleared, and SHALL NOT be
  submitted as a non-empty value

#### Scenario: Company/branch/department cascade
- **WHEN** the Admin picks a Company
- **THEN** the Branch selector SHALL populate from that company's branches
  and any previously selected Branch/Department SHALL be cleared
- **WHEN** the Admin picks a Branch
- **THEN** the Department selector SHALL populate from that branch's
  departments and any previously selected Department SHALL be cleared

#### Scenario: Backend rejects the submission
- **WHEN** the backend returns a non-2xx response (e.g. duplicate national
  ID, weak password)
- **THEN** the form SHALL show an error banner and SHALL NOT clear the
  entered values

### Requirement: User list

The system SHALL provide `/admin/users`, listing every user (via
`GET /users`) in a table showing name, national ID, phone, company,
department, and position, with a "Tạo mới" action and a per-row "Sửa"
action.

#### Scenario: List renders
- **WHEN** an Admin opens `/admin/users`
- **THEN** the system SHALL fetch `GET /users` with the Admin's bearer
  token and render one row per user

#### Scenario: Tạo mới opens the create dialog
- **WHEN** an Admin clicks "Tạo mới"
- **THEN** the system SHALL open a modal dialog containing the create-user
  form; on successful creation the dialog SHALL close and the list SHALL
  refresh to include the new user

#### Scenario: Sửa opens the edit dialog pre-filled
- **WHEN** an Admin clicks "Sửa" on a row
- **THEN** the system SHALL open a modal dialog containing an edit form
  pre-filled with that user's current values (national ID shown read-only,
  no password field) and SHALL call `PUT /users/{userId}` on submit; on
  success the dialog SHALL close and the list SHALL refresh to show the
  updated values

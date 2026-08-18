# Spec: Permission-based nav/route gating (delta over `role-based-nav-route-gating`)

Supersedes `role-based-nav-route-gating`'s `specs/role-gating.md` entirely —
same three requirements, re-stated in terms of permission strings instead of
role names. The "roles" requirement (session captures roles from the JWT)
is **not** superseded — that capability stays, it's just no longer what
nav/route gating itself checks.

## Requirement: Session captures permissions from the JWT

The system SHALL decode the `permissions` claim from a successful login's
JWT and persist it as part of the session, normalized to a string array
regardless of whether the backend serialized it as a single string or a
JSON array (same shape as the existing `roles` claim handling).

### Scenario: Single permission

- GIVEN a login response whose JWT payload has
  `"permissions": "logistics:view"`
- WHEN the session is written
- THEN the stored permissions SHALL be `["logistics:view"]`

### Scenario: Multiple permissions

- GIVEN a login response whose JWT payload has
  `"permissions": ["logistics:view", "departments:manage"]`
- WHEN the session is written
- THEN the stored permissions SHALL be
  `["logistics:view", "departments:manage"]`

### Scenario: No permissions claim

- GIVEN a login response whose JWT payload has no `permissions` claim
- WHEN the session is written
- THEN the stored permissions SHALL be `[]`

## Requirement: Nav links can be restricted to specific permissions

The system SHALL hide a nav link that declares `allowedPermissions` from
any visitor whose session permissions don't intersect that list, while a
nav link with no `allowedPermissions` SHALL remain visible to any
logged-in visitor (today's default for every link).

### Scenario: Visitor has an allowed permission

- GIVEN a nav link with `allowedPermissions: ['logistics:view']`
- WHEN a visitor whose session permissions include `'logistics:view'`
  views the nav
- THEN the link SHALL be shown

### Scenario: Visitor lacks the allowed permission

- GIVEN the same nav link
- WHEN a visitor whose session permissions are `['departments:manage']`
  (or `[]`) views the nav
- THEN the link SHALL NOT be shown

## Requirement: Specific routes can be restricted to specific permissions

The system SHALL redirect a visitor to `/` before a restricted route's page
ever renders if their session permissions don't intersect that route's
`allowedPermissions`, while leaving an unrestricted route unaffected. A
visitor with no session at all SHALL NOT be redirected by this mechanism —
the existing login gate (`(protected)/layout.jsx`) owns that case.

### Scenario: Visitor has an allowed permission

- GIVEN a route restricted to `allowedPermissions: ['logistics:view']`
- WHEN a visitor with a valid session and permission `'logistics:view'`
  requests that route
- THEN the page SHALL render normally

### Scenario: Visitor lacks the allowed permission

- GIVEN the same restricted route
- WHEN a visitor with a valid session but permission `'departments:manage'`
  (not `'logistics:view'`) requests that route
- THEN the visitor SHALL be redirected to `/` before the page renders

### Scenario: Visitor has no session

- GIVEN the same restricted route
- WHEN a visitor with no access-token cookie at all requests that route
- THEN this mechanism SHALL NOT act — the request falls through to
  `(protected)/layout.jsx`'s existing redirect to `/login`

### Scenario: Route has no restriction

- GIVEN a route with no matching entry in `routeAccessRules`
- WHEN any visitor (any permission, or no session) requests that route
- THEN this mechanism SHALL NOT act

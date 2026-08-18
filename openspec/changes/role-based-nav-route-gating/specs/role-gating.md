# Spec: Role-based nav/route gating

## Requirement: Session captures roles from the JWT

The system SHALL decode the `roles` claim from a successful login's JWT and
persist it as part of the session, normalized to a string array regardless
of whether the backend serialized it as a single string or a JSON array.

### Scenario: Single role

- GIVEN a login response whose JWT payload has `"roles": "Admin"`
- WHEN the session is written
- THEN the stored roles SHALL be `["Admin"]`

### Scenario: Multiple roles

- GIVEN a login response whose JWT payload has
  `"roles": ["Admin", "Logistics"]`
- WHEN the session is written
- THEN the stored roles SHALL be `["Admin", "Logistics"]`

### Scenario: No roles claim

- GIVEN a login response whose JWT payload has no `roles` claim
- WHEN the session is written
- THEN the stored roles SHALL be `[]`

## Requirement: Nav links can be restricted to specific roles

The system SHALL hide a nav link that declares `allowedRoles` from any
visitor whose session roles don't intersect that list, while a nav link
with no `allowedRoles` SHALL remain visible to any logged-in visitor
(today's default for every link).

### Scenario: Visitor has an allowed role

- GIVEN a nav link with `allowedRoles: ['Admin', 'Logistics']`
- WHEN a visitor whose session roles include `'Logistics'` views the nav
- THEN the link SHALL be shown

### Scenario: Visitor has no allowed role

- GIVEN the same nav link
- WHEN a visitor whose session roles are `['Participant']` (or `[]`) views
  the nav
- THEN the link SHALL NOT be shown

## Requirement: Specific routes can be restricted to specific roles

The system SHALL redirect a visitor to `/` before a restricted route's page
ever renders if their session roles don't intersect that route's
`allowedRoles`, while leaving an unrestricted route unaffected. A visitor
with no session at all SHALL NOT be redirected by this mechanism — the
existing login gate (`(protected)/layout.jsx`) owns that case.

### Scenario: Visitor has an allowed role

- GIVEN a route restricted to `allowedRoles: ['Admin']`
- WHEN a visitor with a valid session and role `'Admin'` requests that
  route
- THEN the page SHALL render normally

### Scenario: Visitor lacks the allowed role

- GIVEN the same restricted route
- WHEN a visitor with a valid session but role `'Participant'` requests
  that route
- THEN the visitor SHALL be redirected to `/` before the page renders

### Scenario: Visitor has no session

- GIVEN the same restricted route
- WHEN a visitor with no access-token cookie at all requests that route
- THEN this mechanism SHALL NOT act — the request falls through to
  `(protected)/layout.jsx`'s existing redirect to `/login`

### Scenario: Route has no restriction

- GIVEN a route with no matching entry in `routeAccessRules`
- WHEN any visitor (any role, or no session) requests that route
- THEN this mechanism SHALL NOT act

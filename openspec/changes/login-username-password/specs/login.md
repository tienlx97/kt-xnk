# Spec: Login

## Requirement: Username/password authentication

The system SHALL let a visitor authenticate with a username and password
via a login form, validating both fields client-side before submission.

### Scenario: Successful login with valid credentials

- GIVEN a visitor is on `/login`
- WHEN they submit a username and password matching a known test user
- THEN a session is established (access/refresh token and username cookies
  are set) and the visitor is redirected away from `/login`

### Scenario: Invalid credentials rejected

- GIVEN a visitor is on `/login`
- WHEN they submit a username/password pair that does not match any known
  test user
- THEN login fails, no session cookies are set, and an error is shown on
  the form

### Scenario: Client-side validation blocks malformed input

- GIVEN a visitor is on `/login`
- WHEN they submit a username shorter than 3 characters, or a password
  shorter than 6 characters
- THEN the form SHALL show a validation error and SHALL NOT submit the
  login request

## Requirement: Server-side session gate

The system SHALL block access to protected routes for any visitor without
a valid session, by checking for a session cookie on the server before
rendering.

### Scenario: Unauthenticated visitor redirected

- GIVEN a visitor with no access-token cookie
- WHEN they request any route under the protected route group
- THEN the server SHALL redirect them to `/login` before rendering the
  page

### Scenario: Authenticated visitor allowed through

- GIVEN a visitor with a valid access-token cookie
- WHEN they request a route under the protected route group
- THEN the server SHALL render the requested page

## Requirement: Session display and logout

The system SHALL show an authenticated visitor's identity via an avatar
menu, and SHALL let them end their session from that menu.

### Scenario: Avatar shown when authenticated

- GIVEN a visitor has an active session
- WHEN they view any page that renders the user menu
- THEN an avatar reflecting their session username SHALL be shown

### Scenario: Logout clears session and redirects

- GIVEN a visitor has an active session and opens the user menu
- WHEN they select logout
- THEN all session cookies SHALL be cleared and the visitor SHALL be
  redirected to `/login`

## Requirement: Remember-me persistence

The system CAN remember the last-used username across visits when the
visitor opts in, without persisting the password.

### Scenario: Remember-me checked

- GIVEN a visitor logs in with "remember me" checked
- WHEN they return to `/login` later in the same browser
- THEN the username field SHALL be pre-filled with their last-used
  username

### Scenario: Remember-me unchecked

- GIVEN a visitor logs in with "remember me" unchecked
- WHEN they return to `/login` later
- THEN the username field SHALL NOT be pre-filled

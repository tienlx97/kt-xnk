# Spec: Login (delta over `login-username-password`)

Supersedes the "Username/password authentication" requirement's field name
only — all other requirements and scenarios in
`openspec/changes/login-username-password/specs/login.md` (session gate,
avatar/logout, remember-me) are unchanged.

## Requirement: Email/password authentication

The system SHALL let a visitor authenticate with an email and password via
a login form, validating both fields client-side before submission, and
authenticating against the real backend (`POST /authentication/login`).

### Scenario: Successful login with valid credentials

- GIVEN a visitor is on `/login`
- WHEN they submit an email and password the backend accepts
- THEN the backend's `token` is stored as the session, `email` and a
  `displayName` derived from `firstName`/`lastName` are stored alongside
  it, and the visitor is redirected away from `/login`

### Scenario: Invalid credentials rejected

- GIVEN a visitor is on `/login`
- WHEN they submit an email/password pair the backend rejects with 401
- THEN login fails, no session cookies are set, and the backend's error
  `detail` (or a generic fallback if the request itself fails) is shown on
  the form

### Scenario: Client-side validation blocks malformed input

- GIVEN a visitor is on `/login`
- WHEN they submit a value that isn't a valid email, or an empty password
- THEN the form SHALL show a validation error and SHALL NOT submit the
  login request

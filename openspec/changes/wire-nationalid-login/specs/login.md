# Spec: Login (delta over `wire-real-login-backend`)

Supersedes `wire-real-login-backend`'s "Email/password authentication"
requirement's identity field only — all other requirements and scenarios in
`openspec/changes/login-username-password/specs/login.md` (session gate,
avatar/logout, remember-me) are unchanged.

## Requirement: National ID (CCCD) / password authentication

The system SHALL let a visitor authenticate with a national ID (CCCD, 12
digits) and password via a login form, validating both fields client-side
before submission, and authenticating against the real backend
(`POST /api/v1/authentication/login`).

### Scenario: Successful login with valid credentials

- GIVEN a visitor is on `/login`
- WHEN they submit a national ID and password the backend accepts
- THEN the backend's `token` is stored as the session, `nationalId` and a
  `displayName` derived from `firstName`/`lastName` are stored alongside
  it, and the visitor is redirected away from `/login`

### Scenario: Invalid credentials rejected

- GIVEN a visitor is on `/login`
- WHEN they submit a national ID/password pair the backend rejects with 401
- THEN login fails, no session cookies are set, and the backend's error
  `detail` (or the generic fallback "Sai CCCD hoặc mật khẩu" if the request
  itself fails) is shown on the form

### Scenario: Client-side validation blocks malformed input

- GIVEN a visitor is on `/login`
- WHEN they submit a national ID that isn't exactly 12 digits, or an empty
  password
- THEN the form SHALL show a validation error and SHALL NOT submit the
  login request

### Scenario: Remember-me persists the national ID, not an email

- GIVEN a visitor logs in with "remember me" checked
- WHEN they return to `/login` later in the same browser
- THEN the national ID field SHALL be pre-filled with their last-used
  national ID (not an email address)

# Proposal: Switch login/register identity from email to national ID (CCCD)

**Status:** done
**Created:** 2026-08-18

## Why

The backend (`BE-kt-xnk`) removed `Email` as the user identity field and
replaced it with `NationalId` (Vietnamese CCCD, 12 digits) — see its
`harness/PROGRESS.md`, 2026-08-18 entries. `wire-real-login-backend` wired
this frontend to the backend's *previous* shape (`Email`), which the login
endpoint no longer accepts at all: every login attempt through this
frontend currently fails. Separately, `wire-real-login-backend` also called
`${API_BASE_URL}/authentication/login`, missing the `/api/v1` prefix the
backend added in an earlier session — a second, independent reason every
login call 404s today. Both were caught in the same review, fixed together.

## What changes

- `api/login.js`: request URL fixed to
  `${API_BASE_URL}/api/v1/authentication/login`; request body sends
  `NationalId` instead of `Email`; success response reads `body.nationalId`
  instead of `body.email`.
- Field rename `email` → `nationalId` through every layer that touches it:
  `types/index.js`, `config/login-schema.js` (email-format validation
  replaced with a `^\d{12}$` 12-digit regex), `config/session-keys.js`
  (`SESSION_EMAIL_KEY` → `SESSION_NATIONAL_ID_KEY`), `api/session.js`
  (`readSessionEmail` → `readSessionNationalId`), `hooks/use-login-form.js`
  (state, remembered-value localStorage key, submit payload),
  `hooks/use-session.js` (`getEmail`/`email` → `getNationalId`/
  `nationalId`).
- `components/login-form.jsx`: label "Email" → "Căn cước công dân",
  placeholder → "Nhập số CCCD (12 số)", input `type="email"` →
  `type="text" inputMode="numeric"`.
- Error copy: "Sai email hoặc mật khẩu" → "Sai CCCD hoặc mật khẩu".
- `components/user-menu.jsx` unaffected — it never read the email field,
  only `displayName`.

## Out of scope

- Decoding the JWT's `roles` claim client-side for role-based nav/route
  gating (a follow-up the user is planning next — this change only
  restores login to a working state).
- Registration — this frontend has no register UI yet; only login exists.
- Refresh-token/expiry handling — unchanged from `wire-real-login-backend`,
  still out of scope.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-18 | Renamed the field end-to-end (`email`→`nationalId`) rather than keeping `email` as a variable name mapped to a different backend field | Matches this frontend's established pattern from `wire-real-login-backend` (`username`→`email`): frontend field names track the backend's actual identity field, not a stale label |

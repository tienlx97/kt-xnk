# Design: Switch login/register identity from email to national ID (CCCD)

## Approach

Same shape of change as `wire-real-login-backend`'s `username`→`email`
rename: propagate the field rename up through every layer
(`types → config → api → hooks → components`), fix the request URL, and
leave everything else (React Query mutation wrapper, cookie-based session
storage, server-side session gate in `(protected)/layout.jsx`) untouched —
none of that depended on the field being specifically email.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `types/index.js` | `LoginFormValues`/`LoginSuccess`/`Session`: `email`→`nationalId` |
| config | `config/login-schema.js` | email-format validation → 12-digit regex |
| config | `config/session-keys.js` | `SESSION_EMAIL_KEY`→`SESSION_NATIONAL_ID_KEY` |
| api | `api/login.js` | URL gains `/api/v1` prefix; request body `NationalId`; response reads `body.nationalId` |
| api | `api/session.js` | `readSessionEmail`→`readSessionNationalId`; `writeSession`/`clearSession` use the new cookie key |
| hooks | `hooks/use-login-form.js` | state var, remembered-value localStorage key, schema payload, `writeSession` call |
| hooks | `hooks/use-session.js` | `getEmail`/`email` → `getNationalId`/`nationalId` |
| components | `components/login-form.jsx` | label/placeholder/input type |

## New dependencies

None.

## Risks & mitigations

- Anyone with `REMEMBERED_EMAIL_KEY`/`kt-xnk-session-email` cookies/
  localStorage from before this change keeps a stale, now-unused entry
  (harmless — new code never reads the old keys, and cookies expire on
  their own `max-age`). Not actively migrated/cleared; not worth the
  complexity for a low-traffic internal tool.
- The backend's `NationalId` format (exactly 12 digits) is duplicated here
  as a client-side regex for fast feedback; the backend remains the source
  of truth and re-validates independently — a client/server drift here
  would just mean a slightly wrong error message, not a security issue.

## Verification plan

- [x] `grep -ri email src/features/auth` returns nothing (except unrelated
      files outside `features/auth`)
- [ ] Manual: valid national ID + password from a real backend user logs in
      and lands on `/` — **not run this session**, needs a live backend
      with a seeded user to test against (see `BE-kt-xnk`'s
      `AdminSeeder`/dev credentials)
- [ ] Manual: invalid national ID/password shows "Sai CCCD hoặc mật khẩu"
      (or the backend's `detail`) and sets no session cookies
- [ ] `./harness/verify.sh` passes

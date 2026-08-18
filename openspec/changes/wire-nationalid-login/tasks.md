# Tasks: Switch login/register identity from email to national ID (CCCD)

## 1. Fix the backend contract

- [x] 1.1 Fix `api/login.js`'s request URL (add missing `/api/v1` prefix)
      and switch the request body from `Email` to `NationalId` — verify:
      `grep -n "authentication/login" src/features/auth/api/login.js`
      shows `/api/v1/authentication/login`
- [x] 1.2 Rename `email` → `nationalId` across `types/`, `config/`,
      `api/`, `hooks/`, `components/` in `src/features/auth/` — verify:
      `grep -ri email src/features/auth` returns nothing
- [x] 1.3 Update `config/login-schema.js`'s validation from an email format
      check to a 12-digit regex — verify: schema rejects `"abc"` and
      accepts `"012345678901"`
- [x] 1.4 Update `components/login-form.jsx`'s label/placeholder/input type
      — verify: visually matches "Căn cước công dân" / 12-digit numeric
      input

## 2. Verify against a live backend

- [ ] 2.1 Manual login against a running `BE-kt-xnk` instance with a real
      national ID + password — **not run this session**, needs the backend
      up locally
- [ ] 2.2 `./harness/verify.sh` passes

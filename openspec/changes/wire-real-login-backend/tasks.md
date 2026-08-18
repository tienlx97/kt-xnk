# Tasks: Wire real auth backend into login

- [x] 1.1 Replace `api/login.js`'s mock with a real `fetch` call to
      `POST {API_BASE_URL}/authentication/login`, delete
      `config/test-users.js` — verify: `grep -r test-users src/features/auth`
      returns nothing
- [x] 1.2 Wrap the login call in a React Query `useMutation`
      (`hooks/use-login-mutation.js`) and use it from
      `hooks/use-login-form.js` — verify: `use-login-form.js` no longer
      calls `login()` directly
- [x] 1.3 Rename `username` → `email` across `types/`, `config/`, `hooks/`,
      `components/` in `src/features/auth/` — verify:
      `grep -ri username src/features/auth` returns nothing
- [x] 1.4 Drop `refreshToken` from session storage; store `token` +
      `email` + `displayName` instead — verify:
      `grep -ri refreshtoken src/features/auth` returns nothing
- [x] 1.5 Add `config/api-config.js` reading `NEXT_PUBLIC_API_BASE_URL`
      with a `localhost:8080 ` fallback — verify: file exists and is the
      only place `API_BASE_URL` is defined

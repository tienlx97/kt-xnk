# Design: Wire real auth backend into login

## Approach

Swap the mock seam identified in `login-username-password` (`api/login.js`)
for a real `fetch` against the backend the user is running locally, keeping
the existing layering (`types → config → api → hooks → components`) intact.
Because the backend's response shape (`Email` field, single `token`, no
refresh token) doesn't match what the mock assumed, the change propagates
up through every layer rather than staying isolated to `api/login.js`.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `types/index.js` | `LoginFormValues`/`LoginSuccess`/`Session`: `username`→`email`, `accessToken`+`refreshToken`→`token`, add `id`/`firstName`/`lastName`/`displayName` |
| config | `config/login-schema.js`, `config/session-keys.js`, `config/api-config.js` (new) | email validation instead of username min-length; drop `REFRESH_TOKEN_KEY`, add `SESSION_EMAIL_KEY`/`SESSION_DISPLAY_NAME_KEY`; new backend base URL |
| config (deleted) | `config/test-users.js` | mock credentials no longer needed |
| api | `api/login.js`, `api/session.js` | real `fetch` call + `problem+json` error parsing; session cookies drop refresh token, add email/display name |
| hooks | `hooks/use-login-mutation.js` (new), `hooks/use-login-form.js`, `hooks/use-session.js` | login call goes through `useMutation`; field renames |
| components | `components/login-form.jsx`, `components/user-menu.jsx` | label/placeholder/type "username"→"email"; avatar reads `displayName` |

## New dependencies

None — `@tanstack/react-query` was already a dependency with `QueryProvider`
wired into the root layout, just unused by any feature until now.

## Risks & mitigations

- Backend CORS not configured for the frontend's dev origin → login fetch
  fails with an opaque network error. Mitigated in `api/login.js` with a
  generic "Không thể kết nối đến máy chủ" message instead of an unhandled
  rejection; real fix is on the backend, out of scope here.
- No refresh endpoint exists yet, so a session silently stops working once
  the JWT's `exp` passes with no renewal path. Accepted for now — flagged
  in the proposal's out-of-scope section, not solved here.

## Verification plan

- [ ] Manual: valid credentials from the user's example (`lior@mantinband.com`
      / `Amiko1234!!`) log in against a running local backend and land on `/`
- [ ] Manual: invalid credentials show the backend's "Invalid credentials"
      message (translated to the existing generic Vietnamese copy) and do
      not set session cookies
- [ ] `./harness/verify.sh` passes — **blocked in this sandbox**: `node` is
      unreachable in this WSL shell (only `node.exe` under `/mnt/c/...` is
      installed; `pnpm`'s shim needs `node` on `PATH`), a pre-existing
      environment gap unrelated to this change (same issue noted in the
      2026-07-25 `PROGRESS.md` entry). Needs to be run in an environment
      with a Linux `node` before this task can be marked verified.

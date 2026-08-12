# Progress Log

<!--
Append-only session log. Newest entry FIRST.
This file is the handoff between sessions/agents — write for a reader with zero conversation context.
-->

## Harness gaps (mistakes that need a mechanical rule, not a manual fix)

- `harness/checks/project-readiness.sh`'s placeholder scan (angle-bracket
  CLI-argument tokens, an unfilled date-format token, etc. — see the script
  for the exact pattern) didn't account for tool-generated content blocks —
  `astryx init`'s `<!-- ASTRYX:START/END -->` cheat sheet in `AGENTS.md`
  contains angle-bracket CLI usage syntax that happens to match the
  placeholder pattern, and failed `verify.sh` on an otherwise clean repo.
  Fixed 2026-08-06: the check now strips `ASTRYX:START`/`ASTRYX:END` blocks
  before scanning. Any other tool that appends a marked block to these
  files (AGENTS.md, docs/architecture.md, GOLDEN_RULES.md, PROGRESS.md,
  quality-grades.json, project.md) should use a similar
  `<!-- TOOL:START/END -->` convention so this stays generalizable instead
  of needing a new carve-out per tool. (Note for future edits to this very
  log: avoid reproducing the literal placeholder tokens themselves here —
  this file is one of the ones the scan covers, and literal examples in
  the write-up will trip it, as happened while drafting that entry.)

---

## 2026-08-12 — Codex

- **Active change:** harness documentation limits (direct user request).
- **Task worked:** shortened the project summary in `AGENTS.md` without
  removing any source-of-truth pointers or operating rules, bringing the file
  from 121 to 119 lines and back under `audit-harness.sh`'s 120-line limit.
- **Result:** done.
- **Verification:** `./harness/audit-harness.sh` passed 25/25;
  `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260812-093643-6043/`.
- **Harness gap:** none — the existing audit correctly detected the drift.
- **Next step:** none.

---

## 2026-08-07 23:15 — Claude Code

- **Active change:** `openspec/changes/login-username-password/` — retroactively
  documents the login feature (shipped across 5 prior ad-hoc commits, none
  of which went through the openspec proposal flow) and removes an
  undocumented CCCD-specific constraint discovered while writing that
  proposal.
- **Task worked:**
  1. **Removed the CCCD constraint**: `src/features/auth/config/login-schema.js`
     had a hidden `USERNAME_PATTERN = /^\d{12}$/` regex (with a comment
     explaining the "username" field was secretly a Vietnamese CCCD) even
     though every visible label/copy presented it as a generic username.
     Replaced the regex-based rule with a plain `.min(3, ...)` string
     check — no format/charset restriction. Updated
     `config/test-users.js`'s placeholder credentials from CCCD-shaped
     digit strings (`001234567890`, `079198765432`) to plain usernames
     (`admin`, `testuser`), keeping the existing passwords. Confirmed via
     `grep -ri cccd src/features/auth/` (and repo-wide `src/`) that no
     other file references CCCD — the constraint was fully isolated to
     that one regex.
  2. **Wrote the missing openspec change** at
     `openspec/changes/login-username-password/` (status `done`, dated
     today) with `proposal.md` (Why/What changes/Out of scope/Decision
     log), `specs/login.md` (4 requirements — username/password auth,
     server-side session gate, session display & logout, remember-me —
     each with GIVEN/WHEN/THEN scenarios), `design.md` (approach, affected
     layers & files table, verification plan), and `tasks.md` (all boxes
     checked, matching the "already shipped" nature of the work it
     documents).
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass (structure, lint,
  typecheck, harness tests, unit tests, build, quality thresholds).
  Also ran `pnpm dev` and drove the app with `agent-browser`: logged in
  with both new test users (`admin`/`password123`, `testuser`/`testpass1`)
  — success, avatar shown, redirected off `/login`; logged out via the
  avatar menu both times — session cleared, redirected to `/login`;
  submitted a 2-character username — inline "Tên đăng nhập phải có ít
  nhất 3 ký tự" validation error, no request sent; submitted the *old*
  CCCD test value `001234567890`/`password123` — now rejected as "Sai tên
  đăng nhập hoặc mật khẩu" (invalid credentials, not a format error),
  confirming the CCCD-only constraint is genuinely gone and it's just an
  arbitrary string that doesn't match a test user; visited `/` directly
  with no session — redirected to `/login`.
- **Decisions made:** kept the username rule at a plain `min(3)` rather
  than inventing a new regex/charset restriction to replace the old one —
  the point of the change was fewer constraints, not a differently-shaped
  hidden one. Left `session-keys.js`, `api/login.js`, `api/session.js`,
  `hooks/use-login-form.js`, `hooks/use-session.js`, `components/login-form.jsx`,
  `components/user-menu.jsx`, and `src/app/(protected)/layout.jsx`
  untouched — none contained CCCD-specific logic (already fully generic).
- **Next step:** none pending. Known follow-ups intentionally left out of
  scope (see `proposal.md`'s "Out of scope"): swapping the mock
  `api/login.js`/`config/test-users.js` for a real backend once one
  exists, and `components/user-menu.jsx`'s `Avatar name={username}`
  showing the raw username rather than a derived display name.

---

## 2026-08-07 21:45 — Claude Code

- **Active change:** repo-wide, not scoped to the login feature — (1) React
  component files renamed `.js` → `.jsx`, (2) VSCode ESLint auto-fix-on-save
  config fixed (branch `feature/login`, no `openspec/changes/` entry —
  direct per user request: "Fix eslint khi dùng vscode save không auto fix
  và react component phải dùng *.jsx").
- **Task worked:**
  1. **`.jsx` rename**: scanned every `.js` under `src/` for actual JSX
     syntax (not JSDoc generics like `Record<string, string>`, which false-
     positive on a naive `<[A-Za-z]` grep — e.g. `use-login-form.js` and
     `theme.js` have angle-bracket JSDoc/comments but no real JSX, so they
     stayed `.js`). 37 files genuinely render JSX and got `git mv`'d to
     `.jsx`: every `page.js`/`layout.js` under `src/app/` (Next.js resolves
     these by filename convention regardless of extension — no import
     references anywhere needed updating for those), plus every component
     under `src/features/*/components/` and `src/shared/components/`
     (including the `mdx/*.js` callouts and `src/mdx-components.js`, also
     convention-resolved by `@next/mdx`, not imported). Then fixed every
     *explicit* `import .../.js'` reference to a renamed file (barrels like
     `features/*/index.js`, cross-component imports like `showcase-
     section.js` from the design-system sections, `mdx-components.js`'s
     imports of the mdx callouts) — found via a targeted grep per renamed
     basename, not a blind sed, since several basenames collide across
     directories (`post-list.js` exists in both `features/blog/` and
     `features/tutorial/`; every `page.js` collides across routes) and a
     naive global rename would have silently pointed one feature's import
     at the wrong file.
     - **Made it mechanical, not just a one-time cleanup**: added a new
       `eslint.config.mjs` rule block (`react/jsx-filename-extension`,
       `{extensions: ['.jsx']}`, scoped to `src/**/*.js`) so a future PR
       that adds JSX to a `.js` file fails lint instead of silently
       reintroducing the mix — matches `AGENTS.md`'s "every convention
       must map to a lint rule" requirement. Documented the convention in
       `openspec/project.md` (Naming bullet) and refreshed the stale `.js`
       filenames in `docs/architecture.md`'s inventory section.
  2. **VSCode ESLint config**: removed `"eslint.useFlatConfig": true` from
     `.vscode/settings.json` — deprecated now that flat config
     (`eslint.config.mjs`) is auto-detected by the ESLint extension;
     leaving it set is a plausible source of the extension silently
     misbehaving depending on installed extension version. Changed
     `"editor.codeActionsOnSave"`'s `"source.fixAll.eslint"` value from
     `"explicit"` to `true` for broader VSCode-version compatibility
     (`"explicit"` needs VSCode ≥ 1.74; `true` degrades everywhere).
     Left `eslint.validate: ["javascript", "javascriptreact"]` as-is — it
     was already correct (VSCode maps `.jsx` files to the
     `javascriptreact` languageId by built-in association regardless of
     what extension a file used before, so this wasn't actually broken by
     the old `.js`-for-everything convention).
- **Result:** done for what's fixable from repo files. Could NOT verify
  the actual "does autosave now fix" behavior — that requires a live
  VSCode session with the ESLint extension installed and enabled, which
  isn't available in this environment. If it's still not firing after
  these changes, the next things to check are outside repo config: the
  ESLint extension installed/enabled for this specific workspace (VSCode
  can have it disabled per-workspace independent of `extensions.json`
  recommendations), and the "ESLint" output channel (View → Output →
  ESLint) for a startup error.
- **Verification:** `./harness/verify.sh` — full pass, including a real
  `next build` (confirms every renamed `page.jsx`/`layout.jsx` still
  resolves as a route and every fixed import resolves). Also ran `pnpm dev`
  and drove the app with `agent-browser`: `/login` renders and validates,
  logging in redirects to `/` with the full shell + avatar, and `/blog`,
  `/tutorial`, `/design-system` all still render their real content — not
  just a passing build.
- **Decisions made:** kept `page.js`/`layout.js` base filenames but with
  `.jsx` extension (`page.jsx`, `layout.jsx`) rather than inventing
  alternate names — matches Next.js's own convention (`pageExtensions` in
  `next.config.mjs` already listed `'jsx'`) and needed zero config changes
  there. Did not rename `src/shared/components/theme.js` despite the
  grep false-positive (`<Note>` in a comment) — confirmed by hand it has
  no real JSX.
- **Next step:** none pending. Ask the user to confirm autosave-fix now
  works in their actual VSCode session — the repo-side fix is done but
  unverifiable from here.
- **Blockers:** none

---

## 2026-08-07 21:30 — Claude Code

- **Active change:** stop the login form's copy from revealing the
  username is a CCCD (branch `feature/login`, no `openspec/changes/`
  entry — direct follow-up per user request: "username không cần biết đó
  là căn cước công dân hay là tên đăng nhập"). User had already hand-edited
  `components/login-form.js` (label → "Tên đăng nhập", placeholder →
  "Nhập tên đăng nhập", dropped the subtitle text, heading → "ĐĂNG NHẬP")
  before this session picked the task back up.
- **Task worked:** the underlying rule is unchanged — the field still must
  be a 12-digit CCCD (that requirement came from the very first ask in
  this feature and wasn't revisited) — only the *copy* changed, so nobody
  looking at the form can tell it's specifically a citizen-ID field:
  - `config/login-schema.js`: renamed `CCCD_PATTERN` → `USERNAME_PATTERN`;
    error messages "Vui lòng nhập số căn cước công dân" / "Số căn cước
    công dân phải gồm đúng 12 chữ số" → generic "Vui lòng nhập tên đăng
    nhập" / "Tên đăng nhập không hợp lệ". Left a comment noting the
    12-digit regex is still CCCD-shaped internally, on purpose.
  - `api/login.js`: failure message "Sai số căn cước công dân hoặc mật
    khẩu" → "Sai tên đăng nhập hoặc mật khẩu".
  - `components/login-form.js`: removed the now-unused `Text` import
    (dead after the user's edit dropped the subtitle `<Text>` that used
    it) — lint would have caught this on the next `verify.sh` run anyway.
  - Left `config/test-users.js` as-is — its comments already don't
    mention CCCD, and the sample values are just data.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass. `agent-browser`:
  `/login` shows "Tên đăng nhập" (not CCCD wording) with a generic
  required-field error on empty submit; logging in with an existing
  `test-users.js` credential (still a 12-digit value, business rule
  unchanged) still succeeds and redirects to `/`.
- **Decisions made:** kept the actual 12-digit validation — the user asked
  to hide *that it's a CCCD*, not to drop the CCCD requirement itself.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 21:20 — Claude Code

- **Active change:** move the app shell (top nav / side nav / footer) out
  of the root layout and into `src/app/(protected)/layout.js` (branch
  `feature/login`, no `openspec/changes/` entry — direct follow-up per
  user request: "layout app shell cũng tương tự, chỉ xuất hiện khi đã
  login" — the shell was rendering on `/login` too, which shouldn't have
  any site chrome).
- **Task worked:** `src/app/layout.js` now only does `html`/`body` +
  `QueryProvider`/`ThemeProvider` + `{children}` — no `AppShell`, `Header`,
  `AppSideNav`, `Footer`, or `UserMenu` left in it. All of that moved into
  `src/app/(protected)/layout.js`, alongside the existing session-cookie
  redirect check from the 17:20 entry: on a valid session, it now renders
  `<AppShell topNav={<Header .../>} sideNav={<AppSideNav .../>}>{children}
  <Footer /></AppShell>` instead of returning `children` bare. `/login`
  stays outside this route group, so it renders directly under the root
  layout with zero chrome — just `LoginForm`'s own centered card.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass. `agent-browser`:
  `/login` now renders with no header/sidenav/footer at all (screenshot:
  just the centered login card on a blank page); logging in redirects to
  `/` and the full shell (top nav with avatar, side nav, footer) appears;
  clicking "Đăng xuất" clears the session and lands back on the bare
  `/login` page with the shell gone again.
- **Decisions made:** none beyond what's in "Task worked" above — this was
  a straightforward move of existing JSX, no new logic.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 17:20 — Claude Code

- **Active change:** make the login gate a *real* server-side block, not
  just a client-side redirect (branch `feature/login`, no `openspec/
  changes/` entry — direct follow-up). User verified independently that
  unauthenticated visitors could still read protected pages ("người dùng
  chưa đăng nhập vẫn có thể xem được các route khác") and confirmed via
  `curl` (this session, before fixing) that raw HTML — no JS needed — still
  contained full page content (e.g. `/blog`'s "Xin chào MDX" post). Root
  cause: the previous `AuthGuard` (2026-08-07 15:40 entry) only ran after
  React hydrated; Next.js Server Components render full protected-page HTML
  regardless of client auth state, so it was always sent, just hidden late.
- **Task worked:** the only way to stop protected HTML from ever being
  generated, without `middleware.js` (still off the table per the earlier
  explicit rejection), is a server-side check in a layout using
  `cookies()`/`redirect()` — confirmed this is acceptable with the user
  first (`AskUserQuestion`) since it's still Next-specific server code, just
  not the dedicated middleware feature.
  - Moved every route except `/login` into a route group:
    `src/app/(protected)/{page.js, blog/, tutorial/, design-system/}` (was
    directly under `src/app/`). Route groups don't affect the URL — `/`,
    `/blog`, etc. are unchanged — they just let `/login` opt out of the new
    layout. Fixed each moved file's relative import depth (+1 level).
  - New `src/app/(protected)/layout.js` — `async`, `await cookies()`, and
    `redirect('/login')` if the access-token cookie is missing, before
    `{children}` (the actual page) ever renders. This is what makes it
    real: `redirect()` during server rendering means the child Server
    Component's body — and therefore the data/markup it would produce —
    never executes at all.
  - **Session storage moved from `localStorage` to cookies**
    (`src/features/auth/api/session.js`, `config/session-keys.js` +
    `SESSION_COOKIE_MAX_AGE_SECONDS`) — `cookies()` in
    `next/headers` can only read what the browser sends with the request;
    localStorage is invisible server-side. Cookies are plain (non-httpOnly,
    client-`document.cookie`-written) since there's still no backend to
    issue a real `Set-Cookie` — same mock-only caveat as before, now
    documented directly on `writeSession`.
  - **Removed `AuthGuard`** entirely (component + its export from
    `index.js`) — with the server layout blocking unauthenticated requests
    before any protected route ever renders, the old client-side redirect
    (and the spinner-flash / hydration-race workaround it needed, see the
    15:40 entry) is now dead weight, not defense in depth: Next.js reruns
    the dynamic `(protected)/layout.js` check on every navigation to a
    route under it (calling `cookies()` forces dynamic rendering for that
    whole subtree), including client-side `<Link>` navigations, so the
    server check alone covers hard reloads *and* in-app navigation.
    `src/app/layout.js` now renders `{children}` directly.
  - `src/features/auth/index.js` now exports the plain `ACCESS_TOKEN_KEY`
    string constant (not a function) for the protected layout to import —
    kept the cookie-reading/redirect logic itself inline in
    `(protected)/layout.js` rather than in a feature `api/` helper, since a
    helper re-exported through the feature's public `index.js` risks
    pulling `next/headers` (server-only) into the same module graph
    `UserMenu` (a Client Component) imports from — a plain string constant
    is safe in any bundle.
  - `hooks/use-session.js` — dropped the now-meaningless `storage` event
    listener (that event only ever fired for `localStorage`, which nothing
    uses anymore); kept only the custom `kt-xnk-session-change` same-tab
    signal from `api/session.js`.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass (route-group
  restructure didn't break `structure`/`typecheck`/`build`). Then the
  actual regression check that mattered: `curl` (no JS, no browser) against
  every protected route with no cookie — `/`, `/blog`, `/tutorial`,
  `/design-system` all `307` to `/login` with **no page content in the
  body** (confirmed `/login`'s own page reads `HTTP/1.1 200` with no
  cookie). Then `agent-browser`: fresh session, direct nav to `/blog` →
  server-redirected to `/login` before any content painted; logged in with
  a `test-users.js` credential → redirected to `/blog`, cookies present;
  hard reload stayed on `/blog` (no flash, since there's no client guard
  left to race); avatar menu → "Đăng xuất" → cookies cleared, redirected to
  `/login`; re-requesting `/blog` after logout → `307` again, both via
  `agent-browser` and a follow-up `curl`.
- **Decisions made:**
  - Cookie value is only checked for *presence*, not verified (no
    signature/expiry check) — matches the mock/test-data phase (the login
    mock itself doesn't issue real JWTs yet, so there's nothing to verify
    against). Confirmed via `curl -H "Cookie: kt-xnk-access-token=fake"` —
    any value currently passes. Flagged here, not fixed, since real
    verification needs a real backend-issued token; noted in "Next step"
    below along with the other JWT-integration seams from the 15:40 entry.
  - Left `/login` outside any route group (didn't create a `(public)`
    group for symmetry) — only routes that need the extra layout benefit
    from being grouped; `/login` needs nothing extra beyond the root
    layout, so adding a group for it would just be an empty wrapper.
- **Next step:** when a real backend exists, `(protected)/layout.js`'s
  presence-only check should become a real verification (signature +
  expiry, or a call to a backend "whoami"/introspection endpoint) — same
  seam noted in the 15:40 entry for `api/login.js`/`api/session.js`.
- **Blockers:** none

---

## 2026-08-07 15:40 — Claude Code

- **Active change:** gate every route behind login (branch `feature/login`,
  no `openspec/changes/` entry — direct follow-up per user request "tất cả
  các route đều yêu cầu đăng nhập mới có thể sử dụng"). User also asked for
  an avatar + "Đăng xuất" (logout) menu in the top nav, explicitly rejected
  a Next.js `middleware.js`-based gate ("I do not like nextjs middleware,
  because I will depend to nextjs framework"), and flagged that the real
  backend will eventually issue a JWT access + refresh token pair.
- **Task worked:** client-side route gating (no `src/middleware.js`) —
  `src/features/auth/components/auth-guard.js` wraps `{children}` in
  `src/app/layout.js`; renders `children` unconditionally on `/login`,
  otherwise a `Spinner` fallback + `router.replace('/login?next=...')` if
  `api/session.js`'s `readAccessToken()` is `null`. Session storage is
  `localStorage`, JWT-shaped ahead of the real backend:
  `config/session-keys.js` (`kt-xnk-access-token`/`kt-xnk-refresh-token`/
  `kt-xnk-session-username`), `api/session.js` (`readAccessToken`,
  `readSessionUsername`, `writeSession`, `clearSession` — commented as the
  seam a real backend replaces, with the refresh token specifically flagged
  as needing to become an `httpOnly` cookie the backend sets, not something
  client JS writes). `types/index.js`'s `LoginResult` is now a discriminated
  union (`LoginSuccess | LoginFailure`) so `accessToken`/`refreshToken` are
  required-when-`success`, not optional. `api/login.js`'s mock now returns
  mock opaque tokens on success instead of a bare boolean.
  `hooks/use-session.js` — `useSession()` via `useSyncExternalStore`
  (`isAuthenticated`, `username`, `logout()`). `hooks/use-login-form.js` —
  on success, `writeSession(...)` then `router.replace(next ?? '/')`
  (dropped the old `isSuccess` banner state, since the page navigates away
  immediately now). `components/user-menu.js` — `Popover` (custom `Avatar`
  trigger, no built-in trigger slot on `DropdownMenu` for that) +
  `DropdownMenuItem` "Đăng xuất"; renders `null` when logged out. Composed
  in `src/app/layout.js` (not `src/shared/components/header.js`) because
  `src/shared/` is structurally forbidden from importing `src/features/`
  (`harness/structure.rules.cjs`) — `header.js` only grew a generic
  `endContent` prop passed through to `TopNav`, staying feature-agnostic.
  `src/app/login/page.js` wraps `LoginForm` in `<Suspense>` since
  `useSearchParams()` (for reading `?next=`) now flows through it.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass, including
  `structure` (confirms `header.js` has zero `src/features/` imports).
  Browser-tested via `agent-browser`, not just curl: fresh session, `/` and
  `/blog` both redirect to `/login?next=...`; logging in with a
  `test-users.js` credential redirects straight to the original `next`
  path; top nav shows an avatar; clicking it opens the "Đăng xuất" menu;
  logging out clears the session and redirects to `/login`; revisiting `/`
  redirects back to login again (confirms the guard re-engages, not just
  that the click handler ran).
- **Decisions made:**
  - **Middleware pivot:** first drafted this with `src/middleware.js`
    (server-side, no flash-before-redirect); the user explicitly rejected
    it as unwanted framework coupling. Rebuilt as a pure client `AuthGuard`
    instead. **Known, accepted tradeoff:** Next.js Server Components still
    render full protected-page HTML regardless of client auth state — an
    unauthenticated visitor's browser paints that HTML for a brief moment
    before hydration/JS redirects. There is no server-side gate anymore;
    this was a deliberate choice, not a missed bug.
  - **Real bug caught by browser-testing, not by `verify.sh`:** the first
    `AuthGuard` cut the redirect effect on the `isAuthenticated` value
    captured at render time. On a hard reload of an *already-authenticated*
    page, `useSyncExternalStore`'s first hydration-safe render always
    returns the server-safe "logged out" default (it has to match the
    server, which can't see `localStorage`) and only self-corrects on the
    next render — but the effect tied to that first render already fired
    and navigated to `/login` before the correction landed, permanently
    bouncing a logged-in user. Fixed by having the effect re-read
    `readAccessToken()` directly at the moment it runs, instead of trusting
    the closed-over render-time value — decouples the "should I redirect"
    decision from the transient hydration mismatch. `pnpm run
    <lint/typecheck/structure>` never would have caught this; only
    exercising an actual hard reload while logged in did.
  - **Avatar popover, same-tab reactivity, and a click double-toggle bug**
    (both also only caught by clicking through the real page, not by
    `verify.sh`):
    1. `DropdownMenu`'s trigger is always its own internal `Button` (no
       custom-trigger slot per its `.d.ts`) — used `Popover` with a custom
       `Avatar` trigger instead (`Avatar`'s `onClick` prop is documented to
       render it as a real `<button>`, satisfying `Popover`'s "trigger must
       contain a button" requirement) plus a standalone `DropdownMenuItem`
       (confirmed via its `.d.ts`, not the possibly-stale printed docs
       table, that it does accept `onClick`).
    2. First pass: the avatar never appeared after login even though
       `writeSession()` ran. Cause: `UserMenu`/`Header` live in the
       persistent `layout.js` tree, which the Next.js App Router does not
       re-render on a same-route-tree client navigation (`/login` →
       `/blog`) — so its `useSyncExternalStore` subscription never got
       asked again. The native `storage` DOM event only fires in *other*
       tabs, never the tab that wrote the value. Fixed by having
       `api/session.js` dispatch a custom `kt-xnk-session-change` window
       event on every `writeSession`/`clearSession`, and `use-session.js`
       subscribes to that alongside `storage`.
    3. Second pass: clicking the avatar opened and closed the popover in
       the same click (net no-op). Cause: `Popover` already
       `addEventListener('click', ...)`s the trigger button it finds
       inside `children` — my own `onClick={() => setIsOpen(...)}` on
       `Avatar` was a *second*, independent listener on the same click, so
       both toggles fired and canceled out. `Popover`'s own doc comment
       ("the popover finds it and applies click/keydown handlers... 
       automatically") says as much — should have trusted that instead of
       also wiring a manual toggle. Fixed: `Avatar`'s `onClick` is now a
       no-op (still needed so `Avatar` renders as a `<button>` at all —
       required per its own props doc — but `Popover` owns all the actual
       toggle logic).
- **Next step:** none pending. When a real backend exists: replace
  `api/login.js`'s body with a real `fetch`, add `api/refresh.js` for
  token rotation, and change `writeSession`'s refresh-token write to
  instead trust an `httpOnly` `Set-Cookie` from the backend (delete the
  client-side write for that one field).
- **Blockers:** none

---

## 2026-08-07 15:10 — Claude Code

- **Active change:** login page (branch `feature/login`, no `openspec/changes/`
  entry — direct per user request). Requirements: username (must be a
  Vietnamese CCCD — citizen ID), password, "remember me" checkbox; no
  registration; validate with `zod`; submit against test data only (no auth
  backend exists yet).
- **Task worked:** new `src/features/auth/` feature (`types`, `config`,
  `api`, `hooks`, `components`, public `index.js`) per the feature-based
  layer rules. `config/login-schema.js` — zod schema, CCCD regex `^\d{12}$`,
  password min length 6 (placeholder pending a real backend policy).
  `config/test-users.js` — 2 hardcoded test credentials, explicitly commented
  as placeholder-only. `api/login.js` — mocked `login()` with a ~500ms
  delay, checks against `test-users.js`; this is the seam to replace with a
  real backend `fetch` call later. `hooks/use-login-form.js` — form state +
  zod `safeParse` → per-field `status` for `TextInput`; on success, persists
  username to `localStorage` when "remember me" is checked.
  `components/login-form.js` — Astryx-only UI (`Center`/`VStack`/`Card`/
  `Heading`/`Banner`/`TextInput`/`CheckboxInput`/`Button`), modeled on the
  scaffolded `astryx template login` reference. New route
  `src/app/login/page.js`; added "Đăng nhập" to `navLinks` in
  `src/shared/config/site.js` for reachability. Added `zod` to
  `dependencies` (`pnpm add zod`, none of the existing deps provided it).
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  and drove the real page via `agent-browser` (not just curl): empty submit
  shows both zod field errors, malformed CCCD/short password each show
  their specific message, wrong-but-valid-format credentials show the error
  `Banner`, and correct `test-users.js` credentials succeed. Screenshots in
  this session's scratchpad.
- **Decisions made:** hit a real hydration bug while browser-testing
  "remember me": seeding `useState` from `localStorage` via a lazy
  initializer (guarded by `typeof window`) is fine for the username *text*
  value (React silently corrects `value` mismatches) but Astryx's
  `CheckboxInput` checked state is not corrected — Next.js logged "A tree
  hydrated but some attributes... This won't be patched up" and the box
  stayed visually unchecked even though local state was `true`. Fixed by
  switching to `useSyncExternalStore` (server snapshot `''`, client snapshot
  reads `localStorage`) as the source of the remembered username, with
  separate local override state for `username`/`rememberMe` so the user can
  still freely edit the fields — this is the React-sanctioned pattern for
  values that legitimately differ between server and client and avoids both
  the hydration mismatch and the `react-hooks/set-state-in-effect` lint
  error a plain `useEffect` + `setState` approach hit first. Worth
  remembering for any future "prefill a controlled input from
  browser-only storage" work in this repo.
  Deliberately did not add `react-hook-form` or any form library — the form
  is small enough that zod + a single hook covers it, and no other feature
  uses one yet.
- **Next step:** when a real auth backend exists, replace `api/login.js`'s
  body with a real call (keep the same `login(values): Promise<LoginResult>`
  signature so `hooks/`/`components/` don't need to change) and delete
  `config/test-users.js`.
- **Blockers:** none

---

## 2026-08-07 01:56 — Claude Code

- **Active change:** `openspec/changes/feature-based-architecture/` —
  replace the 6-layer backend-shaped architecture
  (`types→config→repo→service→runtime→ui`) with a feature-based front-end
  architecture, per explicit user direction: this repo is confirmed
  front-end only, backend lives in a separate project.
- **Task worked:** all 5 milestones in `tasks.md`. Moved
  `src/ui/hero.js` → `src/features/home/components/hero.js`;
  `src/app/design-system/{showcase-section.js,sections/*.js}` →
  `src/features/design-system/components/`; `src/ui/{header,footer,theme,
  theme-provider}.js`, `src/config/{site.js,site.test.js}`,
  `src/types/index.js` → `src/shared/{components,config,types}/`. Added a
  public `index.js` per feature. Rewrote `harness/structure.rules.cjs`
  around `types→config→api→hooks→components` (per-tree, feature or
  shared), plus new rules `no-feature-to-feature` (isolation),
  `no-shared-to-feature`, `no-deep-feature-imports` — same
  backreference technique the old `no-deep-domain-imports` rule already
  used. Rewrote `harness/tests/structure-rules.test.cjs` fixtures to
  exercise every rule (old fixtures hardcoded the dead layer names, would
  have silently stopped testing anything meaningful). Updated
  `docs/architecture.md`, `openspec/project.md`, `AGENTS.md` (trimmed, not
  re-duplicated — matches its own "map not manual" rule),
  `harness/GOLDEN_RULES.md` (v1→v2), `harness/quality-grades.json`; added
  `docs/adr/0003-feature-based-architecture.md`. Fixed the theme
  build/gitignore wiring for the new `src/shared/components/theme.js`
  path and the two remaining `src/ui/theme.js` text references inside the
  design-system showcase page's own Blockquote/CodeBlock copy.
- **Result:** done. `pnpm run structure` and `pnpm test:harness` pass
  against both the real migrated `src/` and the new violation fixtures.
- **Verification:** `./harness/verify.sh` — full pass (project-readiness,
  memory-secrets, theme-build, lint, typecheck, structure, harness-tests,
  unit-tests, build, quality-thresholds). See
  `harness/runs/20260807-015558-33202/`. Also ran `pnpm dev` and curled
  `/` and `/design-system` directly — both 200, both contain real
  rendered content ("KT-XNK", "Design system"), not an error boundary.
- **Decisions made:** dropped `repo`/`service`/`runtime` entirely rather
  than renaming them — they're backend concepts with no backend in this
  repo. `api`/`hooks` replace them (client calls to the external backend
  project / client-side state) — see decision log in `proposal.md` and
  ADR-0003. Features are **fully isolated** (no cross-feature imports at
  all, not just "public-surface only") since neither current feature
  (`home`, `design-system`) has a legitimate reason to depend on the
  other; revisit if a future feature genuinely needs another's public
  surface. Did not create empty `api/`/`hooks/` folders anywhere — same
  placeholder-free philosophy the old `repo/service` had, add on first
  real need. Did not touch the hardcoded example hex colors in
  `content.js`'s `THEME_SNIPPET` (a pre-existing, separately-flagged
  issue from an earlier session — only its file-path references were
  updated since the file itself moved). Left the change in
  `openspec/changes/` rather than archiving it.
- **Next step:** none pending for this change. First feature that needs
  to call the separate backend project should add `api/` (and `hooks/` if
  it needs client state) under that feature — or `src/shared/api|hooks`
  if more than one feature needs it — following the pattern in
  `docs/architecture.md`.
- **Blockers:** none

---

## 2026-08-07 00:14 — Claude Code

- **Active change:** upgrade `@astryxdesign/core`/`theme-neutral`/`cli`
  0.2.0 → 0.3.0 (no `openspec/changes/` entry — direct per user request)
- **Task worked:** `pnpm add @astryxdesign/core@0.3.0
  @astryxdesign/theme-neutral@0.3.0` then `@astryxdesign/cli@0.3.0`
  (`@latest` silently kept resolving 0.2.0 — pinned the exact version
  instead of digging into why). Approved `@astryxdesign/cli`'s postinstall
  build script in `pnpm-workspace.yaml` after reading it first (same
  print-only nudge pattern as `core`'s, verified 2026-08-06 — never
  mutates files). Ran the sanctioned migration path instead of assuming
  compatibility: `pnpm exec astryx upgrade --from 0.2.0` (dry run) listed
  10 codemods spanning v0.2.1→v0.3.0 and reported "No changes needed —
  your code is already up to date!"; `--apply` confirmed the same and
  additionally refreshed the `<!-- ASTRYX:START/END -->` version stamp in
  `AGENTS.md`/`CLAUDE.md` (154→155 components, v0.2.0→v0.3.0) — diffed
  before committing, only the stamp changed.
- **Result:** done. `package.json` bumped to `^0.3.0` for all three
  packages; `pnpm-lock.yaml` updated; no application code changed (the
  codemods had nothing to do).
- **Verification:** `pnpm theme:build` (rebuilt cleanly on 0.3.0),
  `./harness/verify.sh` — full pass. Also ran `pnpm dev` and curled both
  `/` and `/design-system`, grepping for `astryx-button`/`astryx-dialog`/
  `astryx-table`/`astryx-heading` classes and scanning for error markers
  in the response — confirmed real runtime output on 0.3.0, not just a
  passing build. See `harness/runs/20260807-001356-26089/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 00:08 — Claude Code

- **Active change:** swap which brand hue is MD3 `primary` vs `secondary`
  (no `openspec/changes/` entry — direct per user request: red as the
  dominant accent read too harsh/glaring across filled surfaces like
  inputs and primary buttons)
- **Task worked:** regenerated the MD3 tonal palette with the seeds
  swapped — teal `#247768` is now the `primary` seed, red `#c2252a` is now
  `secondary` (tertiary re-derived at +60° from the new primary hue;
  error stays its own standalone seed, unaffected). Same CIE Lab
  generation method as before, all AA contrast pairs re-verified.
  - `src/ui/theme.js`: `--color-accent` (and accent-muted/on-accent/
    text-accent/icon-accent) now `#126a5c` (teal, was `#b91a24` red). The
    `variant:secondary` Button override now uses the *new* secondary
    (red) container pair (`#fddbd5`/`#3e0500`, was the old teal
    container).
  - Updated copy that named the old mapping: `/design-system` intro text,
    the Button and Link section descriptions in
    `src/app/design-system/sections/actions.js`, and the Color convention
    bullet in `openspec/project.md`.
- **Result:** done.
- **Verification:** `pnpm theme:build` then `./harness/verify.sh` — full
  pass. Rebuilt CSS confirmed to contain `#126a5c`/`#fddbd5`, and curled
  the running `/design-system` page's compiled CSS to confirm the same
  values ship in what actually renders (not just what's in source). See
  `harness/runs/20260807-000807-24222/`.
- **Decisions made:** kept `--color-error` as its own standalone red seed
  (`#b3261e`) rather than aliasing it to the new secondary red — error
  states shouldn't move if someone later re-tunes the secondary brand hue
  independently.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 00:01 — Claude Code

- **Active change:** expand `/design-system` from a 6-component sample into
  a broad Astryx component showcase (no `openspec/changes/` entry — direct
  per user request "tạo tất cả các component có thể")
- **Task worked:** Astryx ships 154 components (`pnpm exec astryx
  component --list`). Looked up real prop signatures for ~55 of them via
  the `xds` MCP server (not guessed) and split the single `page.js` into
  `src/app/design-system/sections/*.js` (one file per category:
  typography, actions, forms, selection, feedback, overlays,
  data-display, content) plus a shared `showcase-section.js` wrapper, so
  no single file got unmanageable. `page.js` now just composes the 8
  section components.
  - Covered: Heading, Text, Button/ButtonGroup/IconButton/ToggleButton,
    Link, TextInput/TextArea/NumberInput/Selector/MultiSelector/RadioList/
    FileInput/Slider, CheckboxInput/CheckboxList/Switch, TabList/
    SegmentedControl, Banner/Toast/ProgressBar/Skeleton/Spinner/StatusDot/
    EmptyState, Dialog/AlertDialog/Popover/Tooltip/HoverCard/DropdownMenu,
    Badge/Card/ClickableCard/SelectableCard/Avatar/AvatarGroup/Table/List/
    Pagination/Token/Timestamp/Citation/Kbd, Divider/Breadcrumbs/Icon/
    Blockquote/CodeBlock/AspectRatio/Collapsible.
  - Explicitly NOT covered (noted in the page's own intro text, not
    silently dropped): Chat family, PowerSearch, Calendar, DateInput
    family, Carousel, Lightbox, TreeList, ContextMenu, MoreMenu, Markdown
    — each needs either external data/backend wiring or enough surface
    area to warrant its own follow-up rather than a rushed demo.
  - Overlay demos (Dialog/AlertDialog/Popover) are real controlled
    open/close via `useState`, not the docs' `isInline` preview escape
    hatch — clicking the trigger buttons actually opens a modal.
  - `AspectRatio`'s example uses the project's real
    `public/images/logo-dn-group.png` instead of a placeholder/remote
    image.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass after fixing 3 real
  issues caught by the gate (not guessed): `AvatarGroup` is exported from
  `@astryxdesign/core/AvatarGroup`, not bundled into `.../Avatar` as the
  groupMembers listing implied; `Selector`'s `value` type is `string |
  null`, not `string | undefined`; ESLint's `react-hooks/purity` rule
  correctly flagged a `Date.now()` call inside JSX render (non-deterministic
  during render) — replaced with a fixed ISO timestamp. Also ran `pnpm dev`
  and curled `/design-system`, grepping the HTML for `astryx-*` class names
  across every section to confirm real DOM output, not just a passing
  build (`DropdownMenu`'s popup class legitimately doesn't appear
  server-rendered — it's portal-based and only mounts on open).
- **Decisions made:** organized sections by Astryx's own component
  grouping (Actions/Forms/Feedback/Overlays/Data display/Content) rather
  than alphabetically — matches how someone would actually look something
  up.
- **Next step:** if the excluded components (Chat, Calendar, etc.) are
  needed later, look them up fresh via `xds` the same way — this entry's
  list of what's missing may drift as Astryx ships new versions.
- **Blockers:** none

---

## 2026-08-06 23:49 — Claude Code

- **Active change:** revert the `turbopack.root` pin from the entry below —
  it fixed a cosmetic warning but caused a fatal Turbopack crash (no
  `openspec/changes/` entry — direct per user request, pasted a crash log)
- **Task worked:** user hit, after a few successful requests then an HMR
  update: `FATAL: An unexpected Turbopack error occurred` /
  `Resource path "projects/work/code/kt-xnk/src/app/layout.js" needs to be
  on project filesystem ""` (missing the `/home/capybara/` prefix — a
  path-resolution bug). Trace pointed at `WebpackLoadersProcessedAsset`,
  i.e. Babel-loader-processed files specifically (this project uses
  `babel.config.js` for the StyleX plugin, so every file StyleX touches
  goes through that path). Traced it to the previous session's
  `turbopack.root: import.meta.dirname` pin in `next.config.mjs`.
- **Result:** reverted that one line. The Turbopack root-inference warning
  is back (harmless, cosmetic) — chose it over a crash that broke HMR for
  any Babel-processed file.
- **Verification:** deleted `.next`, ran `pnpm dev`, confirmed clean
  `200`s. Specifically re-tested the exact failure mode: edited
  `src/app/layout.js` (the file named in the panic) while dev was running,
  confirmed `✓ Compiled in 14ms` with no panic, reverted the edit, same
  result again on the second HMR cycle. `./harness/verify.sh` — full pass.
  See `harness/runs/20260806-234938-20047/`.
- **Decisions made:** don't re-attempt pinning `turbopack.root` without
  first confirming Next.js/Turbopack has actually fixed this interaction —
  it's a known-bad combination in `v16.2.11`, not something to retry as-is.
- **Next step:** none pending. If the warning becomes annoying enough to
  revisit, the safer fix is probably removing the stray
  `/home/capybara/pnpm-lock.yaml` (outside this repo) rather than touching
  `turbopack.root` again.
- **Blockers:** none

---

## 2026-08-06 23:43 — Claude Code

- **Active change:** commit the `astryx init` agent-doc block + fix a
  Turbopack root-inference warning (no `openspec/changes/` entry — direct
  per user request)
- **Task worked:**
  1. User ran `pnpm exec astryx init` themselves (I'd deliberately avoided
     running it earlier — see 2026-08-06 22:02 entry). It appended a
     `<!-- ASTRYX:START/END -->` CLI cheat sheet to both `AGENTS.md` and
     `CLAUDE.md`, purely additive, nothing existing removed — reviewed the
     diff before committing.
  2. `pnpm dev` was warning on every run: "Next.js inferred your workspace
     root... Detected additional lockfiles: /home/capybara/pnpm-lock.yaml".
     This repo sits inside `/home/capybara`, which has its own unrelated
     pnpm lockfile one level up, confusing Turbopack's root inference. Set
     `turbopack.root: import.meta.dirname` in `next.config.mjs` to pin it
     explicitly.
  3. Running `verify.sh` after the `astryx init` commit surfaced a real
     harness bug (see "Harness gaps" above): `project-readiness.sh`'s
     placeholder regex matched an angle-bracket CLI-argument token in the
     Astryx cheat sheet's `astryx template ... [--skeleton]` line. Fixed
     the check rather than editing the tool-generated block (which would
     just get overwritten by a future `astryx upgrade`/re-init).
- **Verification:** `./harness/verify.sh` — full pass. Sanity-checked the
  `project-readiness.sh` fix didn't just neuter the whole check: temporarily
  added one of the scanner's real placeholder tokens to
  `openspec/project.md` and confirmed the script still caught it (exit 1)
  before reverting. Confirmed the Turbopack warning is gone by re-running
  `pnpm dev` and reading the log. See `harness/runs/20260806-234349-17147/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-06 23:36 — Claude Code

- **Active change:** finish wiring MD3 brand colors into Astryx's core
  token set + build a `/design-system` showcase page (no
  `openspec/changes/` entry — direct per user request "làm nốt... rồi tạo
  1 page có full component")
- **Task worked:**
  1. Expanded `src/ui/theme.js` tokens from 7 → 18: added
     `--color-accent-muted`/`--color-on-accent` (MD3 primaryContainer/
     onPrimary), `--color-text-accent`/`--color-icon-accent` (MD3 primary —
     these were silently defaulting to theme-neutral's dark gray, not our
     brand red, for Link text and accent icons), `--color-background-popover`
     (MD3 surfaceContainerHigh), `--color-icon-primary`/`--color-icon-secondary`
     (MD3 onSurface/onSurfaceVariant), `--color-border-emphasized` (MD3
     outline), and `--color-error`/`--color-on-error`/`--color-error-muted`
     (MD3 error/onError/errorContainer — this is what `Button
     variant="destructive"` actually reads, confirmed via
     `node_modules/@astryxdesign/core/dist/astryx.css`).
     Deliberately did NOT touch `--color-success`/`--color-warning` (kept
     universal green/amber), the 10 categorical tag colors
     (`--color-*-blue/cyan/.../yellow`), or structural tokens
     (`--color-neutral`, `--color-overlay*`, `--color-skeleton`,
     `--color-track`, `--color-shadow`, `--color-tint-hover`) — none of
     these are brand identity; overriding them would just be surprising.
  2. New page `src/app/design-system/page.js` — a live component
     reference, not content: Heading (all 6 levels), Text (5 types × 4
     colors), Button (4 variants × sizes/disabled/loading), Badge (5
     semantic + 9 category variants), Card (default/muted/transparent),
     Link (internal + external). Added to nav
     (`src/config/site.js` → `navLinks`) as "Design System" so it's
     reachable, not just a dev-only route.
  3. `jsconfig.json`'s `tsc --noEmit --checkJs` needed the variant arrays
     annotated with `/** @type {('a'|'b'|...)[]} */` JSDoc — Astryx's
     prop types are string-literal unions, and mapping over a bare
     `string[]` fails typecheck (caught by `./harness/verify.sh`, not
     guessed).
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  in the background and curled `/design-system`: confirmed all 6
  `<h1>`–`<h6>` render, and `astryx-button {primary,secondary,ghost,
  destructive}` / `astryx-badge {neutral,info,success,warning,error,blue,
  cyan,green,orange,pink,purple,red,teal,yellow}` classes all present in
  the HTML. See `harness/runs/20260806-233604-14883/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** if a future page needs Form components (Input, Select,
  Checkbox, etc.) or Layout/AppShell, check `node_modules/@astryxdesign/core`
  + `xds` MCP the same way before adding to the showcase page — don't
  assume a component exists without checking its export path first (bit
  us twice already: `LinkProvider` wasn't at the path the docs implied,
  and `Theme`/`defineTheme` live at `./theme`, not `./Theme`).
- **Blockers:** none

---

## 2026-08-06 22:19 — Claude Code

- **Active change:** wire MD3 `secondary` brand color into Astryx `Button`
  (no `openspec/changes/` entry — small follow-up, done directly per user
  question "if I have a primary/secondary button, what happens?")
- **Task worked:** verified (by reading `node_modules/@astryxdesign/core`
  source, not guessing) that Astryx's `Button` `variant` prop is an
  emphasis level, not a brand hue: `variant="primary"` resolves to
  `--color-accent` (our brand red, already wired), but `variant="secondary"`
  resolves to `--color-neutral` (a generic gray) — our brand teal
  (`#247768` / MD3 `secondary`) was not connected to anything.
- **Result:** done. Added a `components.button` override to
  `src/ui/theme.js`'s `defineTheme()` call:
  `'variant:secondary': { backgroundColor: '#a1f2df', color: '#00201a' }`
  (MD3 `secondaryContainer`/`onSecondaryContainer` — the same tonal-button
  pairing MD3 itself uses for "branded but lower emphasis than primary").
  Confirmed the compiled `theme.built.css` contains
  `.astryx-button.secondary { background-color: #a1f2df; ... }` — no
  Button component code touched.
- **Verification:** `./harness/verify.sh` — full pass after
  `pnpm theme:build`. See `harness/runs/20260806-221857-12220/`.
- **Decisions made:** used `secondaryContainer`/`onSecondaryContainer`
  (light tonal fill) rather than solid `secondary`/`onSecondary` — matches
  Astryx's own intent that `variant="secondary"` stays lower-emphasis than
  `variant="primary"`; a solid teal would read as equally weighted.
- **Next step:** if `tertiary`/`error` MD3 roles need a home later,
  Astryx's own token vocabulary is much richer than the 7 tokens in
  `theme.js` (grep `node_modules/@astryxdesign/core/dist/astryx.css` for
  `--color-success`, `--color-warning`, `--color-error`,
  `--color-background-teal`, etc.) — check there before inventing a new
  `components` override.
- **Blockers:** none

---

## 2026-08-06 22:10 — Claude Code

- **Active change:** switch from runtime `defineTheme()` to a pre-built
  Astryx theme (no `openspec/changes/` entry — small follow-up to the
  Astryx migration above, done directly per user request after they pasted
  a `pnpm dev` log showing Astryx's own perf warning)
- **Task worked:** `pnpm dev` was logging: `Theme: "kt-xnk" is using
  runtime style injection. For better performance, use the pre-built
  theme... run 'npx @astryxdesign/cli theme build <file>'`. Ran
  `astryx theme build src/ui/theme.js -o src/ui/theme.built.css`, which
  generates `src/ui/kt-xnk.js` (built theme object), `src/ui/kt-xnk.d.ts`,
  and `src/ui/theme.built.css` (static CSS) next to the source file.
- **Result:** done. `src/ui/theme-provider.js` now imports the built
  `ktXnkTheme` from `./kt-xnk.js` + `./theme.built.css` instead of calling
  runtime `defineTheme()` directly (`src/ui/theme.js` stays as the
  hand-edited *source* the build command reads — not deleted).
  - Generated files are gitignored (`.gitignore`), not committed — they're
    fully deterministic output of `src/ui/theme.js`.
  - Added `"theme:build"` npm script (the exact `astryx theme build`
    command) and made `dev`/`build` run it first
    (`"dev": "pnpm theme:build && next dev"`, same for `build`).
  - `harness/verify.sh` runs `theme:build` as its own step, before
    `lint`/`typecheck`/`structure` — those all resolve the `./kt-xnk.js`
    import, so on a fresh clone (gitignored files absent) they'd fail
    without this step running first.
- **Verification:** deleted the generated files, ran
  `./harness/verify.sh` clean from that state — full pass (theme-build
  step regenerated them before lint/typecheck ran). Also ran `pnpm dev` in
  the background and grepped its log: no more "runtime style injection"
  warning. See `harness/runs/20260806-221048-11148/`.
- **Decisions made:** gitignore + rebuild-on-every-run over committing the
  generated files — keeps `src/ui/theme.js` the single source of truth and
  makes staleness (someone edits `theme.js`, forgets to rebuild, commits
  mismatched CSS) mechanically impossible instead of relying on a reviewer
  to notice.
- **Next step:** none pending.
- **Blockers:** none

## Discovered (backlog — do NOT act on these mid-task)

- No `src/repo`/`src/service` code yet — the site is fully static. Add real
  structural tests for those layers once a first feature needs them.

---

## 2026-08-06 22:02 — Claude Code

- **Active change:** migrate UI to real `@astryxdesign/core` components (no
  `openspec/changes/` entry — direct per user request; project.md already
  said "UI built via the Astryx MCP server" but the app had never actually
  installed/used the package, only hand-rolled markup — user flagged this
  gap)
- **Task worked:** install `@astryxdesign/core` + `@astryxdesign/theme-neutral`
  (deps) and `@astryxdesign/cli` (devDep); wire the MD3 palette from the
  previous entry into Astryx via `defineTheme`; replace hand-written
  `header.js`/`footer.js`/`hero.js` with real Astryx components
  (`TopNav`/`TopNavHeading`/`TopNavItem`, `Section`, `Heading`/`Text`).
- **Result:** done.
  - `src/ui/theme.js` — `defineTheme({name: 'kt-xnk', tokens: {...}})`
    mapping our MD3 role values onto Astryx's CSS-custom-property token
    names (`--color-accent`, `--color-background-body`,
    `--color-background-surface`, `--color-background-card`,
    `--color-text-primary`, `--color-text-secondary`, `--color-border`).
    Single string values only (no `[light, dark]` tuples) since the project
    stays light-only.
  - `src/ui/theme-provider.js` — client component wrapping the app in
    `<LinkProvider component={NextLink}>` (so Astryx `href`s route through
    `next/link`) and `<Theme theme={ktxnkTheme} mode="light">`. Wired into
    `src/app/layout.js` around `<Header>`/`{children}`/`<Footer>`.
  - `src/app/globals.css` — added `@import` for
    `@astryxdesign/core/reset.css`, `@astryxdesign/core/astryx.css`, and
    `@astryxdesign/theme-neutral/theme.css` (baseline before our
    `defineTheme` override); removed the hand-rolled `box-sizing`/`body`
    reset now that Astryx's reset owns it (avoids unlayered CSS silently
    overriding `astryx-base`, per Astryx's Cascade Layer Safety guidance).
  - Deleted `src/ui/container.js` and `src/ui/tokens.stylex.js` — both had
    zero remaining consumers once header/footer/hero moved to Astryx
    components (verified with grep before deleting, same as the
    `colors`-token cleanup in the previous entry).
  - Package install needed one manual step: `pnpm-workspace.yaml` had a
    stub `allowBuilds: '@astryxdesign/core': set this to true or false` —
    read `@astryxdesign/core`'s postinstall script first (it only prints a
    "run `astryx init`" nudge when no agent-doc marker is found; never
    mutates files) before setting it to `true`.
  - Did **not** run `npx astryx init` — it can rewrite `AGENTS.md`/
    `CLAUDE.md`, which this repo treats as the curated single operating
    manual; a human should review that separately before letting the CLI
    touch those files.
  - Updated `openspec/project.md` (Tech stack + Conventions): components
    now come from `@astryxdesign/core`, not hand-rolled markup; StyleX is
    scoped to the `xstyle` escape hatch for one-off layout only; colors
    are sourced from `src/ui/theme.js`, not a StyleX token file.
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  against the actual page and inspected the rendered HTML/CSS: confirmed
  `data-astryx-theme="kt-xnk" data-theme="light"` on the root wrapper,
  `<header><nav aria-label="Điều hướng chính">` from `TopNav`, and
  `#b91a24` (MD3 `primary`) present in the compiled CSS chunk. See
  `harness/runs/20260806-220202-9426/`.
- **Decisions made:** used Astryx's simpler common token set
  (`--color-accent`/`--color-background-*`/`--color-text-*`/`--color-border`)
  rather than trying to force all ~30 MD3 roles into Astryx CSS vars —
  Astryx's own token vocabulary is coarser than MD3's; mapped only the
  tokens Astryx actually documents. `Section`/`TopNav` don't expose an `as`
  prop, so kept native `<header>`/`<footer>` wrappers around them for
  landmark semantics.
- **Next step:** if a future page needs Buttons, Cards, or form fields,
  pull them from Astryx (`xds` MCP) the same way — don't hand-roll. If the
  team decides they do want `astryx init`'s AGENTS.md/CLAUDE.md agent
  prompt, run it in its own reviewed change, not bundled with UI work.
- **Blockers:** none

---

## 2026-08-06 21:44 — Claude Code

- **Active change:** rename/expand color tokens to Material Design 3 roles
  (no `openspec/changes/` entry — small token-only edit done directly per
  user request)
- **Task worked:** replace the ad-hoc `colors` token set in
  `src/ui/tokens.stylex.js` with the full Material Design 3 light-scheme
  role set (`primary`/`onPrimary`/`primaryContainer`/`onPrimaryContainer`,
  same pattern for secondary/tertiary/error, plus `surface*`,
  `outline`/`outlineVariant`, `inverse*`, `shadow`/`scrim`); update the 3
  components that consumed the old names (`hero.js`, `footer.js`,
  `header.js`: `colors.text`→`onSurface`, `colors.textMuted`→
  `onSurfaceVariant`, `colors.border`→`outlineVariant`).
- **Result:** done. Tonal palettes generated in CIE Lab space (tone = L*,
  hue/chroma held from seed) from the existing brand seeds (`#c2252a` red,
  `#247768` teal) plus a derived tertiary (`#7d6a02`, +60° hue rotation) and
  a standalone error seed (`#b3261e`). All on-color pairings verified ≥
  4.5:1 (WCAG AA). Dark-scheme values were also generated for reference but
  NOT added to the codebase — project stays light-only per existing
  convention; dark values live only in the reference artifact from this
  session.
- **Verification:** `./harness/verify.sh` — full pass (lint, typecheck,
  structure, harness-tests, unit-tests, build, quality-thresholds). See
  `harness/runs/20260806-214453-7411/`.
- **Decisions made:** dropped the old `primaryHover`/`primaryActive`/
  `primarySurface`/`secondaryHover`/`secondaryActive`/`secondarySurface`/
  `success`/`warning`/`danger`/`info`/`borderStrong`/`textOnPrimary`/
  `textOnSecondary` tokens — grepped first, confirmed none were referenced
  anywhere in `src/`, so no aliasing/back-compat shim was needed. Updated
  the "Color" convention bullet in `openspec/project.md` to point at the
  MD3 role-naming rule instead of the old ad-hoc names.
- **Next step:** none pending. If a future component needs elevation
  (cards, sheets), the `surfaceContainer*` roles are already defined but
  unused — reach for those before inventing a new surface tone.
- **Blockers:** none
- `verify:quality` only checks bundle size; no p95 latency metric yet (no
  backend to measure).

---

## 2026-07-25 11:20 — Claude Code

- **Active change:** color system for the project (no `openspec/changes/`
  entry — small token-only edit done directly per user request)
- **Task worked:** derive a full color palette in `src/ui/tokens.stylex.js`
  from the brand logo (`public/images/logo-dn-group.png`)
- **Result:** done. Sampled exact logo pixels via PowerShell
  `System.Drawing` (node had no image lib available): primary red
  `rgb(194,37,42)` / `#c2252a`, secondary teal `rgb(36,119,104)` / `#247768`.
  Replaced the old placeholder `accent`/`accentText` tokens (unused anywhere
  in `src/`) with: neutrals (`background`, `surface`, `border`,
  `borderStrong`, `text`, `textMuted`, `textOnPrimary`, `textOnSecondary`),
  `primary`/`primaryHover`/`primaryActive`/`primarySurface`,
  `secondary`/`secondaryHover`/`secondaryActive`/`secondarySurface`, and
  semantic `success`/`warning`/`danger`/`info`. All white-on-color pairings
  verified ≥ 4.5:1 contrast (WCAG AA) via a small luminance-ratio script.
- **Verification:** `./harness/verify.sh` — `structure` passed; `lint`,
  `typecheck`, `harness-tests`, `unit-tests`, `build`, `quality-thresholds`
  all failed on `ERR_PNPM_BAD_PM_VERSION` (repo pins pnpm 11.5.3, local pnpm
  is 9.0.6) — a pre-existing environment issue, unrelated to this change and
  not fixed here (didn't want to touch global tooling without asking).
- **Decisions made:** `success` aliases `secondary` (teal), `danger` aliases
  `primary` (brand red) rather than inventing new hues — kept the palette
  minimal. Only one genuinely new value added: `warning` (`#b45309` amber).
  Documented the "colors only from tokens.stylex.js" rule in
  `openspec/project.md` Conventions so future agents don't hardcode hex.
- **Next step:** whoever picks up next real UI work should run
  `corepack use pnpm@11.5.3` (or equivalent) before relying on
  `./harness/verify.sh` results.
- **Blockers:** none

---

## 2026-07-24 23:30 — Claude Code

- **Active change:** initial project bootstrap (no `openspec/changes/` entry
  yet — done directly per user request, not through the change workflow)
- **Task worked:** scaffold Next.js (JS, App Router) + StyleX + ESLint on top
  of the OpenSpec harness template
- **Result:** done
- **Verification:** `./harness/verify.sh` → run after `npm install`; see
  `harness/runs/<latest>/` for evidence
- **Decisions made:** JavaScript only (no TypeScript app code; `typescript`
  kept as a devDependency purely for `tsc --noEmit --checkJs` typechecking of
  JS via `jsconfig.json`). Light theme only — no dark-mode variant. `src/app`
  plays the routing/wiring role of `runtime` and is exempt from the six-layer
  dependency-cruiser rules (matches `docs/architecture.md`).
- **Next step:** open an `openspec/changes/` proposal (per the `_template/`
  folder) for the next real feature instead of ad-hoc edits.
- **Blockers:** none

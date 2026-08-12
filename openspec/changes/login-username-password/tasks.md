# Tasks: Username/password login

<!--
Rules:
- One task = one session-sized unit of work with its own verification.
- Agent picks the FIRST unchecked task, top to bottom. No parallel tasks.
- A task is checked ONLY after ./harness/verify.sh passes and its criteria are met.
-->

## 1. Remove the CCCD-specific constraint

- [x] 1.1 Replace the CCCD regex in `config/login-schema.js` with a
      generic `min(3)` username check; remove the CCCD comment — verify:
      `grep -ri cccd src/features/auth/` returns nothing
- [x] 1.2 Replace CCCD-shaped usernames in `config/test-users.js` with
      plain strings (`admin`, `testuser`), keeping existing passwords —
      verify: manual login with both new usernames succeeds

## 2. Document the shipped feature (retroactive)

- [x] 2.1 Write `specs/login.md` covering username/password auth, the
      server-side session gate, avatar/logout menu, and remember-me —
      verify: every scenario traces to real code in `src/features/auth/`
      and `src/app/(protected)/layout.jsx`
- [x] 2.2 Write `design.md` with the affected-layers table and
      verification plan — verify: table lists every file in
      `src/features/auth/` and the protected layout

## 3. Verify

- [x] 3.1 Run `./harness/verify.sh` and complete the manual checks in
      `design.md`'s verification plan — verify: all boxes there pass

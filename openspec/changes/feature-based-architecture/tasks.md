# Tasks: Feature-based front-end architecture

<!--
Rules:
- One task = one session-sized unit of work with its own verification.
- Agent picks the FIRST unchecked task, top to bottom. No parallel tasks.
- A task is checked ONLY after ./harness/verify.sh passes and its criteria are met.
-->

## 1. Move files into the new shape

- [x] 1.1 `git mv` `src/ui/*`, `src/config/*`, `src/types/*`,
      `src/app/design-system/{showcase-section.js,sections/*.js}` into
      `src/features/{home,design-system}/components/` and
      `src/shared/{components,config,types}/`; add `index.js` public
      surface for each feature — verify: `find src/ui src/config src/types`
      returns nothing (dirs removed), both feature `index.js` files exist
- [x] 1.2 Fix every import in `src/app/*` to the new paths — verify:
      `pnpm run lint` and `pnpm run typecheck` pass

## 2. Theme build wiring

- [x] 2.1 Update `package.json` `theme:build`, `.gitignore`,
      `harness/verify.sh` comment to `src/shared/components/theme.js` /
      `theme.built.css`; rebuild — verify: `pnpm theme:build` reports
      "18 token overrides, 1 component override" from the new path

## 3. Structural rules

- [x] 3.1 Rewrite `harness/structure.rules.cjs` for
      `types→config→api→hooks→components`, per-tree (feature/shared),
      plus `no-feature-to-feature`, `no-shared-to-feature`,
      `no-deep-feature-imports` — verify: `pnpm run structure` passes on
      the migrated `src/`
- [x] 3.2 Rewrite `harness/tests/structure-rules.test.cjs` fixtures to
      cover the allowlist and every new forbidden rule — verify:
      `pnpm test:harness` passes

## 4. Docs — map of truth

- [x] 4.1 Rewrite `docs/architecture.md`, `openspec/project.md` Architecture
      section, `AGENTS.md` Architectural constraints — verify: no
      remaining reference to `src/repo`, `src/service`, `src/runtime`, or
      old `src/ui`/`src/config`/`src/types` paths (`grep -rn` returns
      nothing outside `harness/PROGRESS.md` history and this change's own
      proposal)
- [x] 4.2 Bump `harness/GOLDEN_RULES.md` to v2, update
      `harness/quality-grades.json` for the new directories, add
      `docs/adr/0003-feature-based-architecture.md` — verify: files exist
      and cross-reference each other

## 5. Verify

- [x] 5.1 Run `./harness/verify.sh` end-to-end — verify: exit code 0
- [x] 5.2 `pnpm dev`, open `/` and `/design-system` in a browser, confirm
      both render as before — verify: visual check, no console errors
- [x] 5.3 Append a `harness/PROGRESS.md` entry for this session — verify:
      entry present with Result/Verification/Decisions/Next step

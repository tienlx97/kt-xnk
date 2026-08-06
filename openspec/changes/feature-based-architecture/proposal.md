# Proposal: Feature-based front-end architecture

**Status:** done
**Created:** 2026-08-07

## Why

This project is confirmed to be front-end only — the backend (data access,
business logic) lives in a separate project. The template's 6-layer
architecture (`types→config→repo→service→runtime→ui`) had `repo/`,
`service/`, and `runtime/` empty since bootstrap: backend concepts with no
backend to serve. Meanwhile `src/ui/` mixed unrelated concerns (site chrome,
the homepage hero, the 8-section internal design-system showcase) in one
flat directory. As more product areas get added, that flat layout doesn't
scale — nothing marks which files belong to which feature, or lets a
feature be reasoned about/removed independently. See
`docs/adr/0003-feature-based-architecture.md` for the full decision record.

## What changes

- New top-level shape: `src/features/<feature>/{types,config,api,hooks,components}`
  and `src/shared/{types,config,api,hooks,components}`, layer order
  `types → config → api → hooks → components` inside each tree.
- Existing code migrated: `src/ui/hero.js` → `src/features/home/`;
  `src/app/design-system/{showcase-section.js,sections/*.js}` →
  `src/features/design-system/`; `src/ui/{header,footer,theme,theme-provider}.js`,
  `src/config/site.js`, `src/types/index.js` → `src/shared/`.
- Each feature gets a public `index.js`; nothing outside a feature may
  import a deeper path (`no-deep-feature-imports`).
- New structural rules in `harness/structure.rules.cjs`: per-tree layer
  order, `no-feature-to-feature` (isolation), `no-shared-to-feature`,
  `no-deep-feature-imports`, `no-circular` — all covered by rewritten
  fixtures in `harness/tests/structure-rules.test.cjs`.
- `docs/architecture.md`, `openspec/project.md`, `AGENTS.md`,
  `harness/GOLDEN_RULES.md` (bumped to v2), `harness/quality-grades.json`
  updated to describe/enforce the new shape; `repo/service/runtime` removed
  from every doc, not merely renamed.
- `pnpm theme:build`, `.gitignore`, `harness/verify.sh` updated for the
  theme source/output's new path under `src/shared/components/`.

## Out of scope

- Creating empty `api/`/`hooks/` folders ahead of need (shared or per
  feature) — added only when a feature actually calls the backend project
  or needs client-side state.
- Fixing the stale/hardcoded-hex color example inside
  `src/features/design-system/components/sections/content.js` (only its
  `src/ui/theme.js` path reference is updated, since the file moved) — a
  separate, previously-flagged issue.
- Archiving this change into `openspec/archive/` — left for a later session.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-07 | `api/hooks` layers named after client concerns (calls to external backend, client state), not `repo/service` | Backend lives in a separate project; those names would misdescribe what the code does |
| 2026-08-07 | Features must not import each other at all (full isolation, not just "public surface only") | Simplest mechanically-checkable rule; current features (`home`, `design-system`) have no legitimate reason to depend on each other |

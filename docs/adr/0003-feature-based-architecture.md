# ADR-0003: Feature-based front-end architecture, drop backend layers

**Status:** accepted
**Date:** 2026-08-07

## Context

The project started from the OpenSpec x Harness Engineering template with a
generic full-stack layered architecture:
`src/{types,config,repo,service,runtime,ui}`, enforced by
`harness/structure.rules.cjs`. In practice `src/repo/`, `src/service/`, and
`src/runtime/` had been empty since bootstrap — this repo is confirmed to be
the **front-end only**; a separate project owns the backend (data access,
business logic). Keeping three permanently-empty backend layers in the map
of truth was misleading, and the flat `src/ui/` directory was already
starting to mix unrelated concerns (site chrome, a single-page hero, an
8-section internal showcase all lived side by side).

The team also wants the codebase organized so a growing set of product
areas ("features") can be added, changed, or removed as independent
vertical slices, rather than every new page's UI landing in one shared
`src/ui/` bucket.

## Decision

Replace the 6-layer backend-shaped architecture with a feature-based
front-end architecture:

```
src/features/<feature>/{types,config,api,hooks,components}
src/shared/{types,config,api,hooks,components}
```

Layer order inside each tree (feature or shared) is
`types → config → api → hooks → components` — `repo`/`service`/`runtime`
are dropped; `api/` is the new home for calls out to the separate backend
project. Features are isolated: `src/features/<a>` may not import
`src/features/<b>` directly, and anything outside a feature may only reach
it through its `index.js`. `src/shared/` holds cross-cutting code (site
chrome, theme, site config, shared types) and may not depend on a feature.
`src/app/` keeps its existing role as the Next.js routing/wiring surface,
unrestricted by these rules.

Alternatives considered:
- **Keep the flat 6-layer structure, just add `src/features/` alongside
  it** — rejected: would leave `repo/service/runtime` as permanent
  no-op placeholders and wouldn't solve the "everything in `src/ui/`"
  problem.
- **Drop layering entirely inside each feature** (fully unstructured
  vertical slices) — rejected: the project's existing convention is that
  every rule maps to a mechanical check (`openspec/project.md`); an
  unstructured feature folder can't be checked, only reviewed by hand.

## Consequences

- New product areas get their own `src/features/<name>/` and can be
  reasoned about, reviewed, and eventually deleted independently.
- `api/`/`hooks/` are not scaffolded ahead of need (same
  placeholder-free philosophy the old `repo/`/`service/` had) — they
  appear the first time a feature actually calls the backend project or
  needs client-side state.
- Anyone editing `docs/architecture.md`, `AGENTS.md`, or
  `openspec/project.md` must keep "front-end only, backend is a separate
  project" visible — it is the reason `repo/service/runtime` are gone, not
  merely renamed.
- Migrating existing code (`src/ui/*`, `src/config/*`, `src/types/*`, plus
  the design-system page's sections) into this shape is a one-time,
  same-change migration — see `openspec/changes/feature-based-architecture/`.

## Enforcement

`harness/structure.rules.cjs` (dependency-cruiser), run via
`pnpm run structure` and as part of `./harness/verify.sh`:
- Layer-order rules scoped to `src/shared/<layer>` and
  `src/features/<feature>/<layer>` (backreferenced per feature).
- `no-feature-to-feature` — forbids direct cross-feature imports.
- `no-shared-to-feature` — forbids `src/shared/` depending on a feature.
- `no-deep-feature-imports` — forbids reaching into a feature except via
  its `index.js`.
- `no-circular` — unchanged.

Fixture coverage for every rule above lives in
`harness/tests/structure-rules.test.cjs`. `harness/GOLDEN_RULES.md` v2
records rules #2 and #3 for this decision.

# Design: Feature-based front-end architecture

## Approach

Replace the flat 6-layer backend-shaped `src/` with a feature-based
front-end shape, nesting the same kind of layer order inside two kinds of
roots instead of one:

```
src/features/<feature>/{types,config,api,hooks,components}
src/shared/{types,config,api,hooks,components}
```

`types → config → api → hooks → components` replaces
`types → config → repo → service → runtime → ui` — `repo`/`service` become
`api` (calls to the separate backend project) and `hooks` (client-side
state/logic); `runtime` is dropped because `src/app/` already plays that
wiring role for the whole app, so a per-feature "runtime" would be a
redundant no-op layer.

`harness/structure.rules.cjs` generates the per-tree layer-order rules
parametrically (one generator function invoked once for `src/shared/`,
once for `src/features/<feature>/` with a dependency-cruiser backreference
so the rule only compares within the *same* feature), then adds three
rules that didn't exist before: feature isolation, shared-can't-depend-on-
feature, and deep-import-must-go-through-index. This mirrors the existing
`no-deep-domain-imports` rule's backreference technique rather than
inventing a new mechanism.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `src/types/index.js` → `src/shared/types/index.js` | moved, no content change |
| config | `src/config/{site.js,site.test.js}` → `src/shared/config/` | moved, no content change |
| components (feature) | `src/ui/hero.js` → `src/features/home/components/hero.js` | moved; new `src/features/home/index.js` |
| components (feature) | `src/app/design-system/{showcase-section.js,sections/*.js}` → `src/features/design-system/components/` | moved; new `src/features/design-system/index.js` re-exporting the 8 sections |
| components (shared) | `src/ui/{header,footer,theme,theme-provider}.js` → `src/shared/components/` | moved, no content change (relative imports unaffected — siblings preserved) |
| app (wiring, not a layer) | `src/app/{layout,page,design-system/page}.js` | import paths updated to the new locations |

## New dependencies

None.

## Risks & mitigations

- **Generated theme output points at stale paths mid-migration** →
  rebuild (`pnpm theme:build`) immediately after moving
  `src/shared/components/theme.js`, and delete the old `src/ui/kt-xnk.*`
  gitignored artifacts so nothing accidentally imports them.
- **New dependency-cruiser rules pass on paper but never actually catch a
  violation** → `harness/tests/structure-rules.test.cjs` asserts each new
  rule name appears in a deliberately-violating fixture, not just that the
  real `src/` is clean.
- **Docs drift from code again** (this is exactly what triggered this
  change) → every doc touched in the same change as the code move, per
  Golden Rule #10.

## Verification plan (agreed BEFORE implementation — "sprint contract")

- [x] `pnpm run structure` passes against the migrated `src/`
- [x] `pnpm test:harness` passes, including new rule-violation assertions
- [x] `./harness/verify.sh` passes end-to-end
- [x] `pnpm dev` → `/` and `/design-system` render identically to before the move

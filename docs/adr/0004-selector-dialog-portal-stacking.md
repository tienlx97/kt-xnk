# ADR-0004: A `*FormDialog` with a `Selector` field never renders inside `renderExpanded`

**Status:** accepted
**Date:** 2026-09-04

## Context

Astryx's `Selector` positions its dropdown by walking up from its own DOM
position and portaling out to the nearest ancestor outside any "unsafe host"
(`<table>`, `<tr>`, ... — see `resolveLayerPortalTarget` in
`node_modules/@astryxdesign/core/src/Layer/layerHost.ts`). Astryx's `Dialog`
is a native `<dialog>` element (`showModal()`), not a portal — it stays
exactly where it is declared in the DOM tree and relies on the browser's own
top-layer promotion to render above everything else.

Every list page in this app (`ContractsList`, `CommissionsList`, ...)
uses `AdvanceTable`'s `renderExpanded` to render a row's detail panel, which
can open a `*FormDialog`. When a `*FormDialog` containing a `Selector` field
is declared *inside* that `renderExpanded` callback, it is still, in the
DOM/React tree, a descendant of the `<table>` — even though the dialog
itself visually floats above the page via `showModal()`. `Selector`'s
walk-up-and-portal logic only sees the DOM tree: it finds the `<table>`
ancestor and portals its dropdown to the table's scroll wrapper, a sibling
of the dialog's own top-layer promotion rather than something layered above
it. The dropdown then renders visually on top of the dialog (looks fine) but
is stacked *underneath* it in the actual paint order — a mouse click on an
option lands on the dialog's own content instead of the option. Only
keyboard selection works.

This is a real interaction bug, not a11y nitpick, and it is silent: nothing
throws, nothing looks wrong in a screenshot, and it only surfaces when a
person actually clicks an option with a mouse. It was found and fixed once
in `contracts-list.jsx` (see the "Selector popover stacking" comment above
`ContractsList`), then found again — independently, months later — as a
live bug in `commissions-list.jsx`, which had copied the
`renderExpanded`-owns-its-dialogs shape before the fix pattern existed.

The library-level root cause (`resolveLayerPortalTarget` walking past an
ancestor `<dialog>` instead of treating it as a stacking boundary) lives in
`@astryxdesign/core`, a published third-party package this repo does not
vendor or patch — fixing it upstream is out of this project's reach, and a
`patch-package` step was judged not worth the maintenance cost for one
component's edge case. The fix has to live on this side of the boundary.

## Decision

Any `*FormDialog` that contains (directly or via its `*Fields` component) a
`Selector` field, and is opened from inside a table row's expanded content,
must be rendered as a **sibling of the `AdvanceTable`**, not a descendant of
it. The expanded-row component only receives trigger callbacks
(`onEdit`, `onAddX`, `onEditX`, ...); the list component itself owns the
dialog's open/closed state and renders the dialog next to `<AdvanceTable
.../>` in its own JSX, keyed by the edited record's id (or `'create'`).

`ContractsList` (`contracts-list.jsx`) and `CommissionsList`
(`commissions-list.jsx`) are the reference implementations of this
shape.

## Consequences

- Every list page with row-expansion + a Selector-bearing dialog carries
  slightly more prop-drilling (trigger callbacks passed down, dialog state
  lifted up) than a naively-nested dialog would need. Accepted — it is the
  only known-correct shape given the library constraint.
- A dialog with no `Selector` field anywhere in its fields (e.g.
  `ContractAnnexFormDialog` if it had no Selector) would be safe to nest
  inside `renderExpanded`, but this ADR does not carve out that exception —
  keeping one rule for every `*FormDialog` regardless of its current fields
  means a field added later (which may add a `Selector`) can't silently
  reintroduce the bug.
- If `@astryxdesign/core` ever fixes `resolveLayerPortalTarget` to treat an
  ancestor open `<dialog>` as a stacking boundary, this whole class of
  workaround becomes unnecessary — re-evaluate this ADR against the
  changelog of whatever version fixes it before undoing the pattern.

## Enforcement

`harness/tests/selector-dialog-stacking.test.cjs`, run via
`pnpm run test:harness` and as part of `./harness/verify.sh`: scans every
`.jsx` file under `src/` for a `renderExpanded:`/`renderExpanded =` callback
body containing a JSX tag matching `<[A-Z][A-Za-z0-9]*FormDialog`, and fails
if one is found. It is a bracket-balance scan (not a real parser) — it
follows this codebase's `*FormDialog` naming convention rather than
resolving whether a given dialog actually has a `Selector` field, so it
flags every `*FormDialog` nested in `renderExpanded`, not only the ones that
would actually break. That is deliberate per the Consequences note above.

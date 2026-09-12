# Proposal: Pin table header while scrolling

**Status:** done
**Created:** 2026-09-12

## Why

User asked for the table header (and ideally the "Tổng cộng" totals row) to
stay visible while scrolling a long list.

## What changes

- `theme.js`'s `table-header-cell` component override gains
  `position: sticky; top: 0; z-index: 1` — sticky is applied per header
  cell (`<th>`), not on `<thead>` itself (sticky on a table-header-group
  isn't reliably supported across browsers; sticky per cell is). This is a
  theme-wide change: every `Table` in the app gets a sticky header, not
  just the four lists with a totals row.
- Verified via computed style in a live browser session
  (`position: sticky`, `top: 0px`, `z-index: 1`, opaque background) against
  the running dev stack.

## Out of scope

- Pinning the totals ("Tổng cộng") row. `Table`'s data-driven mode (which
  `AdvanceTable` uses everywhere) has no `<tfoot>`/footer concept and no
  per-row styling hook — the totals row is an ordinary last `<tr>` in
  `<tbody>`, and `position: sticky` isn't reliably supported on `<tr>`
  itself (only on cells), and a theme override can't target *one specific*
  row differently from the rest of the body. Making it sticky would need
  either swizzling `Table` (`astryx swizzle Table`, ejecting it from the
  shared design system) or moving the totals row out of the `<table>`
  entirely into a separately-positioned bar with manually mirrored column
  widths — both are a materially bigger change than this one. Left for a
  follow-up once the user picks a direction.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-09-12 | Sticky header shipped as a global theme change; sticky totals row deferred, pending user decision on approach | The two asks have very different costs: header pin is a one-line CSS property on an existing theme key; totals-row pin needs an architectural change `Table`'s current API doesn't support. |
| 2026-09-12 | Fixed a regression this change introduced: `TableHeaderGroupBar`'s "GIÁ TRỊ" spanning label (`table-header-group.jsx`) disappeared once the page scrolled | It's `position: absolute` inside a `position: relative` (non-sticky) wrapper, so once the real header `<th>` became `position: sticky` and visually stayed at the viewport top, the absolutely-positioned overlay — anchored to the scrolling wrapper — scrolled away underneath it. Fixed by switching the overlay to `position: fixed` with viewport-relative coordinates and adding a `scroll` listener alongside the existing resize/mutation observers, so it re-measures and tracks the sticky header throughout the scroll, not just once. See `pin-totals-row` for the follow-on totals-row pin, which reuses this same fixed-and-measured technique. |
| 2026-09-12 | Found (seeding 50 test contracts and actually scrolling — the 1–4 row sample data never exercised this) that the sticky header **never actually stuck to anything**: `Table`'s own `astryx-table-scroll-wrapper` is `overflow: auto` on *both* axes (needed for horizontal scroll on wide tables — per the CSS overflow spec, a `visible` value on one axis is forced to `auto` when the other isn't `visible`, so the two can't be decoupled), which makes that wrapper — not the page/viewport — the "nearest scrolling ancestor" `position: sticky` resolves against. Fixed by giving `table-scroll-wrapper` a bounded `max-height: 65vh`, turning it into an actually-scrollable box (independent of the page) that the header now correctly sticks within. |
| 2026-09-12 | Also found (same live pass) a sticky-column/sticky-header z-index collision: the sticky-start column's *body* cells (`useTableStickyColumns`, `z-index: 1`) painted over the header's own label at the same `z-index: 1` — equal z-index ties resolve by DOM order, and `<tbody>` comes after `<thead>`. Bumped `table-header-cell` to `z-index: 2` (beats every sticky body cell regardless of edge) and `TableHeaderGroupBar` to `z-index: 3` (must beat the header cells it overlays). |

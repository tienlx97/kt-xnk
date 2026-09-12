# Tasks: Pin the totals row to the viewport bottom

## 1. Sticky totals bar

- [x] 1.1 New `TableStickyTotalsBar` component — measures real header `<th>` positions, re-renders each column's totals cell at a fixed viewport position, stacks multiple currency rows, only visible while the table is on screen — verify: `pnpm exec tsc --noEmit -p jsconfig.json` clean.
- [x] 1.2 `AdvanceTable` renders it automatically when `totalsRows` is non-empty (via a new `tableWrapperRef` around `<Table>`) — verify: `./harness/verify.sh` full gate green.

## 2. Full verification

- [x] 2.1 `./harness/verify.sh` green (lint, typecheck, structure, harness-tests, unit-tests, build, quality-thresholds).
- [x] 2.2 Live-verified: seeded 50 test contracts via the dev API (`26SCROLL-001`..`050`, cleaned up afterward), logged into a real browser session against `pnpm exec next dev -p 3001` + the BE dev Docker stack, scrolled the Hợp đồng list (both "Mặc định" and "Tài chính" views) and the Shipment list — pinned totals bar tracked correctly and matched the inline "Tổng cộng" row's values exactly. This pass is also what surfaced and got fixed: `pin-table-header`'s sticky header never actually engaging (bounded `max-height` needed) and a sticky-column/header z-index collision — see that change's decision log.

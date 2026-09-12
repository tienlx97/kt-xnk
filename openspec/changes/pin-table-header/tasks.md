# Tasks: Pin table header while scrolling

## 1. Sticky header

- [x] 1.1 `theme.js`'s `table-header-cell` gains `position: sticky; top: 0; z-index: 1`; rebuild `theme.built.css` — verify: `./harness/verify.sh` green; computed style confirmed live (`position: sticky`, `top: 0px`, `z-index: 1`) against the running dev stack.
- [x] 1.2 Fix: `table-header-group.jsx`'s `TableHeaderGroupBar` overlay switched from `position: absolute` (container-relative) to `position: fixed` (viewport-relative) + scroll listener, so the "GIÁ TRỊ" label tracks the now-sticky header instead of scrolling away underneath it — verify: `./harness/verify.sh` green.
- [x] 1.3 Fix: `table-scroll-wrapper` gains `max-height: 65vh` so the sticky header has an actual bounded, scrollable ancestor to stick within (its own unbounded `overflow: auto` box never manifested a scrollbar, so sticky never engaged) — verify: seeded 50 test contracts via the dev API, scrolled the table in a live browser session, header + "GIÁ TRỊ" label stayed pinned while 50 rows scrolled beneath.
- [x] 1.4 Fix: `table-header-cell` z-index bumped `1` → `2` (sticky-column body cells were painting over the header at equal z-index) and `TableHeaderGroupBar` bumped to `3` — verify: same live pass, "Ngày ký" (the sticky-start column's header label) confirmed visible and not overpainted by scrolled body rows.

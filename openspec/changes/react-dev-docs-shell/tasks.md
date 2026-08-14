# Tasks: React.dev Docs Copycat

<!--
Rules:
- One task = one session-sized unit of work with its own verification.
- Agent picks the FIRST unchecked task, top to bottom. No parallel tasks.
- A task is checked ONLY after ./harness/verify.sh passes and its criteria are met.
-->

## 1. Contract and shell

- [x] 1.1 Establish the parity contract and replace the Astryx app frame with
  the react.dev three-region semantic StyleX grid — verify: source contract
  tests plus `./harness/verify.sh`.
- [x] 1.2 Port TopNav appearance and desktop behavior, including 64px sticky
  header, scroll shadow, brand/nav/auth roles, and exact responsive visibility —
  verify: keyboard interaction tests and screenshots at 1024/1536/1919px.
- [x] 1.3 Port mobile TopNav/SideNav overlay behavior, including body scroll
  locking, Escape/route/resize close paths, and focus management — verify:
  browser flow and screenshots at 374/390/640/768px.
- [x] 1.4 Port desktop SideNav tree geometry, disclosure motion, active states,
  sticky scrolling, and section labels — verify: interaction tests and geometry
  screenshot at 1024/1280/1536px.

## 2. Content frame

- [x] 2.1 Port PageHeading, article, footer, and TOC region geometry without
  Astryx UI — verify: measured 20/48px insets, 56rem prose, 80rem body, and
  20rem TOC at breakpoint boundaries plus `./harness/verify.sh`.
- [x] 2.2 Match TOC sticky/scroller/active-link behavior and accessibility —
  verify: browser scroll flow at 1536 and 2048px.

## 3. MDX authoring contract

- [x] 3.1 Record and test the react.dev component-registry parity matrix against
  the current KT-XNK MDX map — verify: every supported/missing/adapted component
  is mechanically classified.
- [ ] 3.2 Port `MaxWidth` prose grouping and explicit full-width interruption
  behavior in an App-Router/MDX-3-compatible form — verify: fixture page DOM and
  geometry tests show stable ordering and axes.
- [ ] 3.3 Reconcile frontmatter, heading ID, TOC, callout, media, and code-block
  authoring behavior with the parity matrix — verify: MDX API tests and fixture
  screenshots.

## 4. Acceptance and handoff

- [ ] 4.1 Capture the full seven-breakpoint screenshot suite, record geometry
  measurements and intentional brand differences, and resolve all regressions —
  verify: evidence exists under a dated `harness/runs/` directory.
- [ ] 4.2 Update architecture/project documentation, close every harness gap
  introduced by the port, pass `./harness/verify.sh`, and mark the proposal done.

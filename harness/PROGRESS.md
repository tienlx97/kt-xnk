# Progress Log

<!--
Append-only session log. Newest entry FIRST.
This file is the handoff between sessions/agents — write for a reader with zero conversation context.
-->

## Harness gaps (mistakes that need a mechanical rule, not a manual fix)

- MDX authoring components have no nested computed-style regression gate. On
  2026-08-14, browser inspection measured only the outer `Intro` wrapper and
  missed that its generated MDX paragraph applied the body typography recipe
  again. The instance is fixed and the inner paragraph is now browser-measured;
  add a Playwright assertion for both wrapper and rendered child styles when
  browser tests become part of the gate.
- MDX alignment has no visual/geometry regression gate. On 2026-08-14 the
  outer `max-w-7xl` body frame was ported from react.dev without the generated
  `MaxWidth` (`max-w-4xl ms-0 2xl:mx-auto`) prose wrapper, so PageHeading and
  article text used different horizontal axes. The instance is fixed and
  browser-measured at 390px, 1280px, and 2048px; add a Playwright geometry
  assertion or screenshot baseline when browser tests become part of the gate.
- MDX layout components do not yet have a DOM-structure regression test. On
  2026-08-14, a rendered MDX fragment was placed directly inside the responsive
  CSS Grid; its multiple root nodes became independent grid items and split
  paragraphs/headings across the content and TOC columns. The instance is fixed
  by an explicit content-column wrapper. Add a render-level test when the repo
  adopts a JSX-capable component test runtime; the current Node test runner does
  not transform JSX components.
- `harness/checks/project-readiness.sh`'s placeholder scan (angle-bracket
  CLI-argument tokens, an unfilled date-format token, etc. — see the script
  for the exact pattern) didn't account for tool-generated content blocks —
  `astryx init`'s `<!-- ASTRYX:START/END -->` cheat sheet in `AGENTS.md`
  contains angle-bracket CLI usage syntax that happens to match the
  placeholder pattern, and failed `verify.sh` on an otherwise clean repo.
  Fixed 2026-08-06: the check now strips `ASTRYX:START`/`ASTRYX:END` blocks
  before scanning. Any other tool that appends a marked block to these
  files (AGENTS.md, docs/architecture.md, GOLDEN_RULES.md, PROGRESS.md,
  quality-grades.json, project.md) should use a similar
  `<!-- TOOL:START/END -->` convention so this stays generalizable instead
  of needing a new carve-out per tool. (Note for future edits to this very
  log: avoid reproducing the literal placeholder tokens themselves here —
  this file is one of the ones the scan covers, and literal examples in
  the write-up will trip it, as happened while drafting that entry.)

---

## 2026-08-14 — Codex

- **Active change:** finalize the MDX navigation/content work for publication.
- **Task worked:** reconciled tests with the committed navigable-parent sidebar
  behavior and the actual 16 Docs article routes. Current breadcrumb ancestors
  intentionally omit `href` even when the corresponding sidebar group is
  navigable, preserving `DOCS > NỘI QUY` semantics without linking the current
  crumb.
- **Result:** done. Task 1.31 and the `mdx-sidebar-navigation` proposal are now
  complete.
- **Verification:** `./harness/verify.sh` passed every gate. Evidence:
  `harness/runs/20260814-165918-92357/`.
- **Harness gap:** none.
- **Next step:** commit and push the completed branch as requested.

---

## 2026-08-14 — Codex

- **Active change:** React.dev-inspired MDX `Note` callout refinement.
- **Task worked:** replaced the stateful Astryx Banner wrapper with an
  always-visible server-rendered callout built from Astryx layout, icon, and
  text primitives. The note uses the KT-XNK accent tint, inset hairline,
  display-font title, responsive padding, rounded desktop treatment, and a
  full-bleed mobile treatment. Applied it to the company-specific schedule in
  `content/docs/noi-quy/gio-lam-viec.mdx`.
- **Result:** implementation and browser QA complete. The note renders as
  semantic `<aside role="note">`; desktop measured 12px radius and 20px/24px
  padding, while 390px mobile measured full viewport width, zero radius, 20px
  padding, and no horizontal overflow.
- **Verification:** lint, typecheck, structure, harness tests, production build,
  and quality thresholds pass. Full gate is blocked by three pre-existing unit
  test/data mismatches in Docs post count and the `NỘI QUY` sidebar `path`; see
  `harness/runs/20260814-135035-52115/`. UI evidence:
  `harness/runs/20260814-mdx-note/gio-lam-viec-note-desktop.png` and
  `harness/runs/20260814-mdx-note/gio-lam-viec-note-mobile.png`.
- **Discovered:** reconcile the expected Docs post count (17 vs 16 discovered)
  and decide whether `NỘI QUY.path` should remain `/docs`; not changed because
  both are outside the note styling task and overlap current user-owned work.
- **Next step:** after those unrelated test/data mismatches are resolved, rerun
  `./harness/verify.sh` and mark task 1.31 done.

---

## 2026-08-14 — Codex

- **Active change:** Docs breadcrumb hierarchy correction.
- **Task worked:** replaced the hard-coded single `Docs` breadcrumb on article
  pages with a recursive lookup against `src/sidebarPost.json`, the same source
  used by the Docs sidebar. The matching article remains the page heading, while
  its ancestors become the breadcrumb trail; separators now render only between
  entries.
- **Result:** done. `/docs/lam-them-gio` renders `DOCS > NỘI QUY`; `Docs` links
  to `/docs`, `NỘI QUY` is the current non-link item, and `Làm thêm giờ` is not
  duplicated. A registry-backed unit test also covers the `IT` group and an
  unknown route.
- **Verification:** `./harness/verify.sh` passed all gates. Mechanical evidence:
  `harness/runs/20260814-115246-20534/`. UI screenshot:
  `harness/runs/20260814-mdx-breadcrumb-group/docs-lam-them-gio-breadcrumb-2048.png`.
- **Harness gap:** closed for hierarchy derivation with a unit test; visual
  separator rendering remains covered by the existing MDX visual-regression gap.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** nested MDX typography correction for `Intro`.
- **Task worked:** corrected the actual rendered node rather than only the
  wrapper. MDX compiles prose inside `<Intro>` to the shared paragraph mapping,
  whose body recipe previously reset the wrapper's font family, size, weight,
  and leading. Paragraphs under the stable `data-mdx-intro` boundary now receive
  the lead typography through scoped StyleX selectors; ordinary paragraphs are
  unaffected and the component remains server-only.
- **Result:** done. Browser inspection on `/docs/noi-quy-chung` confirms both
  wrapper and nested paragraph use Optimistic Display, 20px, weight 400, and
  28.572px leading; the paragraph retains primary ink `rgb(30, 42, 39)`.
- **Verification:** `./harness/verify.sh` passed all gates. Mechanical evidence:
  `harness/runs/20260814-114140-12796/`. UI screenshot:
  `harness/runs/20260814-mdx-intro-fix/intro-fixed-2048.png`.
- **Harness gap:** nested computed-style coverage is logged above.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** React Docs-style MDX `Intro` component.
- **Task worked:** added `Intro` to the shared MDX authoring map and adapted the
  supplied React.dev component to Astryx `Text` plus StyleX typography tokens.
  The component stays server-rendered and uses Optimistic Display, 20px lead
  text, normal weight, primary ink, block layout, and relaxed tokenized leading.
  The opening copy in the MDX sample now demonstrates the component.
- **Result:** done. Browser inspection on `/docs/xin-chao-mdx` measured a DIV
  rendered by Astryx Text with Optimistic Display, 20px, weight 400,
  `rgb(30, 42, 39)` primary ink, 28.572px leading, and block display.
- **Verification:** `./harness/verify.sh` passed all gates. Mechanical evidence:
  `harness/runs/20260814-112517-36258/`. UI screenshot:
  `harness/runs/20260814-mdx-intro/intro-2048.png`.
- **Harness gap:** none beyond the existing MDX visual-regression gap.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** react.dev-style MDX TOC scroll highlighting.
- **Task worked:** confirmed the existing `remark-flexible-toc` extraction
  pipeline already generates heading labels, depths, Unicode slugs, and
  duplicate-heading suffixes correctly. Ported react.dev's missing
  `useTocHighlight` behavior into `src/shared/hooks/`, kept the client boundary
  limited to the TOC, coalesced passive scroll events with animation frames,
  and applied active background/accent/bold styles plus `aria-current`.
- **Result:** done. Browser checks at 2048x900 selected the first section on
  load, selected `IT` when its heading reached 83.7px beneath the fixed header,
  and selected the final visible section at page end. The active item measured
  teal `rgb(36, 119, 104)`, weight 700, and a non-transparent highlight.
- **Verification:** `./harness/verify.sh` passed all gates. Mechanical evidence:
  `harness/runs/20260814-111136-26861/`. UI screenshot:
  `harness/runs/20260814-toc-highlight/toc-active-it-2048.png`.
- **Harness gap:** none beyond the existing MDX visual-regression gap.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** MDX heading permalink alignment correction.
- **Task worked:** matched react.dev's `.mdx-header-anchor svg` display mode by
  overriding Astryx Icon's block SVG to `display: inline`. Removed the earlier
  vertical-align override, allowing the glyph to participate in the heading's
  native text baseline exactly like the upstream implementation.
- **Result:** done. Browser geometry showed the previous block SVG sitting 14px
  below the text baseline with a 19.5px center delta. The inline SVG reduces
  that center delta to 3.5px and visually aligns with the heading text. Clicking
  the glyph still updates the hash and positions its heading at the 84px safe
  header offset.
- **Verification:** `./harness/verify.sh` passed all gates. Mechanical evidence:
  `harness/runs/20260814-105453-14568/`. UI screenshot:
  `harness/runs/20260814-105435-mdx-anchor-alignment/mdx-anchor-aligned-2048.png`.
- **Harness gap:** none beyond the existing MDX visual-regression gap.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** react.dev-style MDX heading permalinks.
- **Task worked:** audited react.dev's `MDXComponents.tsx` against the local
  MDX mapping and ported the missing `Heading` behavior. MDX h2-h6 now expose
  the upstream chain-link glyph beside their text on heading hover or keyboard
  focus; h1 remains unlinked. Links use generated `rehype-slug` ids, localized
  accessible labels, KT-XNK accent color, and an 84px header-safe scroll
  margin. The glyph is isolated in a tiny Client Component so server-rendered
  MDX never passes a component function across the React Server Component
  boundary.
- **Result:** done. Browser checks on `/docs` found zero h1 permalinks and 11
  h2-h6 permalinks, measured icon opacity changing from 0 to 1 on hover/focus,
  and confirmed a glyph click updates the URL fragment and places the target
  heading 84px below the viewport top.
- **Verification:** `./harness/verify.sh` passed all gates. Mechanical evidence:
  `harness/runs/20260814-104947-8675/`. UI screenshot:
  `harness/runs/20260814-104846-mdx-heading-link/mdx-heading-permalink-hover-2048.png`.
- **Harness gap:** none; the initial server/client-boundary mistake is covered
  by the existing production-build gate, which rejects that invalid component
  serialization.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** react.dev Breadcrumbs and TOC style port for MDX pages.
- **Task worked:** replaced the generic Astryx breadcrumb presentation with
  react.dev's 13px uppercase/bold/tracking-wide breadcrumb rhythm and trailing
  20px chevrons. Ported react.dev's TOC offsets, 13px uppercase label, inner
  scroll rail, 8px list/item spacing, 8px vertical link padding, rounded start
  edge, depth-3 indentation, and depth-4+ hiding. This is a presentation-only
  port; existing routes/TOC data remain unchanged. React link/highlight colors
  map to KT-XNK teal/mint tokens rather than React's cyan palette.
- **Result:** done. Browser measurements confirm the breadcrumb and TOC label
  at 13px/700 with 0.025em tracking, the chevron at 20px, TOC heading y=80,
  link padding 8px, and mobile TOC display none. Desktop/mobile screenshots
  show the expected layout without overflow.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence and UI
  screenshots: `harness/runs/20260814-102945-95115/`.
- **Harness gap:** none beyond the existing visual-regression gap above.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** semantic refinement of the MDX color hierarchy.
- **Task worked:** returned PageHeading and all article h1-h6 headings to the
  neutral primary ink, while reserving brand teal for breadcrumb items and
  separators, inline links, markdown strong emphasis, TOC labeling, and the
  copy action. Retained the mint h2 divider and callout surfaces as quiet
  structural accents. Breadcrumb coloring is scoped through inherited Astryx
  color tokens rather than a global component override.
- **Result:** done. Browser computed styles measure headings at
  `rgb(30, 42, 39)` and breadcrumbs/links/strong emphasis at
  `rgb(36, 119, 104)`. Desktop and 390px mobile screenshots preserve the MDX
  alignment and wrapping contracts.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence and UI
  screenshots: `harness/runs/20260814-101958-86869/`.
- **Harness gap:** none beyond the existing visual-regression gap above.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** MDX document color hierarchy.
- **Task worked:** replaced the monochrome MDX presentation with a restrained
  KT-XNK brand hierarchy. Page titles and h1-h3 headings use the logo teal;
  h2 headings gain a mint divider; inline links are teal and permanently
  underlined; blockquotes use the mint accent surface; TOC and copy-link
  affordances use the same accent. Body copy remains neutral for long-form
  readability. The copy icon button now also exposes its accessible label.
- **Result:** done. Browser computed styles confirm `rgb(36, 119, 104)` for
  PageHeading, section headings, links, TOC heading, and copy action; MDX links
  retain an underline. Desktop and 390px mobile screenshots show no overflow
  or layout regression.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence and UI
  screenshots: `harness/runs/20260814-095912-77927/`.
- **Harness gap:** none beyond the existing visual-regression gap above.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** exact MDX PageHeading/article alignment with react.dev.
- **Task worked:** added the missing prose-level `MaxWidth` wrapper used by
  react.dev's `prepareMDX.js`/MDX component map. The body retains its outer
  `max-w-7xl` frame for wide content, while ordinary prose now uses
  `max-w-4xl ms-0 2xl:mx-auto`, matching PageHeading's horizontal contract.
  Added stable layout markers for geometry-based browser checks.
- **Result:** done. At 2048px PageHeading and prose both measure x=576 and
  width=896 while the TOC occupies x=1728..2048; at 1280px both measure x=368
  and width=864 with TOC hidden; at 390px both measure x=20 and width=350.
- **Verification:** `./harness/verify.sh` passed all gates. Browser screenshots
  are `mdx-layout-{390,1280,2048}.png` in evidence directory
  `harness/runs/20260814-094550-69001/`.
- **Harness gap:** logged above; geometry is verified for this change but not
  yet run automatically by the repository gate.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** MDX PageHeading/body alignment correction against react.dev.
- **Task worked:** corrected the responsive hierarchy so the 2xl layout now
  matches react.dev's outer `sidebar | main | toc` model. Within the AppShell
  content area, MDX uses `main | 20rem TOC`; PageHeading (`max-w-4xl`) and body
  (`max-w-7xl`) each center within main, rather than PageHeading centering over
  the combined main-plus-TOC width. This removes the extra rightward offset
  while preserving their intentional different maximum widths.
- **Result:** done.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260814-093202-60510/`.
- **Harness gap:** visual automation remains unavailable because local Chrome
  lacks `libnspr4.so`; the corrected column hierarchy is mechanically covered
  by typecheck/build but not screenshot diffing.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** MDX responsive-grid regression reported from visual review.
- **Task worked:** fixed the MDX body fragment being mounted directly into the
  two-column Grid. MDX can emit many top-level DOM nodes, so each paragraph,
  heading, or list became an independent grid item and flowed into the TOC
  column. The Grid now has exactly two conceptual children: one explicit
  content-column wrapper containing all rendered MDX, and the TOC rail.
- **Result:** done.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260814-092718-56214/`.
- **Harness gap:** logged above; a JSX-capable render test should mechanically
  enforce the Grid's direct-child contract in future.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` React Docs content breakpoints.
- **Task worked:** ported the responsive relationship from react.dev's
  `Layout/Page.tsx`, `PageHeading.tsx`, and Tailwind defaults into the MDX
  frame. MDX routes now remove AppShell's generic padding, apply 20px content
  insets below 640px and 48px from 640px, constrain the heading to 56rem and
  center it only from 1536px, constrain the body to 80rem, and introduce a
  21rem TOC rail only from 1536px. Below that breakpoint the article keeps the
  full content column. All behavior is CSS-driven; no viewport subscriptions
  or resize listeners were added.
- **Result:** done.
- **Verification:** production build output contains the expected spacing
  tokens and 21rem rail; `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260814-092141-52007/`.
- **Harness gap:** screenshot automation remains unavailable because the local
  Chrome runtime lacks `libnspr4.so`; responsive contracts were checked in
  source and compiled output.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` React Docs PageHeading.
- **Task worked:** applied the structure of react.dev's open-source
  `PageHeading.tsx` to every rendered MDX article: a compact top row with
  breadcrumbs and a copy action, followed by a balanced 5xl display heading
  and optional update date. Styling uses KT-XNK/Astryx theme tokens and
  primitives. The heading remains server-rendered; only the clipboard action
  is a small client component. Docs and Tutorial child pages now expose their
  collection breadcrumb.
- **Result:** done.
- **Verification:** production SSR checks confirmed the large heading, copy
  action, and Docs breadcrumb on the relevant routes; `./harness/verify.sh`
  passed all gates. Evidence: `harness/runs/20260814-090756-44019/`.
- **Harness gap:** interactive screenshot/click automation remains unavailable
  because local Chrome is missing `libnspr4.so`; production markup and build
  validate the server/client boundary.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` Docs landing content.
- **Task worked:** replaced the `/docs` list view with a long-form
  `content/docs/index.mdx` landing article. It explains how to use the internal
  knowledge base, introduces the Nội quy and IT domains, links to all 16 child
  documents in context, and includes guidance for reporting incidents and
  proposing documentation updates. The content pipeline reserves `index.mdx`
  for `/docs`, excludes it from `/docs/[slug]`, and no longer carries the now
  unused Docs post-list component or list-loading API.
- **Result:** done.
- **Verification:** unit coverage confirms the landing frontmatter/TOC and the
  absence of an `/docs/index` slug; `./harness/verify.sh` passed all gates.
  Evidence: `harness/runs/20260814-090359-39993/`.
- **Harness gap:** browser screenshots remain unavailable because the local
  Chrome runtime lacks `libnspr4.so`; production rendering is covered by the
  build and MDX compilation tests.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` automatic Docs content pipeline.
- **Task worked:** removed the handwritten `docsPostSlugs` array and
  `components/post-loader.js`. Added a React Docs-inspired content API that
  recursively discovers `content/docs/**/*.mdx`, rejects duplicate filename
  slugs, compiles trusted repository MDX at build time, and derives static
  params, frontmatter, TOC, and index entries directly from files. Moved the
  MDX component mapping into shared UI so both static Tutorial MDX and compiled
  Docs MDX render through the same components. Adding or deleting a Docs file
  no longer requires editing a JavaScript import registry.
- **Result:** done.
- **Verification:** discovery/compilation unit coverage passed for nested
  Nội quy and IT content; typecheck and production build passed; full
  `./harness/verify.sh` passed. Evidence:
  `harness/runs/20260814-085743-35549/`.
- **Harness gap:** sidebar/content consistency is identified in the change
  design as the next mechanical check; filesystem discovery itself is covered.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` content ownership cleanup.
- **Task worked:** moved all company-authored Docs MDX out of
  `src/features/docs/components/posts/` into `content/docs/`, organized under
  `noi-quy/` and `it/` with the introductory article at the Docs root. Updated
  the feature's static source registry so Turbopack can still analyze every
  import while TOC extraction resolves each nested filesystem path. Documented
  `content/docs/` as an architecture-level content boundary.
- **Result:** done.
- **Verification:** typecheck and production build confirm MDX imports outside
  `src/` compile correctly; `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260814-084544-26105/`.
- **Harness gap:** none; typecheck caught and rejected the loader registry's
  stale JSDoc contract during the first run.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` Docs group behavior correction.
- **Task worked:** corrected `NỘI QUY` and `IT` from static section headings to
  pathless disclosure groups. Each full parent row now toggles its nested list;
  a group containing the current article starts expanded, while all 16 article
  rows remain normal navigable links. Added a registry test that locks the
  intended two-group structure and 7/9 child counts.
- **Result:** done.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260814-083514-19167/`.
- **Harness gap:** none; the first state-sync implementation was rejected by
  the existing React hooks lint rule and replaced before completion.
- **Next step:** none.

---

## 2026-08-14 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` company Docs content structure.
- **Task worked:** added route-backed `NỘI QUY` and `IT` sections to
  `sidebarPost.json`. Added 16 MDX documents covering seven company-policy
  topics and nine IT topics, then registered every slug in the static post
  loader so sidebar links, static params, metadata, TOC extraction, and the
  Docs index all use the same content set.
- **Result:** done.
- **Verification:** `./harness/verify.sh` passed all gates. Authenticated SSR
  checks of `/docs/noi-quy-chung` and `/docs/may-tinh` confirmed both section
  labels, article content, and current-page state. Evidence:
  `harness/runs/20260814-082636-12913/`.
- **Harness gap:** browser screenshot automation could not start because the
  installed Chrome runtime is missing the host library `libnspr4.so`; SSR
  artifacts were captured as the available UI evidence.
- **Next step:** replace the initial policy guidance with company-approved
  wording and operational details when those sources become available.

---

## 2026-08-13 — Codex

- **Active change:** route-scoped sidebar frame.
- **Task worked:** moved sidebar visibility to a route-aware AppShell wrapper.
  Only `/tutorial`, `/tutorial/*`, `/blog`, and `/blog/*` receive a desktop
  sidebar and mobile drawer. Home, Design System, and every other route pass
  no sidebar slot and disable mobile navigation, so the content uses the full
  frame width.
- **Result:** done.
- **Verification:** authenticated SSR checks found no documentation navigation
  landmark on Home or Design System, and exactly one on Tutorial and Blog
  article routes. All quality gates passed. Evidence:
  `harness/runs/20260813-152643-36678/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** route-contextual content sidebar.
- **Task worked:** changed the custom sidebar from showing both expandable
  content collections at once to a React Docs-style section tree selected by
  the current route. Blog routes now show Blog, its overview, and Blog article
  links only; Tutorial routes show the equivalent Tutorial content only.
  Non-collection routes retain the general navigation tree.
- **Result:** done.
- **Verification:** lint, typecheck, unit tests, build, formatting, and all
  quality gates passed. Evidence: `harness/runs/20260813-152323-35042/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** React Docs navigation typography calibration.
- **Task worked:** decoupled navigation UI typography from the 17px article
  body scale. Top navigation and top-level sidebar rows now use 15px; nested
  sidebar links and the table of contents use 13px. Top-nav default/active
  weights are 400/500, nested links remain 400, and bold is limited to
  top-level sidebar hierarchy, selected sidebar links, and the TOC heading.
  Replaced the Astryx List-based TOC with the semantic structure and compact
  sizing used by React Docs.
- **Result:** done.
- **Verification:** lint, typecheck, unit tests, build, formatting, and all
  quality gates passed. Evidence: `harness/runs/20260813-150930-31092/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** React Docs source-derived navigation frame.
- **Task worked:** replaced the remaining Astryx TopNav implementation with a
  custom semantic header derived from React Docs' `TopNav.tsx`: 64px desktop
  height, logo at start, right-aligned pill navigation and user actions,
  pressed/hover/active/focus states, and a hamburger below 1024px. AppShell now
  uses a surface frame and a custom 320px mobile drawer containing the same
  custom route tree; the desktop sidebar remains 320px and sticky.
- **Result:** done.
- **Verification:** authenticated SSR contains one custom primary navigation,
  no `astryx-top-nav` markup, one custom documentation sidebar, a current-page
  Tutorial pill on its article route, and no optional reference headings.
  `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-144616-25396/`.
- **Harness gap:** visual screenshot automation is unavailable in the current
  environment; markup, breakpoint CSS, SSR, and interaction contracts were
  checked mechanically.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` top navigation.
- **Task worked:** added Tutorial and Blog to the protected top navigation as
  centered, rounded pill links modeled on React Docs' Learn/Blog navigation.
  Selection uses prefix route matching, so article detail routes retain the
  correct active collection highlight.
- **Result:** done.
- **Verification:** authenticated SSR of `/tutorial/bat-dau` rendered both top
  navigation links and marked Tutorial with `aria-current="page"`; config unit
  coverage confirms their labels, destinations, and order;
  `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-142717-19813/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` custom sidebar.
- **Task worked:** replaced Astryx SideNav/SideNavItem/SideNavSection with a
  semantic custom navigation tree modeled on React Docs' open-source
  SidebarRouteTree and SidebarLink. It has full-row disclosure buttons,
  chevrons, nested links, route-driven expansion, highlighted current links,
  optional divider-separated reference headings, focus styles, and mobile
  drawer close behavior. Reference headings are disabled by default and render
  only when a consumer explicitly supplies them.
- **Result:** done.
- **Verification:** no Astryx SideNav components remain in the implementation;
  authenticated SSR of `/tutorial/bat-dau` returned one expanded disclosure,
  one current-page link, the navigation label, and no visible optional
  reference headings. `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-142328-17277/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** React Docs font families (direct user request).
- **Task worked:** self-hosted the React Docs Latin and Vietnamese WOFF2 font
  assets and configured Astryx typography roles to use Optimistic Text for
  body/UI, Optimistic Display for headings, and Source Code Pro for code. Local
  system stacks remain as fallbacks; unrelated script subsets were omitted.
- **Result:** done.
- **Verification:** generated theme CSS resolves each role to the intended
  family, all downloaded assets identify as valid WOFF2 files, repository-wide
  formatting passes, and `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-135154-5479/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** React Docs-like typography sizing (direct user request).
- **Task worked:** raised the project-wide Astryx typography scale from the
  neutral 14px base to a 17px base while retaining the 1.2 ratio. This matches
  React Docs' 17px document body and raises supporting/sidebar text from 12px
  to 14px, with headings and semantic text growing consistently from tokens.
- **Result:** done.
- **Verification:** generated theme CSS confirmed body 17px, supporting 14px,
  and large text 20px; `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-105149-68036/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` follow-up.
- **Task worked:** followed React Docs' reference-sidebar source model by
  adding optional, divider-separated static headings (`react@19.2`,
  `react-dom@19.2`, and `React Compiler`) after the navigation links. The
  heading block is data-driven and renders nothing when omitted or empty.
- **Result:** done.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-100155-55676/`; repository-wide `pnpm format:check`
  also passed after formatting the previously outstanding files.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/` follow-up.
- **Task worked:** made collapsible Tutorial and Blog parent rows use the full
  SideNavItem surface as their expand/collapse trigger instead of keeping a
  separate small chevron target beside a parent link. Nested article links are
  unchanged.
- **Result:** done.
- **Verification:** `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-092353-45941/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-13 — Codex

- **Active change:** `openspec/changes/mdx-sidebar-navigation/`.
- **Task worked:** changed Tutorial and Blog from flat sidebar links into
  collapsible parents whose nested article links are generated from the existing
  MDX loaders, slugs, and frontmatter titles. Active article routes start with
  their parent expanded and mark the exact child as selected, following the
  route-tree behavior of React Docs while using Astryx's native nested SideNav.
- **Result:** done on branch `feat/mdx-react-style-sidebar`.
- **Verification:** lint, typecheck, and unit tests passed; server-rendered route
  checks confirmed Tutorial expanded/Blog collapsed on `/tutorial/bat-dau` and
  the inverse on `/blog/xin-chao-mdx`, including `aria-current` on each active
  child. `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260813-084937-31693/`.
- **Harness gap:** none.
- **Next step:** none.

---

## 2026-08-12 — Codex

- **Active change:** harness documentation limits (direct user request).
- **Task worked:** shortened the project summary in `AGENTS.md` without
  removing any source-of-truth pointers or operating rules, bringing the file
  from 121 to 119 lines and back under `audit-harness.sh`'s 120-line limit.
- **Result:** done.
- **Verification:** `./harness/audit-harness.sh` passed 25/25;
  `./harness/verify.sh` passed all gates. Evidence:
  `harness/runs/20260812-093643-6043/`.
- **Harness gap:** none — the existing audit correctly detected the drift.
- **Next step:** none.

---

## 2026-08-07 23:15 — Claude Code

- **Active change:** `openspec/changes/login-username-password/` — retroactively
  documents the login feature (shipped across 5 prior ad-hoc commits, none
  of which went through the openspec proposal flow) and removes an
  undocumented CCCD-specific constraint discovered while writing that
  proposal.
- **Task worked:**
  1. **Removed the CCCD constraint**: `src/features/auth/config/login-schema.js`
     had a hidden `USERNAME_PATTERN = /^\d{12}$/` regex (with a comment
     explaining the "username" field was secretly a Vietnamese CCCD) even
     though every visible label/copy presented it as a generic username.
     Replaced the regex-based rule with a plain `.min(3, ...)` string
     check — no format/charset restriction. Updated
     `config/test-users.js`'s placeholder credentials from CCCD-shaped
     digit strings (`001234567890`, `079198765432`) to plain usernames
     (`admin`, `testuser`), keeping the existing passwords. Confirmed via
     `grep -ri cccd src/features/auth/` (and repo-wide `src/`) that no
     other file references CCCD — the constraint was fully isolated to
     that one regex.
  2. **Wrote the missing openspec change** at
     `openspec/changes/login-username-password/` (status `done`, dated
     today) with `proposal.md` (Why/What changes/Out of scope/Decision
     log), `specs/login.md` (4 requirements — username/password auth,
     server-side session gate, session display & logout, remember-me —
     each with GIVEN/WHEN/THEN scenarios), `design.md` (approach, affected
     layers & files table, verification plan), and `tasks.md` (all boxes
     checked, matching the "already shipped" nature of the work it
     documents).
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass (structure, lint,
  typecheck, harness tests, unit tests, build, quality thresholds).
  Also ran `pnpm dev` and drove the app with `agent-browser`: logged in
  with both new test users (`admin`/`password123`, `testuser`/`testpass1`)
  — success, avatar shown, redirected off `/login`; logged out via the
  avatar menu both times — session cleared, redirected to `/login`;
  submitted a 2-character username — inline "Tên đăng nhập phải có ít
  nhất 3 ký tự" validation error, no request sent; submitted the *old*
  CCCD test value `001234567890`/`password123` — now rejected as "Sai tên
  đăng nhập hoặc mật khẩu" (invalid credentials, not a format error),
  confirming the CCCD-only constraint is genuinely gone and it's just an
  arbitrary string that doesn't match a test user; visited `/` directly
  with no session — redirected to `/login`.
- **Decisions made:** kept the username rule at a plain `min(3)` rather
  than inventing a new regex/charset restriction to replace the old one —
  the point of the change was fewer constraints, not a differently-shaped
  hidden one. Left `session-keys.js`, `api/login.js`, `api/session.js`,
  `hooks/use-login-form.js`, `hooks/use-session.js`, `components/login-form.jsx`,
  `components/user-menu.jsx`, and `src/app/(protected)/layout.jsx`
  untouched — none contained CCCD-specific logic (already fully generic).
- **Next step:** none pending. Known follow-ups intentionally left out of
  scope (see `proposal.md`'s "Out of scope"): swapping the mock
  `api/login.js`/`config/test-users.js` for a real backend once one
  exists, and `components/user-menu.jsx`'s `Avatar name={username}`
  showing the raw username rather than a derived display name.

---

## 2026-08-07 21:45 — Claude Code

- **Active change:** repo-wide, not scoped to the login feature — (1) React
  component files renamed `.js` → `.jsx`, (2) VSCode ESLint auto-fix-on-save
  config fixed (branch `feature/login`, no `openspec/changes/` entry —
  direct per user request: "Fix eslint khi dùng vscode save không auto fix
  và react component phải dùng *.jsx").
- **Task worked:**
  1. **`.jsx` rename**: scanned every `.js` under `src/` for actual JSX
     syntax (not JSDoc generics like `Record<string, string>`, which false-
     positive on a naive `<[A-Za-z]` grep — e.g. `use-login-form.js` and
     `theme.js` have angle-bracket JSDoc/comments but no real JSX, so they
     stayed `.js`). 37 files genuinely render JSX and got `git mv`'d to
     `.jsx`: every `page.js`/`layout.js` under `src/app/` (Next.js resolves
     these by filename convention regardless of extension — no import
     references anywhere needed updating for those), plus every component
     under `src/features/*/components/` and `src/shared/components/`
     (including the `mdx/*.js` callouts and `src/mdx-components.js`, also
     convention-resolved by `@next/mdx`, not imported). Then fixed every
     *explicit* `import .../.js'` reference to a renamed file (barrels like
     `features/*/index.js`, cross-component imports like `showcase-
     section.js` from the design-system sections, `mdx-components.js`'s
     imports of the mdx callouts) — found via a targeted grep per renamed
     basename, not a blind sed, since several basenames collide across
     directories (`post-list.js` exists in both `features/blog/` and
     `features/tutorial/`; every `page.js` collides across routes) and a
     naive global rename would have silently pointed one feature's import
     at the wrong file.
     - **Made it mechanical, not just a one-time cleanup**: added a new
       `eslint.config.mjs` rule block (`react/jsx-filename-extension`,
       `{extensions: ['.jsx']}`, scoped to `src/**/*.js`) so a future PR
       that adds JSX to a `.js` file fails lint instead of silently
       reintroducing the mix — matches `AGENTS.md`'s "every convention
       must map to a lint rule" requirement. Documented the convention in
       `openspec/project.md` (Naming bullet) and refreshed the stale `.js`
       filenames in `docs/architecture.md`'s inventory section.
  2. **VSCode ESLint config**: removed `"eslint.useFlatConfig": true` from
     `.vscode/settings.json` — deprecated now that flat config
     (`eslint.config.mjs`) is auto-detected by the ESLint extension;
     leaving it set is a plausible source of the extension silently
     misbehaving depending on installed extension version. Changed
     `"editor.codeActionsOnSave"`'s `"source.fixAll.eslint"` value from
     `"explicit"` to `true` for broader VSCode-version compatibility
     (`"explicit"` needs VSCode ≥ 1.74; `true` degrades everywhere).
     Left `eslint.validate: ["javascript", "javascriptreact"]` as-is — it
     was already correct (VSCode maps `.jsx` files to the
     `javascriptreact` languageId by built-in association regardless of
     what extension a file used before, so this wasn't actually broken by
     the old `.js`-for-everything convention).
- **Result:** done for what's fixable from repo files. Could NOT verify
  the actual "does autosave now fix" behavior — that requires a live
  VSCode session with the ESLint extension installed and enabled, which
  isn't available in this environment. If it's still not firing after
  these changes, the next things to check are outside repo config: the
  ESLint extension installed/enabled for this specific workspace (VSCode
  can have it disabled per-workspace independent of `extensions.json`
  recommendations), and the "ESLint" output channel (View → Output →
  ESLint) for a startup error.
- **Verification:** `./harness/verify.sh` — full pass, including a real
  `next build` (confirms every renamed `page.jsx`/`layout.jsx` still
  resolves as a route and every fixed import resolves). Also ran `pnpm dev`
  and drove the app with `agent-browser`: `/login` renders and validates,
  logging in redirects to `/` with the full shell + avatar, and `/blog`,
  `/tutorial`, `/design-system` all still render their real content — not
  just a passing build.
- **Decisions made:** kept `page.js`/`layout.js` base filenames but with
  `.jsx` extension (`page.jsx`, `layout.jsx`) rather than inventing
  alternate names — matches Next.js's own convention (`pageExtensions` in
  `next.config.mjs` already listed `'jsx'`) and needed zero config changes
  there. Did not rename `src/shared/components/theme.js` despite the
  grep false-positive (`<Note>` in a comment) — confirmed by hand it has
  no real JSX.
- **Next step:** none pending. Ask the user to confirm autosave-fix now
  works in their actual VSCode session — the repo-side fix is done but
  unverifiable from here.
- **Blockers:** none

---

## 2026-08-07 21:30 — Claude Code

- **Active change:** stop the login form's copy from revealing the
  username is a CCCD (branch `feature/login`, no `openspec/changes/`
  entry — direct follow-up per user request: "username không cần biết đó
  là căn cước công dân hay là tên đăng nhập"). User had already hand-edited
  `components/login-form.js` (label → "Tên đăng nhập", placeholder →
  "Nhập tên đăng nhập", dropped the subtitle text, heading → "ĐĂNG NHẬP")
  before this session picked the task back up.
- **Task worked:** the underlying rule is unchanged — the field still must
  be a 12-digit CCCD (that requirement came from the very first ask in
  this feature and wasn't revisited) — only the *copy* changed, so nobody
  looking at the form can tell it's specifically a citizen-ID field:
  - `config/login-schema.js`: renamed `CCCD_PATTERN` → `USERNAME_PATTERN`;
    error messages "Vui lòng nhập số căn cước công dân" / "Số căn cước
    công dân phải gồm đúng 12 chữ số" → generic "Vui lòng nhập tên đăng
    nhập" / "Tên đăng nhập không hợp lệ". Left a comment noting the
    12-digit regex is still CCCD-shaped internally, on purpose.
  - `api/login.js`: failure message "Sai số căn cước công dân hoặc mật
    khẩu" → "Sai tên đăng nhập hoặc mật khẩu".
  - `components/login-form.js`: removed the now-unused `Text` import
    (dead after the user's edit dropped the subtitle `<Text>` that used
    it) — lint would have caught this on the next `verify.sh` run anyway.
  - Left `config/test-users.js` as-is — its comments already don't
    mention CCCD, and the sample values are just data.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass. `agent-browser`:
  `/login` shows "Tên đăng nhập" (not CCCD wording) with a generic
  required-field error on empty submit; logging in with an existing
  `test-users.js` credential (still a 12-digit value, business rule
  unchanged) still succeeds and redirects to `/`.
- **Decisions made:** kept the actual 12-digit validation — the user asked
  to hide *that it's a CCCD*, not to drop the CCCD requirement itself.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 21:20 — Claude Code

- **Active change:** move the app shell (top nav / side nav / footer) out
  of the root layout and into `src/app/(protected)/layout.js` (branch
  `feature/login`, no `openspec/changes/` entry — direct follow-up per
  user request: "layout app shell cũng tương tự, chỉ xuất hiện khi đã
  login" — the shell was rendering on `/login` too, which shouldn't have
  any site chrome).
- **Task worked:** `src/app/layout.js` now only does `html`/`body` +
  `QueryProvider`/`ThemeProvider` + `{children}` — no `AppShell`, `Header`,
  `AppSideNav`, `Footer`, or `UserMenu` left in it. All of that moved into
  `src/app/(protected)/layout.js`, alongside the existing session-cookie
  redirect check from the 17:20 entry: on a valid session, it now renders
  `<AppShell topNav={<Header .../>} sideNav={<AppSideNav .../>}>{children}
  <Footer /></AppShell>` instead of returning `children` bare. `/login`
  stays outside this route group, so it renders directly under the root
  layout with zero chrome — just `LoginForm`'s own centered card.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass. `agent-browser`:
  `/login` now renders with no header/sidenav/footer at all (screenshot:
  just the centered login card on a blank page); logging in redirects to
  `/` and the full shell (top nav with avatar, side nav, footer) appears;
  clicking "Đăng xuất" clears the session and lands back on the bare
  `/login` page with the shell gone again.
- **Decisions made:** none beyond what's in "Task worked" above — this was
  a straightforward move of existing JSX, no new logic.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 17:20 — Claude Code

- **Active change:** make the login gate a *real* server-side block, not
  just a client-side redirect (branch `feature/login`, no `openspec/
  changes/` entry — direct follow-up). User verified independently that
  unauthenticated visitors could still read protected pages ("người dùng
  chưa đăng nhập vẫn có thể xem được các route khác") and confirmed via
  `curl` (this session, before fixing) that raw HTML — no JS needed — still
  contained full page content (e.g. `/blog`'s "Xin chào MDX" post). Root
  cause: the previous `AuthGuard` (2026-08-07 15:40 entry) only ran after
  React hydrated; Next.js Server Components render full protected-page HTML
  regardless of client auth state, so it was always sent, just hidden late.
- **Task worked:** the only way to stop protected HTML from ever being
  generated, without `middleware.js` (still off the table per the earlier
  explicit rejection), is a server-side check in a layout using
  `cookies()`/`redirect()` — confirmed this is acceptable with the user
  first (`AskUserQuestion`) since it's still Next-specific server code, just
  not the dedicated middleware feature.
  - Moved every route except `/login` into a route group:
    `src/app/(protected)/{page.js, blog/, tutorial/, design-system/}` (was
    directly under `src/app/`). Route groups don't affect the URL — `/`,
    `/blog`, etc. are unchanged — they just let `/login` opt out of the new
    layout. Fixed each moved file's relative import depth (+1 level).
  - New `src/app/(protected)/layout.js` — `async`, `await cookies()`, and
    `redirect('/login')` if the access-token cookie is missing, before
    `{children}` (the actual page) ever renders. This is what makes it
    real: `redirect()` during server rendering means the child Server
    Component's body — and therefore the data/markup it would produce —
    never executes at all.
  - **Session storage moved from `localStorage` to cookies**
    (`src/features/auth/api/session.js`, `config/session-keys.js` +
    `SESSION_COOKIE_MAX_AGE_SECONDS`) — `cookies()` in
    `next/headers` can only read what the browser sends with the request;
    localStorage is invisible server-side. Cookies are plain (non-httpOnly,
    client-`document.cookie`-written) since there's still no backend to
    issue a real `Set-Cookie` — same mock-only caveat as before, now
    documented directly on `writeSession`.
  - **Removed `AuthGuard`** entirely (component + its export from
    `index.js`) — with the server layout blocking unauthenticated requests
    before any protected route ever renders, the old client-side redirect
    (and the spinner-flash / hydration-race workaround it needed, see the
    15:40 entry) is now dead weight, not defense in depth: Next.js reruns
    the dynamic `(protected)/layout.js` check on every navigation to a
    route under it (calling `cookies()` forces dynamic rendering for that
    whole subtree), including client-side `<Link>` navigations, so the
    server check alone covers hard reloads *and* in-app navigation.
    `src/app/layout.js` now renders `{children}` directly.
  - `src/features/auth/index.js` now exports the plain `ACCESS_TOKEN_KEY`
    string constant (not a function) for the protected layout to import —
    kept the cookie-reading/redirect logic itself inline in
    `(protected)/layout.js` rather than in a feature `api/` helper, since a
    helper re-exported through the feature's public `index.js` risks
    pulling `next/headers` (server-only) into the same module graph
    `UserMenu` (a Client Component) imports from — a plain string constant
    is safe in any bundle.
  - `hooks/use-session.js` — dropped the now-meaningless `storage` event
    listener (that event only ever fired for `localStorage`, which nothing
    uses anymore); kept only the custom `kt-xnk-session-change` same-tab
    signal from `api/session.js`.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass (route-group
  restructure didn't break `structure`/`typecheck`/`build`). Then the
  actual regression check that mattered: `curl` (no JS, no browser) against
  every protected route with no cookie — `/`, `/blog`, `/tutorial`,
  `/design-system` all `307` to `/login` with **no page content in the
  body** (confirmed `/login`'s own page reads `HTTP/1.1 200` with no
  cookie). Then `agent-browser`: fresh session, direct nav to `/blog` →
  server-redirected to `/login` before any content painted; logged in with
  a `test-users.js` credential → redirected to `/blog`, cookies present;
  hard reload stayed on `/blog` (no flash, since there's no client guard
  left to race); avatar menu → "Đăng xuất" → cookies cleared, redirected to
  `/login`; re-requesting `/blog` after logout → `307` again, both via
  `agent-browser` and a follow-up `curl`.
- **Decisions made:**
  - Cookie value is only checked for *presence*, not verified (no
    signature/expiry check) — matches the mock/test-data phase (the login
    mock itself doesn't issue real JWTs yet, so there's nothing to verify
    against). Confirmed via `curl -H "Cookie: kt-xnk-access-token=fake"` —
    any value currently passes. Flagged here, not fixed, since real
    verification needs a real backend-issued token; noted in "Next step"
    below along with the other JWT-integration seams from the 15:40 entry.
  - Left `/login` outside any route group (didn't create a `(public)`
    group for symmetry) — only routes that need the extra layout benefit
    from being grouped; `/login` needs nothing extra beyond the root
    layout, so adding a group for it would just be an empty wrapper.
- **Next step:** when a real backend exists, `(protected)/layout.js`'s
  presence-only check should become a real verification (signature +
  expiry, or a call to a backend "whoami"/introspection endpoint) — same
  seam noted in the 15:40 entry for `api/login.js`/`api/session.js`.
- **Blockers:** none

---

## 2026-08-07 15:40 — Claude Code

- **Active change:** gate every route behind login (branch `feature/login`,
  no `openspec/changes/` entry — direct follow-up per user request "tất cả
  các route đều yêu cầu đăng nhập mới có thể sử dụng"). User also asked for
  an avatar + "Đăng xuất" (logout) menu in the top nav, explicitly rejected
  a Next.js `middleware.js`-based gate ("I do not like nextjs middleware,
  because I will depend to nextjs framework"), and flagged that the real
  backend will eventually issue a JWT access + refresh token pair.
- **Task worked:** client-side route gating (no `src/middleware.js`) —
  `src/features/auth/components/auth-guard.js` wraps `{children}` in
  `src/app/layout.js`; renders `children` unconditionally on `/login`,
  otherwise a `Spinner` fallback + `router.replace('/login?next=...')` if
  `api/session.js`'s `readAccessToken()` is `null`. Session storage is
  `localStorage`, JWT-shaped ahead of the real backend:
  `config/session-keys.js` (`kt-xnk-access-token`/`kt-xnk-refresh-token`/
  `kt-xnk-session-username`), `api/session.js` (`readAccessToken`,
  `readSessionUsername`, `writeSession`, `clearSession` — commented as the
  seam a real backend replaces, with the refresh token specifically flagged
  as needing to become an `httpOnly` cookie the backend sets, not something
  client JS writes). `types/index.js`'s `LoginResult` is now a discriminated
  union (`LoginSuccess | LoginFailure`) so `accessToken`/`refreshToken` are
  required-when-`success`, not optional. `api/login.js`'s mock now returns
  mock opaque tokens on success instead of a bare boolean.
  `hooks/use-session.js` — `useSession()` via `useSyncExternalStore`
  (`isAuthenticated`, `username`, `logout()`). `hooks/use-login-form.js` —
  on success, `writeSession(...)` then `router.replace(next ?? '/')`
  (dropped the old `isSuccess` banner state, since the page navigates away
  immediately now). `components/user-menu.js` — `Popover` (custom `Avatar`
  trigger, no built-in trigger slot on `DropdownMenu` for that) +
  `DropdownMenuItem` "Đăng xuất"; renders `null` when logged out. Composed
  in `src/app/layout.js` (not `src/shared/components/header.js`) because
  `src/shared/` is structurally forbidden from importing `src/features/`
  (`harness/structure.rules.cjs`) — `header.js` only grew a generic
  `endContent` prop passed through to `TopNav`, staying feature-agnostic.
  `src/app/login/page.js` wraps `LoginForm` in `<Suspense>` since
  `useSearchParams()` (for reading `?next=`) now flows through it.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass, including
  `structure` (confirms `header.js` has zero `src/features/` imports).
  Browser-tested via `agent-browser`, not just curl: fresh session, `/` and
  `/blog` both redirect to `/login?next=...`; logging in with a
  `test-users.js` credential redirects straight to the original `next`
  path; top nav shows an avatar; clicking it opens the "Đăng xuất" menu;
  logging out clears the session and redirects to `/login`; revisiting `/`
  redirects back to login again (confirms the guard re-engages, not just
  that the click handler ran).
- **Decisions made:**
  - **Middleware pivot:** first drafted this with `src/middleware.js`
    (server-side, no flash-before-redirect); the user explicitly rejected
    it as unwanted framework coupling. Rebuilt as a pure client `AuthGuard`
    instead. **Known, accepted tradeoff:** Next.js Server Components still
    render full protected-page HTML regardless of client auth state — an
    unauthenticated visitor's browser paints that HTML for a brief moment
    before hydration/JS redirects. There is no server-side gate anymore;
    this was a deliberate choice, not a missed bug.
  - **Real bug caught by browser-testing, not by `verify.sh`:** the first
    `AuthGuard` cut the redirect effect on the `isAuthenticated` value
    captured at render time. On a hard reload of an *already-authenticated*
    page, `useSyncExternalStore`'s first hydration-safe render always
    returns the server-safe "logged out" default (it has to match the
    server, which can't see `localStorage`) and only self-corrects on the
    next render — but the effect tied to that first render already fired
    and navigated to `/login` before the correction landed, permanently
    bouncing a logged-in user. Fixed by having the effect re-read
    `readAccessToken()` directly at the moment it runs, instead of trusting
    the closed-over render-time value — decouples the "should I redirect"
    decision from the transient hydration mismatch. `pnpm run
    <lint/typecheck/structure>` never would have caught this; only
    exercising an actual hard reload while logged in did.
  - **Avatar popover, same-tab reactivity, and a click double-toggle bug**
    (both also only caught by clicking through the real page, not by
    `verify.sh`):
    1. `DropdownMenu`'s trigger is always its own internal `Button` (no
       custom-trigger slot per its `.d.ts`) — used `Popover` with a custom
       `Avatar` trigger instead (`Avatar`'s `onClick` prop is documented to
       render it as a real `<button>`, satisfying `Popover`'s "trigger must
       contain a button" requirement) plus a standalone `DropdownMenuItem`
       (confirmed via its `.d.ts`, not the possibly-stale printed docs
       table, that it does accept `onClick`).
    2. First pass: the avatar never appeared after login even though
       `writeSession()` ran. Cause: `UserMenu`/`Header` live in the
       persistent `layout.js` tree, which the Next.js App Router does not
       re-render on a same-route-tree client navigation (`/login` →
       `/blog`) — so its `useSyncExternalStore` subscription never got
       asked again. The native `storage` DOM event only fires in *other*
       tabs, never the tab that wrote the value. Fixed by having
       `api/session.js` dispatch a custom `kt-xnk-session-change` window
       event on every `writeSession`/`clearSession`, and `use-session.js`
       subscribes to that alongside `storage`.
    3. Second pass: clicking the avatar opened and closed the popover in
       the same click (net no-op). Cause: `Popover` already
       `addEventListener('click', ...)`s the trigger button it finds
       inside `children` — my own `onClick={() => setIsOpen(...)}` on
       `Avatar` was a *second*, independent listener on the same click, so
       both toggles fired and canceled out. `Popover`'s own doc comment
       ("the popover finds it and applies click/keydown handlers... 
       automatically") says as much — should have trusted that instead of
       also wiring a manual toggle. Fixed: `Avatar`'s `onClick` is now a
       no-op (still needed so `Avatar` renders as a `<button>` at all —
       required per its own props doc — but `Popover` owns all the actual
       toggle logic).
- **Next step:** none pending. When a real backend exists: replace
  `api/login.js`'s body with a real `fetch`, add `api/refresh.js` for
  token rotation, and change `writeSession`'s refresh-token write to
  instead trust an `httpOnly` `Set-Cookie` from the backend (delete the
  client-side write for that one field).
- **Blockers:** none

---

## 2026-08-07 15:10 — Claude Code

- **Active change:** login page (branch `feature/login`, no `openspec/changes/`
  entry — direct per user request). Requirements: username (must be a
  Vietnamese CCCD — citizen ID), password, "remember me" checkbox; no
  registration; validate with `zod`; submit against test data only (no auth
  backend exists yet).
- **Task worked:** new `src/features/auth/` feature (`types`, `config`,
  `api`, `hooks`, `components`, public `index.js`) per the feature-based
  layer rules. `config/login-schema.js` — zod schema, CCCD regex `^\d{12}$`,
  password min length 6 (placeholder pending a real backend policy).
  `config/test-users.js` — 2 hardcoded test credentials, explicitly commented
  as placeholder-only. `api/login.js` — mocked `login()` with a ~500ms
  delay, checks against `test-users.js`; this is the seam to replace with a
  real backend `fetch` call later. `hooks/use-login-form.js` — form state +
  zod `safeParse` → per-field `status` for `TextInput`; on success, persists
  username to `localStorage` when "remember me" is checked.
  `components/login-form.js` — Astryx-only UI (`Center`/`VStack`/`Card`/
  `Heading`/`Banner`/`TextInput`/`CheckboxInput`/`Button`), modeled on the
  scaffolded `astryx template login` reference. New route
  `src/app/login/page.js`; added "Đăng nhập" to `navLinks` in
  `src/shared/config/site.js` for reachability. Added `zod` to
  `dependencies` (`pnpm add zod`, none of the existing deps provided it).
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  and drove the real page via `agent-browser` (not just curl): empty submit
  shows both zod field errors, malformed CCCD/short password each show
  their specific message, wrong-but-valid-format credentials show the error
  `Banner`, and correct `test-users.js` credentials succeed. Screenshots in
  this session's scratchpad.
- **Decisions made:** hit a real hydration bug while browser-testing
  "remember me": seeding `useState` from `localStorage` via a lazy
  initializer (guarded by `typeof window`) is fine for the username *text*
  value (React silently corrects `value` mismatches) but Astryx's
  `CheckboxInput` checked state is not corrected — Next.js logged "A tree
  hydrated but some attributes... This won't be patched up" and the box
  stayed visually unchecked even though local state was `true`. Fixed by
  switching to `useSyncExternalStore` (server snapshot `''`, client snapshot
  reads `localStorage`) as the source of the remembered username, with
  separate local override state for `username`/`rememberMe` so the user can
  still freely edit the fields — this is the React-sanctioned pattern for
  values that legitimately differ between server and client and avoids both
  the hydration mismatch and the `react-hooks/set-state-in-effect` lint
  error a plain `useEffect` + `setState` approach hit first. Worth
  remembering for any future "prefill a controlled input from
  browser-only storage" work in this repo.
  Deliberately did not add `react-hook-form` or any form library — the form
  is small enough that zod + a single hook covers it, and no other feature
  uses one yet.
- **Next step:** when a real auth backend exists, replace `api/login.js`'s
  body with a real call (keep the same `login(values): Promise<LoginResult>`
  signature so `hooks/`/`components/` don't need to change) and delete
  `config/test-users.js`.
- **Blockers:** none

---

## 2026-08-07 01:56 — Claude Code

- **Active change:** `openspec/changes/feature-based-architecture/` —
  replace the 6-layer backend-shaped architecture
  (`types→config→repo→service→runtime→ui`) with a feature-based front-end
  architecture, per explicit user direction: this repo is confirmed
  front-end only, backend lives in a separate project.
- **Task worked:** all 5 milestones in `tasks.md`. Moved
  `src/ui/hero.js` → `src/features/home/components/hero.js`;
  `src/app/design-system/{showcase-section.js,sections/*.js}` →
  `src/features/design-system/components/`; `src/ui/{header,footer,theme,
  theme-provider}.js`, `src/config/{site.js,site.test.js}`,
  `src/types/index.js` → `src/shared/{components,config,types}/`. Added a
  public `index.js` per feature. Rewrote `harness/structure.rules.cjs`
  around `types→config→api→hooks→components` (per-tree, feature or
  shared), plus new rules `no-feature-to-feature` (isolation),
  `no-shared-to-feature`, `no-deep-feature-imports` — same
  backreference technique the old `no-deep-domain-imports` rule already
  used. Rewrote `harness/tests/structure-rules.test.cjs` fixtures to
  exercise every rule (old fixtures hardcoded the dead layer names, would
  have silently stopped testing anything meaningful). Updated
  `docs/architecture.md`, `openspec/project.md`, `AGENTS.md` (trimmed, not
  re-duplicated — matches its own "map not manual" rule),
  `harness/GOLDEN_RULES.md` (v1→v2), `harness/quality-grades.json`; added
  `docs/adr/0003-feature-based-architecture.md`. Fixed the theme
  build/gitignore wiring for the new `src/shared/components/theme.js`
  path and the two remaining `src/ui/theme.js` text references inside the
  design-system showcase page's own Blockquote/CodeBlock copy.
- **Result:** done. `pnpm run structure` and `pnpm test:harness` pass
  against both the real migrated `src/` and the new violation fixtures.
- **Verification:** `./harness/verify.sh` — full pass (project-readiness,
  memory-secrets, theme-build, lint, typecheck, structure, harness-tests,
  unit-tests, build, quality-thresholds). See
  `harness/runs/20260807-015558-33202/`. Also ran `pnpm dev` and curled
  `/` and `/design-system` directly — both 200, both contain real
  rendered content ("KT-XNK", "Design system"), not an error boundary.
- **Decisions made:** dropped `repo`/`service`/`runtime` entirely rather
  than renaming them — they're backend concepts with no backend in this
  repo. `api`/`hooks` replace them (client calls to the external backend
  project / client-side state) — see decision log in `proposal.md` and
  ADR-0003. Features are **fully isolated** (no cross-feature imports at
  all, not just "public-surface only") since neither current feature
  (`home`, `design-system`) has a legitimate reason to depend on the
  other; revisit if a future feature genuinely needs another's public
  surface. Did not create empty `api/`/`hooks/` folders anywhere — same
  placeholder-free philosophy the old `repo/service` had, add on first
  real need. Did not touch the hardcoded example hex colors in
  `content.js`'s `THEME_SNIPPET` (a pre-existing, separately-flagged
  issue from an earlier session — only its file-path references were
  updated since the file itself moved). Left the change in
  `openspec/changes/` rather than archiving it.
- **Next step:** none pending for this change. First feature that needs
  to call the separate backend project should add `api/` (and `hooks/` if
  it needs client state) under that feature — or `src/shared/api|hooks`
  if more than one feature needs it — following the pattern in
  `docs/architecture.md`.
- **Blockers:** none

---

## 2026-08-07 00:14 — Claude Code

- **Active change:** upgrade `@astryxdesign/core`/`theme-neutral`/`cli`
  0.2.0 → 0.3.0 (no `openspec/changes/` entry — direct per user request)
- **Task worked:** `pnpm add @astryxdesign/core@0.3.0
  @astryxdesign/theme-neutral@0.3.0` then `@astryxdesign/cli@0.3.0`
  (`@latest` silently kept resolving 0.2.0 — pinned the exact version
  instead of digging into why). Approved `@astryxdesign/cli`'s postinstall
  build script in `pnpm-workspace.yaml` after reading it first (same
  print-only nudge pattern as `core`'s, verified 2026-08-06 — never
  mutates files). Ran the sanctioned migration path instead of assuming
  compatibility: `pnpm exec astryx upgrade --from 0.2.0` (dry run) listed
  10 codemods spanning v0.2.1→v0.3.0 and reported "No changes needed —
  your code is already up to date!"; `--apply` confirmed the same and
  additionally refreshed the `<!-- ASTRYX:START/END -->` version stamp in
  `AGENTS.md`/`CLAUDE.md` (154→155 components, v0.2.0→v0.3.0) — diffed
  before committing, only the stamp changed.
- **Result:** done. `package.json` bumped to `^0.3.0` for all three
  packages; `pnpm-lock.yaml` updated; no application code changed (the
  codemods had nothing to do).
- **Verification:** `pnpm theme:build` (rebuilt cleanly on 0.3.0),
  `./harness/verify.sh` — full pass. Also ran `pnpm dev` and curled both
  `/` and `/design-system`, grepping for `astryx-button`/`astryx-dialog`/
  `astryx-table`/`astryx-heading` classes and scanning for error markers
  in the response — confirmed real runtime output on 0.3.0, not just a
  passing build. See `harness/runs/20260807-001356-26089/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 00:08 — Claude Code

- **Active change:** swap which brand hue is MD3 `primary` vs `secondary`
  (no `openspec/changes/` entry — direct per user request: red as the
  dominant accent read too harsh/glaring across filled surfaces like
  inputs and primary buttons)
- **Task worked:** regenerated the MD3 tonal palette with the seeds
  swapped — teal `#247768` is now the `primary` seed, red `#c2252a` is now
  `secondary` (tertiary re-derived at +60° from the new primary hue;
  error stays its own standalone seed, unaffected). Same CIE Lab
  generation method as before, all AA contrast pairs re-verified.
  - `src/ui/theme.js`: `--color-accent` (and accent-muted/on-accent/
    text-accent/icon-accent) now `#126a5c` (teal, was `#b91a24` red). The
    `variant:secondary` Button override now uses the *new* secondary
    (red) container pair (`#fddbd5`/`#3e0500`, was the old teal
    container).
  - Updated copy that named the old mapping: `/design-system` intro text,
    the Button and Link section descriptions in
    `src/app/design-system/sections/actions.js`, and the Color convention
    bullet in `openspec/project.md`.
- **Result:** done.
- **Verification:** `pnpm theme:build` then `./harness/verify.sh` — full
  pass. Rebuilt CSS confirmed to contain `#126a5c`/`#fddbd5`, and curled
  the running `/design-system` page's compiled CSS to confirm the same
  values ship in what actually renders (not just what's in source). See
  `harness/runs/20260807-000807-24222/`.
- **Decisions made:** kept `--color-error` as its own standalone red seed
  (`#b3261e`) rather than aliasing it to the new secondary red — error
  states shouldn't move if someone later re-tunes the secondary brand hue
  independently.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 00:01 — Claude Code

- **Active change:** expand `/design-system` from a 6-component sample into
  a broad Astryx component showcase (no `openspec/changes/` entry — direct
  per user request "tạo tất cả các component có thể")
- **Task worked:** Astryx ships 154 components (`pnpm exec astryx
  component --list`). Looked up real prop signatures for ~55 of them via
  the `xds` MCP server (not guessed) and split the single `page.js` into
  `src/app/design-system/sections/*.js` (one file per category:
  typography, actions, forms, selection, feedback, overlays,
  data-display, content) plus a shared `showcase-section.js` wrapper, so
  no single file got unmanageable. `page.js` now just composes the 8
  section components.
  - Covered: Heading, Text, Button/ButtonGroup/IconButton/ToggleButton,
    Link, TextInput/TextArea/NumberInput/Selector/MultiSelector/RadioList/
    FileInput/Slider, CheckboxInput/CheckboxList/Switch, TabList/
    SegmentedControl, Banner/Toast/ProgressBar/Skeleton/Spinner/StatusDot/
    EmptyState, Dialog/AlertDialog/Popover/Tooltip/HoverCard/DropdownMenu,
    Badge/Card/ClickableCard/SelectableCard/Avatar/AvatarGroup/Table/List/
    Pagination/Token/Timestamp/Citation/Kbd, Divider/Breadcrumbs/Icon/
    Blockquote/CodeBlock/AspectRatio/Collapsible.
  - Explicitly NOT covered (noted in the page's own intro text, not
    silently dropped): Chat family, PowerSearch, Calendar, DateInput
    family, Carousel, Lightbox, TreeList, ContextMenu, MoreMenu, Markdown
    — each needs either external data/backend wiring or enough surface
    area to warrant its own follow-up rather than a rushed demo.
  - Overlay demos (Dialog/AlertDialog/Popover) are real controlled
    open/close via `useState`, not the docs' `isInline` preview escape
    hatch — clicking the trigger buttons actually opens a modal.
  - `AspectRatio`'s example uses the project's real
    `public/images/logo-dn-group.png` instead of a placeholder/remote
    image.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass after fixing 3 real
  issues caught by the gate (not guessed): `AvatarGroup` is exported from
  `@astryxdesign/core/AvatarGroup`, not bundled into `.../Avatar` as the
  groupMembers listing implied; `Selector`'s `value` type is `string |
  null`, not `string | undefined`; ESLint's `react-hooks/purity` rule
  correctly flagged a `Date.now()` call inside JSX render (non-deterministic
  during render) — replaced with a fixed ISO timestamp. Also ran `pnpm dev`
  and curled `/design-system`, grepping the HTML for `astryx-*` class names
  across every section to confirm real DOM output, not just a passing
  build (`DropdownMenu`'s popup class legitimately doesn't appear
  server-rendered — it's portal-based and only mounts on open).
- **Decisions made:** organized sections by Astryx's own component
  grouping (Actions/Forms/Feedback/Overlays/Data display/Content) rather
  than alphabetically — matches how someone would actually look something
  up.
- **Next step:** if the excluded components (Chat, Calendar, etc.) are
  needed later, look them up fresh via `xds` the same way — this entry's
  list of what's missing may drift as Astryx ships new versions.
- **Blockers:** none

---

## 2026-08-06 23:49 — Claude Code

- **Active change:** revert the `turbopack.root` pin from the entry below —
  it fixed a cosmetic warning but caused a fatal Turbopack crash (no
  `openspec/changes/` entry — direct per user request, pasted a crash log)
- **Task worked:** user hit, after a few successful requests then an HMR
  update: `FATAL: An unexpected Turbopack error occurred` /
  `Resource path "projects/work/code/kt-xnk/src/app/layout.js" needs to be
  on project filesystem ""` (missing the `/home/capybara/` prefix — a
  path-resolution bug). Trace pointed at `WebpackLoadersProcessedAsset`,
  i.e. Babel-loader-processed files specifically (this project uses
  `babel.config.js` for the StyleX plugin, so every file StyleX touches
  goes through that path). Traced it to the previous session's
  `turbopack.root: import.meta.dirname` pin in `next.config.mjs`.
- **Result:** reverted that one line. The Turbopack root-inference warning
  is back (harmless, cosmetic) — chose it over a crash that broke HMR for
  any Babel-processed file.
- **Verification:** deleted `.next`, ran `pnpm dev`, confirmed clean
  `200`s. Specifically re-tested the exact failure mode: edited
  `src/app/layout.js` (the file named in the panic) while dev was running,
  confirmed `✓ Compiled in 14ms` with no panic, reverted the edit, same
  result again on the second HMR cycle. `./harness/verify.sh` — full pass.
  See `harness/runs/20260806-234938-20047/`.
- **Decisions made:** don't re-attempt pinning `turbopack.root` without
  first confirming Next.js/Turbopack has actually fixed this interaction —
  it's a known-bad combination in `v16.2.11`, not something to retry as-is.
- **Next step:** none pending. If the warning becomes annoying enough to
  revisit, the safer fix is probably removing the stray
  `/home/capybara/pnpm-lock.yaml` (outside this repo) rather than touching
  `turbopack.root` again.
- **Blockers:** none

---

## 2026-08-06 23:43 — Claude Code

- **Active change:** commit the `astryx init` agent-doc block + fix a
  Turbopack root-inference warning (no `openspec/changes/` entry — direct
  per user request)
- **Task worked:**
  1. User ran `pnpm exec astryx init` themselves (I'd deliberately avoided
     running it earlier — see 2026-08-06 22:02 entry). It appended a
     `<!-- ASTRYX:START/END -->` CLI cheat sheet to both `AGENTS.md` and
     `CLAUDE.md`, purely additive, nothing existing removed — reviewed the
     diff before committing.
  2. `pnpm dev` was warning on every run: "Next.js inferred your workspace
     root... Detected additional lockfiles: /home/capybara/pnpm-lock.yaml".
     This repo sits inside `/home/capybara`, which has its own unrelated
     pnpm lockfile one level up, confusing Turbopack's root inference. Set
     `turbopack.root: import.meta.dirname` in `next.config.mjs` to pin it
     explicitly.
  3. Running `verify.sh` after the `astryx init` commit surfaced a real
     harness bug (see "Harness gaps" above): `project-readiness.sh`'s
     placeholder regex matched an angle-bracket CLI-argument token in the
     Astryx cheat sheet's `astryx template ... [--skeleton]` line. Fixed
     the check rather than editing the tool-generated block (which would
     just get overwritten by a future `astryx upgrade`/re-init).
- **Verification:** `./harness/verify.sh` — full pass. Sanity-checked the
  `project-readiness.sh` fix didn't just neuter the whole check: temporarily
  added one of the scanner's real placeholder tokens to
  `openspec/project.md` and confirmed the script still caught it (exit 1)
  before reverting. Confirmed the Turbopack warning is gone by re-running
  `pnpm dev` and reading the log. See `harness/runs/20260806-234349-17147/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-06 23:36 — Claude Code

- **Active change:** finish wiring MD3 brand colors into Astryx's core
  token set + build a `/design-system` showcase page (no
  `openspec/changes/` entry — direct per user request "làm nốt... rồi tạo
  1 page có full component")
- **Task worked:**
  1. Expanded `src/ui/theme.js` tokens from 7 → 18: added
     `--color-accent-muted`/`--color-on-accent` (MD3 primaryContainer/
     onPrimary), `--color-text-accent`/`--color-icon-accent` (MD3 primary —
     these were silently defaulting to theme-neutral's dark gray, not our
     brand red, for Link text and accent icons), `--color-background-popover`
     (MD3 surfaceContainerHigh), `--color-icon-primary`/`--color-icon-secondary`
     (MD3 onSurface/onSurfaceVariant), `--color-border-emphasized` (MD3
     outline), and `--color-error`/`--color-on-error`/`--color-error-muted`
     (MD3 error/onError/errorContainer — this is what `Button
     variant="destructive"` actually reads, confirmed via
     `node_modules/@astryxdesign/core/dist/astryx.css`).
     Deliberately did NOT touch `--color-success`/`--color-warning` (kept
     universal green/amber), the 10 categorical tag colors
     (`--color-*-blue/cyan/.../yellow`), or structural tokens
     (`--color-neutral`, `--color-overlay*`, `--color-skeleton`,
     `--color-track`, `--color-shadow`, `--color-tint-hover`) — none of
     these are brand identity; overriding them would just be surprising.
  2. New page `src/app/design-system/page.js` — a live component
     reference, not content: Heading (all 6 levels), Text (5 types × 4
     colors), Button (4 variants × sizes/disabled/loading), Badge (5
     semantic + 9 category variants), Card (default/muted/transparent),
     Link (internal + external). Added to nav
     (`src/config/site.js` → `navLinks`) as "Design System" so it's
     reachable, not just a dev-only route.
  3. `jsconfig.json`'s `tsc --noEmit --checkJs` needed the variant arrays
     annotated with `/** @type {('a'|'b'|...)[]} */` JSDoc — Astryx's
     prop types are string-literal unions, and mapping over a bare
     `string[]` fails typecheck (caught by `./harness/verify.sh`, not
     guessed).
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  in the background and curled `/design-system`: confirmed all 6
  `<h1>`–`<h6>` render, and `astryx-button {primary,secondary,ghost,
  destructive}` / `astryx-badge {neutral,info,success,warning,error,blue,
  cyan,green,orange,pink,purple,red,teal,yellow}` classes all present in
  the HTML. See `harness/runs/20260806-233604-14883/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** if a future page needs Form components (Input, Select,
  Checkbox, etc.) or Layout/AppShell, check `node_modules/@astryxdesign/core`
  + `xds` MCP the same way before adding to the showcase page — don't
  assume a component exists without checking its export path first (bit
  us twice already: `LinkProvider` wasn't at the path the docs implied,
  and `Theme`/`defineTheme` live at `./theme`, not `./Theme`).
- **Blockers:** none

---

## 2026-08-06 22:19 — Claude Code

- **Active change:** wire MD3 `secondary` brand color into Astryx `Button`
  (no `openspec/changes/` entry — small follow-up, done directly per user
  question "if I have a primary/secondary button, what happens?")
- **Task worked:** verified (by reading `node_modules/@astryxdesign/core`
  source, not guessing) that Astryx's `Button` `variant` prop is an
  emphasis level, not a brand hue: `variant="primary"` resolves to
  `--color-accent` (our brand red, already wired), but `variant="secondary"`
  resolves to `--color-neutral` (a generic gray) — our brand teal
  (`#247768` / MD3 `secondary`) was not connected to anything.
- **Result:** done. Added a `components.button` override to
  `src/ui/theme.js`'s `defineTheme()` call:
  `'variant:secondary': { backgroundColor: '#a1f2df', color: '#00201a' }`
  (MD3 `secondaryContainer`/`onSecondaryContainer` — the same tonal-button
  pairing MD3 itself uses for "branded but lower emphasis than primary").
  Confirmed the compiled `theme.built.css` contains
  `.astryx-button.secondary { background-color: #a1f2df; ... }` — no
  Button component code touched.
- **Verification:** `./harness/verify.sh` — full pass after
  `pnpm theme:build`. See `harness/runs/20260806-221857-12220/`.
- **Decisions made:** used `secondaryContainer`/`onSecondaryContainer`
  (light tonal fill) rather than solid `secondary`/`onSecondary` — matches
  Astryx's own intent that `variant="secondary"` stays lower-emphasis than
  `variant="primary"`; a solid teal would read as equally weighted.
- **Next step:** if `tertiary`/`error` MD3 roles need a home later,
  Astryx's own token vocabulary is much richer than the 7 tokens in
  `theme.js` (grep `node_modules/@astryxdesign/core/dist/astryx.css` for
  `--color-success`, `--color-warning`, `--color-error`,
  `--color-background-teal`, etc.) — check there before inventing a new
  `components` override.
- **Blockers:** none

---

## 2026-08-06 22:10 — Claude Code

- **Active change:** switch from runtime `defineTheme()` to a pre-built
  Astryx theme (no `openspec/changes/` entry — small follow-up to the
  Astryx migration above, done directly per user request after they pasted
  a `pnpm dev` log showing Astryx's own perf warning)
- **Task worked:** `pnpm dev` was logging: `Theme: "kt-xnk" is using
  runtime style injection. For better performance, use the pre-built
  theme... run 'npx @astryxdesign/cli theme build <file>'`. Ran
  `astryx theme build src/ui/theme.js -o src/ui/theme.built.css`, which
  generates `src/ui/kt-xnk.js` (built theme object), `src/ui/kt-xnk.d.ts`,
  and `src/ui/theme.built.css` (static CSS) next to the source file.
- **Result:** done. `src/ui/theme-provider.js` now imports the built
  `ktXnkTheme` from `./kt-xnk.js` + `./theme.built.css` instead of calling
  runtime `defineTheme()` directly (`src/ui/theme.js` stays as the
  hand-edited *source* the build command reads — not deleted).
  - Generated files are gitignored (`.gitignore`), not committed — they're
    fully deterministic output of `src/ui/theme.js`.
  - Added `"theme:build"` npm script (the exact `astryx theme build`
    command) and made `dev`/`build` run it first
    (`"dev": "pnpm theme:build && next dev"`, same for `build`).
  - `harness/verify.sh` runs `theme:build` as its own step, before
    `lint`/`typecheck`/`structure` — those all resolve the `./kt-xnk.js`
    import, so on a fresh clone (gitignored files absent) they'd fail
    without this step running first.
- **Verification:** deleted the generated files, ran
  `./harness/verify.sh` clean from that state — full pass (theme-build
  step regenerated them before lint/typecheck ran). Also ran `pnpm dev` in
  the background and grepped its log: no more "runtime style injection"
  warning. See `harness/runs/20260806-221048-11148/`.
- **Decisions made:** gitignore + rebuild-on-every-run over committing the
  generated files — keeps `src/ui/theme.js` the single source of truth and
  makes staleness (someone edits `theme.js`, forgets to rebuild, commits
  mismatched CSS) mechanically impossible instead of relying on a reviewer
  to notice.
- **Next step:** none pending.
- **Blockers:** none

## Discovered (backlog — do NOT act on these mid-task)

- No `src/repo`/`src/service` code yet — the site is fully static. Add real
  structural tests for those layers once a first feature needs them.

---

## 2026-08-06 22:02 — Claude Code

- **Active change:** migrate UI to real `@astryxdesign/core` components (no
  `openspec/changes/` entry — direct per user request; project.md already
  said "UI built via the Astryx MCP server" but the app had never actually
  installed/used the package, only hand-rolled markup — user flagged this
  gap)
- **Task worked:** install `@astryxdesign/core` + `@astryxdesign/theme-neutral`
  (deps) and `@astryxdesign/cli` (devDep); wire the MD3 palette from the
  previous entry into Astryx via `defineTheme`; replace hand-written
  `header.js`/`footer.js`/`hero.js` with real Astryx components
  (`TopNav`/`TopNavHeading`/`TopNavItem`, `Section`, `Heading`/`Text`).
- **Result:** done.
  - `src/ui/theme.js` — `defineTheme({name: 'kt-xnk', tokens: {...}})`
    mapping our MD3 role values onto Astryx's CSS-custom-property token
    names (`--color-accent`, `--color-background-body`,
    `--color-background-surface`, `--color-background-card`,
    `--color-text-primary`, `--color-text-secondary`, `--color-border`).
    Single string values only (no `[light, dark]` tuples) since the project
    stays light-only.
  - `src/ui/theme-provider.js` — client component wrapping the app in
    `<LinkProvider component={NextLink}>` (so Astryx `href`s route through
    `next/link`) and `<Theme theme={ktxnkTheme} mode="light">`. Wired into
    `src/app/layout.js` around `<Header>`/`{children}`/`<Footer>`.
  - `src/app/globals.css` — added `@import` for
    `@astryxdesign/core/reset.css`, `@astryxdesign/core/astryx.css`, and
    `@astryxdesign/theme-neutral/theme.css` (baseline before our
    `defineTheme` override); removed the hand-rolled `box-sizing`/`body`
    reset now that Astryx's reset owns it (avoids unlayered CSS silently
    overriding `astryx-base`, per Astryx's Cascade Layer Safety guidance).
  - Deleted `src/ui/container.js` and `src/ui/tokens.stylex.js` — both had
    zero remaining consumers once header/footer/hero moved to Astryx
    components (verified with grep before deleting, same as the
    `colors`-token cleanup in the previous entry).
  - Package install needed one manual step: `pnpm-workspace.yaml` had a
    stub `allowBuilds: '@astryxdesign/core': set this to true or false` —
    read `@astryxdesign/core`'s postinstall script first (it only prints a
    "run `astryx init`" nudge when no agent-doc marker is found; never
    mutates files) before setting it to `true`.
  - Did **not** run `npx astryx init` — it can rewrite `AGENTS.md`/
    `CLAUDE.md`, which this repo treats as the curated single operating
    manual; a human should review that separately before letting the CLI
    touch those files.
  - Updated `openspec/project.md` (Tech stack + Conventions): components
    now come from `@astryxdesign/core`, not hand-rolled markup; StyleX is
    scoped to the `xstyle` escape hatch for one-off layout only; colors
    are sourced from `src/ui/theme.js`, not a StyleX token file.
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  against the actual page and inspected the rendered HTML/CSS: confirmed
  `data-astryx-theme="kt-xnk" data-theme="light"` on the root wrapper,
  `<header><nav aria-label="Điều hướng chính">` from `TopNav`, and
  `#b91a24` (MD3 `primary`) present in the compiled CSS chunk. See
  `harness/runs/20260806-220202-9426/`.
- **Decisions made:** used Astryx's simpler common token set
  (`--color-accent`/`--color-background-*`/`--color-text-*`/`--color-border`)
  rather than trying to force all ~30 MD3 roles into Astryx CSS vars —
  Astryx's own token vocabulary is coarser than MD3's; mapped only the
  tokens Astryx actually documents. `Section`/`TopNav` don't expose an `as`
  prop, so kept native `<header>`/`<footer>` wrappers around them for
  landmark semantics.
- **Next step:** if a future page needs Buttons, Cards, or form fields,
  pull them from Astryx (`xds` MCP) the same way — don't hand-roll. If the
  team decides they do want `astryx init`'s AGENTS.md/CLAUDE.md agent
  prompt, run it in its own reviewed change, not bundled with UI work.
- **Blockers:** none

---

## 2026-08-06 21:44 — Claude Code

- **Active change:** rename/expand color tokens to Material Design 3 roles
  (no `openspec/changes/` entry — small token-only edit done directly per
  user request)
- **Task worked:** replace the ad-hoc `colors` token set in
  `src/ui/tokens.stylex.js` with the full Material Design 3 light-scheme
  role set (`primary`/`onPrimary`/`primaryContainer`/`onPrimaryContainer`,
  same pattern for secondary/tertiary/error, plus `surface*`,
  `outline`/`outlineVariant`, `inverse*`, `shadow`/`scrim`); update the 3
  components that consumed the old names (`hero.js`, `footer.js`,
  `header.js`: `colors.text`→`onSurface`, `colors.textMuted`→
  `onSurfaceVariant`, `colors.border`→`outlineVariant`).
- **Result:** done. Tonal palettes generated in CIE Lab space (tone = L*,
  hue/chroma held from seed) from the existing brand seeds (`#c2252a` red,
  `#247768` teal) plus a derived tertiary (`#7d6a02`, +60° hue rotation) and
  a standalone error seed (`#b3261e`). All on-color pairings verified ≥
  4.5:1 (WCAG AA). Dark-scheme values were also generated for reference but
  NOT added to the codebase — project stays light-only per existing
  convention; dark values live only in the reference artifact from this
  session.
- **Verification:** `./harness/verify.sh` — full pass (lint, typecheck,
  structure, harness-tests, unit-tests, build, quality-thresholds). See
  `harness/runs/20260806-214453-7411/`.
- **Decisions made:** dropped the old `primaryHover`/`primaryActive`/
  `primarySurface`/`secondaryHover`/`secondaryActive`/`secondarySurface`/
  `success`/`warning`/`danger`/`info`/`borderStrong`/`textOnPrimary`/
  `textOnSecondary` tokens — grepped first, confirmed none were referenced
  anywhere in `src/`, so no aliasing/back-compat shim was needed. Updated
  the "Color" convention bullet in `openspec/project.md` to point at the
  MD3 role-naming rule instead of the old ad-hoc names.
- **Next step:** none pending. If a future component needs elevation
  (cards, sheets), the `surfaceContainer*` roles are already defined but
  unused — reach for those before inventing a new surface tone.
- **Blockers:** none
- `verify:quality` only checks bundle size; no p95 latency metric yet (no
  backend to measure).

---

## 2026-07-25 11:20 — Claude Code

- **Active change:** color system for the project (no `openspec/changes/`
  entry — small token-only edit done directly per user request)
- **Task worked:** derive a full color palette in `src/ui/tokens.stylex.js`
  from the brand logo (`public/images/logo-dn-group.png`)
- **Result:** done. Sampled exact logo pixels via PowerShell
  `System.Drawing` (node had no image lib available): primary red
  `rgb(194,37,42)` / `#c2252a`, secondary teal `rgb(36,119,104)` / `#247768`.
  Replaced the old placeholder `accent`/`accentText` tokens (unused anywhere
  in `src/`) with: neutrals (`background`, `surface`, `border`,
  `borderStrong`, `text`, `textMuted`, `textOnPrimary`, `textOnSecondary`),
  `primary`/`primaryHover`/`primaryActive`/`primarySurface`,
  `secondary`/`secondaryHover`/`secondaryActive`/`secondarySurface`, and
  semantic `success`/`warning`/`danger`/`info`. All white-on-color pairings
  verified ≥ 4.5:1 contrast (WCAG AA) via a small luminance-ratio script.
- **Verification:** `./harness/verify.sh` — `structure` passed; `lint`,
  `typecheck`, `harness-tests`, `unit-tests`, `build`, `quality-thresholds`
  all failed on `ERR_PNPM_BAD_PM_VERSION` (repo pins pnpm 11.5.3, local pnpm
  is 9.0.6) — a pre-existing environment issue, unrelated to this change and
  not fixed here (didn't want to touch global tooling without asking).
- **Decisions made:** `success` aliases `secondary` (teal), `danger` aliases
  `primary` (brand red) rather than inventing new hues — kept the palette
  minimal. Only one genuinely new value added: `warning` (`#b45309` amber).
  Documented the "colors only from tokens.stylex.js" rule in
  `openspec/project.md` Conventions so future agents don't hardcode hex.
- **Next step:** whoever picks up next real UI work should run
  `corepack use pnpm@11.5.3` (or equivalent) before relying on
  `./harness/verify.sh` results.
- **Blockers:** none

---

## 2026-07-24 23:30 — Claude Code

- **Active change:** initial project bootstrap (no `openspec/changes/` entry
  yet — done directly per user request, not through the change workflow)
- **Task worked:** scaffold Next.js (JS, App Router) + StyleX + ESLint on top
  of the OpenSpec harness template
- **Result:** done
- **Verification:** `./harness/verify.sh` → run after `npm install`; see
  `harness/runs/<latest>/` for evidence
- **Decisions made:** JavaScript only (no TypeScript app code; `typescript`
  kept as a devDependency purely for `tsc --noEmit --checkJs` typechecking of
  JS via `jsconfig.json`). Light theme only — no dark-mode variant. `src/app`
  plays the routing/wiring role of `runtime` and is exempt from the six-layer
  dependency-cruiser rules (matches `docs/architecture.md`).
- **Next step:** open an `openspec/changes/` proposal (per the `_template/`
  folder) for the next real feature instead of ad-hoc edits.
- **Blockers:** none

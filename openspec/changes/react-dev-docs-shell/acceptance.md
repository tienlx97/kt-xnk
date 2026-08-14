# Acceptance: React.dev Docs Copycat

**Accepted:** 2026-08-14, after typography re-audit
**Reference:** local `../react.dev` clone
**Route fixture:** `/docs/gio-lam-viec`

## Runtime breakpoint evidence

All screenshots use a 1000px viewport height. The versioned contract is
protected by `src/shared/components/docs-shell-contract.test.js`; replayable
images are under `harness/runs/20260814-react-dev-docs-shell-acceptance/`.

| Width | Navigation mode | Main geometry | TOC | Horizontal overflow |
|---:|---|---|---|---:|
| 374 | 48px mobile toggle; overlay closed | x=0, width=374 | hidden | 0 |
| 640 | 48px mobile toggle; overlay closed | x=0, width=640 | hidden | 0 |
| 768 | 48px mobile toggle; overlay closed | x=0, width=768 | hidden | 0 |
| 1024 | SideNav x=0, width=320 | x=320, width=704 | hidden | 0 |
| 1280 | SideNav x=0, width=320 | x=320, width=960 | hidden | 0 |
| 1536 | SideNav x=0, width=320 | x=320, width=1216 | x=1216, width=320 | 0 |
| 1919 | SideNav x=0, width=320 | x=320, width=1599 | x=1599, width=320 | 0 |
| 2048 audit | SideNav x=0, width=320 | x=320, width=1728 | x=1728, width=320 | 0 |

Additional boundary checks confirmed a 64px sticky header; 20px content inset
below 640px and 48px from 640px; a 56rem PageHeading/prose axis inside an
80rem body; and matching PageHeading/prose horizontal axes at wide widths.

## Typography evidence

The initial acceptance incorrectly covered geometry without pinning the full
upstream type scale. Task 4.3 re-audited the local clone's `tailwind.config.js`,
`pages/_document.tsx`, `MDX/Heading.tsx`, `MDX/Intro.tsx`, Sidebar, TOC,
Breadcrumbs, Button, callout, code-block, figure, and Footer sources. Runtime
computed styles now match the relevant upstream values:

| Role | Font size | Line height | Weight |
|---|---:|---:|---:|
| Page/MDX H1 | 40px | 50px | 700 |
| MDX H2 | 28px | 40px | 700 |
| MDX H3 | 24px | 36px | 700 |
| MDX H4 | 20px | 36px | 700 |
| MDX H5 | 17px | 36px | 700 |
| Article body | 17px | 30px | 500 |
| Intro | 20px | 32.5px | 500 |
| Callout title | 24px | 30px | 700 |
| SideNav parent/selected route | 15px | 30px | 700 |
| SideNav nested unselected route | 13px | 30px | 500 |
| SideNav section label | 13px | 30px | 700 |
| TOC link | 13px | 19.5px | 400/700 by state |
| Breadcrumb | 13px | 30px | 700 |
| Copy action | 13px | 16.25px | 700 |
| Code block | 13.6px | 24px | 400 |
| Footer copyright | 11px | 30px | 500 |

Computed-style screenshots for 390px and 1536px are under
`harness/runs/20260814-react-dev-docs-shell-typography/`. A source contract
pins these values so later Astryx token changes cannot silently change the
react.dev-parity type scale.

## Interaction and accessibility evidence

- Mobile navigation opens as a full-height overlay, moves focus into the
  overlay, locks body scrolling, and restores focus/scroll state when closed.
- The overlay closes through its close control, Escape, route navigation, and
  resizing across the 1024px desktop boundary.
- SideNav disclosures preserve semantic buttons, active links, keyboard focus,
  and inert closed descendants.
- TOC highlighting follows the fixed-header offset and selects the final item
  at page end.
- MDX callouts, disclosures, figures, media, headings, links, quotes, and code
  use semantic local elements; the tested callout renders as
  `aside[role=note]`.

## Intentional differences from react.dev

- KT-XNK logo, teal/red theme, authentication, Vietnamese labels, routes, and
  company-authored content replace React product branding and controls.
- The implementation stays on Next.js App Router, JavaScript, StyleX, and MDX
  3 instead of copying the upstream Pages Router, TypeScript, Tailwind, and MDX
  2 plumbing.
- React-specific search, language/theme/GitHub controls, interactive learning
  widgets, trademarks, and page content remain out of scope.

These differences do not change the required shell region geometry,
visibility thresholds, sticky behavior, mobile navigation lifecycle, content
widths, or navigation state.

## Mechanical verification

- `./harness/verify.sh`: passed after each completed task.
- Final pre-handoff evidence is recorded by task 4.2 in
  `harness/PROGRESS.md`.
- Unit/API/source-contract suite covers MDX discovery, frontmatter, heading
  IDs, TOC, width grouping, registry parity, semantic MDX UI, shell geometry,
  breakpoint boundaries, active navigation, and TOC selection.

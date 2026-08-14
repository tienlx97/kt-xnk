# Acceptance: React.dev Docs Copycat

**Accepted:** 2026-08-14  
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

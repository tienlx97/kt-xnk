# Proposal: React.dev Docs Copycat

**Status:** complete
**Created:** 2026-08-14

## Why

The documentation experience already borrows individual patterns from
react.dev, but its shell is still mediated by Astryx `AppShell` and its MDX
pipeline does not reproduce react.dev's content-width composition. This makes
the result close in isolated screenshots without having one durable contract
for navigation, responsive layout, and MDX authoring.

This change ports the react.dev documentation experience as a coherent system.
"Copycat" means rendered layout and interaction parity at the agreed viewport
widths, while retaining this repository's Next.js App Router, JavaScript,
StyleX, authentication, brand, routes, and Vietnamese content.

## What changes

- Replace Astryx shell primitives in the protected documentation frame with
  semantic local components styled by StyleX.
- Port react.dev's 64px TopNav, 20rem desktop SideNav, content frame, 20rem TOC
  rail, sticky behavior, mobile navigation overlay, and scroll locking.
- Adopt react.dev's exact responsive thresholds: 374, 640, 768, 1024, 1280,
  1536, and 1919px.
- Port the useful MDX authoring contract: component registry, heading anchors,
  frontmatter, TOC, `MaxWidth` prose grouping, and explicit full-width
  interruption points.
- Preserve App Router and MDX 3 server rendering instead of copying the
  upstream Pages Router serialization/evaluation implementation verbatim.
- Add mechanical layout/MDX tests and browser evidence at representative
  breakpoint boundaries.

Acceptance measurements, intentional differences, and verification evidence
are recorded in `acceptance.md`.

## Out of scope

- Switching to the Pages Router, TypeScript, Tailwind, or MDX 2.
- Copying React trademarks, React branding, page content, search service,
  language picker, theme switcher, or GitHub controls.
- Removing authentication or changing KT-XNK's route/data model.
- Rebuilding non-documentation pages to look like react.dev.
- Requiring Astryx UI inside the TopNav, SideNav, documentation content shell,
  TOC, or MDX authoring components covered by this change.

## Definition of 100% parity

- **Required:** the same region geometry, visibility thresholds, sticky/fixed
  behavior, mobile drawer behavior, content widths, padding, and navigation
  state as the corresponding react.dev documentation shell.
- **Adapted:** colors use KT-XNK theme variables and controls display KT-XNK
  brand/auth content while occupying the same layout roles.
- **Not required:** identical source code, DOM class names, framework plumbing,
  third-party search, or React-specific product controls.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-14 | Name the change `react-dev-docs-shell` and the feature "React.dev Docs Copycat". | The name identifies the visual reference while making the affected product surface explicit. |
| 2026-08-14 | Ignore Astryx UI for this entire scoped shell, not only `useMDXComponents`. | Astryx wrapper geometry and mobile state prevent a deterministic 1:1 port; the user explicitly requested this exception. |
| 2026-08-14 | Target output/behavior parity, not byte-for-byte implementation parity. | react.dev uses Next 15 Pages Router, TypeScript, Tailwind, MDX 2, Babel evaluation, and JSON tree revival; KT-XNK must remain Next 16 App Router, JavaScript, StyleX, and MDX 3. |
| 2026-08-14 | Preserve brand, auth, routes, and Vietnamese content. | These are product requirements, not styling details from the reference implementation. |
| 2026-08-14 | Retain upstream MIT notices in any substantially copied source file. | react.dev's implementation is MIT-licensed and attribution must survive source adaptation. |
| 2026-08-14 | Reopen acceptance for an exact typography audit. | Runtime review found that geometry was pinned but the upstream 17px body and 40/28/24/20/17px heading scale had not been mechanically enforced. |

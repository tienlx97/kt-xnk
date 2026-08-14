# Proposal: React.dev MDX components parity

**Status:** in-progress
**Created:** 2026-08-15

## Why

The current Docs shell matches react.dev, but its MDX registry implements only
a subset of the pinned upstream `MDXComponents`. Entries such as diagrams,
console blocks, challenges, Sandpack, lifecycle callouts, cards, inline TOC,
and terminal UI remain classified as planned or omitted. The user now requires
the complete upstream authoring surface rather than a product-specific subset.

## What changes

- Port every key exported by the pinned local
  `../react.dev/src/components/MDX/MDXComponents.tsx` registry.
- Match upstream DOM semantics, visible structure, responsive geometry,
  accessibility, and interaction behavior; translate Tailwind/CSS modules to
  StyleX and TypeScript to JavaScript.
- Retain Next.js App Router, MDX 3, KT-XNK theme CSS variables, routes, and
  Vietnamese content.
- Keep the complete registry tree free of Astryx imports.
- Preserve upstream MIT attribution in substantially adapted source modules.
- Add fixtures and mechanical parity tests so every registry key is rendered
  or interaction-tested rather than merely present in an object.

## Out of scope

- Switching to the Pages Router, TypeScript, Tailwind, or MDX 2.
- Byte-for-byte source parity where framework plumbing differs.
- Shipping placeholders that only satisfy registry-name tests.
- Editing `openspec/archive/`.

## Definition of 100% parity

- Every upstream registry key exists locally with the same public authoring
  name and compatible props.
- Static components match upstream semantics, hierarchy, typography, spacing,
  responsive behavior, and states.
- Interactive components match keyboard, focus, disclosure, navigation, copy,
  challenge, console, and sandbox behavior.
- Adaptations are limited to JavaScript, App Router/MDX 3 integration, StyleX,
  local theme variables/assets, and KT-XNK product data.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-15 | Supersede the old supported/planned/omitted product subset with a complete registry contract. | The user explicitly requested 100% parity for `MDXComponents`. |
| 2026-08-15 | Keep behavior/output parity rather than copying framework plumbing verbatim. | The repository must remain Next.js App Router, JavaScript, StyleX, and MDX 3. |
| 2026-08-15 | Prohibit Astryx imports throughout the complete MDX component tree. | StyleX is the requested adaptation layer. |

# Design: React.dev MDX components parity

## Pinned source

- Registry: `../react.dev/src/components/MDX/MDXComponents.tsx`
- Component tree: `../react.dev/src/components/MDX/**`
- License: `../react.dev/LICENSE` (MIT)
- Existing inventory:
  `openspec/changes/react-dev-docs-shell/mdx-component-matrix.json`

## Adaptation map

| Upstream | Local contract |
|---|---|
| TypeScript | JavaScript with checked JSDoc |
| Tailwind/CSS modules | StyleX styles and local `tokens.stylex.js` |
| Pages Router query state | App Router pathname/search params or local event state |
| MDX 2 serialized context | MDX 3 component props and explicit local contexts |
| React product data | Compatible props backed by local data supplied by the author |
| Astryx | Prohibited in the complete MDX registry tree |

## Module boundaries

- `mdx-components.jsx` remains the public registry composition point.
- Static/server-safe components stay server-compatible.
- Interaction-heavy modules carry the smallest possible `'use client'`
  boundary and receive serializable props.
- Heavy code/sandbox dependencies load only for documents that render them.
- Shared icons are local SVG components; no Astryx icon/control substitutes.

## Verification strategy

1. Exact registry inventory test against the pinned upstream list.
2. Recursive no-Astryx source contract.
3. Server-render fixture for every static component family.
4. Browser interaction fixtures for disclosures, terminal copy, challenges,
   inline TOC, diagrams, and Sandpack.
5. Computed-style screenshots at 390px, 1024px, and 1536px.
6. Full `./harness/verify.sh` after every task.

## Resume protocol

Start with the first unchecked item in `tasks.md`. Do not mark a component as
ported until its real fixture and relevant behavior test pass. Update the old
matrix entry from planned/omitted to adapted only in the task that implements
it.

# Design: MDX sidebar navigation

## Approach

The Docs content API recursively scans `content/docs/**/*.mdx`, compiles trusted
repository content at build time, and derives static params, frontmatter, and
TOC data without a handwritten import registry. `AppSideNav` renders the
explicit JSON information architecture as a semantic `nav` route tree with
StyleX, following React Docs' `SidebarRouteTree` and `SidebarLink` behavior.
A group containing the current route starts expanded, while other groups start
collapsed and remain user-toggleable.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `src/shared/types/index.js` | Allow nested navigation links. |
| api | `src/features/docs/api/content.js` | Discover and compile trusted company MDX recursively. |
| UI | protected layout, shared side nav | Build and render expandable article navigation. |
| UI | shared header | Render a custom React Docs-derived 64px header with route-aware Tutorial and Blog pills, user actions, and a mobile menu trigger. |
| UI | protected layout | Use the React Docs 1024px navigation breakpoint and a 320px mobile drawer; remove the elevated content corner. |

## New dependencies

- `@mdx-js/mdx` — compile trusted repository MDX discovered outside the App
  Router tree, mirroring React Docs' build-time compiler model.

## Risks & mitigations

- Sidebar navigation could point to a removed file → a registry/content
  consistency test should remain part of the mechanical gate.
- A selected child could be hidden → active-route matching controls the parent's initial collapsed state.
- A custom navigation tree could regress keyboard or screen-reader behavior → parent disclosures use native buttons with `aria-expanded`/`aria-controls`, destinations remain native links, and the current destination exposes `aria-current="page"`.

## Verification plan (agreed BEFORE implementation — "sprint contract")

- [x] Tutorial and Blog can each be expanded and collapsed.
- [x] Their child links use MDX frontmatter titles and open the correct article.
- [x] The current article is selected and its parent section is expanded.
- [x] The sidebar renders without Astryx SideNav components while retaining semantic navigation and disclosure markup.
- [x] The header renders without Astryx TopNav components and adapts to a drawer below the React Docs desktop breakpoint.
- [x] `./harness/verify.sh` passes.

# Design: MDX sidebar navigation

## Approach

The protected server layout loads both existing post registries and maps their frontmatter titles and slugs into serializable child navigation links. `AppSideNav` implements a semantic `nav` route tree directly with StyleX, following React Docs' `SidebarRouteTree` and `SidebarLink` behavior instead of using Astryx SideNav components. A section containing the current route starts expanded, while other sections start collapsed and remain user-toggleable.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `src/shared/types/index.js` | Allow nested navigation links. |
| config/service | Existing tutorial and blog loaders | Reuse post metadata without a new content source. |
| UI | protected layout, shared side nav | Build and render expandable article navigation. |
| UI | shared header | Render a custom React Docs-derived 64px header with route-aware Tutorial and Blog pills, user actions, and a mobile menu trigger. |
| UI | protected layout | Use the React Docs 1024px navigation breakpoint and a 320px mobile drawer; remove the elevated content corner. |

## New dependencies

None.

## Risks & mitigations

- Sidebar metadata could drift from article lists → both consume the same existing loaders and frontmatter.
- A selected child could be hidden → active-route matching controls the parent's initial collapsed state.
- A custom navigation tree could regress keyboard or screen-reader behavior → parent disclosures use native buttons with `aria-expanded`/`aria-controls`, destinations remain native links, and the current destination exposes `aria-current="page"`.

## Verification plan (agreed BEFORE implementation — "sprint contract")

- [x] Tutorial and Blog can each be expanded and collapsed.
- [x] Their child links use MDX frontmatter titles and open the correct article.
- [x] The current article is selected and its parent section is expanded.
- [x] The sidebar renders without Astryx SideNav components while retaining semantic navigation and disclosure markup.
- [x] The header renders without Astryx TopNav components and adapts to a drawer below the React Docs desktop breakpoint.
- [x] `./harness/verify.sh` passes.

# Design: MDX sidebar navigation

## Approach

The protected server layout loads both existing post registries and maps their frontmatter titles and slugs into serializable child navigation links. `AppSideNav` renders links with children as collapsible `SideNavItem` parents. A section containing the current route starts expanded, mirroring React Docs' breadcrumb-driven expansion, while other sections start collapsed and remain user-toggleable.

## Affected layers & files

| Layer | Files | Change |
|---|---|---|
| types | `src/shared/types/index.js` | Allow nested navigation links. |
| config/service | Existing tutorial and blog loaders | Reuse post metadata without a new content source. |
| UI | protected layout, shared side nav | Build and render expandable article navigation. |

## New dependencies

None.

## Risks & mitigations

- Sidebar metadata could drift from article lists → both consume the same existing loaders and frontmatter.
- A selected child could be hidden → active-route matching controls the parent's initial collapsed state.

## Verification plan (agreed BEFORE implementation — "sprint contract")

- [x] Tutorial and Blog can each be expanded and collapsed.
- [x] Their child links use MDX frontmatter titles and open the correct article.
- [x] The current article is selected and its parent section is expanded.
- [x] `./harness/verify.sh` passes.

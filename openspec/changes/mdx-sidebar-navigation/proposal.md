# Proposal: MDX sidebar navigation

**Status:** done
**Created:** 2026-08-13

## Why

Tutorial and Blog currently appear as flat links, so readers cannot discover or move directly to individual MDX articles from the sidebar. The navigation should expose the content hierarchy in the same expandable parent/child pattern used by the React documentation.

## What changes

- Make Tutorial and Blog expandable sidebar items.
- Populate article routes from recursively discovered MDX files; keep sidebar
  hierarchy explicit in the React Docs-style JSON registry.
- Expand the active section and select the current article.
- Render the sidebar with a custom React Docs-inspired route tree instead of Astryx SideNav components.
- Expose Tutorial and Blog as React Docs-style pill links in the top navigation.
- Replace Astryx TopNav with a custom responsive header derived from React Docs' source structure.
- Highlight the current MDX section in the table of contents while the reader scrolls, following React Docs' `useTocHighlight` behavior.
- Provide React Docs' `Intro` lead-text component to MDX authors using the local Astryx typography system.
- Refine the reusable MDX `Note` callout with React.dev's visual hierarchy,
  adapted to the KT-XNK theme and server-rendered component model.

## Out of scope

- Changing MDX content, routes, or the article table of contents.
- Recreating React Docs outside the sidebar navigation.
- Adding a content-management system.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-13 | Use Astryx `SideNavItem` nesting and collapse support | It is the project's supported hierarchical navigation primitive. |
| 2026-08-13 | Replace Astryx SideNav primitives with a semantic custom route tree | The requested UI should follow React Docs' sidebar behavior and visual structure directly. |
| 2026-08-14 | Discover and compile Docs MDX recursively | File creation/deletion must not require maintaining a second slug/import registry. |

# Proposal: MDX sidebar navigation

**Status:** done
**Created:** 2026-08-13

## Why

Tutorial and Blog currently appear as flat links, so readers cannot discover or move directly to individual MDX articles from the sidebar. The navigation should expose the content hierarchy in the same expandable parent/child pattern used by the React documentation.

## What changes

- Make Tutorial and Blog expandable sidebar items.
- Populate their nested links from MDX frontmatter and the existing post registries.
- Expand the active section and select the current article.
- Render the sidebar with a custom React Docs-inspired route tree instead of Astryx SideNav components.
- Expose Tutorial and Blog as React Docs-style pill links in the top navigation.
- Replace Astryx TopNav with a custom responsive header derived from React Docs' source structure.

## Out of scope

- Changing MDX content, routes, or the article table of contents.
- Recreating React Docs outside the sidebar navigation.
- Adding a content-management system or automatic filesystem scanning.

## Decision log

| Date | Decision | Why |
|---|---|---|
| 2026-08-13 | Use Astryx `SideNavItem` nesting and collapse support | It is the project's supported hierarchical navigation primitive. |
| 2026-08-13 | Replace Astryx SideNav primitives with a semantic custom route tree | The requested UI should follow React Docs' sidebar behavior and visual structure directly. |

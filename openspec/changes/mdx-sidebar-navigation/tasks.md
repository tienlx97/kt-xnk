# Tasks: MDX sidebar navigation

## 1. Expandable content navigation

- [x] 1.1 Add nested Tutorial and Blog links backed by MDX metadata — verify: both groups toggle, route correctly, and expose the active article.
- [x] 1.2 Run the full quality gate and record evidence — verify: `./harness/verify.sh` passes.
- [x] 1.3 Make each collection parent row the full expand/collapse target — verify: parent items render as a single toggle instead of a split link and icon action.
- [x] 1.4 Add optional, divider-separated reference headings configured as `react@19.2`, `react-dom@19.2`, and `React Compiler`.
- [x] 1.5 Increase the project type scale to React Docs-like reading sizes through the theme typography configuration.
- [x] 1.6 Self-host and apply React Docs' Optimistic Text, Optimistic Display, and Source Code Pro families, including Vietnamese glyph subsets.
- [x] 1.7 Replace Astryx SideNav components with an accessible React Docs-inspired custom route tree.
- [x] 1.8 Keep optional reference headings disabled unless a consumer explicitly passes them to `AppSideNav`.
- [x] 1.9 Add React Docs-style Tutorial and Blog pill links to the top navigation with route-aware selection.
- [x] 1.10 Replace Astryx TopNav with a custom 64px desktop header and a 1024px mobile drawer breakpoint derived from React Docs.
- [x] 1.11 Match React Docs' navigation typography: 15px top-level UI, 13px nested sidebar and table of contents, with bold reserved for hierarchy and active states.
- [x] 1.12 Make the sidebar route-contextual: Blog routes show only Blog overview/articles, and Tutorial routes show only Tutorial overview/articles.
- [x] 1.13 Render the sidebar column and mobile drawer only for Tutorial and Blog route trees.

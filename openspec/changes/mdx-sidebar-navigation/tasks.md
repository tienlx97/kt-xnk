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
- [x] 1.14 Add expandable Nội quy and IT document groups with working MDX routes for every nested sidebar entry.
- [x] 1.15 Move company-authored MDX out of the component tree into `content/docs/{noi-quy,it}/` and keep static loading/build support intact.
- [x] 1.16 Replace the handwritten Docs slug/import registry with recursive filesystem discovery and trusted build-time MDX compilation modeled on react.dev.
- [x] 1.17 Replace the `/docs` list with a long MDX landing article that introduces both document groups and links to all 16 child pages.
- [x] 1.18 Apply React Docs' PageHeading composition to rendered MDX pages using KT-XNK typography/theme tokens, breadcrumbs, and a compact copy-link action.
- [x] 1.19 Match react.dev's responsive MDX content contract: 20/48px insets, max-w-4xl heading alignment, max-w-7xl body, and a 20rem TOC column appearing at 2xl.
- [x] 1.20 Correct the 2xl column hierarchy so PageHeading and the max-w-7xl body align within the main column while TOC remains an external 20rem sibling rail.
- [x] 1.21 Mirror react.dev's generated `MaxWidth` prose wrapper so ordinary MDX content and PageHeading share the same max-w-4xl alignment inside the max-w-7xl body frame.
- [x] 1.22 Apply a restrained brand-color hierarchy to MDX pages: accent PageHeading/section headings, underlined accent links, tinted quotes, and coordinated TOC/copy affordances.
- [x] 1.23 Refine MDX color semantics: return headings to neutral ink and reserve brand teal for breadcrumbs, links, emphasized text, TOC, and actions.
- [x] 1.24 Port react.dev's Breadcrumbs and TOC presentation—13px uppercase labels, chevron trail, sticky offsets, scroll rail, item spacing, nesting, and hover treatment—while retaining KT-XNK brand colors.
- [x] 1.25 Port react.dev's MDX Heading permalinks: keep h1 unlinked, expose a branded chain-link icon for h2-h6 on heading hover or keyboard focus, and apply header-safe anchor scroll margins.
- [x] 1.26 Match react.dev's inline SVG rendering for heading permalinks so the chain-link glyph aligns with the heading text baseline.
- [x] 1.27 Port react.dev's TOC scroll highlighting so the current visible MDX section receives the active background, accent text, and bold weight.
- [x] 1.28 Add React.dev's `Intro` to the shared MDX component map with Astryx `Text`, display typography, primary ink, and relaxed leading.
- [x] 1.29 Make MDX paragraphs nested inside `Intro` inherit its lead typography instead of resetting to the global body-text recipe.
- [x] 1.30 Derive Docs breadcrumbs from the sidebar hierarchy so each article shows its containing document group.
- [x] 1.31 Restyle the reusable MDX `Note` callout and apply it to the working-hours exception — verify: desktop/mobile browser evidence and the full quality gate.

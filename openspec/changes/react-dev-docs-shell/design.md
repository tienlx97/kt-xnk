# Design: React.dev Docs Copycat

## Reference baseline

The local clone at `../react.dev` is the pinned implementation reference. The
primary upstream files are:

| Concern | react.dev source | KT-XNK destination |
|---|---|---|
| Page grid and region visibility | `src/components/Layout/Page.tsx` | `src/shared/components/protected-app-shell.jsx` |
| Top navigation and mobile overlay | `src/components/Layout/TopNav/TopNav.tsx` | `src/shared/components/header.jsx`, shell state/hook |
| Sidebar route tree | `src/components/Layout/Sidebar/**` | `src/shared/components/side-nav.jsx` |
| Heading/content widths | `src/components/PageHeading.tsx`, `src/components/Layout/MaxWidth.tsx` | `mdx-page-heading.jsx`, `mdx-article.jsx`, MDX layout helpers |
| TOC rail | `src/components/Layout/Toc.tsx` | `table-of-contents.jsx` |
| MDX registry | `src/components/MDX/MDXComponents.tsx` | `mdx-components.jsx` |
| MDX tree preparation | `src/utils/prepareMDX.js` | App-Router-compatible MDX layout components |
| MDX compilation | `src/utils/compileMDX.ts` | `src/features/docs/api/content.js` |
| Responsive constants | `tailwind.config.js` | literal StyleX media conditions plus regression tests |

The source clone is an implementation reference, not a runtime dependency.

## Visual direction

This is a faithful port, so the reference design is the design plan. The
product-specific subject is internal Vietnamese company documentation; its
single job is to keep policy and technical guidance readable and navigable.
KT-XNK's teal/red brand and Optimistic Vietnamese font coverage remain, while
react.dev supplies the information architecture, spacing rhythm, and responsive
behavior. No new decorative signature is introduced because it would reduce
parity; the persistent three-rail reading system is the signature.

## Layout contract

```text
< 1024px
┌──────────── sticky TopNav: 64px ────────────┐
│ menu  brand                      user/menu  │
├─────────────────────────────────────────────┤
│ Content: 20px inset; 48px from 640px       │
└─────────────────────────────────────────────┘

1024px–1535px
┌──────────── sticky TopNav: 64px ────────────┐
├──── SideNav: 20rem ────┬──── Content ──────┤
│ sticky below header    │ max body: 80rem   │
│                        │ prose: 56rem       │
└────────────────────────┴────────────────────┘

>= 1536px
┌──────────── sticky TopNav: 64px ────────────┐
├──── 20rem ──────────────┬─ fluid ─┬─ 20rem ┤
│ SideNav                 │ Content │ TOC     │
└─────────────────────────┴─────────┴─────────┘
```

### Canonical breakpoints

| Name | Minimum width | Required behavior |
|---|---:|---|
| `xs` | 374px | Upstream compact navigation spacing becomes available. |
| `sm` | 640px | Content/PageHeading inline padding changes from 20px to 48px. |
| `md` | 768px | Reserved for upstream-equivalent content/footer refinements. |
| `lg` | 1024px | Mobile overlay disappears; 20rem sidebar column appears. |
| `xl` | 1280px | Reserved upstream-compatible navigation capacity. |
| `2xl` | 1536px | 20rem TOC rail appears; 56rem prose centers in the main column. |
| `3xl` | 1919px | Upstream wide-navigation brand treatment threshold. |

Media conditions are literal StyleX values. Astryx breakpoint aliases and
spacing tokens must not approximate these geometry values.

## Component and state architecture

```text
Protected layout (Server Component: auth + static data)
└── ProtectedAppShell (Client boundary: pathname + mobile state)
    ├── Header
    ├── desktop SideNav
    ├── mobile SideNav overlay
    └── main
        ├── route content / MdxArticle
        └── Footer
```

- Only shell state (`isMenuOpen`, pathname reactions, scroll shadow, body
  scroll lock) belongs in the client boundary.
- Page content and MDX compilation remain server-side. Avoid serializing live
  MDX data into the shell client component.
- No new dependency is needed for body locking: preserve the current body
  overflow value and compensate for scrollbar width, then restore both during
  cleanup. The implementation must also close at navigation and when crossing
  above the 1023px maximum mobile query.
- Use semantic `header`, `nav`, `aside`, `main`, `article`, `footer`, `ul`, and
  `button` elements. StyleX is the only styling system in this scope.

## MDX compatibility approach

The upstream compile pipeline cannot be copied literally because it assumes
Pages Router data functions, MDX 2, Babel CommonJS evaluation, and a custom
React-tree JSON transport. The compatible port keeps MDX 3 `evaluate` and App
Router Server Components, then recreates the externally visible contract:

1. Parse frontmatter and generate deterministic heading IDs/TOC.
2. Provide the same category of authoring mappings through
   `useMDXComponents`.
3. Introduce a local `MaxWidth` layout primitive matching `max-w-4xl ms-0
   2xl:mx-auto`.
4. Make ordinary prose use that primitive and allow designated interactive or
   illustrative blocks to interrupt it at the 80rem body width.
5. Keep heading links, callouts, figures, code and media accessible and
   server-rendered unless they specifically require browser state.

The first MDX milestone records and tests the contract before broadening the
component registry. This prevents a partial tree transformation from silently
changing existing authored pages.

## Affected layers and files

| Layer | Files | Change |
|---|---|---|
| shared hooks | new mobile shell hook if state cannot stay local | Mobile overlay lifecycle and body lock. |
| shared components | header, side-nav, protected shell, footer, MDX article/heading/TOC | Semantic StyleX port with no Astryx UI. |
| docs API | `src/features/docs/api/content.js` and tests | Preserve MDX 3 compilation; add tested parity behavior. |
| app wiring | protected layout/docs routes only if required | Keep auth and App Router boundaries. |
| harness | layout contract tests and browser evidence | Make "100%" measurable. |

## New dependencies

None planned. Any new dependency requires a decision-log entry and bundle
measurement before adoption.

## Risks and mitigations

- Existing uncommitted font/MDX-policy work overlaps project documentation →
  edit additively and stage only files belonging to this change.
- A client shell could pull server content into the client bundle → keep the
  client boundary shallow and pass children as opaque React nodes.
- Pixel claims can drift with content/logo differences → compare region
  geometry and use matched fixtures; separately document intentional brand
  substitutions.
- Literal StyleX media values can diverge across files → add a source-level
  breakpoint contract test that scans every scoped component.
- Mobile body locking can survive navigation/resize → require cleanup tests and
  browser checks for route change, close button, Escape, and desktop resize.
- MDX tree grouping can turn fragment roots into grid items → keep one explicit
  content-column wrapper and add a DOM/geometry regression test.

## Verification plan (sprint contract)

- [x] Unit tests cover active navigation, mobile disclosure behavior, TOC and
      MDX width grouping.
- [x] Source contract test asserts 64px header, 20rem rails, 56rem prose,
      80rem content, and all seven exact responsive thresholds.
- [x] At 390px the mobile menu opens as a full-height overlay, locks page
      scrolling, closes on selection/Escape, and has no horizontal overflow.
- [x] At 1024px the sidebar is visible as a 20rem column and mobile controls are
      absent.
- [x] At 1536px the TOC appears as a 20rem rail and prose centers in the main
      column without changing the PageHeading axis.
- [x] Screenshots are captured at 374, 640, 768, 1024, 1280, 1536, and 1919px,
      plus one 2048px wide audit.
- [x] `./harness/verify.sh` passes.

## Resume protocol

Always resume from the first unchecked item in `tasks.md`. Before editing,
read the newest `harness/PROGRESS.md` entry, inspect `git status`, and compare
the current destination file to the upstream file listed in the reference
table. Store each browser run under its own dated `harness/runs/` directory and
append the exact command, viewport, URL, and measured geometry to the progress
log. Never mark an item complete solely from code inspection.

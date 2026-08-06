# Project Context

<!-- Project-wide truth that outlives individual changes. Keep current. -->

## Purpose

KT-XNK website — a static/informational Next.js site. Target users: visitors
looking up company/product info. Success criteria: fast, light-themed, easy
to extend with new pages via the layered `src/` structure.

## Tech stack

- Language/runtime: JavaScript
- Framework: Next.js (latest, App Router) — UI built from real
  `@astryxdesign/core` components (looked up via the Astryx MCP server
  `xds`, https://astryx.atmeta.com/mcp), not hand-rolled markup
- Style: Astryx theme tokens (`src/ui/theme.js`) drive all color/spacing;
  StyleX is the sanctioned escape hatch for one-off layout overrides via the
  `xstyle` prop only — see `docs/stylex-installation.md` (build tool setup)
  and `docs/stylex-authoring.md` (style APIs, antipatterns)
- Theme: light only (no dark mode)
- Database: none yet — static site
- Testing: Node's built-in test runner (`node --test`)

## Architecture

Layered per OpenAI harness standard — see `docs/architecture.md` for the full map:

```
types → config → repo → service → runtime → ui
```

Enforced mechanically by structural tests in `./harness/verify.sh`
(dependency-cruiser config: `harness/structure.rules.cjs`). Violations fail the
build with messages that explain the fix.

## Conventions (linted, not aspirational)

- Naming: kebab-case files, camelCase functions, PascalCase React components
- Module boundaries: cross-domain imports only via each domain's `index.js`
- Errors: handled at boundaries (`src/runtime`, `src/app`); no empty catch
- Components: build UI from `@astryxdesign/core` primitives (`Section`,
  `TopNav`, `Text`, `Heading`, ...) — no hand-rolled `<div>`/`<nav>` markup
  where an Astryx component covers the case. Look up props/examples via the
  `xds` MCP server before writing a component from scratch.
- Styling: no inline `style`/`className`, no top-level media
  queries/pseudo-classes. Use StyleX (`xstyle` prop, see
  `docs/stylex-authoring.md` antipatterns) only for layout overrides Astryx
  props don't cover — never to re-implement colors or component chrome.
- Color: all colors come from Astryx theme tokens in `src/ui/theme.js`
  (`defineTheme` — `--color-accent`, `--color-text-primary`, etc.) — no
  hardcoded hex in components. `src/ui/theme.js` is the editable source;
  `pnpm theme:build` (runs automatically before `dev`/`build`/`verify`)
  compiles it via `astryx theme build` into gitignored, do-not-edit
  artifacts (`src/ui/kt-xnk.js`, `src/ui/kt-xnk.d.ts`,
  `src/ui/theme.built.css`) for static, non-runtime-injected CSS — see
  `theme-provider.js` for how they're wired into `<Theme>`. Token values
  follow Material Design 3 role naming/tone mapping internally
  (`primary`/`onPrimary`/`primaryContainer`/..., `surfaceVariant`,
  `outline` — see https://m3.material.io/styles/color/roles) before being
  mapped onto Astryx's CSS-custom-property token names. Palette is derived
  from the brand logo (`public/images/logo-dn-group.png`: primary red
  `#c2252a`, secondary teal `#247768`) expanded into MD3 tonal palettes;
  adding a new hue requires updating `src/ui/theme.js`, not inlining one
- Every convention here must map to a lint/structural rule. A convention that
  cannot be checked mechanically goes to `harness/GOLDEN_RULES.md` with a plan
  to make it checkable.

## Measurable quality constraints (numbers, not adjectives)

<!-- Agents verify against these; "feels fast" is not a criterion. -->
| Constraint | Threshold | How measured |
|---|---|---|
| Test coverage on changed lines | ≥ 80% | coverage report |
| Shared JS bundle (gzip) | < 250 kB | `harness/checks/quality.mjs` (verify:quality) |

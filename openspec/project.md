# Project Context

<!-- Project-wide truth that outlives individual changes. Keep current. -->

## Purpose

KT-XNK website — a static/informational Next.js site. Target users: visitors
looking up company/product info. Success criteria: fast, light-themed, easy
to extend with new pages via the layered `src/` structure.

## Tech stack

- Language/runtime: JavaScript
- Framework: Next.js (latest, App Router) — UI built via the Astryx MCP
  server (`xds`, https://astryx.atmeta.com/mcp)
- Style: StyleX — see `docs/stylex-installation.md` (build tool setup: Vite,
  Next.js, Webpack, Rspack, esbuild) and `docs/stylex-authoring.md` (style
  APIs, theming, antipatterns)
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
- Styling: StyleX only — no inline `style`/`className`, no top-level media
  queries/pseudo-classes (see `docs/stylex-authoring.md` antipatterns)
- Color: all colors come from `colors` in `src/ui/tokens.stylex.js` — no
  hardcoded hex in components. Palette is derived from the brand logo
  (`public/images/logo-dn-group.png`: primary red `#c2252a`, secondary teal
  `#247768`); adding a new hue requires updating that file, not inlining one
- Every convention here must map to a lint/structural rule. A convention that
  cannot be checked mechanically goes to `harness/GOLDEN_RULES.md` with a plan
  to make it checkable.

## Measurable quality constraints (numbers, not adjectives)

<!-- Agents verify against these; "feels fast" is not a criterion. -->
| Constraint | Threshold | How measured |
|---|---|---|
| Test coverage on changed lines | ≥ 80% | coverage report |
| Shared JS bundle (gzip) | < 250 kB | `harness/checks/quality.mjs` (verify:quality) |

# Progress Log

<!--
Append-only session log. Newest entry FIRST.
This file is the handoff between sessions/agents — write for a reader with zero conversation context.
-->

## Harness gaps (mistakes that need a mechanical rule, not a manual fix)

(none yet)

## Discovered (backlog — do NOT act on these mid-task)

- No `src/repo`/`src/service` code yet — the site is fully static. Add real
  structural tests for those layers once a first feature needs them.
- `verify:quality` only checks bundle size; no p95 latency metric yet (no
  backend to measure).

---

## 2026-07-25 11:20 — Claude Code

- **Active change:** color system for the project (no `openspec/changes/`
  entry — small token-only edit done directly per user request)
- **Task worked:** derive a full color palette in `src/ui/tokens.stylex.js`
  from the brand logo (`public/images/logo-dn-group.png`)
- **Result:** done. Sampled exact logo pixels via PowerShell
  `System.Drawing` (node had no image lib available): primary red
  `rgb(194,37,42)` / `#c2252a`, secondary teal `rgb(36,119,104)` / `#247768`.
  Replaced the old placeholder `accent`/`accentText` tokens (unused anywhere
  in `src/`) with: neutrals (`background`, `surface`, `border`,
  `borderStrong`, `text`, `textMuted`, `textOnPrimary`, `textOnSecondary`),
  `primary`/`primaryHover`/`primaryActive`/`primarySurface`,
  `secondary`/`secondaryHover`/`secondaryActive`/`secondarySurface`, and
  semantic `success`/`warning`/`danger`/`info`. All white-on-color pairings
  verified ≥ 4.5:1 contrast (WCAG AA) via a small luminance-ratio script.
- **Verification:** `./harness/verify.sh` — `structure` passed; `lint`,
  `typecheck`, `harness-tests`, `unit-tests`, `build`, `quality-thresholds`
  all failed on `ERR_PNPM_BAD_PM_VERSION` (repo pins pnpm 11.5.3, local pnpm
  is 9.0.6) — a pre-existing environment issue, unrelated to this change and
  not fixed here (didn't want to touch global tooling without asking).
- **Decisions made:** `success` aliases `secondary` (teal), `danger` aliases
  `primary` (brand red) rather than inventing new hues — kept the palette
  minimal. Only one genuinely new value added: `warning` (`#b45309` amber).
  Documented the "colors only from tokens.stylex.js" rule in
  `openspec/project.md` Conventions so future agents don't hardcode hex.
- **Next step:** whoever picks up next real UI work should run
  `corepack use pnpm@11.5.3` (or equivalent) before relying on
  `./harness/verify.sh` results.
- **Blockers:** none

---

## 2026-07-24 23:30 — Claude Code

- **Active change:** initial project bootstrap (no `openspec/changes/` entry
  yet — done directly per user request, not through the change workflow)
- **Task worked:** scaffold Next.js (JS, App Router) + StyleX + ESLint on top
  of the OpenSpec harness template
- **Result:** done
- **Verification:** `./harness/verify.sh` → run after `npm install`; see
  `harness/runs/<latest>/` for evidence
- **Decisions made:** JavaScript only (no TypeScript app code; `typescript`
  kept as a devDependency purely for `tsc --noEmit --checkJs` typechecking of
  JS via `jsconfig.json`). Light theme only — no dark-mode variant. `src/app`
  plays the routing/wiring role of `runtime` and is exempt from the six-layer
  dependency-cruiser rules (matches `docs/architecture.md`).
- **Next step:** open an `openspec/changes/` proposal (per the `_template/`
  folder) for the next real feature instead of ad-hoc edits.
- **Blockers:** none

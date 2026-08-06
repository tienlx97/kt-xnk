# Progress Log

<!--
Append-only session log. Newest entry FIRST.
This file is the handoff between sessions/agents — write for a reader with zero conversation context.
-->

## Harness gaps (mistakes that need a mechanical rule, not a manual fix)

- `harness/checks/project-readiness.sh`'s placeholder scan (angle-bracket
  CLI-argument tokens, an unfilled date-format token, etc. — see the script
  for the exact pattern) didn't account for tool-generated content blocks —
  `astryx init`'s `<!-- ASTRYX:START/END -->` cheat sheet in `AGENTS.md`
  contains angle-bracket CLI usage syntax that happens to match the
  placeholder pattern, and failed `verify.sh` on an otherwise clean repo.
  Fixed 2026-08-06: the check now strips `ASTRYX:START`/`ASTRYX:END` blocks
  before scanning. Any other tool that appends a marked block to these
  files (AGENTS.md, docs/architecture.md, GOLDEN_RULES.md, PROGRESS.md,
  quality-grades.json, project.md) should use a similar
  `<!-- TOOL:START/END -->` convention so this stays generalizable instead
  of needing a new carve-out per tool. (Note for future edits to this very
  log: avoid reproducing the literal placeholder tokens themselves here —
  this file is one of the ones the scan covers, and literal examples in
  the write-up will trip it, as happened while drafting that entry.)

---

## 2026-08-07 01:56 — Claude Code

- **Active change:** `openspec/changes/feature-based-architecture/` —
  replace the 6-layer backend-shaped architecture
  (`types→config→repo→service→runtime→ui`) with a feature-based front-end
  architecture, per explicit user direction: this repo is confirmed
  front-end only, backend lives in a separate project.
- **Task worked:** all 5 milestones in `tasks.md`. Moved
  `src/ui/hero.js` → `src/features/home/components/hero.js`;
  `src/app/design-system/{showcase-section.js,sections/*.js}` →
  `src/features/design-system/components/`; `src/ui/{header,footer,theme,
  theme-provider}.js`, `src/config/{site.js,site.test.js}`,
  `src/types/index.js` → `src/shared/{components,config,types}/`. Added a
  public `index.js` per feature. Rewrote `harness/structure.rules.cjs`
  around `types→config→api→hooks→components` (per-tree, feature or
  shared), plus new rules `no-feature-to-feature` (isolation),
  `no-shared-to-feature`, `no-deep-feature-imports` — same
  backreference technique the old `no-deep-domain-imports` rule already
  used. Rewrote `harness/tests/structure-rules.test.cjs` fixtures to
  exercise every rule (old fixtures hardcoded the dead layer names, would
  have silently stopped testing anything meaningful). Updated
  `docs/architecture.md`, `openspec/project.md`, `AGENTS.md` (trimmed, not
  re-duplicated — matches its own "map not manual" rule),
  `harness/GOLDEN_RULES.md` (v1→v2), `harness/quality-grades.json`; added
  `docs/adr/0003-feature-based-architecture.md`. Fixed the theme
  build/gitignore wiring for the new `src/shared/components/theme.js`
  path and the two remaining `src/ui/theme.js` text references inside the
  design-system showcase page's own Blockquote/CodeBlock copy.
- **Result:** done. `pnpm run structure` and `pnpm test:harness` pass
  against both the real migrated `src/` and the new violation fixtures.
- **Verification:** `./harness/verify.sh` — full pass (project-readiness,
  memory-secrets, theme-build, lint, typecheck, structure, harness-tests,
  unit-tests, build, quality-thresholds). See
  `harness/runs/20260807-015558-33202/`. Also ran `pnpm dev` and curled
  `/` and `/design-system` directly — both 200, both contain real
  rendered content ("KT-XNK", "Design system"), not an error boundary.
- **Decisions made:** dropped `repo`/`service`/`runtime` entirely rather
  than renaming them — they're backend concepts with no backend in this
  repo. `api`/`hooks` replace them (client calls to the external backend
  project / client-side state) — see decision log in `proposal.md` and
  ADR-0003. Features are **fully isolated** (no cross-feature imports at
  all, not just "public-surface only") since neither current feature
  (`home`, `design-system`) has a legitimate reason to depend on the
  other; revisit if a future feature genuinely needs another's public
  surface. Did not create empty `api/`/`hooks/` folders anywhere — same
  placeholder-free philosophy the old `repo/service` had, add on first
  real need. Did not touch the hardcoded example hex colors in
  `content.js`'s `THEME_SNIPPET` (a pre-existing, separately-flagged
  issue from an earlier session — only its file-path references were
  updated since the file itself moved). Left the change in
  `openspec/changes/` rather than archiving it.
- **Next step:** none pending for this change. First feature that needs
  to call the separate backend project should add `api/` (and `hooks/` if
  it needs client state) under that feature — or `src/shared/api|hooks`
  if more than one feature needs it — following the pattern in
  `docs/architecture.md`.
- **Blockers:** none

---

## 2026-08-07 00:14 — Claude Code

- **Active change:** upgrade `@astryxdesign/core`/`theme-neutral`/`cli`
  0.2.0 → 0.3.0 (no `openspec/changes/` entry — direct per user request)
- **Task worked:** `pnpm add @astryxdesign/core@0.3.0
  @astryxdesign/theme-neutral@0.3.0` then `@astryxdesign/cli@0.3.0`
  (`@latest` silently kept resolving 0.2.0 — pinned the exact version
  instead of digging into why). Approved `@astryxdesign/cli`'s postinstall
  build script in `pnpm-workspace.yaml` after reading it first (same
  print-only nudge pattern as `core`'s, verified 2026-08-06 — never
  mutates files). Ran the sanctioned migration path instead of assuming
  compatibility: `pnpm exec astryx upgrade --from 0.2.0` (dry run) listed
  10 codemods spanning v0.2.1→v0.3.0 and reported "No changes needed —
  your code is already up to date!"; `--apply` confirmed the same and
  additionally refreshed the `<!-- ASTRYX:START/END -->` version stamp in
  `AGENTS.md`/`CLAUDE.md` (154→155 components, v0.2.0→v0.3.0) — diffed
  before committing, only the stamp changed.
- **Result:** done. `package.json` bumped to `^0.3.0` for all three
  packages; `pnpm-lock.yaml` updated; no application code changed (the
  codemods had nothing to do).
- **Verification:** `pnpm theme:build` (rebuilt cleanly on 0.3.0),
  `./harness/verify.sh` — full pass. Also ran `pnpm dev` and curled both
  `/` and `/design-system`, grepping for `astryx-button`/`astryx-dialog`/
  `astryx-table`/`astryx-heading` classes and scanning for error markers
  in the response — confirmed real runtime output on 0.3.0, not just a
  passing build. See `harness/runs/20260807-001356-26089/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 00:08 — Claude Code

- **Active change:** swap which brand hue is MD3 `primary` vs `secondary`
  (no `openspec/changes/` entry — direct per user request: red as the
  dominant accent read too harsh/glaring across filled surfaces like
  inputs and primary buttons)
- **Task worked:** regenerated the MD3 tonal palette with the seeds
  swapped — teal `#247768` is now the `primary` seed, red `#c2252a` is now
  `secondary` (tertiary re-derived at +60° from the new primary hue;
  error stays its own standalone seed, unaffected). Same CIE Lab
  generation method as before, all AA contrast pairs re-verified.
  - `src/ui/theme.js`: `--color-accent` (and accent-muted/on-accent/
    text-accent/icon-accent) now `#126a5c` (teal, was `#b91a24` red). The
    `variant:secondary` Button override now uses the *new* secondary
    (red) container pair (`#fddbd5`/`#3e0500`, was the old teal
    container).
  - Updated copy that named the old mapping: `/design-system` intro text,
    the Button and Link section descriptions in
    `src/app/design-system/sections/actions.js`, and the Color convention
    bullet in `openspec/project.md`.
- **Result:** done.
- **Verification:** `pnpm theme:build` then `./harness/verify.sh` — full
  pass. Rebuilt CSS confirmed to contain `#126a5c`/`#fddbd5`, and curled
  the running `/design-system` page's compiled CSS to confirm the same
  values ship in what actually renders (not just what's in source). See
  `harness/runs/20260807-000807-24222/`.
- **Decisions made:** kept `--color-error` as its own standalone red seed
  (`#b3261e`) rather than aliasing it to the new secondary red — error
  states shouldn't move if someone later re-tunes the secondary brand hue
  independently.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-07 00:01 — Claude Code

- **Active change:** expand `/design-system` from a 6-component sample into
  a broad Astryx component showcase (no `openspec/changes/` entry — direct
  per user request "tạo tất cả các component có thể")
- **Task worked:** Astryx ships 154 components (`pnpm exec astryx
  component --list`). Looked up real prop signatures for ~55 of them via
  the `xds` MCP server (not guessed) and split the single `page.js` into
  `src/app/design-system/sections/*.js` (one file per category:
  typography, actions, forms, selection, feedback, overlays,
  data-display, content) plus a shared `showcase-section.js` wrapper, so
  no single file got unmanageable. `page.js` now just composes the 8
  section components.
  - Covered: Heading, Text, Button/ButtonGroup/IconButton/ToggleButton,
    Link, TextInput/TextArea/NumberInput/Selector/MultiSelector/RadioList/
    FileInput/Slider, CheckboxInput/CheckboxList/Switch, TabList/
    SegmentedControl, Banner/Toast/ProgressBar/Skeleton/Spinner/StatusDot/
    EmptyState, Dialog/AlertDialog/Popover/Tooltip/HoverCard/DropdownMenu,
    Badge/Card/ClickableCard/SelectableCard/Avatar/AvatarGroup/Table/List/
    Pagination/Token/Timestamp/Citation/Kbd, Divider/Breadcrumbs/Icon/
    Blockquote/CodeBlock/AspectRatio/Collapsible.
  - Explicitly NOT covered (noted in the page's own intro text, not
    silently dropped): Chat family, PowerSearch, Calendar, DateInput
    family, Carousel, Lightbox, TreeList, ContextMenu, MoreMenu, Markdown
    — each needs either external data/backend wiring or enough surface
    area to warrant its own follow-up rather than a rushed demo.
  - Overlay demos (Dialog/AlertDialog/Popover) are real controlled
    open/close via `useState`, not the docs' `isInline` preview escape
    hatch — clicking the trigger buttons actually opens a modal.
  - `AspectRatio`'s example uses the project's real
    `public/images/logo-dn-group.png` instead of a placeholder/remote
    image.
- **Result:** done.
- **Verification:** `./harness/verify.sh` — full pass after fixing 3 real
  issues caught by the gate (not guessed): `AvatarGroup` is exported from
  `@astryxdesign/core/AvatarGroup`, not bundled into `.../Avatar` as the
  groupMembers listing implied; `Selector`'s `value` type is `string |
  null`, not `string | undefined`; ESLint's `react-hooks/purity` rule
  correctly flagged a `Date.now()` call inside JSX render (non-deterministic
  during render) — replaced with a fixed ISO timestamp. Also ran `pnpm dev`
  and curled `/design-system`, grepping the HTML for `astryx-*` class names
  across every section to confirm real DOM output, not just a passing
  build (`DropdownMenu`'s popup class legitimately doesn't appear
  server-rendered — it's portal-based and only mounts on open).
- **Decisions made:** organized sections by Astryx's own component
  grouping (Actions/Forms/Feedback/Overlays/Data display/Content) rather
  than alphabetically — matches how someone would actually look something
  up.
- **Next step:** if the excluded components (Chat, Calendar, etc.) are
  needed later, look them up fresh via `xds` the same way — this entry's
  list of what's missing may drift as Astryx ships new versions.
- **Blockers:** none

---

## 2026-08-06 23:49 — Claude Code

- **Active change:** revert the `turbopack.root` pin from the entry below —
  it fixed a cosmetic warning but caused a fatal Turbopack crash (no
  `openspec/changes/` entry — direct per user request, pasted a crash log)
- **Task worked:** user hit, after a few successful requests then an HMR
  update: `FATAL: An unexpected Turbopack error occurred` /
  `Resource path "projects/work/code/kt-xnk/src/app/layout.js" needs to be
  on project filesystem ""` (missing the `/home/capybara/` prefix — a
  path-resolution bug). Trace pointed at `WebpackLoadersProcessedAsset`,
  i.e. Babel-loader-processed files specifically (this project uses
  `babel.config.js` for the StyleX plugin, so every file StyleX touches
  goes through that path). Traced it to the previous session's
  `turbopack.root: import.meta.dirname` pin in `next.config.mjs`.
- **Result:** reverted that one line. The Turbopack root-inference warning
  is back (harmless, cosmetic) — chose it over a crash that broke HMR for
  any Babel-processed file.
- **Verification:** deleted `.next`, ran `pnpm dev`, confirmed clean
  `200`s. Specifically re-tested the exact failure mode: edited
  `src/app/layout.js` (the file named in the panic) while dev was running,
  confirmed `✓ Compiled in 14ms` with no panic, reverted the edit, same
  result again on the second HMR cycle. `./harness/verify.sh` — full pass.
  See `harness/runs/20260806-234938-20047/`.
- **Decisions made:** don't re-attempt pinning `turbopack.root` without
  first confirming Next.js/Turbopack has actually fixed this interaction —
  it's a known-bad combination in `v16.2.11`, not something to retry as-is.
- **Next step:** none pending. If the warning becomes annoying enough to
  revisit, the safer fix is probably removing the stray
  `/home/capybara/pnpm-lock.yaml` (outside this repo) rather than touching
  `turbopack.root` again.
- **Blockers:** none

---

## 2026-08-06 23:43 — Claude Code

- **Active change:** commit the `astryx init` agent-doc block + fix a
  Turbopack root-inference warning (no `openspec/changes/` entry — direct
  per user request)
- **Task worked:**
  1. User ran `pnpm exec astryx init` themselves (I'd deliberately avoided
     running it earlier — see 2026-08-06 22:02 entry). It appended a
     `<!-- ASTRYX:START/END -->` CLI cheat sheet to both `AGENTS.md` and
     `CLAUDE.md`, purely additive, nothing existing removed — reviewed the
     diff before committing.
  2. `pnpm dev` was warning on every run: "Next.js inferred your workspace
     root... Detected additional lockfiles: /home/capybara/pnpm-lock.yaml".
     This repo sits inside `/home/capybara`, which has its own unrelated
     pnpm lockfile one level up, confusing Turbopack's root inference. Set
     `turbopack.root: import.meta.dirname` in `next.config.mjs` to pin it
     explicitly.
  3. Running `verify.sh` after the `astryx init` commit surfaced a real
     harness bug (see "Harness gaps" above): `project-readiness.sh`'s
     placeholder regex matched an angle-bracket CLI-argument token in the
     Astryx cheat sheet's `astryx template ... [--skeleton]` line. Fixed
     the check rather than editing the tool-generated block (which would
     just get overwritten by a future `astryx upgrade`/re-init).
- **Verification:** `./harness/verify.sh` — full pass. Sanity-checked the
  `project-readiness.sh` fix didn't just neuter the whole check: temporarily
  added one of the scanner's real placeholder tokens to
  `openspec/project.md` and confirmed the script still caught it (exit 1)
  before reverting. Confirmed the Turbopack warning is gone by re-running
  `pnpm dev` and reading the log. See `harness/runs/20260806-234349-17147/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** none pending.
- **Blockers:** none

---

## 2026-08-06 23:36 — Claude Code

- **Active change:** finish wiring MD3 brand colors into Astryx's core
  token set + build a `/design-system` showcase page (no
  `openspec/changes/` entry — direct per user request "làm nốt... rồi tạo
  1 page có full component")
- **Task worked:**
  1. Expanded `src/ui/theme.js` tokens from 7 → 18: added
     `--color-accent-muted`/`--color-on-accent` (MD3 primaryContainer/
     onPrimary), `--color-text-accent`/`--color-icon-accent` (MD3 primary —
     these were silently defaulting to theme-neutral's dark gray, not our
     brand red, for Link text and accent icons), `--color-background-popover`
     (MD3 surfaceContainerHigh), `--color-icon-primary`/`--color-icon-secondary`
     (MD3 onSurface/onSurfaceVariant), `--color-border-emphasized` (MD3
     outline), and `--color-error`/`--color-on-error`/`--color-error-muted`
     (MD3 error/onError/errorContainer — this is what `Button
     variant="destructive"` actually reads, confirmed via
     `node_modules/@astryxdesign/core/dist/astryx.css`).
     Deliberately did NOT touch `--color-success`/`--color-warning` (kept
     universal green/amber), the 10 categorical tag colors
     (`--color-*-blue/cyan/.../yellow`), or structural tokens
     (`--color-neutral`, `--color-overlay*`, `--color-skeleton`,
     `--color-track`, `--color-shadow`, `--color-tint-hover`) — none of
     these are brand identity; overriding them would just be surprising.
  2. New page `src/app/design-system/page.js` — a live component
     reference, not content: Heading (all 6 levels), Text (5 types × 4
     colors), Button (4 variants × sizes/disabled/loading), Badge (5
     semantic + 9 category variants), Card (default/muted/transparent),
     Link (internal + external). Added to nav
     (`src/config/site.js` → `navLinks`) as "Design System" so it's
     reachable, not just a dev-only route.
  3. `jsconfig.json`'s `tsc --noEmit --checkJs` needed the variant arrays
     annotated with `/** @type {('a'|'b'|...)[]} */` JSDoc — Astryx's
     prop types are string-literal unions, and mapping over a bare
     `string[]` fails typecheck (caught by `./harness/verify.sh`, not
     guessed).
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  in the background and curled `/design-system`: confirmed all 6
  `<h1>`–`<h6>` render, and `astryx-button {primary,secondary,ghost,
  destructive}` / `astryx-badge {neutral,info,success,warning,error,blue,
  cyan,green,orange,pink,purple,red,teal,yellow}` classes all present in
  the HTML. See `harness/runs/20260806-233604-14883/`.
- **Decisions made:** none beyond what's in "Task worked" above.
- **Next step:** if a future page needs Form components (Input, Select,
  Checkbox, etc.) or Layout/AppShell, check `node_modules/@astryxdesign/core`
  + `xds` MCP the same way before adding to the showcase page — don't
  assume a component exists without checking its export path first (bit
  us twice already: `LinkProvider` wasn't at the path the docs implied,
  and `Theme`/`defineTheme` live at `./theme`, not `./Theme`).
- **Blockers:** none

---

## 2026-08-06 22:19 — Claude Code

- **Active change:** wire MD3 `secondary` brand color into Astryx `Button`
  (no `openspec/changes/` entry — small follow-up, done directly per user
  question "if I have a primary/secondary button, what happens?")
- **Task worked:** verified (by reading `node_modules/@astryxdesign/core`
  source, not guessing) that Astryx's `Button` `variant` prop is an
  emphasis level, not a brand hue: `variant="primary"` resolves to
  `--color-accent` (our brand red, already wired), but `variant="secondary"`
  resolves to `--color-neutral` (a generic gray) — our brand teal
  (`#247768` / MD3 `secondary`) was not connected to anything.
- **Result:** done. Added a `components.button` override to
  `src/ui/theme.js`'s `defineTheme()` call:
  `'variant:secondary': { backgroundColor: '#a1f2df', color: '#00201a' }`
  (MD3 `secondaryContainer`/`onSecondaryContainer` — the same tonal-button
  pairing MD3 itself uses for "branded but lower emphasis than primary").
  Confirmed the compiled `theme.built.css` contains
  `.astryx-button.secondary { background-color: #a1f2df; ... }` — no
  Button component code touched.
- **Verification:** `./harness/verify.sh` — full pass after
  `pnpm theme:build`. See `harness/runs/20260806-221857-12220/`.
- **Decisions made:** used `secondaryContainer`/`onSecondaryContainer`
  (light tonal fill) rather than solid `secondary`/`onSecondary` — matches
  Astryx's own intent that `variant="secondary"` stays lower-emphasis than
  `variant="primary"`; a solid teal would read as equally weighted.
- **Next step:** if `tertiary`/`error` MD3 roles need a home later,
  Astryx's own token vocabulary is much richer than the 7 tokens in
  `theme.js` (grep `node_modules/@astryxdesign/core/dist/astryx.css` for
  `--color-success`, `--color-warning`, `--color-error`,
  `--color-background-teal`, etc.) — check there before inventing a new
  `components` override.
- **Blockers:** none

---

## 2026-08-06 22:10 — Claude Code

- **Active change:** switch from runtime `defineTheme()` to a pre-built
  Astryx theme (no `openspec/changes/` entry — small follow-up to the
  Astryx migration above, done directly per user request after they pasted
  a `pnpm dev` log showing Astryx's own perf warning)
- **Task worked:** `pnpm dev` was logging: `Theme: "kt-xnk" is using
  runtime style injection. For better performance, use the pre-built
  theme... run 'npx @astryxdesign/cli theme build <file>'`. Ran
  `astryx theme build src/ui/theme.js -o src/ui/theme.built.css`, which
  generates `src/ui/kt-xnk.js` (built theme object), `src/ui/kt-xnk.d.ts`,
  and `src/ui/theme.built.css` (static CSS) next to the source file.
- **Result:** done. `src/ui/theme-provider.js` now imports the built
  `ktXnkTheme` from `./kt-xnk.js` + `./theme.built.css` instead of calling
  runtime `defineTheme()` directly (`src/ui/theme.js` stays as the
  hand-edited *source* the build command reads — not deleted).
  - Generated files are gitignored (`.gitignore`), not committed — they're
    fully deterministic output of `src/ui/theme.js`.
  - Added `"theme:build"` npm script (the exact `astryx theme build`
    command) and made `dev`/`build` run it first
    (`"dev": "pnpm theme:build && next dev"`, same for `build`).
  - `harness/verify.sh` runs `theme:build` as its own step, before
    `lint`/`typecheck`/`structure` — those all resolve the `./kt-xnk.js`
    import, so on a fresh clone (gitignored files absent) they'd fail
    without this step running first.
- **Verification:** deleted the generated files, ran
  `./harness/verify.sh` clean from that state — full pass (theme-build
  step regenerated them before lint/typecheck ran). Also ran `pnpm dev` in
  the background and grepped its log: no more "runtime style injection"
  warning. See `harness/runs/20260806-221048-11148/`.
- **Decisions made:** gitignore + rebuild-on-every-run over committing the
  generated files — keeps `src/ui/theme.js` the single source of truth and
  makes staleness (someone edits `theme.js`, forgets to rebuild, commits
  mismatched CSS) mechanically impossible instead of relying on a reviewer
  to notice.
- **Next step:** none pending.
- **Blockers:** none

## Discovered (backlog — do NOT act on these mid-task)

- No `src/repo`/`src/service` code yet — the site is fully static. Add real
  structural tests for those layers once a first feature needs them.

---

## 2026-08-06 22:02 — Claude Code

- **Active change:** migrate UI to real `@astryxdesign/core` components (no
  `openspec/changes/` entry — direct per user request; project.md already
  said "UI built via the Astryx MCP server" but the app had never actually
  installed/used the package, only hand-rolled markup — user flagged this
  gap)
- **Task worked:** install `@astryxdesign/core` + `@astryxdesign/theme-neutral`
  (deps) and `@astryxdesign/cli` (devDep); wire the MD3 palette from the
  previous entry into Astryx via `defineTheme`; replace hand-written
  `header.js`/`footer.js`/`hero.js` with real Astryx components
  (`TopNav`/`TopNavHeading`/`TopNavItem`, `Section`, `Heading`/`Text`).
- **Result:** done.
  - `src/ui/theme.js` — `defineTheme({name: 'kt-xnk', tokens: {...}})`
    mapping our MD3 role values onto Astryx's CSS-custom-property token
    names (`--color-accent`, `--color-background-body`,
    `--color-background-surface`, `--color-background-card`,
    `--color-text-primary`, `--color-text-secondary`, `--color-border`).
    Single string values only (no `[light, dark]` tuples) since the project
    stays light-only.
  - `src/ui/theme-provider.js` — client component wrapping the app in
    `<LinkProvider component={NextLink}>` (so Astryx `href`s route through
    `next/link`) and `<Theme theme={ktxnkTheme} mode="light">`. Wired into
    `src/app/layout.js` around `<Header>`/`{children}`/`<Footer>`.
  - `src/app/globals.css` — added `@import` for
    `@astryxdesign/core/reset.css`, `@astryxdesign/core/astryx.css`, and
    `@astryxdesign/theme-neutral/theme.css` (baseline before our
    `defineTheme` override); removed the hand-rolled `box-sizing`/`body`
    reset now that Astryx's reset owns it (avoids unlayered CSS silently
    overriding `astryx-base`, per Astryx's Cascade Layer Safety guidance).
  - Deleted `src/ui/container.js` and `src/ui/tokens.stylex.js` — both had
    zero remaining consumers once header/footer/hero moved to Astryx
    components (verified with grep before deleting, same as the
    `colors`-token cleanup in the previous entry).
  - Package install needed one manual step: `pnpm-workspace.yaml` had a
    stub `allowBuilds: '@astryxdesign/core': set this to true or false` —
    read `@astryxdesign/core`'s postinstall script first (it only prints a
    "run `astryx init`" nudge when no agent-doc marker is found; never
    mutates files) before setting it to `true`.
  - Did **not** run `npx astryx init` — it can rewrite `AGENTS.md`/
    `CLAUDE.md`, which this repo treats as the curated single operating
    manual; a human should review that separately before letting the CLI
    touch those files.
  - Updated `openspec/project.md` (Tech stack + Conventions): components
    now come from `@astryxdesign/core`, not hand-rolled markup; StyleX is
    scoped to the `xstyle` escape hatch for one-off layout only; colors
    are sourced from `src/ui/theme.js`, not a StyleX token file.
- **Verification:** `./harness/verify.sh` — full pass. Also ran `pnpm dev`
  against the actual page and inspected the rendered HTML/CSS: confirmed
  `data-astryx-theme="kt-xnk" data-theme="light"` on the root wrapper,
  `<header><nav aria-label="Điều hướng chính">` from `TopNav`, and
  `#b91a24` (MD3 `primary`) present in the compiled CSS chunk. See
  `harness/runs/20260806-220202-9426/`.
- **Decisions made:** used Astryx's simpler common token set
  (`--color-accent`/`--color-background-*`/`--color-text-*`/`--color-border`)
  rather than trying to force all ~30 MD3 roles into Astryx CSS vars —
  Astryx's own token vocabulary is coarser than MD3's; mapped only the
  tokens Astryx actually documents. `Section`/`TopNav` don't expose an `as`
  prop, so kept native `<header>`/`<footer>` wrappers around them for
  landmark semantics.
- **Next step:** if a future page needs Buttons, Cards, or form fields,
  pull them from Astryx (`xds` MCP) the same way — don't hand-roll. If the
  team decides they do want `astryx init`'s AGENTS.md/CLAUDE.md agent
  prompt, run it in its own reviewed change, not bundled with UI work.
- **Blockers:** none

---

## 2026-08-06 21:44 — Claude Code

- **Active change:** rename/expand color tokens to Material Design 3 roles
  (no `openspec/changes/` entry — small token-only edit done directly per
  user request)
- **Task worked:** replace the ad-hoc `colors` token set in
  `src/ui/tokens.stylex.js` with the full Material Design 3 light-scheme
  role set (`primary`/`onPrimary`/`primaryContainer`/`onPrimaryContainer`,
  same pattern for secondary/tertiary/error, plus `surface*`,
  `outline`/`outlineVariant`, `inverse*`, `shadow`/`scrim`); update the 3
  components that consumed the old names (`hero.js`, `footer.js`,
  `header.js`: `colors.text`→`onSurface`, `colors.textMuted`→
  `onSurfaceVariant`, `colors.border`→`outlineVariant`).
- **Result:** done. Tonal palettes generated in CIE Lab space (tone = L*,
  hue/chroma held from seed) from the existing brand seeds (`#c2252a` red,
  `#247768` teal) plus a derived tertiary (`#7d6a02`, +60° hue rotation) and
  a standalone error seed (`#b3261e`). All on-color pairings verified ≥
  4.5:1 (WCAG AA). Dark-scheme values were also generated for reference but
  NOT added to the codebase — project stays light-only per existing
  convention; dark values live only in the reference artifact from this
  session.
- **Verification:** `./harness/verify.sh` — full pass (lint, typecheck,
  structure, harness-tests, unit-tests, build, quality-thresholds). See
  `harness/runs/20260806-214453-7411/`.
- **Decisions made:** dropped the old `primaryHover`/`primaryActive`/
  `primarySurface`/`secondaryHover`/`secondaryActive`/`secondarySurface`/
  `success`/`warning`/`danger`/`info`/`borderStrong`/`textOnPrimary`/
  `textOnSecondary` tokens — grepped first, confirmed none were referenced
  anywhere in `src/`, so no aliasing/back-compat shim was needed. Updated
  the "Color" convention bullet in `openspec/project.md` to point at the
  MD3 role-naming rule instead of the old ad-hoc names.
- **Next step:** none pending. If a future component needs elevation
  (cards, sheets), the `surfaceContainer*` roles are already defined but
  unused — reach for those before inventing a new surface tone.
- **Blockers:** none
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

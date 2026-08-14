# Tasks: React.dev MDX components parity

<!-- One task at a time. Check only after ./harness/verify.sh passes. -->

## 1. Contract and primitive authoring UI

- [x] 1.1 Pin the complete upstream inventory/dependency map and port primitive
  prose, lifecycle callouts/badges, cards/actions, math, recap, illustrations,
  and inline TOC without Astryx — verify: exact registry/source tests, a static
  MDX fixture, browser screenshots at 390/1536px, and `./harness/verify.sh`.

## 2. Code and diagram UI

- [ ] 2.1 Port `CodeBlock`, `InlineCode`, `CodeStep`, `CodeDiagram`, `Diagram`,
  `DiagramGroup`, console blocks, `TerminalBlock`, and `PackageImport` — verify:
  syntax/line-state fixtures, copy interaction, responsive screenshots, and
  `./harness/verify.sh`.

## 3. Guided learning UI

- [ ] 3.1 Port `Challenges`, `Recipes`, `Hint`, `Solution`, DeepDive behavior,
  and challenge navigation/query state — verify: keyboard/browser flow and
  `./harness/verify.sh`.

## 4. Interactive sandbox UI

- [ ] 4.1 Port `Sandpack`, `SandpackRSC`, and `SandpackWithHTMLOutput` with
  lazy client loading and upstream-equivalent controls — verify: edit/run/
  reload/console/open/download flows, bundle gate, and `./harness/verify.sh`.

## 5. Product/context components and acceptance

- [ ] 5.1 Port language/team/error-decoder context components, render the full
  registry fixture, update every matrix status, capture 390/1024/1536px
  acceptance evidence, close harness gaps, and pass `./harness/verify.sh`.

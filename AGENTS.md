# AGENTS.md — Map, Not Manual

> Per OpenAI harness engineering: this file stays ~100 lines and is a MAP.
> It points to deeper sources of truth; it never duplicates them.

## What this project is

KT-XNK is a Next.js (App Router, JavaScript) marketing/informational website
styled with StyleX. It follows the OpenSpec x Harness Engineering template:
layered `src/` architecture, mechanically enforced structure and quality
gates, and change-tracked work under `openspec/changes/`.

## Map of truth

| Question | Source of truth |
|---|---|
| Architecture & system diagram | `docs/architecture.md` |
| Why past decisions were made | `docs/adr/` (one ADR per decision, versioned) |
| Project conventions, stack, thresholds | `openspec/project.md` |
| What are we building now? Why? | `openspec/changes/<change>/proposal.md` |
| Requirements & scenarios | `openspec/changes/<change>/specs/` |
| Execution plan (current work) | `openspec/changes/<change>/tasks.md` |
| Quality standards (golden rules) | `harness/GOLDEN_RULES.md` |
| Entropy management & cleanup duty | `harness/ENTROPY.md` |
| Session history & handoffs | `harness/PROGRESS.md` |
| Semantic recall of past conversations | memsearch over `.memsearch/memory/` — see `docs/adr/0002-memory-layer.md` |

## Architectural constraints (mechanically enforced)

Dependencies flow ONE direction. A layer may import only layers to its left:

```
types → config → repo → service → runtime → ui
```

- `src/types/`   — pure types/schemas. Imports nothing.
- `src/config/`  — configuration. Imports: types.
- `src/repo/`    — data access. Imports: types, config.
- `src/service/` — business logic. Imports: types, config, repo.
- `src/runtime/` — API/entrypoints/wiring. Imports: everything except ui.
- `src/ui/`      — presentation. Imports: types and runtime contracts only.

`./harness/verify.sh` runs structural tests that FAIL the build on violations.
Error messages tell you how to fix them — read them; do not work around them.

## Session lifecycle

1. Read this map → `harness/PROGRESS.md` → active change in `openspec/changes/`.
2. Run `./init.sh`.
3. Select the first unchecked task in `tasks.md`. One task at a time.
4. Implement within the layer rules above and `harness/GOLDEN_RULES.md`.
5. Run `./harness/verify.sh`. Done = verification passes. No other definition exists.
6. Update `tasks.md`, append to `harness/PROGRESS.md`, commit (`feat(<change>): task N.N ...`).

## Verification & observability (evidence, not opinion)

- Quality thresholds are numbers, not adjectives — see `openspec/project.md`.
  Claiming "fast" or "works" requires a measurement or a test.
- For UI work: take a screenshot / run the e2e flow; do not assert visual
  correctness from code alone.
- Logs and metrics for your task run go to their own dated directory under
  `harness/runs/` so a reviewer can replay evidence.

## Failure protocol — every agent mistake is a harness gap

When you (or a reviewer) catch a mistake, do NOT just patch the output:

1. Fix the instance.
2. Ask: what tool, lint, structural test, or golden rule would have made this
   mistake impossible?
3. Add it (or log it in `harness/PROGRESS.md` under "Harness gaps" if out of scope).

Writing the same fix twice by hand is a harness failure.

## Hard rules

- Never mark a task done without `./harness/verify.sh` passing.
- Never expand scope beyond the selected task; log findings under "Discovered".
- Never edit `openspec/archive/`.
- Prefer existing patterns; you replicate what you see, so only replicate what
  `harness/GOLDEN_RULES.md` grades as A.
- **Shared memory is files, not agent memory.** This repo is worked by multiple
  agents (Claude Code, Codex, humans). Durable knowledge lives ONLY in repo
  files: `harness/PROGRESS.md`, `docs/adr/`, `openspec/`. The sanctioned recall
  layer is memsearch over `.memsearch/memory/` markdown (ADR-0002) — recall
  only, never the sole home of a fact. Other tool-specific memory is invisible
  to the rest of the team; don't rely on it.

## Commands

```bash
./init.sh                    # setup + verify environment
./harness/verify.sh          # full gate: lint, typecheck, tests, structure, build
./harness/audit-harness.sh   # validate the harness itself
```

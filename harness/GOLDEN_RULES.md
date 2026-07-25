# Golden Rules

<!--
Versioned quality standards (OpenAI harness style). Agents replicate patterns
they see — these rules define which patterns are allowed to exist.
Each rule states its ENFORCEMENT: the mechanical check that catches violations.
A rule with enforcement "manual" is a harness gap — plan to automate it.
Raising the version creates cleanup work: see harness/ENTROPY.md.
-->

## v1 — 2026-07-24

| # | Rule | Enforcement |
|---|---|---|
| 1 | No task is done without passing `./harness/verify.sh` | verify.sh exit code |
| 2 | Dependencies flow types → config → repo → service → runtime → ui; no upward imports, no cycles | structural test (dependency-cruiser) |
| 3 | Cross-domain imports only via the domain's `index.ts` | structural test |
| 4 | No dead or commented-out code; delete it, git remembers | lint |
| 5 | Every spec scenario has a corresponding test | manual → TODO: coverage-map script |
| 6 | Errors handled at boundaries; no empty catch | lint |
| 7 | One task per commit; diffs stay small and single-concern | review + PR size check |
| 8 | Copy patterns only from A-graded code (`harness/quality-grades.json`) | manual → cleanup agent scans |
| 9 | Quality claims are measurements against `openspec/project.md` thresholds, not adjectives | verify.sh perf steps |
| 10 | Stale docs are bugs; updating `docs/`/`openspec/` is part of the task that made them stale | cleanup agent scan |
| 11 | Shared memory must not contain credentials or private keys | `harness/checks/memory-secrets.sh` |

## Changelog

- v1 (2026-07-24): initial rules.

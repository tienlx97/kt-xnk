#!/usr/bin/env bash
# Audits that the harness itself is intact (the 5 subsystems:
# instructions, state, verification, scope, lifecycle) plus the
# OpenAI-standard layers: docs map, structural rules, entropy management.
set -uo pipefail
cd "$(dirname "$0")/.."

ok=0; bad=0
check() {
  if eval "$2"; then echo "✔ $1"; ok=$((ok+1)); else echo "✘ $1"; bad=$((bad+1)); fi
}

echo "── Instructions (map, not manual) ──"
check "AGENTS.md exists"                     "[ -f AGENTS.md ]"
check "AGENTS.md is a map (≤ 120 lines)"     "[ \$(wc -l < AGENTS.md) -le 120 ]"
check "CLAUDE.md exists"                     "[ -f CLAUDE.md ]"
check "docs/architecture.md exists"          "[ -f docs/architecture.md ]"
check "docs/adr/ exists"                     "[ -d docs/adr ]"
check "openspec/project.md exists"           "[ -f openspec/project.md ]"

echo "── State ──"
check "harness/PROGRESS.md exists"           "[ -f harness/PROGRESS.md ]"
check "memory layer ADR exists (ADR-0002)"   "[ -f docs/adr/0002-memory-layer.md ]"
check "memsearch memory dir exists"          "[ -d .memsearch/memory ]"
check "openspec/changes/ exists"             "[ -d openspec/changes ]"
check "openspec/archive/ exists"             "[ -d openspec/archive ]"

echo "── Verification (mechanical constraints) ──"
check "harness/verify.sh executable"         "[ -x harness/verify.sh ]"
check "structural rules present"             "[ -f harness/structure.rules.cjs ]"
check "GOLDEN_RULES.md exists"               "[ -f harness/GOLDEN_RULES.md ]"
check "harness self-tests exist"             "[ -f harness/tests/structure-rules.test.cjs ]"
check "readiness check executable"           "[ -x harness/checks/project-readiness.sh ]"
check "memory secret check executable"       "[ -x harness/checks/memory-secrets.sh ]"
check "test:harness npm script exists"       "node -e 'const p=require(\"./package.json\"); process.exit(p.scripts?.[\"test:harness\"] ? 0 : 1)'"

echo "── Entropy management ──"
check "harness/ENTROPY.md exists"            "[ -f harness/ENTROPY.md ]"
check "quality-grades.json exists"           "[ -f harness/quality-grades.json ]"

echo "── Scope ──"
check "change template has tasks.md"         "[ -f openspec/changes/_template/tasks.md ]"
check "change template has proposal.md"      "[ -f openspec/changes/_template/proposal.md ]"
check "change template has design.md"        "[ -f openspec/changes/_template/design.md ]"
check "change template has specs/"           "[ -d openspec/changes/_template/specs ]"

echo "── Lifecycle ──"
check "init.sh exists and executable"        "[ -x init.sh ]"

echo
echo "$ok passed, $bad failed"
[ "$bad" -eq 0 ]

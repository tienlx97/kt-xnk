const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const verify = fs.readFileSync(
  path.resolve(__dirname, "../verify.sh"),
  "utf8"
);

test("application verification never silently skips required scripts", () => {
  assert.doesNotMatch(verify, /--if-present/);
  for (const script of ["lint", "typecheck", "test", "build", "verify:quality"]) {
    assert.match(verify, new RegExp(`require_step [^\\n]*${script.replace(":", "\\:")}`));
  }
});

test("readiness, memory safety, and harness tests are always in the gate", () => {
  assert.match(verify, /step "project-readiness"/);
  assert.match(verify, /step "memory-secrets"/);
  assert.match(verify, /step "harness-tests"/);
});

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const projectRoot = path.resolve(__dirname, "../..");
const config = require(path.join(projectRoot, "harness/structure.rules.cjs"));

async function runCruise(files) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "harness-structure-"));
  for (const [name, contents] of Object.entries(files)) {
    const target = path.join(cwd, name);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }

  try {
    const { cruise } = await import("dependency-cruiser");
    const result = await cruise(["src"], {
      ...config.options,
      baseDir: cwd,
      validate: true,
      ruleSet: { forbidden: config.forbidden },
      outputType: "json",
    });
    const output = typeof result.output === "string"
      ? JSON.parse(result.output)
      : result.output;
    return output.summary.violations.map((violation) => violation.rule.name);
  } finally {
    fs.rmSync(cwd, { recursive: true, force: true });
  }
}

test("accepts imports declared in the layer allowlist", async () => {
  const violations = await runCruise({
    "src/types/id.ts": "export const id = 1;\n",
    "src/repo/users/index.ts": "import { id } from '../../types/id'; export { id };\n",
    "src/service/users/index.ts": "import { id } from '../../repo/users'; export { id };\n",
    "src/runtime/users.ts": "import { id } from '../service/users'; export { id };\n",
    "src/ui/users.ts": "import { id } from '../runtime/users'; export { id };\n",
  });
  assert.deepEqual(violations, []);
});

test("accepts the allowlist and reports every protected boundary", async () => {
  const violations = await runCruise({
    "src/types/id.ts": "export const id = 1;\n",
    "src/repo/valid/index.ts": "import { id } from '../../types/id'; export { id };\n",
    "src/service/valid/index.ts": "import { id } from '../../repo/valid'; export { id };\n",
    "src/runtime/valid.ts": "import { id } from '../service/valid'; export { id };\n",
    "src/ui/valid.ts": "import { id } from '../runtime/valid'; export { id };\n",
    "src/service/users/index.ts": "export const user = 1;\n",
    "src/repo/users/index.ts": "import { user } from '../../service/users'; export { user };\n",
    "src/ui/users.ts": "import { user } from '../repo/users'; export { user };\n",
    "src/service/a.ts": "import { b } from './b'; export const a = b;\n",
    "src/service/b.ts": "import { a } from './a'; export const b = a;\n",
    "src/service/billing/internal.ts": "export const charge = 1;\n",
    "src/service/orders/index.ts": "import { charge } from '../billing/internal'; export { charge };\n",
  });
  const details = JSON.stringify(violations);
  assert.ok(violations.includes("no-repo-to-service"), details);
  assert.ok(violations.includes("no-ui-to-repo"), details);
  assert.ok(violations.includes("no-circular"), details);
  assert.ok(violations.includes("no-deep-domain-imports"), details);
});

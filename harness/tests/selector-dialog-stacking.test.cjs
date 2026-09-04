const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

// Mechanical enforcement for the "Selector popover stacking" bug documented
// above `ContractsList` (src/features/logistics-contracts/components/
// contracts-list.jsx) and `CommissionsList` (commissions-list.jsx):
// Astryx's `Selector` portals its dropdown to the nearest ancestor outside any
// "unsafe host" (`<table>`, `<tr>`, ...). A `*FormDialog` declared inside a
// table's own `renderExpanded` callback is still a DOM descendant of that
// `<table>` even though the dialog itself renders visually above the page, so
// any `Selector` inside it gets portaled underneath the dialog instead of
// above it — clicks land on the dialog, not the option.
//
// Found twice by hand (contracts-list.jsx / shipments-list.jsx fixed it;
// commissions-list.jsx quietly carried the same bug for a while
// after). This test makes a third occurrence fail CI instead of waiting for
// someone to notice a Selector "not responding to clicks".
//
// It is a bracket-balance scan, not a real parser — good enough for this
// codebase's formatting conventions, not a general JS/JSX tool.

const projectRoot = path.resolve(__dirname, "../..");
const srcDir = path.join(projectRoot, "src");

/** @param {string} dir @returns {string[]} */
function listJsxFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...listJsxFiles(full));
    } else if (entry.isFile() && full.endsWith(".jsx")) {
      out.push(full);
    }
  }
  return out;
}

/**
 * Extract the source text of the arrow-function value bound to a
 * `renderExpanded:` (or `renderExpanded =`) property, starting from the `(`
 * or `{` right after `=>` and reading until that bracket's matching close.
 * @param {string} source
 * @returns {string[]} one entry per `renderExpanded` occurrence found
 */
function extractRenderExpandedBodies(source) {
  const bodies = [];
  const propPattern = /renderExpanded\s*[:=]/g;
  let match;
  while ((match = propPattern.exec(source))) {
    const arrowIndex = source.indexOf("=>", match.index);
    if (arrowIndex === -1) continue;
    let start = arrowIndex + 2;
    while (start < source.length && /\s/.test(source[start])) start++;
    const openChar = source[start];
    if (openChar !== "(" && openChar !== "{") continue;
    const closeChar = openChar === "(" ? ")" : "}";
    let depth = 0;
    let end = start;
    for (; end < source.length; end++) {
      if (source[end] === openChar) depth++;
      else if (source[end] === closeChar) {
        depth--;
        if (depth === 0) break;
      }
    }
    bodies.push(source.slice(start, end + 1));
  }
  return bodies;
}

test("no *FormDialog is rendered inside a table's renderExpanded callback", () => {
  const violations = [];
  const dialogTagPattern = /<([A-Z][A-Za-z0-9]*FormDialog)\b/g;

  for (const file of listJsxFiles(srcDir)) {
    const source = fs.readFileSync(file, "utf8");
    for (const body of extractRenderExpandedBodies(source)) {
      let tagMatch;
      dialogTagPattern.lastIndex = 0;
      while ((tagMatch = dialogTagPattern.exec(body))) {
        violations.push(`${path.relative(projectRoot, file)}: <${tagMatch[1]}>`);
      }
    }
  }

  assert.deepEqual(
    violations,
    [],
    "A *FormDialog was found inside a renderExpanded callback — a Selector " +
      "field inside it will portal underneath the dialog instead of above " +
      "it (see the comment atop this test). Render the dialog as a sibling " +
      "of the table instead, passing trigger callbacks down to the " +
      "expanded-row component — see ContractsList/CommissionsList for " +
      "the pattern.\n" +
      violations.join("\n"),
  );
});

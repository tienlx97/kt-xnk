/**
 * Structural tests for the dependency hierarchy (dependency-cruiser config).
 * Enforces: types → config → repo → service → runtime → ui.
 * Error messages teach the fix — keep them actionable.
 *
 * Enable in verify.sh after: npm i -D dependency-cruiser
 */
const LAYERS = ["types", "config", "repo", "service", "runtime", "ui"];
const ALLOWED_IMPORTS = {
  types: [],
  config: ["types"],
  repo: ["types", "config"],
  service: ["types", "config", "repo"],
  runtime: ["types", "config", "repo", "service"],
  ui: ["types", "runtime"],
};

// Use an explicit allowlist so documentation and enforcement cannot diverge.
const layerRules = LAYERS.flatMap((from) =>
  LAYERS.filter(
    (to) => to !== from && !ALLOWED_IMPORTS[from].includes(to)
  ).map((to) => ({
    name: `no-${from}-to-${to}`,
    severity: "error",
    comment:
      `src/${from} must not import src/${to}. Allowed imports for ${from}: ` +
      `${ALLOWED_IMPORTS[from].join(", ") || "none"}. Fix: move the shared ` +
      "contract to an allowed layer or invert the dependency.",
    from: { path: `^src/${from}` },
    to: { path: `^src/${to}` },
  }))
);

module.exports = {
  forbidden: [
    ...layerRules,
    {
      name: "no-circular",
      severity: "error",
      comment:
        "Circular dependency. Break the cycle by extracting the shared part into a lower layer.",
      from: {},
      to: { circular: true },
    },
    {
      name: "no-deep-domain-imports",
      severity: "error",
      comment:
        "Import domains via their public index.ts, not deep paths. Fix: export the symbol from the domain's index.ts and import from there.",
      from: { path: "^src/(service|repo)/([^/]+)" },
      to: {
        // $2 backreferences the domain captured in from.path — dependency-cruiser
        // does not support \k<name> backreferences across from/to, only $N.
        path: "^src/(service|repo)/(?!$2/)[^/]+/.+",
        pathNot: "index\\.(ts|js)$",
      },
    },
  ],
  options: {
    doNotFollow: { path: "node_modules" },
    tsPreCompilationDeps: true,
  },
};

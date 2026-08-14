# Tasks: MDX component authoring policy

## 1. Document the scoped exception

- [x] 1.1 Add an AI-visible MDX authoring instruction, prohibit Astryx imports
  throughout the MDX component tree, and reconcile project/code guidance —
  verify: `./harness/verify.sh` passes and the instruction explicitly keeps
  non-MDX UI under the existing Astryx policy.

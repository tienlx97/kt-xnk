# Architecture

<!--
Versioned source of truth for system structure. AGENTS.md points here.
Keep the diagram current — stale docs are a bug (see harness/ENTROPY.md).
-->

## System diagram

```
[client/ui] → [runtime: api/entrypoints] → [service] → [repo] → [database]
                     ↑ config ↑ types (imported by all layers to their right)
```

## Layer responsibilities

| Layer | Directory | Owns | May import |
|---|---|---|---|
| Types | `src/types/` | Schemas, domain types, contracts | — |
| Config | `src/config/` | Env parsing, feature flags, constants | types |
| Repo | `src/repo/` | DB/external-API access, persistence | types, config |
| Service | `src/service/` | Business logic, orchestration | types, config, repo |
| Runtime | `src/runtime/` | HTTP handlers, jobs, wiring, DI | types, config, repo, service |
| UI | `src/ui/` | Components, pages, presentation | types, runtime contracts |

`src/app/` holds Next.js App Router entrypoints (pages, layouts). It plays the
role of the `runtime` layer's routing/wiring surface: it imports `ui`
components and renders them; it is not itself one of the six enforced
layers, so structural rules do not restrict its imports.

## Module boundaries

No multi-domain services yet — `src/service/` and `src/repo/` are currently
empty (placeholder-free, `.gitkeep`-free) pending the first feature that
needs business logic or data access beyond static site config
(`src/config/site.js`).

## Data flow

`src/app/*` (Next.js routes) → `src/ui/*` (StyleX-styled components) →
`src/config/*` (static site content). No backend/database yet — the site is
fully static at this stage.

## Non-goals

- No dark theme — light only, by explicit product decision
  (`openspec/project.md`).
- No CSS-in-JS other than StyleX; no Tailwind, no styled-components.

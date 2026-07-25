# CLAUDE.md

Read and follow `AGENTS.md`. It is the single operating manual for this repository, shared by every agent (Claude Code, Codex, humans).

Claude-specific notes:
- Use the session lifecycle in `AGENTS.md` exactly; start every session by reading `harness/PROGRESS.md`.
- When context runs long, finish the current task, update state files, and hand off via `harness/PROGRESS.md` — state on disk survives context resets, your conversation does not.
- For recalling past work, use the memsearch plugin (`/memory-recall <query>`) — it searches the shared `.memsearch/memory/` markdown that Codex sessions also feed. Do NOT rely on any Claude-only memory store for project knowledge; everything durable goes to `harness/PROGRESS.md`, `docs/adr/`, or `openspec/` per `AGENTS.md` and ADR-0002.

# AGENTS.md

Guidance for AI agents working in this repo. Keep it thin — the detailed sources
of truth live in `openspec/` and `docs/`.

## What this project is

Trekking Food — a frontend (React 19 + TS + Vite) for planning meals on hiking
trips. Backend is a separate REST API (not in this repo).

## Work through OpenSpec — this is the primary workflow

All non-trivial work goes through OpenSpec. Do not free-code features outside it.

Sources of truth (read these first, in this order):

1. `openspec/BACKLOG.md` — **the workflow**: idea pool, build log, numbering,
   branching, and the pull ritual. Follow it exactly.
2. `openspec/CAPABILITIES.md` — capability map (what exists / is planned).
3. `openspec/config.yaml` — project context + per-artifact rules.
4. `docs/BUSINESS_LOGIC.md` — authoritative domain model and business rules.

Key points (see `BACKLOG.md` for the full ritual):

- Pick the next feature from the **Idea pool** by meaning (priority / readiness /
  dependencies), not by number.
- A feature gets its **build number** (`NNNN`) the moment work starts. That
  number is the through-line: branch `feat/NNNN-<slug>` → change
  `feat-NNNN-<slug>` (OpenSpec names must start with a letter).
- Commit scopes use the short project area / capability, not the build number:
  `docs(i18n): propose top-menu localization`, `feat(hikings): …`.
- Run each change through `propose → apply → archive`.

## Checkpoints — pause and hand back to the human

Stop and tell the user (do not proceed automatically) at these points:

- **After the feature spec/proposal is created, before implementation.** Present
  what will be built and wait for approval to start coding.

## Commands: who runs what

Commands the **agent may run** (read-only / verification):

- `npm run tsc` — type check
- `npm run lint` — lint
- `npm run test` — Vitest

Commands the **user runs** — do NOT execute these; instead tell the user the
exact command to run:

- `npm run dev`, `npm run build`, `npm run preview`
- Any package install. When a dependency is needed, tell the user **when** and the
  **exact command** (e.g. `npm i <pkg>` / `npm i -D <pkg>`) and why. Do not add or
  modify dependencies yourself.

## Token economy

Optimize for low token usage:

- Be concise; avoid restating unchanged context or large file dumps.
- Read narrowly (targeted ranges / specific files) instead of broad scans; reuse
  what's already in context.
- Prefer small, targeted edits over rewriting whole files.
- Don't pipe large command output into the chat; summarize.

If a repo/editor setting would meaningfully reduce token use, suggest it (and the
exact change) rather than applying it silently.

## Conventions (brief; full list in `openspec/config.yaml`)

- Path alias `@/` → `src/`. Barrel `index.ts` per folder.
- API returns snake_case; normalize to camelCase in `src/api/*`.
- Components never call the API directly — go through `src/hooks/*`.
- User-facing UI strings are in English.
- Verify changes with `npm run tsc && npm run lint && npm run test`.

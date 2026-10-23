# Agent Docs: Skills Matrix, graphify Rules, and Project Context

## Scope

Rewrite the AI agent guidance so every agent (Claude Code, Codex, Gemini, and
others) knows the project, uses the installed skills for the right tasks, and
queries and refreshes the graphify knowledge graph. Modeled on the
`sparta-energy` docs and adapted to this repository. No application code
changed.

## Context and Sources

- Previous `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `AI_RULES.md`,
  `ARCHITECTURE_PLAN.md`, `PRODUCT.md`, `README.md`, `.env.example`.
- `skills-lock.json` and the skill folders under `.agents/skills/`.
- Code: `lib/db/pools.ts`, `lib/services/store-service.ts`,
  `lib/services/telemetry-service.ts`, `lib/types.ts`, `app/` routes,
  `prisma.config.ts`, `.github/workflows/deploy.yml`, `Dockerfile`.
- Agent notes on the VPS migration, telemetry delta energy, rollover fix,
  phase normalization, monthly PLN cost card, and latest-date default.
- graphify output built on 2026-10-23 (`graphify-out/`).

## Changed Files

- `CLAUDE.md`: full Claude Code guide: required context, skills table,
  pnpm commands, env setup, architecture, directory map, data layer, domain
  rules, workflow, security, graphify rules, task notes, antislop block.
- `AGENTS.md`: same guide for Codex and other agents, keeping the existing
  governance, task-note, commit-enforcement, and Next.js sections; antislop
  paths point to `.agents/skills/`.
- `GEMINI.md`: points to `AGENTS.md`, adds the graphify rules, keeps the
  antislop block.
- `AI_CONTEXT.md` (new): domain context in Indonesian: users, flows, store
  status, telemetry rules, PLN cost, route and file map, handoff notes.
- `AI_RULES.md`: added skill enforcement (impeccable, antislop,
  systematic-debugging, verification-before-completion), graphify, Next.js,
  data access, and secrets rules. Existing rules kept.
- `ARCHITECTURE_PLAN.md`: env var table now matches the code
  (`SPARTA_DATABASE_URL`, `TELEMETRY_DATABASE_URL`, `DATABASE_URL` fallback);
  added data access layer and infrastructure history sections; removed the
  VPS IP address.
- `.env.example`: added `SPARTA_DATABASE_URL` and `TELEMETRY_DATABASE_URL`.
- `README.md`: project name and description, pointers to agent docs and
  graphify.
- `PRODUCT.md`: evidence list includes the new docs.
- `.claude/settings.json`: added a `PostToolUse` hook (Edit/Write/MultiEdit/
  NotebookEdit) that writes `graphify-out/.claude_needs_update`, and a `Stop`
  hook that runs `graphify update .` once per turn when that marker exists.
  The existing graphify `hook-guard` PreToolUse hooks are unchanged.
- `graphify-out/.graphify_build.json`: added `.codex` to the excludes. The new
  antislop copies in `.codex/skills/` had added 260 skill nodes to the graph.

## Decisions

- `AGENTS.md` and `CLAUDE.md` carry the same body so each tool reads one
  complete file. They must be kept in sync; `GEMINI.md` defers to
  `AGENTS.md` to avoid a third copy.
- `AI_RULES.md` stays the rulebook (must / must not); `AI_CONTEXT.md` holds
  domain knowledge; `AGENTS.md`/`CLAUDE.md` describe the project and the
  skill-to-task mapping.
- The user asked for graphify to be updated after every change. The update
  runs on `Stop` rather than after each edit, because one rebuild takes about
  7 seconds and parallel rebuilds could race on `graph.json`.
- `clerk-nextjs-patterns` is marked not applicable because auth is planned
  through better-auth SSO.
- The old architecture doc said `DATABASE_URL` pointed to DB 1. The code reads
  DB 1 from `SPARTA_DATABASE_URL`, so the docs follow the code.
- Store status documented as the code behaves: `live` when recording or
  online.

## Verification

- Checked every route, service export, and env var named in the docs against
  the source files.
- Searched the new and changed docs for the VPS IP and connection strings:
  none found.
- Piped test input into both hook commands; parsed `.claude/settings.json` as
  valid JSON; confirmed the PostToolUse hook wrote the marker after a real Edit.
- `graphify update .` after the `.codex` exclude: 683 nodes, 1,685 edges, 31
  communities, with no nodes from skill folders.

## Remaining Work and Risks

- `lib/services/store-service.ts` still hardcodes a fallback API host for
  `NEXT_PUBLIC_TELEMETRY_API_URL`; consider removing it.
- `lib/mock-data.ts` is no longer imported and can be deleted.
- `.env.example` still lists `GOOGLE_GENAI_API_KEY`, which no code reads.
- Any later change to `AGENTS.md` must be mirrored in `CLAUDE.md`.
- The hooks only see Claude Code file tools. Files changed by shell commands,
  or by other agents (Codex, Gemini), need a manual `graphify update .`.
- `graphify update .` is AST-only. Changed docs still need `/graphify . --update`
  for semantic re-extraction. Community labels are now stale (`graphify label`).
- The hooks call graphify by an absolute path under the current user's home
  folder, so on other machines they fail silently until that path is changed.

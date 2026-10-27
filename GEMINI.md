# GEMINI.md

This file provides guidance to Gemini agents working in this repository.

`AGENTS.md` is the full guide and applies to Gemini as written: required context, the skills table, commands, architecture, data layer, domain rules, task notes, and commit rules. Read it first, then `AI_RULES.md` and `AI_CONTEXT.md`. Installed skills for Gemini are under `.gemini/skills/`; the rest are under `.agents/skills/`.

## graphify

This project has a knowledge graph at `graphify-out/` (about 630 nodes, 1,600 edges, 21 communities) built from the code and the docs. The folders `.agents`, `.claude`, `.codex`, `.cursor`, `.gemini`, `.github`, and `.opencode` are excluded (see `graphify-out/.graphify_build.json`). When a new agent or skill folder appears, add it there before the next update.

The graph is refreshed automatically in Claude Code: a `PostToolUse` hook in `.claude/settings.json` marks the graph stale after any Edit/Write, and a `Stop` hook runs `graphify update .` once at the end of that turn. Other agents must run the update themselves.

Rules:
- When `graphify-out/graph.json` exists, run `graphify query "<question>"` before your first grep, search, or source-file read for a codebase question, and put this rule in every subagent prompt that explores code. Read raw files only for lines the graph or an earlier read already located. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than `GRAPH_REPORT.md` or raw grep output.
- If `graphify-out/wiki/index.md` exists, use it for broad navigation instead of raw source browsing.
- Read `graphify-out/GRAPH_REPORT.md` only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST only, no API cost). After changing docs or agent notes, run `/graphify . --update` so the changed docs are re-extracted.
- A committed `graphify-out/graph.json` is rewritten whole on every build, so a large diff to it in a pull request is expected. Do not flag it as churn or suggest skipping the graph rebuild or its hooks.
- Main communities in the graph:
  - **Store API Routes** and **Dashboard Overview & Map**: `store-service.ts`, `telemetry-service.ts`, `app/api/stores`, overview widgets.
  - **Store Detail Analytics** and **SVG Phase Gauges**: `components/monitoring`.
  - **Admin Shell & Navigation**: `components/layout`.
  - **3-Pillar Architecture Plan** and **Dual-DB Session Linking**: `ARCHITECTURE_PLAN.md` and the integration notes.
  - **Agent Governance Rules**: `AGENTS.md`, `AI_RULES.md`, task-note guard.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.gemini/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.gemini/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.gemini/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.gemini/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.gemini/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.gemini/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

# AGENTS.md

This file provides guidance to Codex and every other AI coding agent working in this repository. `CLAUDE.md` holds the same guidance for Claude Code; keep the two in sync.

## Required Project Context

Before starting work, every AI agent and developer must:

1. Read `AI_RULES.md`.
2. Read `skills-lock.json` and use every installed skill relevant to the task (see **Skills** below).
3. Read `AI_CONTEXT.md` for domain rules and the file map, and the canonical documents relevant to the task (`ARCHITECTURE_PLAN.md`, `PRODUCT.md`, `DESIGN.md`).
4. Query the knowledge graph (`graphify query "<question>"`) before searching or reading source files (see **graphify** below).
5. Read recent related notes in `docs/agent-notes/`, then verify current code and schema before relying on an older note.
6. Run `/impeccable init` before continuing when either `PRODUCT.md` or `DESIGN.md` does not exist.

Domain terms to keep: toko, cabang, perangkat (device), sesi rekaman (capture session), fase R/S/T, kWh, PLN.

## Required Task Note

Before finishing a task that changes files or project decisions:

1. Update canonical documentation when a permanent behavior or decision
   changed.
2. Create one note from `docs/agent-notes/TEMPLATE.md`.
3. Name it `docs/agent-notes/YYYY-MM-DD-HHMM-<task>.md` using Asia/Jakarta
   time.
4. Refresh the knowledge graph: `graphify update .` after code changes,
   `/graphify . --update` after doc changes.

Read-only exploration, status checks, and unchanged investigations do not
require a task note. Task notes must not include secrets, credentials, raw SQL
output, personal data, or production records.

## Local Commit Enforcement

Run this once after cloning the repository:

```powershell
pnpm setup:git-hooks
```

It configures `.githooks/pre-commit` for every local branch. Normal commits
that stage substantive changes without a dated task note are blocked.
`git commit --no-verify` is strictly prohibited because it bypasses this
required guard.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Skills

`skills-lock.json` lists the installed skills; `impeccable` and the `antislop` family are installed beside it under `.agents/skills/`. Use every skill that matches the task, and do not load skills that do not apply. Read a skill's `SKILL.md` before acting on the task it covers.

| When | Skill |
| :--- | :--- |
| Any task, at the start | `using-superpowers` |
| New feature, component, or behavior change | `brainstorming`, then `writing-plans` |
| Executing a written plan | `executing-plans` or `subagent-driven-development`; `dispatching-parallel-agents` for independent parts |
| Isolated feature work | `using-git-worktrees` |
| Any UI creation, revision, redesign, or polish | `impeccable` (required), `shadcn`, `antislop` + `antislop-ui`, `web-design-guidelines` |
| Responsive layout, accessibility, contrast | `antislop-layoutmobile`, `antislop-human` |
| UI copy, labels, docs prose | `antislop-copywriting` |
| Writing or cleaning code comments | `antislop-code` |
| Next.js routing, Server Components, data fetching | `nextjs-app-router-patterns`, `vercel-react-best-practices` |
| Cache Components or instant navigation | `next-cache-components-adoption`, `next-cache-components-optimizer` |
| Confirming a change works in the running app | `next-dev-loop` |
| Bug, failing check, unexpected behavior | `systematic-debugging` |
| New logic with testable behavior | `test-driven-development` |
| Prisma schema, client, CLI, or adapter work | `prisma-client-api`, `prisma-cli`, `prisma-database-setup`, `prisma-driver-adapter-implementation`, `prisma-upgrade-v7` (read the database rules in `AI_RULES.md` first) |
| Prisma Postgres or Prisma Compute | `prisma-postgres`, `prisma-postgres-setup`, `prisma-compute` (only if the user moves hosting there; production runs on Dokploy) |
| Stress-testing a plan or design | `grill-me`, `grill-with-docs` |
| Architecture or refactor review | `improve-codebase-architecture` |
| Before claiming done | `verification-before-completion` |
| Review requested or received | `requesting-code-review`, `receiving-code-review` |
| Finishing a branch | `finishing-a-development-branch` |
| Writing a commit message | `caveman-commit` |
| Creating or editing a skill | `writing-skills` |

`clerk-nextjs-patterns` does not apply: authentication is planned through better-auth SSO shared with `sparta-energy`, not Clerk.

## Quick Start

### Common Commands

```powershell
pnpm install
pnpm setup:git-hooks     # once per clone: enables the task-note pre-commit guard

pnpm dev                 # dev server (http://localhost:3000)
pnpm build               # production build (standalone output)
pnpm start               # serve the production build

pnpm lint                # ESLint
pnpm typecheck           # tsc --noEmit
pnpm format              # Prettier (ts, tsx)

pnpm check:agent-note    # same check the pre-commit hook runs
pnpm test:agent-note     # tests for that check
pnpm test:access         # role and access-scope rules (node --test)

pnpm prisma:validate     # allowed: does not touch the database
pnpm prisma:generate     # allowed: does not touch the database
pnpm copy:assets         # copy brand assets into public/assets
```

Unit tests use `node --test` on pure modules without `@/` imports (`tests/*.test.mjs`). Verify the rest with `pnpm typecheck`, `pnpm lint`, and the running app (`next-dev-loop`).

### Environment Setup

Copy `.env.example` to `.env` and ask which environment each URL points to before using it.

```
SPARTA_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/energy?sslmode=disable        # DB 1, stores
TELEMETRY_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/energy-meter?sslmode=disable # DB 2, telemetry
NEXT_PUBLIC_TELEMETRY_API_URL=http://HOST:5000/api   # smart-energy-meter-vps API (capture status)
NEXT_PUBLIC_TELEMETRY_WS_URL=ws://HOST:5000/ws
NEXT_PUBLIC_REALTIME_METER_URL=https://energy-meter.sparta-alfamart.web.id/
NEXT_PUBLIC_SPARTA_AUDIT_URL=http://localhost:3000
```

Use hostnames your machine can resolve. A Docker service name such as `sparta-database-xxxx` only resolves inside the Dokploy network and fails locally with `getaddrinfo ENOTFOUND`.

## Project Architecture

### High-Level Overview

**smart-energy-monitoring** is the visualization portal of the SPARTA energy ecosystem. It shows Alfamart stores on a map and in a gallery, marks each one LIVE, HISTORICAL, or UNASSIGNED based on its IoT meter, and charts 3-phase telemetry, energy consumption, and PLN cost per store.

**Core flows:**
1. **Overview** (`/`): KPI summary, monthly PLN cost card, network map, store analytics widget, store gallery and table.
2. **Monitoring list** (`/monitoring`): "Prioritas Pasang IoT" (12 Sangat Boros stores from SPARTA, installed or not), then the stores that already have an IoT device.
3. **Store detail** (`/monitoring/[storeId]`): store hero, live phase gauges, capture session selector, telemetry charts with day/week/month/year/session ranges, per-equipment sensor cards.
4. **Client-side switching**: widgets fetch `/api/stores/...` routes to change store, date, or range without a full page load.

### Directory Structure

```
app/
├── (dashboard)/
│   ├── layout.tsx                  # AdminShell (sidebar + header)
│   ├── page.tsx                    # / overview (force-dynamic)
│   └── monitoring/
│       ├── page.tsx                # /monitoring store list
│       └── [storeId]/page.tsx      # /monitoring/[storeId] store detail
├── api/
│   ├── assets/[filename]/route.ts  # serves brand assets
│   └── stores/
│       ├── route.ts                # getStores
│       └── [storeId]/
│           ├── route.ts            # getStoreById + getAuditSessions + getLiveTelemetry
│           ├── history/route.ts    # getTelemetryHistory (paginated, by metric and range)
│           ├── telemetry/route.ts  # getLiveTelemetry (latest phase values)
│           └── overview-analytics/route.ts  # getStoreAnalyticsData for a store and date
├── layout.tsx                      # root layout, fonts, ThemeProvider
└── globals.css                     # Tailwind 4 tokens

components/
├── ui/                             # shadcn/ui primitives (do not hand-edit spacing)
├── layout/                         # admin-shell, app-sidebar, app-header, breadcrumb-nav, theme-toggle
├── dashboard/                      # overview widgets: kpi summary, monthly cost card, map, gallery, table
├── monitoring/                     # store detail: gauges, telemetry chart, date picker, session selector
├── logo.tsx
└── theme-provider.tsx

lib/
├── auth/                          # access-rules (pure), access (per request), api-guard
├── db/pools.ts                     # pg pools: getSpartaPool (DB 1), getTelemetryPool (DB 2)
├── services/
│   ├── store-service.ts            # getStores, getStoreById, getIotDeviceDataList
│   ├── sangat-boros-service.ts     # v_toko_sangat_boros (DB 1 view), install status, comparison
│   └── telemetry-service.ts        # analytics, telemetry history, live phases, sessions, monthly cost
├── types.ts                        # Store, PhaseData, TelemetryPoint, AuditSession, MonthlyCostRecord, ...
├── mock-data.ts                    # legacy mock data, no longer imported
└── utils.ts                        # cn()

hooks/use-mobile.ts
prisma/schema.prisma                # generator + datasource only, no models yet
scripts/                            # agent-note check, asset copy
.githooks/pre-commit                # runs pnpm check:agent-note
.github/workflows/deploy.yml        # GHCR build + Dokploy webhook
```

### Technology Stack

- **Frontend:** Next.js 16.2 (App Router, Server Components), React 19.2, TypeScript, Tailwind CSS 4, shadcn/ui on `@base-ui/react`, lucide-react, next-themes, Recharts 3, Leaflet + react-leaflet.
- **Data:** PostgreSQL through `pg` pools with raw SQL. Prisma 7 is set up (`prisma.config.ts`, generator output `generated/prisma`) but has no models.
- **Deploy:** Docker (`node:22-alpine`, standalone output, port 3000), GitHub Actions to GHCR, Dokploy webhook.
- **Tooling:** pnpm, ESLint 9, Prettier with the Tailwind plugin.

## Data Layer

### Databases

| Pool | Env var | Database | Tables used |
| :--- | :--- | :--- | :--- |
| `getSpartaPool()` | `SPARTA_DATABASE_URL` | DB 1 `energy` (owned by `sparta-energy`) | `stores`, view `v_toko_sangat_boros` |
| `getTelemetryPool()` | `TELEMETRY_DATABASE_URL`, falls back to `DATABASE_URL`, then `AIVEN_DATABASE_URL` | DB 2 `energy_meter` (owned by `smart-energy-meter-vps`) | `devices`, `telemetry`, `history` |

- Pools are cached on `globalThis` in development. After changing `.env`, restart `pnpm dev`; hot reload keeps the old pool and the old connection string.
- `getAivenPool` is a backward-compatible alias of `getTelemetryPool`. Telemetry moved from Aiven to the Biznet VPS PostgreSQL in October 2026.
- `sslmode=disable` in the URL turns SSL off; otherwise SSL is on with `rejectUnauthorized: false`.
- This app never writes to either database and never changes their schema.

### Services

**`lib/services/store-service.ts`**
- `getStores()`: merges DB 1 stores with DB 2 devices, groups several devices that share a store code into one store, and sets the status.
- `getStoreById()`: one store with its IoT state.
- `getIotDeviceDataList()`: devices plus capture status from `NEXT_PUBLIC_TELEMETRY_API_URL/capture/status`.

**`lib/services/telemetry-service.ts`**
- `getStoreAnalyticsData()`: daily/weekly/monthly energy, load profile, two-year comparison, anchored to the store's latest recorded date.
- `getTelemetryHistory()`: paginated points (96 per day at 15 minutes) for a metric and time range.
- `getLiveTelemetry()`, `getAuditSessions()`, `getDailyConsumptionTrend()`, `getMonthlyCostSummary()`.

**`lib/services/sangat-boros-service.ts`**
- `getSangatBorosStores()`: reads `v_toko_sangat_boros` (12 Sangat Boros stores). Returns status `missing` when the view does not exist yet, so pages keep working.
- `withInstallStatus()`: marks each store Terpasang when its code matches a store from `getStores()`.
- `compareWithSangatBoros()`: per-day comparison of main panel kWh with the PLN bill and the standard. The view's columns are a contract with `sparta-energy` (see `ARCHITECTURE_PLAN.md` section 7).

## Access Control

Login happens in sparta-energy; this portal only reads the session. The concept lives in sparta-energy `docs/akses-role-admin-auditor-gs-area.md`.

| Role | Portal |
| :--- | :--- |
| `ADMIN`, `AUDITOR` | All devices |
| `GS` | Only devices in `user_device_access` (DB 1) |
| `USER` | Redirected to the sparta calculator (`/dashboard`) |
| `AREA` | Redirected to the sparta admin dashboard (`/admin/dashboard`) |

- `lib/auth/access-rules.ts`: pure role rules (no imports), tested with `pnpm test:access`.
- `lib/auth/access.ts`: `getRequestAccess()` (cached per request) reads cookie `sso_session`, then `session` and `users` in DB 1 (SELECT only). In development, cookie `dev_role` overrides the role and a simulated GS uses `DEV_GS_DEVICE_IDS`.
- Scope is enforced in the services: `getIotDeviceDataList()` drops devices outside the scope, so `getStores()`, `getStoreById()` and every store page and API follow; the two aggregate queries filter `device_id = ANY($1)`.
- `proxy.ts` only redirects pages without `sso_session` to the sparta login and stamps the request path header. `app/(dashboard)/layout.tsx` does the real role check.
- Loop guard: when `proxy.ts` sends a page to the sparta login it sets `sso_bounce` (60 s). A page request that comes back still without `sso_session` while `sso_bounce` lives goes to `/akses-ditolak?alasan=sesi`. An `sso_session` that matches no live session row gives status `invalid`; the layout sends it to `GET /api/auth/session-invalid`, which clears the cookie and redirects to the same page.
- API routes call `requireApiAccess()`. sparta calls with header `x-internal-token` (`MONITORING_INTERNAL_TOKEN`); while that env is empty, `GET /api/stores` stays open in development only; production answers 401. `/api/stores/[storeId]/history` and `/overview-analytics` validate query params with `lib/request-params.ts` and answer 400 on bad input. `/api/assets/[filename]` serves only bare image file names from `public/assets`. `next.config.ts` sets CSP and security headers; a new external origin (tiles, APIs) must be added to its CSP. `GET /api/internal/devices` feeds the GS checklist in sparta and needs the token.
- Until sparta runs its migration, `user_device_access` does not exist; error `42P01` means a GS user has no devices.
- Sign-out (sidebar "Keluar"): `POST` to sparta `/api/auth/sign-out` (deletes the session row, clears cookies), then portal `GET /api/auth/logout` clears `sso_session`/`dev_role` (and the `SSO_COOKIE_DOMAIN` cookie) and redirects to the sparta login.

## Domain Rules That Code Must Keep

Details and reasons are in `AI_CONTEXT.md`.

- **Store status:** `live` when the device is recording or online, `historical` when it has data but is offline, `unassigned` when no device is linked.
- **Dates:** group and filter by `Asia/Jakarta` in SQL (`TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta'`). Default views open on the latest recorded date, not today and not a hardcoded date.
- **Phases:** normalize `L12/L1/R` to R, `L13/L2/S` to S, `L14/L3/T` to T (the MQTT topics changed on 28 August 2026). Exclude `L6` and any phase containing `dummy`.
- **Energy:** consumption is the delta of the cumulative `energy` counter per interval, not the raw counter. If a delta exceeds what the average power allows for that interval, treat it as a counter reset and use average power × interval.
- **Sources:** combine `telemetry` and `history` when computing energy so the record has no gaps.
- **Cost:** PLN tariff is `1444.7` rupiah per kWh (`PLN_TARIFF` in `telemetry-service.ts`).
- **Store total:** only main panel phases R/S/T count as the store's total consumption (`mainPanelKwh`). Sub-metering sensors are excluded from baselines and reduction percentages so nothing is counted twice.
- **Sangat Boros:** the list comes from `v_toko_sangat_boros`; `is_demo` rows get the label "Uji coba"; the reduction percentage is compared per day, never a partial month against a full PLN month.
- **Number format:** `id-ID` locale; energy deltas use two decimals.

## Code Organization Patterns

### Server vs Client Components

- **Server Components** (default): pages in `app/(dashboard)` call services directly and pass data down as props. Pages that read live data export `dynamic = 'force-dynamic'`.
- **Client Components** (`'use client'`): charts, maps, pickers, and anything with state. Leaflet loads only on the client.
- **API routes** (`app/api/stores/...`): read-only JSON for client-side switching. They call the same services; they do not hold their own SQL.

### Component Patterns

- `components/ui/`: shadcn primitives. Add new ones with `npx shadcn@latest add <name>`.
- `components/dashboard/`, `components/monitoring/`: feature components composed from `ui/`. They take props and do not hardcode one store's data.
- `components/layout/`: the AdminShell. Keep it identical in structure to the SPARTA admin shell.

### Naming

- Files: kebab-case (`store-analytics-widget.tsx`). Components: PascalCase. Functions and variables: camelCase.
- Database columns are snake_case; map them to camelCase in `lib/types.ts` shapes inside the service layer.

## Development Workflow

### Adding a Feature

1. Query graphify for the area you are touching, then read the related agent notes.
2. `brainstorming`, then `writing-plans` for anything beyond a small fix.
3. Data: add or extend a function in `lib/services/`, with types in `lib/types.ts`. Reuse the pools.
4. API: add a route under `app/api/stores/` only when a client component must refetch.
5. UI: `impeccable` + `shadcn` first, then feature components.
6. Verify: `pnpm typecheck`, `pnpm lint`, and the running app through `next-dev-loop`.
7. Update canonical docs if a permanent rule changed, write the dated task note, run `graphify update .`.

### Debugging

- Use `systematic-debugging` before proposing a fix.
- `getaddrinfo ENOTFOUND <host>`: the database host cannot be resolved from where the app runs. Check `.env`, then restart the dev server so the cached pool is rebuilt.
- Charts with spikes or gaps: check the phase normalization, the `telemetry`/`history` union, and the rollover guard before touching the UI.

## Security Notes

- `.env*` is gitignored except `.env.example`. Never commit credentials or paste connection strings into docs, notes, or the graph.
- All SQL uses parameterized queries (`$1`, `$2`). Never interpolate request input into SQL.
- Both databases belong to other projects. Treat them as read-only and ask before running anything that could write.

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
- Core filter, always on: `antislop`: `.agents/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.agents/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.agents/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.agents/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.agents/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.agents/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

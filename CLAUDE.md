# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Required Context

Before starting any feature or significant change, read these files. They hold context that is not repeated here:

- `AI_RULES.md`: mandatory rules (skills, shadcn-first, reusable components, no manual spacing on shadcn, Prisma/database safety, Git safety).
- `AI_CONTEXT.md`: domain context in Indonesian (store status LIVE/HISTORICAL/UNASSIGNED, energy delta and rollover rules, R/S/T phase normalization, PLN cost, Asia/Jakarta dates) plus a route and file map.
- `ARCHITECTURE_PLAN.md`: the 3-pillar ecosystem (`sparta-energy`, `smart-energy-meter-vps`, `smart-energy-monitoring`), the dual database strategy, and the environment variables. This app only reads both databases; schema changes belong to the other two projects.
- `PRODUCT.md` and `DESIGN.md`: product purpose and visual rules (AdminShell identical to SPARTA admin, emerald `#2c7a57`, light mode first). If either file is missing, run `/impeccable init` first.
- `docs/agent-notes/`: dated task notes. Read the recent ones related to your task, then verify against current code before trusting them.
- `node_modules/next/dist/docs/`: this is Next.js 16.4 with breaking changes. Read the relevant guide before writing Next.js code.

Domain terms to keep: toko, cabang, perangkat (device), sesi rekaman (capture session), fase R/S/T, kWh, PLN.

## Skills

`skills-lock.json` lists the installed skills; `impeccable` and the `antislop` family are installed beside it. Use every skill that matches the task, and do not load skills that do not apply. Invoke a skill before acting on the task it covers.

| When | Skill |
| :--- | :--- |
| Any task, at the start | `using-superpowers` |
| New feature, component, or behavior change | `brainstorming`, then `writing-plans` |
| Executing a written plan | `executing-plans` or `subagent-driven-development`; `dispatching-parallel-agents` for independent parts |
| Isolated feature work | `using-git-worktrees` |
| Any UI creation, revision, redesign, or polish | `impeccable` (required), `shadcn`, `antislop` + `antislop-ui`, `web-design-guidelines`, `frontend-design` (aesthetic direction for new UI) |
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
pnpm test:access         # role, access-scope and sign-out rules (node --test)
pnpm test:data           # pure data modules: phase keys, live buffer, shared fetch, stale cache, read-only, session records

pnpm prisma:validate     # allowed: does not touch the database
pnpm prisma:generate     # allowed: does not touch the database
pnpm copy:assets         # copy brand assets into public/assets
```

Unit tests use `node --test` on pure modules without `@/` imports (`tests/*.test.mjs`). Pure modules in `lib/` import each other with relative paths that keep the `.ts` extension (allowed by `allowImportingTsExtensions` in `tsconfig.json`) and use `import type` for types. Verify the rest with `pnpm typecheck`, `pnpm lint`, and the running app (`next-dev-loop`).

### Environment Setup

Copy `.env.example` to `.env` and ask which environment each URL points to before using it.

```
SPARTA_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/energy?sslmode=disable        # DB 1, stores
TELEMETRY_DATABASE_URL=postgresql://USER:PASSWORD@HOST:5432/energy-meter?sslmode=disable # DB 2, telemetry
TELEMETRY_API_URL=http://HOST:5000/api               # server-only, live buffer; required in the Dokploy runtime env (the NEXT_PUBLIC_ fallback only works in pnpm dev)
NEXT_PUBLIC_TELEMETRY_API_URL=http://HOST:5000/api   # smart-energy-meter-vps API (capture status)
NEXT_PUBLIC_TELEMETRY_WS_URL=ws://HOST:5000/ws
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
│   ├── monitoring/
│   │   ├── page.tsx                # /monitoring store list
│   │   └── [storeId]/page.tsx      # /monitoring/[storeId] store detail
│   ├── perangkat/                  # devices, recording control, health and alerts
│   ├── laporan/page.tsx            # /laporan reports (Excel, CSV, print)
│   └── sesi-rekaman/page.tsx       # /sesi-rekaman recording session list
├── api/
│   ├── sessions/[sessionId]/records/route.ts  # getSessionRecords (history, READ ONLY)
│   ├── assets/[filename]/route.ts  # serves brand assets
│   └── stores/
│       ├── route.ts                # getStores
│       └── [storeId]/
│           ├── live/route.ts       # getStoreLiveBuffer (server proxy to Flask live buffer, shared cache)
│           ├── route.ts            # getStoreById + getAuditSessions + getLiveTelemetry
│           ├── history/route.ts    # getTelemetryHistory (paginated, by metric and range)
│           ├── telemetry/route.ts  # getLiveTelemetry (latest phase values)
│           └── overview-analytics/route.ts  # getStoreAnalyticsData for a store and date
├── layout.tsx                      # root layout, fonts, ThemeProvider
└── globals.css                     # Tailwind 4 tokens

components/
├── ui/                             # shadcn/ui primitives (do not hand-edit spacing)
├── layout/                         # admin-shell, app-sidebar, app-header, user-menu, breadcrumb-nav, theme-toggle
├── dashboard/                      # overview widgets: kpi summary, monthly cost card, map, gallery, table
├── monitoring/                     # store detail: gauges, telemetry chart, live chart, date picker, session selector
├── sessions/                       # session-table (recording session list)
├── logo.tsx
└── theme-provider.tsx

lib/
├── auth/                          # access-rules (pure), access (per request), api-guard
├── db/pools.ts                     # pg pools: getSpartaPool (DB 1), getTelemetryPool (DB 2)
├── services/
│   ├── store-service.ts            # getStores, getStoreById, getIotDeviceDataList
│   ├── live-buffer-service.ts      # getStoreLiveBuffer: Flask GET /api/live-buffer/<id> with shared cache
│   ├── session-service.ts          # getRecordingSessions, getSessionRecords (READ ONLY queries on history)
│   ├── telemetry-api.ts            # fetchTelemetryApi: server-side GET to Flask (TELEMETRY_API_URL)
│   ├── sangat-boros-service.ts     # v_toko_sangat_boros (DB 1 view), install status, comparison
│   └── telemetry-service.ts        # analytics, telemetry history, live phases, sessions, monthly cost
├── phase-keys.ts, live-buffer.ts, session-records.ts, shared-fetch.ts, stale-cache.ts, energy-index.ts, jakarta-range.ts, format-energy.ts  # pure modules (tested by test:data)
├── db/read-only.ts                 # readOnlyQuery: BEGIN READ ONLY + 15 s statement_timeout on getTelemetryPool()
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

- **Frontend:** Next.js 16.4 (App Router, Server Components), React 19.2, TypeScript, Tailwind CSS 4, shadcn/ui on `@base-ui/react`, lucide-react, next-themes, Recharts 3, Leaflet + react-leaflet.
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
- Ingestion and every write to DB 2 stay in Flask (`smart-energy-meter-vps`). Never run that project locally: it would subscribe to MQTT and record a second copy of the data.
- Session export to Excel runs in the browser (`lib/xlsx.ts`, no dependency). "Buka File Rekaman" is not built.

### Services

**`lib/services/store-service.ts`**
- `getStores()`: merges DB 1 stores with DB 2 devices, groups several devices that share a store code into one store, and sets the status.
- `getStoreById()`: one store with its IoT state.
- `getIotDeviceDataList()`: devices plus capture status from Flask `GET /api/capture/status` through `fetchTelemetryApi()` (`TELEMETRY_API_URL`), shared for 5 s with a 15 s pause after a failure; falls back to DB `capture_states`.

**`lib/services/telemetry-service.ts`**
- `getStoreAnalyticsData()`: daily/weekly/monthly energy, load profile, two-year comparison, anchored to the store's latest recorded date.
- `getTelemetryHistory()`: paginated points (96 per day at 15 minutes) for a metric and time range.
- `getLiveTelemetry()`, `getAuditSessions()`, `getMonthlyCostSummary()`.
- `getEnergyIndex()` (`lib/services/energy-service.ts`, pure rules in `lib/energy-index.ts`) is the only source for energy totals, daily and monthly kWh, cost, recorded dates and the load profile. It reads `history` and `telemetry` once as 15-minute buckets, then only rows past the last id every 60 s, with a full read every 6 h; it lives on `globalThis` because pages, API routes and `instrumentation.ts` are bundled apart. It holds every device, so callers ask only for devices in scope. Do not add new `MAX(energy) - MIN(energy)` queries over long periods: they miss counter resets.

**`lib/services/live-buffer-service.ts`, `telemetry-api.ts`**
- `getStoreLiveBuffer()`: latest samples of a store's device from Flask `GET /api/live-buffer/<device_id>`, called only from the server. `lib/shared-fetch.ts` allows at most 1 call per device per 3 s and pauses 15 s after a failure. The store to device lookup is cached per (access scope, store) for 60 s, so a GS revocation reaches this route within 60 s.

**`lib/services/session-service.ts`**
- `getRecordingSessions()` (cached 30 s per scope) and `getSessionRecords()` read `history` through `readOnlyQuery()` (`BEGIN READ ONLY`, 15 s statement timeout, 200,000 record cap). No `INSERT`, `UPDATE`, or `DELETE` here.

**`lib/services/health-service.ts`, `report-service.ts`**
- `getDeviceHealth()`: 30-day completeness per sensor and the alerts for `/perangkat` and the header bell (`GET /api/alerts`). Rules and limits live in `lib/alerts.ts` (`ALERT_LIMITS`), completeness in `lib/coverage.ts`. `devices.last_seen` is the device's own clock and can be hours off: use the energy index for the last sample time.
- `buildReport()` feeds `/laporan` through `GET /api/reports` (type, store, from, to; at most 366 days). Pure builders, CSV and param rules live in `lib/reports.ts`. Excel, CSV and print are made in the browser; nothing is stored. Sangat Boros is for scope `all` only.
- The energy index reads everything again when `buffered_telemetry.replayed_at` changes (at most every 15 minutes), because devices fill old rows in place after being offline.

**`lib/services/workbook-service.ts`, `report-template-store.ts`, `report-mail-service.ts`**
- `/laporan/excel`: custom workbooks (sheets, columns, stores, periods). Rules are pure in `lib/workbook.ts`; column labels in `REPORT_COLUMNS` are saved in templates, so do not rename them.
- Templates, schedules and send results are JSON files in `REPORT_DATA_DIR` (Dokploy volume at `/data`), never in a database. Only ADMIN sees or changes them.
- The scheduler starts from `instrumentation.ts` in production, checks every 60 s and runs with `runAsJob({ kind: 'all' })`. A slot is sent once: `claimSlot()` decides between containers, only clear failures repeat (3 times, 10 minutes apart), an unknown result never does.
- The sender account is set in `/laporan/email` (ADMIN) and kept in `mail-settings.json`; the password is sealed with `REPORT_SECRET_KEY` and bound to host, port and user (`lib/secret-box.ts`), so it never opens for another server. Email goes through `lib/smtp.ts` (TLS always), only to the allowed domains, with recipients in the envelope only. Never log recipients or settings.
- Users are recipients only while they subscribe (`/laporan`, own account, ADMIN and AUDITOR). `getSubscribers()` reads only those users from DB 1; recipients are resolved on every send. GS waits for per-store reports (`docs/backlog.md`).
- `/laporan/excel` edits the workbook on a live sheet (`sheet-surface.tsx`, data from `POST /api/reports/preview`, at most 25 rows) with a side panel; the rows match the downloaded file (`previewSheet`).
- Form controls use shadcn (`components/ui`, wrappers in `components/form-controls.tsx`); no native `<select>` or checkbox.

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
- API routes call `requireApiAccess()`. sparta calls with header `x-internal-token` (`MONITORING_INTERNAL_TOKEN`); while that env is empty, `GET /api/stores` stays open in development only; production answers 401. `/api/stores/[storeId]/history` and `/overview-analytics` validate query params with `lib/request-params.ts` and answer 400 on bad input. `/api/assets/[filename]` serves only bare image file names from `public/assets`. `next.config.ts` sets the other security headers; a new external origin (tiles, APIs) must be added to `lib/security-headers.ts`. `GET /api/internal/devices` feeds the GS checklist in sparta and needs the token.
- Until sparta runs its migration, `user_device_access` does not exist; error `42P01` means a GS user has no devices.
- **Device control** (`/perangkat`, `/sesi-rekaman` actions): ADMIN only, through `app/api/control/*` with `handleControl()` (role, Origin, body check, audit line). Flask does every write; the portal sends `X-Portal-Token` (`PORTAL_CONTROL_TOKEN`, same value in Flask) from the server and refuses to send anything while it is empty, because local environments point at the production Flask server. Commands are sent once, always name a device, and the state is read back; a timeout means the result is unknown. Delete asks for the session name and refuses a running session.
- Sign-out ("Keluar" in the sidebar and header profile menus): the browser POSTs to sparta `/api/auth/sign-out`, then to portal `POST /api/auth/logout`, which ends the session at sparta from the server when the cookie is still there, expires `sso_session` (host and `SSO_COOKIE_DOMAIN`) and `dev_role`, and returns the sparta login URL. Call `clearSessionCookie()` last: `response.cookies.set()` drops appended Set-Cookie headers.
- "Ganti Peran" (ADMIN and AUDITOR) links to sparta `/admin-entry`. The image is built without `NEXT_PUBLIC_*`, so client components get sparta URLs as props from `app/(dashboard)/layout.tsx`.
- `proxy.ts` sets the CSP per request (`lib/security-headers.ts`) because the sparta origin is only known at runtime. Redirects inside the portal use `relativeRedirect()`; `request.url` holds the container address.

## Domain Rules That Code Must Keep

Details and reasons are in `AI_CONTEXT.md`.

- **Store status:** `live` when the device is recording or online, `historical` when it has data but is offline, `unassigned` when no device is linked.
- **Dates:** group and filter by `Asia/Jakarta` in SQL (`TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta'`). Default views open on the latest recorded date, not today and not a hardcoded date.
- **Phases:** normalize `L12/L1/R` to R, `L13/L2/S` to S, `L14/L3/T` to T (the MQTT topics changed on 28 August 2026). Exclude `L6` and any phase containing `dummy`.
- **Energy:** consumption is the delta of the cumulative `energy` counter per interval, not the raw counter. If a delta exceeds what the average power allows for that interval, treat it as a counter reset and use average power × interval.
- **Bad samples:** sensor frames with voltage above 300 V or current above 500 A, and offline rows, are never used (`VALID_SAMPLE_SQL`). Time without records (more than 30 minutes) adds no energy, and month comparisons are per recorded hour.
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

## Task Notes and Commits

- Every task that changes files or project decisions ends with a note from `docs/agent-notes/TEMPLATE.md`, named `docs/agent-notes/YYYY-MM-DD-HHMM-<task>.md` in Asia/Jakarta time. No secrets, raw SQL output, personal data, or production records in notes.
- `git commit --no-verify` is prohibited. If the hook blocks a commit, add the missing note.

<!-- antislop:start -->
## antislop
For UI, copy, people, mobile layout, or code comments work, read these installed skill files directly (use these paths even if a same-named global skill exists):
- Core filter, always on: `antislop`: `.claude/skills/antislop/SKILL.md`
- UI / visual: `antislop-ui`: `.claude/skills/antislop-ui/SKILL.md`
- Copy & text: `antislop-copywriting`: `.claude/skills/antislop-copywriting/SKILL.md`
- People: `antislop-human`: `.claude/skills/antislop-human/SKILL.md`
- Mobile / responsive: `antislop-layoutmobile`: `.claude/skills/antislop-layoutmobile/SKILL.md`
- Code comments: `antislop-code`: `.claude/skills/antislop-code/SKILL.md`
Before starting, follow the core's "Two Usage Modes" section in strict order: explicit session instruction first, then global preference, then ask. A session instruction always wins. For a resolved mode, say `antislop active: <mode> (session override).` or `antislop active: <mode> (global preference).` once before presenting findings or making edits, using the actual mode and source. Acknowledging the user's request without naming the source does not replace this notice.
Only an explicit choice of antislop during or after selects a session mode. A request to review, audit, or avoid file edits does not select a mode; read the global preference in that case. Another skill's mode does not select antislop's mode.
If the mode is unresolved, ask during/after and end the response; wait for the answer before any UI review, planning, or concept. For read-only tasks, put the active-mode notice only at the start of the final answer, never in progress messages. For editing tasks, announce before the first edit and omit it from the final answer.
To update antislop later: `npx antislop-ai --update`, or run `npx antislop-ai` and pick Overwrite them.
<!-- antislop:end -->

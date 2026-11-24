# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 191 files · ~95,066 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1100 nodes · 2742 edges · 56 communities (53 shown, 3 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 216 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `8f2ff1eb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access.ts
- Rapikan File Graphify dan Isi Repo
- sangat-boros-service.ts
- (dashboard)/layout.tsx
- access-rules.ts
- 3-Pillar Architecture Plan
- app/layout.tsx
- next
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- cn
- getStoreAnalyticsData
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- monthly-cost-kpi-card.tsx
- ESLint Config
- PostCSS Config
- dotenv
- POST
- app-header.tsx
- CLAUDE.md
- telemetry-service.ts
- store-service.ts
- getRequestScope
- types.ts
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- lucide-react
- app-sidebar.tsx
- network-map-leaflet.tsx
- react
- Tambah skill frontend-design dari sparta-office
- SPARTA & Aiven Real Data Integration
- Tombol "Kembali ke SPARTA" di header portal
- dashboard-overview.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- session-service.ts
- session-invalid/route.ts
- SSO redirect loop guard
- stale-cache.test.mjs
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- logout/route.ts
- Portal Akses Role (Admin, Auditor, GS)
- next.config.ts
- GEMINI.md
- Dynamic Sensor Naming and Session Scoping
- Standardize GitHub Actions Deploy Workflow
- store-analytics-widget.tsx
- requireApiAccess
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints

## God Nodes (most connected - your core abstractions)
1. `cn()` - 123 edges
2. `next` - 32 edges
3. `Store` - 29 edges
4. `getStoreAnalyticsData()` - 27 edges
5. `react` - 27 edges
6. `lucide-react` - 25 edges
7. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
8. `MonthlyCostKpiCard()` - 23 edges
9. `requireApiAccess()` - 22 edges
10. `getTelemetryPool()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Tahap 2 (garis besar, dibuat sebagai plan terpisah)` --references--> `POST()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → app/api/auth/logout/route.ts
- `Context and Sources` --references--> `resolveRole()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/access-rules.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Global Constraints` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard Shell Phase 1 Build** — docs_superpowers_plans_2026_08_13_dashboard_shell_phase1, docs_agent_notes_2026_08_13_1615_mock_data_setup, docs_agent_notes_2026_08_13_1621_admin_shell_layout, docs_agent_notes_2026_08_13_1623_overview_gallery, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_lib_types, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_lib_mock_data, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_admin_shell_components, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_store_gallery [EXTRACTED 1.00]
- **Task-Note Governance Enforcement** — agents_required_task_note, agents_pre_commit_guard, ai_rules_no_verify_prohibition, docs_superpowers_plans_2026_07_29_project_governance_check_agent_task_note, docs_agent_notes_template, docs_superpowers_specs_2026_07_29_project_governance_design_sparta_maintenance_note_contract [EXTRACTED 1.00]
- **3-Pillar Smart Energy Ecosystem** — architecture_plan_sparta_energy, architecture_plan_smart_energy_meter_vps, architecture_plan_smart_energy_monitoring, architecture_plan_db1_sparta_energy, architecture_plan_db2_energy_meter, architecture_plan_dual_database_strategy [EXTRACTED 1.00]
- **SSR/CSR hydration mismatch fixes** — docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_id_id_locale_determinism, docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_suppress_hydration_warning, docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_buttonvariants_link_pattern, app_layout, components_dashboard_store_card [EXTRACTED 1.00]
- **Store Detail Sensor Card UI Evolution** — concept_summary_first_dashboard_hierarchy, concept_compact_metric_chips, concept_clean_equipment_names, concept_multi_select_phase_filtering [INFERRED 0.75]
- **Store-to-device session linking** — docs_agent_notes_2026_08_14_1030_iot_session_assignment_architecture_iot_audit_session, docs_agent_notes_2026_08_18_1130_dual_db_integration_architecture_store_id_column_devices_history, docs_agent_notes_2026_08_14_1030_iot_session_assignment_architecture_gps_via_store_master, docs_agent_notes_2026_08_24_1120_dynamic_sensor_naming_and_session_scoping_session_sensor_scoping [INFERRED 0.75]
- **Date Default and Timezone Resolution** — concept_asia_jakarta_timezone_alignment, concept_latest_recorded_date_default, concept_today_jakarta_fallback [INFERRED 0.85]
- **Energy kWh Correctness Fixes** — concept_per_phase_energy_delta, concept_phase_normalization, concept_interval_delta_energy, concept_physics_bounded_energy_guard [INFERRED 0.85]
- **Real data pipeline from SPARTA and Aiven DBs** — lib_db_pools, lib_services_store_service, lib_services_telemetry_service, docs_agent_notes_2026_08_21_1013_sparta_aiven_real_data_integration_aiven_iot_db, docs_agent_notes_2026_08_21_1013_sparta_aiven_real_data_integration_sparta_energy_db, docs_agent_notes_2026_08_18_1130_dual_db_integration_architecture_dual_database_architecture [INFERRED 0.85]

## Communities (56 total, 3 thin omitted)

### Community 0 - "access.ts"
Cohesion: 0.33
Nodes (11): Task 1: Aturan role dan lingkup (modul murni, TDD), getAssignedDeviceIds(), getRequestAccess, RequestAccess, isValidInternalToken(), parseDeviceIds(), resolveRole(), Role (+3 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "sangat-boros-service.ts"
Cohesion: 0.10
Nodes (26): StoreGalleryProps, SangatBorosPriorityProps, Changed Files, Context and Sources, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope, Verification (+18 more)

### Community 3 - "(dashboard)/layout.tsx"
Cohesion: 0.28
Nodes (9): DashboardLayout(), AccessCheckFailed(), PortalDecision, portalDecision(), Fetch, revokeSpartaSession(), ROLE_SWITCH_ROLES, roleSwitchUrl() (+1 more)

### Community 4 - "access-rules.ts"
Cohesion: 0.19
Nodes (14): dynamic, anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, DEV_ROLE_COOKIE, INTERNAL_TOKEN_HEADER, isRole(), PATHNAME_HEADER (+6 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.07
Nodes (25): ASSET_DIRS, CONTENT_TYPES, fontMono, inter, metadata, RootLayout(), isTypingTarget(), ThemeHotkey() (+17 more)

### Community 7 - "next"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+6 more)

### Community 8 - "Package Manifest"
Cohesion: 0.10
Nodes (27): devDependencies, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, shadcn@^4.23.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/leaflet@^1.9.22, @types/node@^20 (+19 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^1.27.0, next@16.4.6, pg@^8.23.0, @prisma/client@^7.9.1 (+10 more)

### Community 12 - "cn"
Cohesion: 0.12
Nodes (30): AvatarBadge(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), badgeVariants, Input(), Separator(), SidebarContext (+22 more)

### Community 13 - "getStoreAnalyticsData"
Cohesion: 0.18
Nodes (23): Codebase Map, dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, Data Layer, Databases (+15 more)

### Community 14 - "npm Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+8 more)

### Community 15 - "Cache per request untuk data toko dan halaman loading"
Cohesion: 0.25
Nodes (7): Cache per request untuk data toko dan halaman loading, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.18
Nodes (29): MonthlyCostKpiCard(), StatusBadge(), formatRelativeTime(), StoreTable(), formatDate(), formatKwh(), SangatBorosPriority(), DATE_OPTIONS (+21 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 22 - "POST"
Cohesion: 0.10
Nodes (20): POST(), Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification (+12 more)

### Community 23 - "app-header.tsx"
Cohesion: 0.14
Nodes (25): AdminShell(), AppHeader(), ThemeToggle(), ROLE_LABELS, ShellViewer, signOut(), SpartaLinks, UserMenuContent() (+17 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.16
Nodes (10): Smart-Energy-Meter-Vps project, PZEM Energy Counter Reset / Rollover, Fix Weekly Chart Switching and Timezone Alignment, Telemetry Interval Delta Energy, Fix Energy Meter Reset Rollover False Spike, compareWithSangatBoros(), _analyticsCache, _historyCache (+2 more)

### Community 26 - "store-service.ts"
Cohesion: 0.17
Nodes (14): Toko Sangat Boros, history table (session captures), telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Decisions, _deviceEnergyCache, extractStoreCode(), getIotDeviceDataList (+6 more)

### Community 27 - "getRequestScope"
Cohesion: 0.18
Nodes (14): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, NoAssignedDevices(), Changed Files, Backlog (+6 more)

### Community 28 - "types.ts"
Cohesion: 0.05
Nodes (74): emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, SessionSelectorProps, StoreHero(), StoreMonitoringPage() (+66 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.13
Nodes (14): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+6 more)

### Community 31 - "lucide-react"
Cohesion: 0.25
Nodes (14): GalleryToolbar(), SessionSelector(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton() (+6 more)

### Community 32 - "app-sidebar.tsx"
Cohesion: 0.21
Nodes (15): AppSidebar(), NavItem, NavItemButton(), navItems, initialsOf(), Logo(), LogoProps, Avatar() (+7 more)

### Community 33 - "network-map-leaflet.tsx"
Cohesion: 0.17
Nodes (12): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, Integrate Real Leaflet Mapping, leaflet@^1.9.4, react-dom@19.2.4 (+4 more)

### Community 34 - "react"
Cohesion: 0.29
Nodes (11): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+3 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "SPARTA & Aiven Real Data Integration"
Cohesion: 0.29
Nodes (7): Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig(), POOL_STATEMENT_TIMEOUT_MS

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "dashboard-overview.tsx"
Cohesion: 0.05
Nodes (44): DashboardLoading(), DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback() (+36 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "session-service.ts"
Cohesion: 0.05
Nodes (47): dynamic, GET(), dynamic, loadSessions(), metadata, SessionsPage(), Changed Files, Context and Sources (+39 more)

### Community 42 - "session-invalid/route.ts"
Cohesion: 0.29
Nodes (8): dynamic, GET(), Access Control, clearSessionCookie(), expiredSessionCookies(), relativeRedirect(), contentSecurityPolicy(), httpOrigin()

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "stale-cache.test.mjs"
Cohesion: 0.29
Nodes (3): createStaleCache(), Entry, StaleCacheOptions

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "logout/route.ts"
Cohesion: 0.67
Nodes (3): AccessDeniedPage(), metadata, spartaUrl()

### Community 47 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 48 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

### Community 50 - "Dynamic Sensor Naming and Session Scoping"
Cohesion: 0.11
Nodes (15): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture (+7 more)

### Community 51 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.50
Nodes (4): Dokploy Webhook CI/CD Deploy, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 53 - "store-analytics-widget.tsx"
Cohesion: 0.07
Nodes (35): CustomXAxisTick(), formatDateToIso(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget(), CustomXAxisTick() (+27 more)

### Community 56 - "requireApiAccess"
Cohesion: 0.18
Nodes (16): dynamic, GET(), isDeviceAllowed(), HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam(), parseHistoryParams() (+8 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **6 isolated node(s):** `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `sparta-energy project`, `getTelemetryChartData` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 353 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `app-sidebar.tsx`, `network-map-leaflet.tsx`, `react`, `(dashboard)/layout.tsx`, `access-rules.ts`, `access.ts`, `app/layout.tsx`, `dashboard-overview.tsx`, `Package Manifest`, `session-service.ts`, `Runtime Dependencies`, `getStoreAnalyticsData`, `logout/route.ts`, `next.config.ts`, `monthly-cost-kpi-card.tsx`, `store-analytics-widget.tsx`, `requireApiAccess`?**
  _High betweenness centrality (0.118) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `sangat-boros-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09852216748768473 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `app-sidebar.tsx`, `react`, `dashboard-overview.tsx`, `app/layout.tsx`, `monthly-cost-kpi-card.tsx`, `Dynamic Sensor Naming and Session Scoping`, `store-analytics-widget.tsx`, `app-header.tsx`, `types.ts`, `lucide-react`?**
  _High betweenness centrality (0.087) - this node is a cross-community bridge._
- **Should `3-Pillar Architecture Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.05485232067510549 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
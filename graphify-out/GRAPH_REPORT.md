# Graph Report - smart-energy-monitoring  (2026-11-03)

## Corpus Check
- 156 files · ~69,453 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 887 nodes · 2167 edges · 43 communities (37 shown, 6 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 121 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ecc44e1b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access.ts
- Rapikan File Graphify dan Isi Repo
- store-service.ts
- cn
- sangat-boros-service.ts
- 3-Pillar Architecture Plan
- app/layout.tsx
- Dual-Database Integration Architecture
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- monthly-cost-kpi-card.tsx
- (dashboard)/page.tsx
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- phase-gauge-grid.tsx
- ESLint Config
- PostCSS Config
- dotenv
- pg
- types.ts
- CLAUDE.md
- telemetry-service.ts
- getStoreById
- getStoreAnalyticsData
- @prisma/client@^7.9.1
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- store-analytics-widget.tsx
- getTelemetryHistory
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- request-params.ts
- recharts
- Standardize GitHub Actions Deploy Workflow
- Tombol "Kembali ke SPARTA" di header portal
- Global Constraints
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 125 edges
2. `next` - 30 edges
3. `Store` - 29 edges
4. `getStoreAnalyticsData()` - 25 edges
5. `lucide-react` - 25 edges
6. `react` - 24 edges
7. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
8. `MonthlyCostKpiCard()` - 23 edges
9. `AppSidebar()` - 22 edges
10. `IoT Session Assignment & Multi-Session Architecture` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Access Control` --references--> `requireApiAccess()`  [INFERRED]
  CLAUDE.md → lib/auth/api-guard.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
- `Scope` --references--> `getSangatBorosStores()`  [INFERRED]
  docs/agent-notes/2026-11-03-0702-sembunyikan-toko-demo-sangat-boros.md → lib/services/sangat-boros-service.ts
- `Context and Sources` --references--> `getStoreAnalyticsData()`  [INFERRED]
  docs/agent-notes/2026-10-23-1039-integrasi-sangat-boros.md → lib/services/telemetry-service.ts

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

## Communities (43 total, 6 thin omitted)

### Community 0 - "access.ts"
Cohesion: 0.06
Nodes (53): AccessDeniedPage(), metadata, dynamic, GET(), dynamic, GET(), DashboardLayout(), AccessCheckFailed() (+45 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "store-service.ts"
Cohesion: 0.16
Nodes (17): Data Layer, Databases, Aiven to Biznet VPS PostgreSQL Migration, Dual-Database Architecture (sparta_energy + energy_meter), Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig() (+9 more)

### Community 3 - "cn"
Cohesion: 0.06
Nodes (80): DashboardLoading(), AdminShell(), AppHeader(), AppSidebar(), initialsOf(), navGroups, NavItem, NavItemButton() (+72 more)

### Community 4 - "sangat-boros-service.ts"
Cohesion: 0.24
Nodes (14): Services, Default Analytics to Latest Recorded Date, Changed Files, compareWithSangatBoros(), getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT (+6 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.10
Nodes (17): ASSET_DIRS, CONTENT_TYPES, fontMono, inter, metadata, RootLayout(), isTypingTarget(), ThemeHotkey() (+9 more)

### Community 7 - "Dual-Database Integration Architecture"
Cohesion: 0.29
Nodes (5): IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture, 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), smart-energy-meter-vps (sister project), sparta-energy (sister project)

### Community 8 - "Package Manifest"
Cohesion: 0.11
Nodes (25): devDependencies, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/leaflet@^1.9.22, @types/node@^20, @types/pg@^8.23.1 (+17 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.2.6, next-themes@^0.4.6 (+14 more)

### Community 12 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.09
Nodes (52): DashboardKpiSummary(), GalleryToolbar(), GalleryToolbarProps, MonthlyCostKpiCard(), MonthlyCostKpiCardProps, StatusBadgeProps, formatRelativeTime(), StoreCard() (+44 more)

### Community 13 - "(dashboard)/page.tsx"
Cohesion: 0.27
Nodes (11): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, DashboardOverview(), NoAssignedDevices(), Changed Files (+3 more)

### Community 14 - "npm Scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+7 more)

### Community 15 - "Cache per request untuk data toko dan halaman loading"
Cohesion: 0.25
Nodes (7): Cache per request untuk data toko dan halaman loading, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (9): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, IotDeviceData, PhaseData (+1 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 23 - "types.ts"
Cohesion: 0.05
Nodes (55): DashboardKpiSummaryProps, DashboardOverviewProps, createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, NetworkMapLeaflet (+47 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.08
Nodes (22): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow (+14 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.15
Nodes (10): PZEM Energy Counter Reset / Rollover, Fix Weekly Chart Switching and Timezone Alignment, Telemetry Interval Delta Energy, Fix Energy Meter Reset Rollover False Spike, _analyticsCache, DEFAULT_PALETTE, _historyCache, _monthlyCostCache (+2 more)

### Community 26 - "getStoreById"
Cohesion: 0.29
Nodes (11): Codebase Map, dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, StoreMonitoringPage(), getAivenPool (+3 more)

### Community 27 - "getStoreAnalyticsData"
Cohesion: 0.18
Nodes (14): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+6 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.09
Nodes (21): AI Context - SPARTA Smart Energy Monitoring, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase, Notes for AI Handoff (+13 more)

### Community 31 - "store-analytics-widget.tsx"
Cohesion: 0.09
Nodes (32): CustomXAxisTick(), formatDateToIso(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget(), CustomXAxisTick() (+24 more)

### Community 32 - "getTelemetryHistory"
Cohesion: 0.24
Nodes (11): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, deviceScopeFilter() (+3 more)

### Community 33 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 34 - "request-params.ts"
Cohesion: 0.12
Nodes (16): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam(), parseHistoryParams() (+8 more)

### Community 36 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **6 isolated node(s):** `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData`, `August 28 MQTT Topic Format Migration`, `.gitignore` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 276 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `access.ts` to `cn`, `app/layout.tsx`, `Package Manifest`, `Runtime Dependencies`, `monthly-cost-kpi-card.tsx`, `types.ts`, `getStoreById`, `getStoreAnalyticsData`, `store-analytics-widget.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `access.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05789235639981909 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `app/layout.tsx`, `monthly-cost-kpi-card.tsx`, `(dashboard)/page.tsx`, `phase-gauge-grid.tsx`, `types.ts`, `getStoreById`, `store-analytics-widget.tsx`?**
  _High betweenness centrality (0.113) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.05563853622106049 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
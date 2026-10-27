# Graph Report - smart-energy-monitoring  (2026-10-26)

## Corpus Check
- 142 files · ~84,618 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 789 nodes · 2011 edges · 39 communities (36 shown, 3 thin omitted)
- Extraction: 93% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 130 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `edd25e62`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access.ts
- Rapikan File Graphify dan Isi Repo
- store-service.ts
- cn
- sangat-boros-service.ts
- 3-Pillar Architecture Plan
- next
- telemetry-service.ts
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- Dev Dependencies
- gallery-toolbar.tsx
- npm Scripts
- network-map-leaflet.tsx
- Asset Copy Script
- phase-gauge-grid.tsx
- ESLint Config
- PostCSS Config
- store-hero.tsx
- types.ts
- monthly-cost-kpi-card.tsx
- CLAUDE.md
- pools.ts
- mock-data.ts
- store-detail-analytics.tsx
- getStoreAnalyticsData
- requireApiAccess
- AI Context - SPARTA Smart Energy Monitoring
- store-monitoring-page.tsx
- (dashboard)/page.tsx
- telemetry-date-picker.tsx
- getTelemetryHistory
- Global Constraints
- Standardize GitHub Actions Deploy Workflow
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 123 edges
2. `Store` - 29 edges
3. `next` - 27 edges
4. `getStoreAnalyticsData()` - 25 edges
5. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
6. `MonthlyCostKpiCard()` - 23 edges
7. `lucide-react` - 23 edges
8. `react` - 22 edges
9. `AppSidebar()` - 21 edges
10. `getStores()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
- `Context and Sources` --references--> `resolveRole()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/access-rules.ts
- `Access Control` --references--> `requireApiAccess()`  [INFERRED]
  CLAUDE.md → lib/auth/api-guard.ts
- `Changed Files` --references--> `requireApiAccess()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/api-guard.ts

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

## Communities (39 total, 3 thin omitted)

### Community 0 - "access.ts"
Cohesion: 0.09
Nodes (35): AccessDeniedPage(), metadata, dynamic, GET(), DashboardLayout(), AccessCheckFailed(), Context and Sources, Decisions (+27 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "store-service.ts"
Cohesion: 0.15
Nodes (17): Toko Sangat Boros, dynamic, GET(), Access Control, Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks (+9 more)

### Community 3 - "cn"
Cohesion: 0.05
Nodes (84): AdminShell(), AppHeader(), AppSidebar(), initialsOf(), navGroups, NavItem, NavItemButton(), ROLE_LABELS (+76 more)

### Community 4 - "sangat-boros-service.ts"
Cohesion: 0.30
Nodes (11): Changed Files, compareWithSangatBoros(), getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT, toNumber(), toOptionalNumber() (+3 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.06
Nodes (55): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+47 more)

### Community 6 - "next"
Cohesion: 0.07
Nodes (22): fontMono, inter, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+14 more)

### Community 7 - "telemetry-service.ts"
Cohesion: 0.20
Nodes (10): PZEM Energy Counter Reset / Rollover, Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Fix Energy Meter Reset Rollover False Spike, _analyticsCache, DEFAULT_PALETTE (+2 more)

### Community 8 - "Package Manifest"
Cohesion: 0.09
Nodes (21): name, private, type, version, clsx, dotenv, prettier, prettier-plugin-tailwindcss (+13 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.12
Nodes (17): dependencies, @base-ui/react, class-variance-authority, clsx, leaflet, lucide-react, next, next-themes (+9 more)

### Community 12 - "Dev Dependencies"
Cohesion: 0.13
Nodes (15): devDependencies, dotenv, eslint, eslint-config-next, prettier, prettier-plugin-tailwindcss, prisma, tailwindcss (+7 more)

### Community 13 - "gallery-toolbar.tsx"
Cohesion: 0.10
Nodes (24): GalleryToolbar(), GalleryToolbarProps, StatusBadgeProps, SessionSelector(), SessionSelectorProps, Input(), SelectContent(), SelectGroup() (+16 more)

### Community 14 - "npm Scripts"
Cohesion: 0.14
Nodes (14): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+6 more)

### Community 15 - "network-map-leaflet.tsx"
Cohesion: 0.23
Nodes (9): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, Integrate Real Leaflet Mapping, leaflet, react-dom (+1 more)

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "phase-gauge-grid.tsx"
Cohesion: 0.18
Nodes (10): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, Dynamic Sensor Naming and Session Scoping, IotDeviceData (+2 more)

### Community 18 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 21 - "store-hero.tsx"
Cohesion: 0.20
Nodes (4): StoreHero(), StoreMonitoringPage(), Bugfix: Hydration & Base UI Button, Sidebar Active Indicator and Modern Hover

### Community 22 - "types.ts"
Cohesion: 0.18
Nodes (9): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData(), Dashboard Time-Grain Switcher and Real Monthly History, LoadProfilePoint, MonthlyTrendSummary, PaginationMeta (+1 more)

### Community 23 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.09
Nodes (54): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostKpiCard(), MonthlyCostKpiCardProps, NetworkMapLeaflet, NetworkMapWidget() (+46 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "pools.ts"
Cohesion: 0.33
Nodes (7): Data Layer, Databases, Remove Hardcoded DB Secrets, createPoolConfig(), getSpartaPool(), getTelemetryPool(), pg

### Community 26 - "mock-data.ts"
Cohesion: 0.25
Nodes (5): StoreMonitoringPageProps, MOCK_AUDIT_SESSIONS, MOCK_STORES, AuditSession, TelemetryHistoryResult

### Community 27 - "store-detail-analytics.tsx"
Cohesion: 0.15
Nodes (13): CustomXAxisTick(), formatDateToIso(), formatPct(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, SangatBorosComparisonBar() (+5 more)

### Community 28 - "getStoreAnalyticsData"
Cohesion: 0.34
Nodes (12): Codebase Map, dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, Services, getAivenPool (+4 more)

### Community 29 - "requireApiAccess"
Cohesion: 0.23
Nodes (9): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+1 more)

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.14
Nodes (13): AI Context - SPARTA Smart Energy Monitoring, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase, Notes for AI Handoff (+5 more)

### Community 31 - "store-monitoring-page.tsx"
Cohesion: 0.19
Nodes (19): METRIC_CONFIG, TelemetryChart(), TelemetryChartProps, Compact Interactive Sensor Metric Chips, Multi-Select Phase Filtering with Total Daya Beban, Time Range Modes (Harian, Bulanan, Tahunan, Sesi Audit), Monitoring Detail Page Setup, Fix Weekly Chart Switching and Timezone Alignment (+11 more)

### Community 32 - "(dashboard)/page.tsx"
Cohesion: 0.27
Nodes (11): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, StoreGallery(), NoAssignedDevices(), Changed Files (+3 more)

### Community 33 - "telemetry-date-picker.tsx"
Cohesion: 0.22
Nodes (9): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Interactive Telemetry Date Calendar Picker (+1 more)

### Community 34 - "getTelemetryHistory"
Cohesion: 0.23
Nodes (11): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, deviceScopeFilter() (+3 more)

### Community 35 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 36 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **19 isolated node(s):** `@prisma/client`, `shadcn`, `tw-animate-css`, `@tailwindcss/postcss`, `@types/leaflet` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 258 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `telemetry-date-picker.tsx`, `next`, `gallery-toolbar.tsx`, `phase-gauge-grid.tsx`, `store-hero.tsx`, `monthly-cost-kpi-card.tsx`, `store-detail-analytics.tsx`, `store-monitoring-page.tsx`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@prisma/client`, `shadcn`, `tw-animate-css` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `access.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08788159111933395 - nodes in this community are weakly interconnected._
- **Why does `next` connect `access.ts` to `store-service.ts`, `cn`, `next`, `Package Manifest`, `network-map-leaflet.tsx`, `monthly-cost-kpi-card.tsx`, `getStoreAnalyticsData`, `requireApiAccess`?**
  _High betweenness centrality (0.110) - this node is a cross-community bridge._
- **Should `store-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14761904761904762 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
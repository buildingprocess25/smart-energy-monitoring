# Graph Report - smart-energy-monitoring  (2026-10-23)

## Corpus Check
- 129 files · ~79,896 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 712 nodes · 1800 edges · 24 communities (21 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 106 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a8a93522`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- check-agent-task-note.mjs
- Store API Routes
- cn
- store-monitoring-page.tsx
- 3-Pillar Architecture Plan
- app-sidebar.tsx
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- Dev Dependencies
- SVG Phase Gauges
- npm Scripts
- Asset Copy Script
- ESLint Config
- PostCSS Config
- types.ts
- CLAUDE.md
- AI Context - SPARTA Smart Energy Monitoring
- store-analytics-widget.tsx
- network-map-leaflet.tsx
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- GEMINI.md

## God Nodes (most connected - your core abstractions)
1. `cn()` - 123 edges
2. `Store` - 29 edges
3. `getStoreAnalyticsData()` - 25 edges
4. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
5. `MonthlyCostKpiCard()` - 23 edges
6. `lucide-react` - 23 edges
7. `react` - 21 edges
8. `next` - 20 edges
9. `IoT Session Assignment & Multi-Session Architecture` - 20 edges
10. `AppSidebar()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `Changed Files` --references--> `StoreAnalyticsResult`  [INFERRED]
  docs/agent-notes/2026-10-23-1039-integrasi-sangat-boros.md → lib/types.ts
- `Changed Files` --references--> `SangatBorosStore`  [INFERRED]
  docs/agent-notes/2026-10-23-1039-integrasi-sangat-boros.md → lib/types.ts
- `Changed Files` --references--> `SangatBorosPriorityItem`  [INFERRED]
  docs/agent-notes/2026-10-23-1039-integrasi-sangat-boros.md → lib/types.ts
- `Changed Files` --references--> `SangatBorosListStatus`  [INFERRED]
  docs/agent-notes/2026-10-23-1039-integrasi-sangat-boros.md → lib/types.ts
- `Codebase Map` --references--> `getSpartaPool()`  [INFERRED]
  AI_CONTEXT.md → lib/db/pools.ts

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

## Communities (24 total, 3 thin omitted)

### Community 0 - "check-agent-task-note.mjs"
Cohesion: 0.23
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 2 - "Store API Routes"
Cohesion: 0.05
Nodes (78): Codebase Map, Toko Sangat Boros, dynamic, GET(), dynamic, GET(), dynamic, GET() (+70 more)

### Community 3 - "cn"
Cohesion: 0.07
Nodes (74): DashboardLayout(), GalleryToolbar(), MonthlyCostKpiCard(), AdminShell(), AppHeader(), BreadcrumbNav(), ROUTE_LABELS, SessionSelector() (+66 more)

### Community 4 - "store-monitoring-page.tsx"
Cohesion: 0.11
Nodes (28): StoreHero(), StoreHeroProps, StoreMonitoringPage(), METRIC_CONFIG, TelemetryChart(), TelemetryChartProps, Compact Interactive Sensor Metric Chips, Dokploy Webhook CI/CD Deploy (+20 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.06
Nodes (55): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+47 more)

### Community 6 - "app-sidebar.tsx"
Cohesion: 0.06
Nodes (44): fontMono, inter, metadata, RootLayout(), AppSidebar(), navGroups, NavItem, NavItemButton() (+36 more)

### Community 8 - "Package Manifest"
Cohesion: 0.09
Nodes (22): name, private, type, version, clsx, dotenv, pg, prettier (+14 more)

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

### Community 13 - "SVG Phase Gauges"
Cohesion: 0.11
Nodes (15): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture (+7 more)

### Community 14 - "npm Scripts"
Cohesion: 0.15
Nodes (13): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+5 more)

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 18 - "ESLint Config"
Cohesion: 0.50
Nodes (3): eslintConfig, eslint, eslint-config-next

### Community 23 - "types.ts"
Cohesion: 0.06
Nodes (55): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverviewProps, GalleryToolbarProps, MonthlyCostKpiCardProps, NetworkMapLeaflet, NetworkMapWidget(), NetworkMapWidgetProps (+47 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.14
Nodes (13): AI Context - SPARTA Smart Energy Monitoring, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase, Notes for AI Handoff (+5 more)

### Community 31 - "store-analytics-widget.tsx"
Cohesion: 0.07
Nodes (34): DashboardOverview(), CustomXAxisTick(), formatDateToIso(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget() (+26 more)

### Community 34 - "network-map-leaflet.tsx"
Cohesion: 0.23
Nodes (9): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, Integrate Real Leaflet Mapping, leaflet, react-dom (+1 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **19 isolated node(s):** `@prisma/client`, `shadcn`, `tw-animate-css`, `@tailwindcss/postcss`, `@types/leaflet` (+14 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 231 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `cn` to `store-monitoring-page.tsx`, `app-sidebar.tsx`, `SVG Phase Gauges`, `types.ts`, `store-analytics-widget.tsx`?**
  _High betweenness centrality (0.153) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `@prisma/client`, `shadcn`, `tw-animate-css` to the rest of the system?**
  _19 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Store API Routes` be split into smaller, more focused modules?**
  _Cohesion score 0.05194805194805195 - nodes in this community are weakly interconnected._
- **Why does `next` connect `app-sidebar.tsx` to `Store API Routes`, `cn`, `network-map-leaflet.tsx`, `Package Manifest`, `types.ts`, `store-analytics-widget.tsx`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **Should `cn` be split into smaller, more focused modules?**
  _Cohesion score 0.06710526315789474 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
# Graph Report - smart-energy-monitoring  (2026-11-03)

## Corpus Check
- 154 files · ~68,962 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 874 nodes · 2168 edges · 43 communities (40 shown, 3 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 134 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `45f1a581`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access.ts
- Rapikan File Graphify dan Isi Repo
- store-service.ts
- sidebar.tsx
- sangat-boros-service.ts
- 3-Pillar Architecture Plan
- app/layout.tsx
- app-sidebar.tsx
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- gallery-toolbar.tsx
- (dashboard)/page.tsx
- npm Scripts
- network-map-leaflet.tsx
- Asset Copy Script
- phase-gauge-grid.tsx
- ESLint Config
- PostCSS Config
- dropdown-menu.tsx
- getStores
- cn
- CLAUDE.md
- telemetry-service.ts
- getStoreById
- getStoreAnalyticsData
- breadcrumb.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- store-monitoring-page.tsx
- getTelemetryHistory
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- request-params.ts
- cn
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
6. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
7. `MonthlyCostKpiCard()` - 23 edges
8. `react` - 23 edges
9. `AppSidebar()` - 22 edges
10. `getStores()` - 21 edges

## Surprising Connections (you probably didn't know these)
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
- `Scope` --references--> `getSangatBorosStores()`  [INFERRED]
  docs/agent-notes/2026-11-03-0702-sembunyikan-toko-demo-sangat-boros.md → lib/services/sangat-boros-service.ts
- `Context and Sources` --references--> `resolveRole()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/access-rules.ts
- `Access Control` --references--> `requireApiAccess()`  [INFERRED]
  CLAUDE.md → lib/auth/api-guard.ts

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

## Communities (43 total, 3 thin omitted)

### Community 0 - "access.ts"
Cohesion: 0.06
Nodes (54): AccessDeniedPage(), metadata, dynamic, GET(), dynamic, GET(), DashboardLayout(), AccessCheckFailed() (+46 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "store-service.ts"
Cohesion: 0.18
Nodes (14): Data Layer, Databases, Aiven to Biznet VPS PostgreSQL Migration, Dual-Database Architecture (sparta_energy + energy_meter), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, VPS Database Migration and Dynamic Equipment Monitoring, createPoolConfig() (+6 more)

### Community 3 - "sidebar.tsx"
Cohesion: 0.11
Nodes (26): Separator(), SidebarContext, SidebarContextProps, SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel(), SidebarMenuAction() (+18 more)

### Community 4 - "sangat-boros-service.ts"
Cohesion: 0.29
Nodes (11): Changed Files, compareWithSangatBoros(), getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT, toNumber(), toOptionalNumber() (+3 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.09
Nodes (19): ASSET_DIRS, CONTENT_TYPES, fontMono, inter, metadata, RootLayout(), isTypingTarget(), ThemeHotkey() (+11 more)

### Community 7 - "app-sidebar.tsx"
Cohesion: 0.14
Nodes (23): AdminShell(), AppHeader(), AppSidebar(), initialsOf(), navGroups, NavItem, NavItemButton(), ROLE_LABELS (+15 more)

### Community 8 - "Package Manifest"
Cohesion: 0.09
Nodes (29): devDependencies, dotenv@^17.4.2, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, prisma@^7.9.1, tailwindcss@^4, @tailwindcss/postcss@^4, @types/leaflet@^1.9.22 (+21 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.11
Nodes (18): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+10 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^1.27.0, next@16.2.6, pg@^8.23.0, @prisma/client@^7.9.1 (+10 more)

### Community 12 - "gallery-toolbar.tsx"
Cohesion: 0.21
Nodes (15): GalleryToolbar(), SessionSelector(), Input(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+7 more)

### Community 13 - "(dashboard)/page.tsx"
Cohesion: 0.22
Nodes (15): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, DashboardOverview(), NoAssignedDevices(), Changed Files (+7 more)

### Community 14 - "npm Scripts"
Cohesion: 0.13
Nodes (15): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+7 more)

### Community 15 - "network-map-leaflet.tsx"
Cohesion: 0.17
Nodes (12): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, Integrate Real Leaflet Mapping, leaflet@^1.9.4, react-dom@19.2.4 (+4 more)

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "phase-gauge-grid.tsx"
Cohesion: 0.12
Nodes (14): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture (+6 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "dropdown-menu.tsx"
Cohesion: 0.18
Nodes (12): ThemeToggle(), Button(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+4 more)

### Community 22 - "getStores"
Cohesion: 0.18
Nodes (14): Toko Sangat Boros, dynamic, GET(), Access Control, Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks (+6 more)

### Community 23 - "cn"
Cohesion: 0.06
Nodes (64): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverviewProps, GalleryToolbarProps, MonthlyCostKpiCard(), MonthlyCostKpiCardProps, NetworkMapLeaflet, NetworkMapWidget() (+56 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.20
Nodes (9): PZEM Energy Counter Reset / Rollover, SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), Telemetry Interval Delta Energy, Fix Energy Meter Reset Rollover False Spike, _analyticsCache, DEFAULT_PALETTE, _historyCache (+1 more)

### Community 26 - "getStoreById"
Cohesion: 0.35
Nodes (10): Codebase Map, dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, Services, getStoreById() (+2 more)

### Community 27 - "getStoreAnalyticsData"
Cohesion: 0.27
Nodes (8): dynamic, GET(), dynamic, GET(), dynamic, GET(), requireApiAccess(), getStoreAnalyticsData()

### Community 28 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.14
Nodes (13): AI Context - SPARTA Smart Energy Monitoring, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase, Notes for AI Handoff (+5 more)

### Community 31 - "store-monitoring-page.tsx"
Cohesion: 0.05
Nodes (60): CustomXAxisTick(), formatDateToIso(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget(), StoreAnalyticsWidgetProps (+52 more)

### Community 32 - "getTelemetryHistory"
Cohesion: 0.27
Nodes (9): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, getSensorColor() (+1 more)

### Community 33 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 34 - "request-params.ts"
Cohesion: 0.11
Nodes (18): dynamic, GET(), Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, HistoryParams, isIsoDate(), MAX_PAGE_SIZE (+10 more)

### Community 35 - "cn"
Cohesion: 0.46
Nodes (7): Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), cn()

### Community 36 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "Global Constraints"
Cohesion: 0.29
Nodes (6): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

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
- **6 isolated node(s):** `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `sparta-energy project`, `.gitignore` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 269 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `access.ts` to `request-params.ts`, `app/layout.tsx`, `app-sidebar.tsx`, `Package Manifest`, `Runtime Dependencies`, `network-map-leaflet.tsx`, `getStores`, `cn`, `getStoreById`, `getStoreAnalyticsData`, `breadcrumb.tsx`, `store-monitoring-page.tsx`?**
  _High betweenness centrality (0.125) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `access.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.05926251097453907 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `sidebar.tsx`, `app/layout.tsx`, `app-sidebar.tsx`, `gallery-toolbar.tsx`, `(dashboard)/page.tsx`, `phase-gauge-grid.tsx`, `dropdown-menu.tsx`, `cn`, `breadcrumb.tsx`, `store-monitoring-page.tsx`?**
  _High betweenness centrality (0.116) - this node is a cross-community bridge._
- **Should `sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10873440285204991 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
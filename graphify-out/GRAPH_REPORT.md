# Graph Report - smart-energy-monitoring  (2026-11-23)

## Corpus Check
- 178 files · ~90,866 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1033 nodes · 2595 edges · 59 communities (56 shown, 3 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 198 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `87bfae47`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access.ts
- Rapikan File Graphify dan Isi Repo
- sangat-boros-service.ts
- app-sidebar.tsx
- types.ts
- 3-Pillar Architecture Plan
- app/layout.tsx
- next
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- sidebar.tsx
- getStoreAnalyticsData
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- Struktur File
- ESLint Config
- PostCSS Config
- dotenv
- Store
- live-buffer.ts
- CLAUDE.md
- telemetry-service.ts
- store-service.ts
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- IoT Session Assignment & Multi-Session Architecture
- getTelemetryPool
- dropdown-menu.tsx
- sangat-boros-service.ts
- Tambah skill frontend-design dari sparta-office
- cn
- Tombol "Kembali ke SPARTA" di header portal
- store-table.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- session-service.ts
- network-map-leaflet.tsx
- lucide-react
- app/layout.tsx
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- react
- sheet.tsx
- utils.ts
- GEMINI.md
- Dynamic Sensor Naming and Session Scoping
- Alamat API Flask dan cache status capture
- live-buffer-service.ts
- store-analytics-widget.tsx
- Standardize GitHub Actions Deploy Workflow
- next.config.ts
- requireApiAccess
- Pindah fitur Smart Energy Meter ke portal: Tahap 1
- Task 5: Data record sesi dan route-nya

## God Nodes (most connected - your core abstractions)
1. `cn()` - 125 edges
2. `next` - 34 edges
3. `Store` - 29 edges
4. `react` - 26 edges
5. `getStoreAnalyticsData()` - 25 edges
6. `lucide-react` - 25 edges
7. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
8. `MonthlyCostKpiCard()` - 23 edges
9. `AppSidebar()` - 22 edges
10. `requireApiAccess()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Access Control` --references--> `requireApiAccess()`  [INFERRED]
  CLAUDE.md → lib/auth/api-guard.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Global Constraints` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/auth/api-guard.ts
- `Jaminan untuk Alur IoT` --references--> `getTelemetryPool()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/pools.ts
- `Task 1: Modul fase bersama` --references--> `sensorColor()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/phase-keys.ts

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

## Communities (59 total, 3 thin omitted)

### Community 0 - "access.ts"
Cohesion: 0.06
Nodes (56): AccessDeniedPage(), metadata, dynamic, GET(), dynamic, GET(), DashboardLayout(), AccessCheckFailed() (+48 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "sangat-boros-service.ts"
Cohesion: 0.18
Nodes (19): StoreGalleryProps, SangatBorosPriorityProps, Changed Files, getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT, toNumber() (+11 more)

### Community 3 - "app-sidebar.tsx"
Cohesion: 0.15
Nodes (22): AdminShell(), AppSidebar(), initialsOf(), navGroups, NavItem, NavItemButton(), ROLE_LABELS, SidebarViewer (+14 more)

### Community 4 - "types.ts"
Cohesion: 0.32
Nodes (4): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData()

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.11
Nodes (13): ASSET_DIRS, CONTENT_TYPES, Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote() (+5 more)

### Community 7 - "next"
Cohesion: 0.23
Nodes (11): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+3 more)

### Community 8 - "Package Manifest"
Cohesion: 0.11
Nodes (25): devDependencies, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/leaflet@^1.9.22, @types/node@^20, @types/pg@^8.23.1 (+17 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.11
Nodes (18): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, lucide-react@^1.27.0, next@16.2.6, pg@^8.23.0, @prisma/client@^7.9.1 (+10 more)

### Community 12 - "sidebar.tsx"
Cohesion: 0.13
Nodes (19): SidebarContext, SidebarContextProps, SidebarGroup(), SidebarGroupAction(), SidebarGroupContent(), SidebarGroupLabel(), SidebarMenuAction(), SidebarMenuBadge() (+11 more)

### Community 13 - "getStoreAnalyticsData"
Cohesion: 0.18
Nodes (22): Codebase Map, dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, Services, StoreMonitoringPage() (+14 more)

### Community 14 - "npm Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+8 more)

### Community 15 - "Cache per request untuk data toko dan halaman loading"
Cohesion: 0.25
Nodes (7): Cache per request untuk data toko dan halaman loading, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "Struktur File"
Cohesion: 0.21
Nodes (11): Struktur File, Task 6: Export Excel dan backup JSON, Task 8: Buka File Rekaman, sensorColor(), energyDeltaKwh(), summarizeSession(), toChartData(), SessionPhaseRecords (+3 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.2.6, eslint, eslint-config-next

### Community 21 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 22 - "Store"
Cohesion: 0.13
Nodes (26): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverviewProps, GalleryToolbarProps, MonthlyCostKpiCardProps, NetworkMapLeaflet, NetworkMapWidget(), NetworkMapWidgetProps (+18 more)

### Community 23 - "live-buffer.ts"
Cohesion: 0.17
Nodes (24): sensorList(), Task 2: Parser live buffer, FIELD_MAP, formatJakartaTime(), isRecord(), parseLiveBuffer(), TIME_FORMAT, toNumber() (+16 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.08
Nodes (22): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow (+14 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.19
Nodes (10): PZEM Energy Counter Reset / Rollover, Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Telemetry Interval Delta Energy, Fix Energy Meter Reset Rollover False Spike, _analyticsCache (+2 more)

### Community 26 - "store-service.ts"
Cohesion: 0.21
Nodes (11): history table (session captures), telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, _deviceEnergyCache, getIotDeviceDataList, loadCaptureStatus, loadIotDeviceDataList(), loadStoreById() (+3 more)

### Community 27 - "getRequestScope"
Cohesion: 0.27
Nodes (13): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, DashboardOverview(), StoreGallery(), NoAssignedDevices() (+5 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.07
Nodes (34): emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, METRIC_CONFIG, TelemetryChart(), TelemetryChartProps (+26 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.08
Nodes (22): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+14 more)

### Community 31 - "IoT Session Assignment & Multi-Session Architecture"
Cohesion: 0.11
Nodes (5): Bugfix: Hydration & Base UI Button, Sidebar Active Indicator and Modern Hover, IoT Session Assignment & Multi-Session Architecture, MOCK_AUDIT_SESSIONS, MOCK_STORES

### Community 32 - "getTelemetryPool"
Cohesion: 0.33
Nodes (7): Data Layer, Databases, Aiven to Biznet VPS PostgreSQL Migration, Remove Hardcoded DB Secrets, VPS Database Migration and Dynamic Equipment Monitoring, createPoolConfig(), getTelemetryPool()

### Community 33 - "dropdown-menu.tsx"
Cohesion: 0.18
Nodes (12): ThemeToggle(), Button(), DropdownMenu(), DropdownMenuCheckboxItem(), DropdownMenuContent(), DropdownMenuItem(), DropdownMenuLabel(), DropdownMenuRadioItem() (+4 more)

### Community 34 - "sangat-boros-service.ts"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "cn"
Cohesion: 0.23
Nodes (12): DashboardLoading(), Avatar(), AvatarBadge(), AvatarFallback(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Input() (+4 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "store-table.tsx"
Cohesion: 0.31
Nodes (18): MonthlyCostKpiCard(), formatRelativeTime(), StoreTable(), formatDate(), formatKwh(), SangatBorosPriority(), DATE_OPTIONS, formatEpoch() (+10 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "session-service.ts"
Cohesion: 0.16
Nodes (16): dynamic, loadSessions(), metadata, SessionsPage(), Task 7: Halaman Sesi Rekaman, getRecordingSessions(), loadRecordingSessions(), MAX_SESSION_RECORDS (+8 more)

### Community 42 - "network-map-leaflet.tsx"
Cohesion: 0.17
Nodes (12): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, Integrate Real Leaflet Mapping, leaflet@^1.9.4, react-dom@19.2.4 (+4 more)

### Community 43 - "lucide-react"
Cohesion: 0.23
Nodes (15): GalleryToolbar(), SessionSelector(), SessionSelectorProps, SelectContent(), SelectGroup(), SelectItem(), SelectLabel(), SelectScrollDownButton() (+7 more)

### Community 44 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): fontMono, inter, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "react"
Cohesion: 0.36
Nodes (10): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+2 more)

### Community 47 - "sheet.tsx"
Cohesion: 0.29
Nodes (9): Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader(), SheetOverlay(), SheetPortal(), SheetTitle() (+1 more)

### Community 48 - "utils.ts"
Cohesion: 0.33
Nodes (6): AppHeader(), Separator(), SidebarSeparator(), SidebarTrigger(), @base-ui/react, class-variance-authority

### Community 50 - "Dynamic Sensor Naming and Session Scoping"
Cohesion: 0.11
Nodes (15): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture (+7 more)

### Community 51 - "Alamat API Flask dan cache status capture"
Cohesion: 0.29
Nodes (6): Alamat API Flask dan cache status capture, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 52 - "live-buffer-service.ts"
Cohesion: 0.25
Nodes (12): dynamic, GET(), parseSinceParam(), getStoreLiveBuffer(), loadLiveBuffer, resolveDeviceId, fetchTelemetryApi(), telemetryApiBase() (+4 more)

### Community 53 - "store-analytics-widget.tsx"
Cohesion: 0.10
Nodes (26): CustomXAxisTick(), formatDateToIso(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget(), CustomXAxisTick() (+18 more)

### Community 54 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 55 - "next.config.ts"
Cohesion: 0.33
Nodes (4): contentSecurityPolicy, nextConfig, securityHeaders, spartaOrigin

### Community 56 - "requireApiAccess"
Cohesion: 0.16
Nodes (17): dynamic, GET(), dynamic, GET(), HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam() (+9 more)

### Community 57 - "Pindah fitur Smart Energy Meter ke portal: Tahap 1"
Cohesion: 0.29
Nodes (7): Changed Files, Context and Sources, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Remaining Work and Risks, Scope, Verification, scopeKey()

### Community 58 - "Task 5: Data record sesi dan route-nya"
Cohesion: 0.12
Nodes (12): Decisions, Changed Files, Fakta dari Flask yang dipakai plan ini, Task 1: Modul fase bersama, Task 3: Route live per toko, Task 5: Data record sesi dan route-nya, Task 9: Dokumen, catatan task, dan verifikasi akhir, QueryClient (+4 more)

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **6 isolated node(s):** `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `getTelemetryChartData`, `sparta-energy project` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 326 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `access.ts`, `app-sidebar.tsx`, `app/layout.tsx`, `store-table.tsx`, `Package Manifest`, `session-service.ts`, `network-map-leaflet.tsx`, `Runtime Dependencies`, `app/layout.tsx`, `getStoreAnalyticsData`, `react`, `live-buffer-service.ts`, `store-analytics-widget.tsx`, `Store`, `next.config.ts`, `requireApiAccess`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Are the 4 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 4 INFERRED edges - model-reasoned connections that need verification._
- **What connects `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `access.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.056692242114237 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `dropdown-menu.tsx`, `app-sidebar.tsx`, `store-table.tsx`, `lucide-react`, `app/layout.tsx`, `getStoreAnalyticsData`, `react`, `sheet.tsx`, `utils.ts`, `sidebar.tsx`, `Dynamic Sensor Naming and Session Scoping`, `store-analytics-widget.tsx`, `Store`, `getRequestScope`, `store-monitoring-page.tsx`?**
  _High betweenness centrality (0.097) - this node is a cross-community bridge._
- **Should `app-sidebar.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.1452991452991453 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
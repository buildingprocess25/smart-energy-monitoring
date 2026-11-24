# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 228 files · ~105,234 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1328 nodes · 3600 edges · 73 communities (69 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 224 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `9f8aa760`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- Rapikan File Graphify dan Isi Repo
- sangat-boros-service.ts
- (dashboard)/layout.tsx
- access-rules.ts
- 3-Pillar Architecture Plan
- app/layout.tsx
- Button
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- cn
- getTelemetryHistory
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- session-records.ts
- ESLint Config
- PostCSS Config
- dotenv
- Sign-out, Ganti Peran, dan security
- Store Analytics Widget with Load Profile
- CLAUDE.md
- telemetry-service.ts
- store-service.ts
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- react
- Fakta dari Flask yang dipakai plan ini
- control-commands.ts
- createSharedFetch
- Tambah skill frontend-design dari sparta-office
- app-sidebar.tsx
- Tombol "Kembali ke SPARTA" di header portal
- store-table.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- live-buffer-service.ts
- logout/route.ts
- SSO redirect loop guard
- energy-service.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- app/layout.tsx
- Portal Akses Role (Admin, Auditor, GS)
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- Services
- [storeId]/page.tsx
- session-service.ts
- monthly-cost-kpi-card.tsx
- requireApiAccess
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- device-control.ts
- Store
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- energy-service.ts
- Dashboard streaming dan cache biaya bulanan
- telemetry-api.ts
- dashboard-overview.tsx
- Backlog
- store-analytics-widget.tsx
- perangkat/page.tsx
- pools.ts
- stale-cache.ts
- Integrasi 12 Toko Sangat Boros
- Tahap
- network-map-leaflet.tsx

## God Nodes (most connected - your core abstractions)
1. `cn()` - 136 edges
2. `next` - 41 edges
3. `react` - 38 edges
4. `Store` - 32 edges
5. `Button()` - 29 edges
6. `getTelemetryPool()` - 28 edges
7. `requireApiAccess()` - 27 edges
8. `lucide-react` - 27 edges
9. `getStoreAnalyticsData()` - 26 edges
10. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges

## Surprising Connections (you probably didn't know these)
- `Context and Sources` --references--> `resolveRole()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/access-rules.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Global Constraints` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/auth/api-guard.ts
- `Jaminan untuk Alur IoT` --references--> `getTelemetryPool()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/pools.ts
- `Task 9: Dokumen, catatan task, dan verifikasi akhir` --references--> `readOnlyQuery()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/read-only.ts

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

## Communities (73 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.14
Nodes (22): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+14 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "sangat-boros-service.ts"
Cohesion: 0.24
Nodes (15): StoreGalleryProps, SangatBorosPriorityProps, Changed Files, compareWithSangatBoros(), getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT (+7 more)

### Community 3 - "(dashboard)/layout.tsx"
Cohesion: 0.30
Nodes (8): AccessDeniedPage(), metadata, DashboardLayout(), AccessCheckFailed(), spartaUrl(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 4 - "access-rules.ts"
Cohesion: 0.16
Nodes (23): Task 1: Aturan role dan lingkup (modul murni, TDD), getAssignedDeviceIds(), RequestAccess, AccessScope, anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, INTERNAL_TOKEN_HEADER (+15 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (66): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+58 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.11
Nodes (13): ASSET_DIRS, CONTENT_TYPES, Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote() (+5 more)

### Community 7 - "Button"
Cohesion: 0.15
Nodes (25): AdminShell(), AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), initialsOf(), ROLE_LABELS, ShellViewer (+17 more)

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
Cohesion: 0.09
Nodes (23): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, pg@^8.23.0 (+15 more)

### Community 12 - "cn"
Cohesion: 0.13
Nodes (27): AvatarBadge(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Separator(), SheetContent(), SheetOverlay(), SidebarContext (+19 more)

### Community 13 - "getTelemetryHistory"
Cohesion: 0.22
Nodes (10): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, Default Analytics to Latest Recorded Date (+2 more)

### Community 14 - "npm Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+8 more)

### Community 15 - "Cache per request untuk data toko dan halaman loading"
Cohesion: 0.25
Nodes (7): Cache per request untuk data toko dan halaman loading, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "session-records.ts"
Cohesion: 0.06
Nodes (62): TelemetryChart(), TelemetryChartProps, downloadSession(), exportExcel(), sensorList(), Context and Sources, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Remaining Work and Risks (+54 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 22 - "Sign-out, Ganti Peran, dan security"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification

### Community 23 - "Store Analytics Widget with Load Profile"
Cohesion: 0.17
Nodes (7): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, MOCK_AUDIT_SESSIONS, MOCK_STORES, PaginationMeta, SessionInfo

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.12
Nodes (14): PZEM Energy Counter Reset / Rollover, getStoreAnalyticsData(), Dashboard Time-Grain Switcher and Real Monthly History, Fix Energy Meter Reset Rollover False Spike, jakartaRange(), getEnergyIndex(), auditSessionCache, AuditSessionRow (+6 more)

### Community 26 - "store-service.ts"
Cohesion: 0.16
Nodes (17): isDeviceAllowed(), isCaptureStalled(), parseWibTimestamp(), EnergyTotal, getEnergyIndexWithin(), CaptureReport, IotDeviceData, LatestRow (+9 more)

### Community 27 - "getRequestScope"
Cohesion: 0.19
Nodes (17): dynamic, GET(), dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, NoAssignedDevices() (+9 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.05
Nodes (52): emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, SessionSelectorProps, CustomXAxisTick(), formatDateToIso() (+44 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (15): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+7 more)

### Community 31 - "react"
Cohesion: 0.14
Nodes (27): CaptureControls(), submit(), CommandError(), IntervalField(), Open, Message(), SensorRow(), save() (+19 more)

### Community 32 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.16
Nodes (12): Task 5: Data record sesi dan route-nya, QueryClient, QueryPool, readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS, readLastRecordTimes(), DeviceRow, getManagedDevices() (+4 more)

### Community 33 - "control-commands.ts"
Cohesion: 0.10
Nodes (31): dynamic, POST(), dynamic, POST(), dynamic, POST(), asRecord(), fail() (+23 more)

### Community 34 - "createSharedFetch"
Cohesion: 0.15
Nodes (11): Alamat API Flask dan cache status capture, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification, BackoffError (+3 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "app-sidebar.tsx"
Cohesion: 0.17
Nodes (21): AppSidebar(), NavItem, NavItemButton(), navItems, Logo(), LogoProps, Avatar(), AvatarFallback() (+13 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "store-table.tsx"
Cohesion: 0.31
Nodes (17): StoreGallery(), formatRelativeTime(), StoreTable(), formatDate(), formatKwh(), SangatBorosPriority(), DATE_OPTIONS, formatEpoch() (+9 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "live-buffer-service.ts"
Cohesion: 0.26
Nodes (11): dynamic, GET(), dynamic, GET(), Changed Files, scopeKey(), parseSinceParam(), getDeviceLiveBuffer() (+3 more)

### Community 42 - "logout/route.ts"
Cohesion: 0.17
Nodes (15): dynamic, POST(), dynamic, GET(), Access Control, Changed Files, DEV_ROLE_COOKIE, SESSION_COOKIE (+7 more)

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "energy-service.ts"
Cohesion: 0.15
Nodes (16): Bucket, BUCKET_MS, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge(), summary() (+8 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 47 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "Services"
Cohesion: 0.40
Nodes (9): Codebase Map, dynamic, GET(), Services, getAivenPool, getRecordingSessions(), getStoreById, getAuditSessions() (+1 more)

### Community 52 - "[storeId]/page.tsx"
Cohesion: 0.43
Nodes (7): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreMonitoringPage()

### Community 54 - "session-service.ts"
Cohesion: 0.16
Nodes (15): formatDuration(), UNITS, loadSessionRows(), MAX_SESSION_RECORDS, SessionListRow, SessionMetaRow, SessionRows, sessionRowsCache (+7 more)

### Community 55 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.13
Nodes (28): GalleryToolbar(), GalleryToolbarProps, STATUS_LABELS, MonthlyCostCard(), MonthlyCostKpiCardProps, StatusBadgeProps, SessionSelector(), SelectContent() (+20 more)

### Community 56 - "requireApiAccess"
Cohesion: 0.16
Nodes (17): dynamic, GET(), dynamic, GET(), HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam() (+9 more)

### Community 57 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 58 - "device-control.ts"
Cohesion: 0.20
Nodes (19): CaptureCommand, DeviceCommand, SessionCommand, captureStates(), ControlError, findDevice(), findSession(), runCaptureCommand() (+11 more)

### Community 59 - "Store"
Cohesion: 0.13
Nodes (15): DashboardKpiSummaryProps, DashboardOverviewProps, StatusBadge(), StoreAnalyticsWidgetProps, formatRelativeTime(), StoreCard(), StoreCardProps, StoreTableProps (+7 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.15
Nodes (14): Data Layer, Databases, Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan (+6 more)

### Community 63 - "energy-service.ts"
Cohesion: 0.20
Nodes (13): Aiven to Biznet VPS PostgreSQL Migration, VPS Database Migration and Dynamic Equipment Monitoring, Decisions, register(), getTelemetryPool(), EnergyIndex, EnergyState, lastId() (+5 more)

### Community 64 - "Dashboard streaming dan cache biaya bulanan"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 66 - "telemetry-api.ts"
Cohesion: 0.57
Nodes (6): fetchTelemetryApi(), sendTelemetryCommand(), telemetryApiBase(), TelemetryApiError, TelemetryReply, tokenHeaders()

### Community 67 - "dashboard-overview.tsx"
Cohesion: 0.33
Nodes (13): DashboardKpiSummary(), DashboardOverview(), MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection(), MonthlyCostKpiCard(), NetworkMapWidget() (+5 more)

### Community 69 - "store-analytics-widget.tsx"
Cohesion: 0.26
Nodes (10): CustomXAxisTick(), formatDateToIso(), formatKw(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget() (+2 more)

### Community 71 - "perangkat/page.tsx"
Cohesion: 0.21
Nodes (22): DashboardError(), DashboardLoading(), DevicePage(), dynamic, metadata, DevicesPage(), dynamic, metadata (+14 more)

### Community 72 - "pools.ts"
Cohesion: 0.29
Nodes (7): Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig(), POOL_STATEMENT_TIMEOUT_MS

### Community 73 - "stale-cache.ts"
Cohesion: 0.29
Nodes (3): createStaleCache(), Entry, StaleCacheOptions

### Community 75 - "Integrasi 12 Toko Sangat Boros"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope, Verification

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 78 - "network-map-leaflet.tsx"
Cohesion: 0.13
Nodes (11): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, NetworkMapLeaflet, NetworkMapWidgetProps, IoT Session Assignment & Multi-Session Architecture (+3 more)

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **6 isolated node(s):** `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData`, `sparta-energy project`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 400 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `(dashboard)/layout.tsx`, `access-rules.ts`, `app/layout.tsx`, `Package Manifest`, `Runtime Dependencies`, `getRequestScope`, `react`, `control-commands.ts`, `app-sidebar.tsx`, `store-table.tsx`, `live-buffer-service.ts`, `logout/route.ts`, `app/layout.tsx`, `breadcrumb.tsx`, `Services`, `[storeId]/page.tsx`, `requireApiAccess`, `Store`, `dashboard-overview.tsx`, `store-analytics-widget.tsx`, `perangkat/page.tsx`, `network-map-leaflet.tsx`?**
  _High betweenness centrality (0.119) - this node is a cross-community bridge._
- **What connects `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.1354679802955665 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `dashboard-overview.tsx`, `app-sidebar.tsx`, `store-analytics-widget.tsx`, `store-table.tsx`, `Button`, `perangkat/page.tsx`, `network-map-leaflet.tsx`, `app/layout.tsx`, `breadcrumb.tsx`, `session-records.ts`, `phase-gauge-grid.tsx`, `[storeId]/page.tsx`, `monthly-cost-kpi-card.tsx`, `Store`, `store-monitoring-page.tsx`, `react`?**
  _High betweenness centrality (0.086) - this node is a cross-community bridge._
- **Should `3-Pillar Architecture Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.050200803212851405 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `dashboard-overview.tsx`, `access-rules.ts`, `store-analytics-widget.tsx`, `store-table.tsx`, `perangkat/page.tsx`, `Button`, `Package Manifest`, `Runtime Dependencies`, `cn`, `network-map-leaflet.tsx`, `app/layout.tsx`, `breadcrumb.tsx`, `[storeId]/page.tsx`, `monthly-cost-kpi-card.tsx`, `store-service.ts`, `store-monitoring-page.tsx`?**
  _High betweenness centrality (0.064) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
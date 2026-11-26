# Graph Report - smart-energy-monitoring  (2026-11-26)

## Corpus Check
- 313 files · ~147,492 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1946 nodes · 6119 edges · 104 communities (101 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 266 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `76677115`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- workbook.ts
- Rapikan File Graphify dan Isi Repo
- store-service.ts
- monthly-cost-kpi-card.tsx
- laporan/layout.tsx
- ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture
- app/layout.tsx
- myeco-service.ts
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- cn
- jakartaDate
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- phase-keys.ts
- ESLint Config
- PostCSS Config
- myeco-ac-section.tsx
- Sign-out, Ganti Peran, dan security
- report-template-store.ts
- CLAUDE.md
- telemetry-service.ts
- device-status.ts
- ref_node_assert
- types.ts
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- schedule-panel.tsx
- dashboard-overview.tsx
- device-control.ts
- store-analytics-widget.tsx
- Tambah skill frontend-design dari sparta-office
- session-actions.tsx
- (dashboard)/layout.tsx
- xlsx.ts
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- myeco.test.mjs
- Store
- logout/route.ts
- device-topology.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- device-tree.tsx
- mail-settings.ts
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- energy-service.ts
- session-service.ts
- network-map-leaflet.tsx
- device-service.ts
- perangkat/page.tsx
- request-params.ts
- sangat-boros-service.ts
- access-rules.ts
- control-commands.ts
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- app-header.tsx
- SSO redirect loop guard
- Badge
- Alamat API Flask dan cache status capture
- store-detail-analytics.tsx
- access.ts
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- report-mail-service.ts
- smtp.ts
- getRequestScope
- sample-count-service.ts
- report-service.ts
- getTelemetryHistory
- Struktur File
- Tahap
- usage-insights.ts
- createMyEcoState
- theme-provider.tsx
- next
- Tombol "Kembali ke SPARTA" di header portal
- sheet-surface.tsx
- telemetry-date-picker.tsx
- copy-assets.mjs
- myeco-ac-section.tsx
- Button
- lucide-react
- load-profile-chart.tsx
- Portal Akses Role (Admin, Auditor, GS)
- pools.ts
- health-service.ts
- workbook.test.mjs
- laporan/page.tsx
- store-monitoring-page.tsx
- requireApiAccess
- [storeId]/page.tsx
- utils.ts
- Store Analytics Widget with Load Profile
- telemetry-api.ts
- Dashboard streaming dan cache biaya bulanan
- Dashboard Time-Grain Switcher and Real Monthly History
- Integrasi 12 Toko Sangat Boros
- getStoreAnalyticsData

## God Nodes (most connected - your core abstractions)
1. `cn()` - 167 edges
2. `next` - 60 edges
3. `react` - 58 edges
4. `Button()` - 51 edges
5. `requireApiAccess()` - 39 edges
6. `WorkbookBuilder()` - 38 edges
7. `lucide-react` - 38 edges
8. `getTelemetryPool()` - 35 edges
9. `Store` - 33 edges
10. `Input()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Global Constraints` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
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

## Communities (104 total, 3 thin omitted)

### Community 0 - "workbook.ts"
Cohesion: 0.09
Nodes (43): dynamic, POST(), dynamic, POST(), Preview, TemplateView, readJsonBody(), SavedTemplate (+35 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "store-service.ts"
Cohesion: 0.12
Nodes (24): dynamic, GET(), Data Layer, Databases, PhaseGaugeGridProps, getAssignedDeviceIds(), requireInternalAccess(), getSpartaPool() (+16 more)

### Community 3 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.25
Nodes (16): GalleryToolbar(), STATUS_LABELS, StoreAnalyticsWidget(), SessionSelector(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel() (+8 more)

### Community 4 - "laporan/layout.tsx"
Cohesion: 0.17
Nodes (12): dynamic, POST(), isSubscribed(), ReportsLayout(), ReportNav(), Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history` (+4 more)

### Community 5 - "ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 7 - "myeco-service.ts"
Cohesion: 0.17
Nodes (20): dynamic, GET(), register(), findMyEcoStore(), MeterReading, MyEcoStore, isPowerRange(), nextDelay() (+12 more)

### Community 8 - "Package Manifest"
Cohesion: 0.09
Nodes (31): devDependencies, dotenv@^17.4.2, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, prisma@^7.9.1, shadcn@^4.23.0, tailwindcss@^4, @tailwindcss/postcss@^4 (+23 more)

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
Cohesion: 0.12
Nodes (37): AppSidebar(), NavItem, NavItemButton(), navItems, Logo(), LogoProps, Separator(), SidebarContent() (+29 more)

### Community 13 - "jakartaDate"
Cohesion: 0.14
Nodes (20): ASSET_DIRS, CONTENT_TYPES, jakartaDate(), createMyEcoArchive(), MyEcoArchive, PowerSample, datesBetween(), decodeSamples() (+12 more)

### Community 14 - "npm Scripts"
Cohesion: 0.12
Nodes (16): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+8 more)

### Community 15 - "Cache per request untuk data toko dan halaman loading"
Cohesion: 0.25
Nodes (7): Cache per request untuk data toko dan halaman loading, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 16 - "Asset Copy Script"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 17 - "phase-keys.ts"
Cohesion: 0.18
Nodes (25): sensorList(), Task 2: Parser live buffer, combineLiveBuffers(), FIELD_MAP, formatJakartaTime(), isRecord(), MAIN_PHASES, parseLiveBuffer() (+17 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "myeco-ac-section.tsx"
Cohesion: 0.12
Nodes (23): AXIS, chartTooltip(), clock, dayClock, dayHour, dayLabel(), Grid(), HistoryChart() (+15 more)

### Community 22 - "Sign-out, Ganti Peran, dan security"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification

### Community 23 - "report-template-store.ts"
Cohesion: 0.17
Nodes (31): bad(), dynamic, POST(), bad(), dynamic, POST(), requireControlAccess(), sendPlainTest() (+23 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.14
Nodes (21): Codebase Map, dynamic, GET(), dynamic, GET(), Fix Weekly Chart Switching and Timezone Alignment, getAivenPool, isVirtualDeviceId() (+13 more)

### Community 26 - "device-status.ts"
Cohesion: 0.80
Nodes (4): isRecord(), parseBufferSync(), parseDeviceStatus(), text()

### Community 27 - "ref_node_assert"
Cohesion: 0.18
Nodes (5): Task 6: Export Excel dan backup JSON, Energy, energyDeltaKwh(), summarizeSession(), T0

### Community 28 - "types.ts"
Cohesion: 0.14
Nodes (20): LIVE_METRICS, LiveState, STATE_BADGE, METRIC_CONFIG, TelemetryChartProps, Dynamic Equipment Naming from devices.sensors and history.phase_name, Time Range Modes (Harian, Bulanan, Tahunan, Sesi Audit), Store Detail Analytics Tabs and Time Range Modes (+12 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (15): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+7 more)

### Community 31 - "schedule-panel.tsx"
Cohesion: 0.15
Nodes (28): Check(), Choice, Field(), SelectField(), AddressInput(), MailSettingsForm(), PasswordHelp(), load() (+20 more)

### Community 32 - "dashboard-overview.tsx"
Cohesion: 0.25
Nodes (16): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection() (+8 more)

### Community 33 - "device-control.ts"
Cohesion: 0.19
Nodes (20): CaptureCommand, DeviceCommand, SessionCommand, captureStates(), ControlError, findDevice(), findSession(), runCaptureCommand() (+12 more)

### Community 34 - "store-analytics-widget.tsx"
Cohesion: 0.17
Nodes (18): EnergyChart(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah(), formatUnit() (+10 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "session-actions.tsx"
Cohesion: 0.23
Nodes (17): CaptureControls(), CommandError(), IntervalField(), Open, useCommand(), RecipientGroups(), SettingsSection(), Open (+9 more)

### Community 37 - "(dashboard)/layout.tsx"
Cohesion: 0.29
Nodes (9): DashboardLayout(), AccessCheckFailed(), AdminShell(), portalDecision(), Fetch, revokeSpartaSession(), ROLE_SWITCH_ROLES, roleSwitchUrl() (+1 more)

### Community 38 - "xlsx.ts"
Cohesion: 0.19
Nodes (18): BulkDownload(), download(), fetchSession(), downloadSession(), exportExcel(), downloadFile(), exportFileName(), sessionSheets() (+10 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "myeco.test.mjs"
Cohesion: 0.15
Nodes (12): createMyEcoClient(), body(), getToken(), requestToken(), send(), MyEcoClientOptions, MyEcoError, MyEcoErrorKind (+4 more)

### Community 42 - "Store"
Cohesion: 0.11
Nodes (16): GalleryToolbarProps, StatusBadge(), StatusBadgeProps, formatRelativeTime(), StoreCard(), StoreCardProps, StoreTableProps, StoreHeroProps (+8 more)

### Community 43 - "logout/route.ts"
Cohesion: 0.29
Nodes (8): dynamic, GET(), Access Control, clearSessionCookie(), expiredSessionCookies(), relativeRedirect(), contentSecurityPolicy(), httpOrigin()

### Community 44 - "device-topology.ts"
Cohesion: 0.21
Nodes (19): currentMembers(), end(), expandBucketRows(), macOf(), macsEverIn(), MAIN_PANELS, MAIN_PHASES, parseNotes() (+11 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "device-tree.tsx"
Cohesion: 0.19
Nodes (15): DeviceTree(), formatKwh(), SensorList(), buildDeviceTree(), total(), TreeBranch, TreeDevice, TreeSensor (+7 more)

### Community 47 - "mail-settings.ts"
Cohesion: 0.19
Nodes (13): asRecord(), fail(), isUserId(), MAIL_PROVIDERS, MailProvider, MailSettings, parseGroup(), parseMailSettings() (+5 more)

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.36
Nodes (6): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), SVG Circular Gauge Setup, Recharts

### Community 51 - "energy-service.ts"
Cohesion: 0.12
Nodes (21): Aiven to Biznet VPS PostgreSQL Migration, getTelemetryPool(), TopologyMap, EnergyIndex, EnergyState, lastId(), lastReplay(), PHASE_SQL (+13 more)

### Community 52 - "session-service.ts"
Cohesion: 0.13
Nodes (21): dynamic, GET(), dynamic, loadSessions(), metadata, SessionsPage(), Task 7: Halaman Sesi Rekaman, parseSessionId() (+13 more)

### Community 53 - "network-map-leaflet.tsx"
Cohesion: 0.10
Nodes (15): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, NetworkMapLeaflet, NetworkMapWidgetProps, IoT Session Assignment & Multi-Session Architecture (+7 more)

### Community 54 - "device-service.ts"
Cohesion: 0.16
Nodes (13): isCaptureStalled(), parseWibTimestamp(), QueryClient, QueryPool, readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS, deviceKind(), readLastRecordTimes() (+5 more)

### Community 55 - "perangkat/page.tsx"
Cohesion: 0.35
Nodes (16): DashboardError(), DashboardLoading(), DevicesPage(), dynamic, metadata, MetricCard(), DeviceSettings(), MyEcoStoreList() (+8 more)

### Community 56 - "request-params.ts"
Cohesion: 0.16
Nodes (16): dynamic, GET(), dynamic, GET(), dynamic, GET(), HistoryParams, isIsoDate() (+8 more)

### Community 57 - "sangat-boros-service.ts"
Cohesion: 0.26
Nodes (14): StoreGalleryProps, SangatBorosPriorityProps, Changed Files, getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT, toNumber() (+6 more)

### Community 58 - "access-rules.ts"
Cohesion: 0.18
Nodes (18): Context and Sources, Task 1: Aturan role dan lingkup (modul murni, TDD), anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, isRole(), isValidInternalToken(), parseDeviceIds() (+10 more)

### Community 59 - "control-commands.ts"
Cohesion: 0.23
Nodes (14): dynamic, POST(), asRecord(), deviceDisplayName(), fail(), MAX_INTERVAL_S, MIN_INTERVAL_S, parseCaptureCommand() (+6 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 62 - "app-header.tsx"
Cohesion: 0.20
Nodes (15): AppHeader(), initialsOf(), ROLE_LABELS, ShellViewer, signOut(), SpartaLinks, UserMenuContent(), Avatar() (+7 more)

### Community 63 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 64 - "Badge"
Cohesion: 0.21
Nodes (12): DevicePage(), dynamic, metadata, CaptureFacts(), DeviceBadges(), formatWib(), bufferSyncText(), emptyMessage() (+4 more)

### Community 65 - "Alamat API Flask dan cache status capture"
Cohesion: 0.25
Nodes (7): Alamat API Flask dan cache status capture, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 66 - "store-detail-analytics.tsx"
Cohesion: 0.19
Nodes (15): EnergyChartControls(), spikeText(), StoreAnalyticsWidgetProps, CustomXAxisTick(), formatDateToIso(), formatKw(), formatPct(), ID_DAYS_FULL (+7 more)

### Community 67 - "access.ts"
Cohesion: 0.17
Nodes (12): AccessDeniedPage(), metadata, dynamic, POST(), jobScope, RequestAccess, AccessScope, DEV_ROLE_COOKIE (+4 more)

### Community 68 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 69 - "report-mail-service.ts"
Cohesion: 0.13
Nodes (30): dynamic, load(), MailSettingsPage(), metadata, dynamic, formatTime(), loadSaved(), metadata (+22 more)

### Community 70 - "smtp.ts"
Cohesion: 0.13
Nodes (13): RFC-2047, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail, oneLine() (+5 more)

### Community 71 - "getRequestScope"
Cohesion: 0.11
Nodes (25): dynamic, GET(), dynamic, GET(), Changed Files, Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1 (+17 more)

### Community 72 - "sample-count-service.ts"
Cohesion: 0.08
Nodes (67): AlertList(), StoreGallery(), formatRelativeTime(), StoreTable(), DeviceHealthSection(), formatTime(), CountRow, CountTable() (+59 more)

### Community 73 - "report-service.ts"
Cohesion: 0.14
Nodes (21): dynamic, GET(), Services, formatDuration(), UNITS, buildConsumption(), buildLoadProfile(), buildSummary() (+13 more)

### Community 74 - "getTelemetryHistory"
Cohesion: 0.12
Nodes (16): August 28 MQTT Topic Format Migration, Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, history table (session captures), PZEM Energy Counter Reset / Rollover, raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring) (+8 more)

### Community 75 - "Struktur File"
Cohesion: 0.17
Nodes (15): TelemetryChart(), Fakta dari Flask yang dipakai plan ini, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Struktur File, Tahap 2 (garis besar, dibuat sebagai plan terpisah), Task 1: Modul fase bersama (+7 more)

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 77 - "usage-insights.ts"
Cohesion: 0.24
Nodes (14): add(), ascending(), DailyThreshold, dailyThreshold(), findSpikes(), FULL_DAY_HOURS, HourPattern, PeriodSummary (+6 more)

### Community 78 - "createMyEcoState"
Cohesion: 0.50
Nodes (3): appendSample(), averageSamples(), createMyEcoState()

### Community 79 - "theme-provider.tsx"
Cohesion: 0.22
Nodes (11): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+3 more)

### Community 80 - "next"
Cohesion: 0.23
Nodes (9): dynamic, POST(), dynamic, POST(), handleControl(), assetHeaders, nextConfig, securityHeaders (+1 more)

### Community 81 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 82 - "sheet-surface.tsx"
Cohesion: 0.11
Nodes (36): noSubscription(), THEME_OPTIONS, ThemeToggle(), newSheet(), cellText(), ColumnMenu(), SheetGrid(), SheetSurface() (+28 more)

### Community 83 - "telemetry-date-picker.tsx"
Cohesion: 0.18
Nodes (11): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Interactive Telemetry Date Calendar Picker (+3 more)

### Community 84 - "copy-assets.mjs"
Cohesion: 0.22
Nodes (7): Sync Logo and Branding with Sparta Energy, Clean copy-assets Scripts, __dirname, __filename, destDir, srcDir, possibleSrcDirs

### Community 85 - "myeco-ac-section.tsx"
Cohesion: 0.27
Nodes (13): dailyUsage(), DayUsage, hourlyUsage(), HourUsage, isRecord(), listIn(), Log, numberIn() (+5 more)

### Community 86 - "Button"
Cohesion: 0.23
Nodes (11): submit(), Message(), SensorRow(), save(), StoreAssignment(), send(), run(), send() (+3 more)

### Community 87 - "lucide-react"
Cohesion: 0.26
Nodes (16): AlertBell(), load(), onVisible(), MonthlyCostCard(), MonthlyCostKpiCard(), Sheet(), SheetContent(), SheetDescription() (+8 more)

### Community 88 - "load-profile-chart.tsx"
Cohesion: 0.22
Nodes (10): kw(), LoadProfileChart(), SPIKE_COLOR, SPIKE_LABEL, SPIKE_TEXT, LoadProfilePoint, SPIKE_LIMITS, SpikeLevel (+2 more)

### Community 89 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Changed Files, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 90 - "pools.ts"
Cohesion: 0.29
Nodes (7): Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig(), POOL_STATEMENT_TIMEOUT_MS

### Community 91 - "health-service.ts"
Cohesion: 0.05
Nodes (49): dynamic, GET(), DATE_OPTIONS, shift(), Alert, ALERT_LIMITS, AlertDevice, AlertKind (+41 more)

### Community 92 - "workbook.test.mjs"
Cohesion: 0.24
Nodes (6): mail, schedule(), sheet(), table, template(), workbook()

### Community 93 - "laporan/page.tsx"
Cohesion: 0.27
Nodes (9): dynamic, firstReport(), metadata, ReportsPage(), Loaded, jakartaToday(), ReportTable, getReportStores() (+1 more)

### Community 94 - "store-monitoring-page.tsx"
Cohesion: 0.31
Nodes (8): SessionSelectorProps, StoreMonitoringPageProps, Compact Interactive Sensor Metric Chips, Multi-Select Phase Filtering with Total Daya Beban, Reposition Sensor Phase Breakdown Cards, Compact Store Detail Sensor Cards, AuditSession, TelemetryHistoryResult

### Community 95 - "requireApiAccess"
Cohesion: 0.27
Nodes (12): dynamic, GET(), dynamic, GET(), WorkbookPage(), getRequestAccess, canControlDevices(), requireApiAccess() (+4 more)

### Community 96 - "[storeId]/page.tsx"
Cohesion: 0.46
Nodes (7): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreMonitoringPage()

### Community 97 - "utils.ts"
Cohesion: 0.39
Nodes (3): Toggle(), @base-ui/react, class-variance-authority

### Community 98 - "Store Analytics Widget with Load Profile"
Cohesion: 0.32
Nodes (4): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData()

### Community 99 - "telemetry-api.ts"
Cohesion: 0.46
Nodes (7): fetchTelemetryApi(), isControlConfigured(), sendTelemetryCommand(), telemetryApiBase(), TelemetryApiError, TelemetryReply, tokenHeaders()

### Community 100 - "Dashboard streaming dan cache biaya bulanan"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 101 - "Dashboard Time-Grain Switcher and Real Monthly History"
Cohesion: 0.50
Nodes (3): Dashboard Time-Grain Switcher and Real Monthly History, MonthlyTrendSummary, RealMonthlyConsumption

### Community 102 - "Integrasi 12 Toko Sangat Boros"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope, Verification

### Community 105 - "getStoreAnalyticsData"
Cohesion: 0.24
Nodes (13): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, NoAssignedDevices(), Monthly PLN Cost Card Refactor, Default Analytics to Latest Recorded Date (+5 more)

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `getTelemetryChartData` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 527 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `workbook.ts`, `store-service.ts`, `laporan/layout.tsx`, `myeco-service.ts`, `Package Manifest`, `Runtime Dependencies`, `cn`, `jakartaDate`, `report-template-store.ts`, `telemetry-service.ts`, `schedule-panel.tsx`, `dashboard-overview.tsx`, `store-analytics-widget.tsx`, `session-actions.tsx`, `(dashboard)/layout.tsx`, `Store`, `device-tree.tsx`, `breadcrumb.tsx`, `session-service.ts`, `network-map-leaflet.tsx`, `perangkat/page.tsx`, `request-params.ts`, `access-rules.ts`, `control-commands.ts`, `Badge`, `access.ts`, `report-mail-service.ts`, `getRequestScope`, `sample-count-service.ts`, `report-service.ts`, `theme-provider.tsx`, `sheet-surface.tsx`, `health-service.ts`, `laporan/page.tsx`, `requireApiAccess`, `[storeId]/page.tsx`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `requireApiAccess()` (e.g. with `Access Control` and `Changed Files`) actually correct?**
  _`requireApiAccess()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `workbook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09219858156028368 - nodes in this community are weakly interconnected._
- **Why does `react` connect `schedule-panel.tsx` to `store-service.ts`, `monthly-cost-kpi-card.tsx`, `Package Manifest`, `Runtime Dependencies`, `cn`, `myeco-ac-section.tsx`, `types.ts`, `dashboard-overview.tsx`, `store-analytics-widget.tsx`, `session-actions.tsx`, `xlsx.ts`, `breadcrumb.tsx`, `network-map-leaflet.tsx`, `device-service.ts`, `perangkat/page.tsx`, `app-header.tsx`, `store-detail-analytics.tsx`, `access.ts`, `sample-count-service.ts`, `theme-provider.tsx`, `sheet-surface.tsx`, `telemetry-date-picker.tsx`, `Button`, `lucide-react`, `health-service.ts`, `store-monitoring-page.tsx`, `[storeId]/page.tsx`, `getStoreAnalyticsData`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `store-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11965811965811966 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
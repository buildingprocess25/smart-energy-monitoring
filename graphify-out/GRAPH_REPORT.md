# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 292 files · ~133,925 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1749 nodes · 5363 edges · 85 communities (81 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 258 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a55a7944`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- Rapikan File Graphify dan Isi Repo
- types.ts
- workbook.test.mjs
- access-rules.test.mjs
- AI_RULES.md - AI Coding Rules
- app/layout.tsx
- Button
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- cn
- session-actions.tsx
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- phase-keys.ts
- ESLint Config
- PostCSS Config
- ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture
- Sign-out, Ganti Peran, dan security
- report-mail-service.ts
- CLAUDE.md
- getStoreAnalyticsData
- store-service.ts
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- capture-controls.tsx
- report-mail-service.ts
- device-control.ts
- store-detail-analytics.tsx
- Tambah skill frontend-design dari sparta-office
- device-tree-service.ts
- Tombol "Kembali ke SPARTA" di header portal
- monthly-cost-kpi-card.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- live-buffer-service.ts
- (dashboard)/layout.tsx
- SSO redirect loop guard
- energy-service.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- store-analytics-widget.tsx
- telemetry-date-picker.tsx
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- store-service.ts
- session-service.ts
- health-service.ts
- DESIGN.md - UI/UX Specification
- perangkat/page.tsx
- next
- pools.ts
- access.ts
- workbook.ts
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- Dashboard Shell (Tahap 1) Implementation Plan
- getTelemetryPool
- Fakta dari Flask yang dipakai plan ini
- [deviceId]/page.tsx
- device-health.tsx
- access-rules.ts
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- mail-settings.ts
- smtp.ts
- react
- report-service.ts
- check-agent-task-note.mjs
- Standardize GitHub Actions Deploy Workflow
- store-gallery.tsx
- Tahap
- logout/route.ts
- types.ts
- Dynamic Sensor Naming and Session Scoping
- allowBuilds
- server-only
- store-card.tsx
- app/layout.tsx
- ref_node_assert

## God Nodes (most connected - your core abstractions)
1. `cn()` - 161 edges
2. `next` - 57 edges
3. `react` - 53 edges
4. `Button()` - 45 edges
5. `WorkbookBuilder()` - 38 edges
6. `lucide-react` - 36 edges
7. `requireApiAccess()` - 35 edges
8. `Store` - 32 edges
9. `Input()` - 31 edges
10. `getTelemetryPool()` - 31 edges

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

## Communities (85 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.14
Nodes (25): dynamic, POST(), dynamic, POST(), Preview, readJsonBody(), buildPreview(), buildWorkbook() (+17 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "types.ts"
Cohesion: 0.12
Nodes (12): SessionSelectorProps, Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, Dashboard Time-Grain Switcher and Real Monthly History, MOCK_AUDIT_SESSIONS, MOCK_STORES, AuditSession (+4 more)

### Community 3 - "workbook.test.mjs"
Cohesion: 0.24
Nodes (6): mail, schedule(), sheet(), table, template(), workbook()

### Community 4 - "access-rules.test.mjs"
Cohesion: 0.16
Nodes (13): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification, Task 1: Aturan role dan lingkup (modul murni, TDD), isRole() (+5 more)

### Community 5 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.17
Nodes (16): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template, Project Governance Implementation Plan, GitHub Actions Deploy Workflow (+8 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.11
Nodes (13): ASSET_DIRS, CONTENT_TYPES, Sync Logo and Branding with Sparta Energy, Clean copy-assets Scripts, Dual-Database Integration Architecture, 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), __dirname, __filename (+5 more)

### Community 7 - "Button"
Cohesion: 0.15
Nodes (27): AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), ROLE_LABELS, signOut(), UserMenuContent(), cellText() (+19 more)

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
Cohesion: 0.09
Nodes (49): AdminShell(), AppSidebar(), NavItem, NavItemButton(), navItems, initialsOf(), ShellViewer, SpartaLinks (+41 more)

### Community 13 - "session-actions.tsx"
Cohesion: 0.14
Nodes (22): downloadExcel(), fileName(), BulkDownload(), download(), fetchSession(), downloadSession(), exportExcel(), Task 6: Export Excel dan backup JSON (+14 more)

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
Cohesion: 0.13
Nodes (31): sensorList(), Remaining Work and Risks, Task 2: Parser live buffer, Task 8: Buka File Rekaman, FIELD_MAP, formatJakartaTime(), isRecord(), MAIN_PHASES (+23 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture"
Cohesion: 0.26
Nodes (16): ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification, ESP32 Sensor MQTT Telemetry Ingestion, Interactive Map View (Leaflet), Real-Time 3-Phase Live Gauge Mode (+8 more)

### Community 22 - "Sign-out, Ganti Peran, dan security"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification

### Community 23 - "report-mail-service.ts"
Cohesion: 0.21
Nodes (23): bad(), dynamic, POST(), bad(), dynamic, POST(), saveMail(), sendPlainTest() (+15 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.08
Nodes (23): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases, Debugging (+15 more)

### Community 25 - "getStoreAnalyticsData"
Cohesion: 0.09
Nodes (30): Codebase Map, dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback() (+22 more)

### Community 26 - "store-service.ts"
Cohesion: 0.15
Nodes (16): Aiven to Biznet VPS PostgreSQL Migration, Decisions, Task 5: Data record sesi dan route-nya, isDeviceAllowed(), getTelemetryPool(), QueryClient, QueryPool, readOnlyQuery() (+8 more)

### Community 27 - "getRequestScope"
Cohesion: 0.12
Nodes (24): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, StoreGallery(), NoAssignedDevices(), Default Analytics to Latest Recorded Date (+16 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.14
Nodes (26): bufferSyncText(), emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, StoreMonitoringPage(), METRIC_CONFIG (+18 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (15): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+7 more)

### Community 31 - "capture-controls.tsx"
Cohesion: 0.17
Nodes (24): CaptureControls(), CommandError(), IntervalField(), Open, useCommand(), AddressInput(), MailSettingsForm(), PasswordHelp() (+16 more)

### Community 32 - "report-mail-service.ts"
Cohesion: 0.12
Nodes (36): dynamic, load(), MailSettingsPage(), metadata, dynamic, formatTime(), loadSaved(), metadata (+28 more)

### Community 33 - "device-control.ts"
Cohesion: 0.05
Nodes (70): dynamic, POST(), dynamic, POST(), dynamic, POST(), dynamic, GET() (+62 more)

### Community 34 - "store-detail-analytics.tsx"
Cohesion: 0.08
Nodes (47): EnergyChart(), EnergyChartControls(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah() (+39 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "device-tree-service.ts"
Cohesion: 0.17
Nodes (16): DeviceTree(), formatKwh(), SensorList(), buildDeviceTree(), total(), TreeBranch, TreeDevice, TreeSensor (+8 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.23
Nodes (22): formatRelativeTime(), StoreTable(), StoreTableProps, formatDate(), formatKwh(), SangatBorosPriority(), isNumeric(), ReportBuilder() (+14 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "live-buffer-service.ts"
Cohesion: 0.18
Nodes (15): Changed Files, Context and Sources, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Scope, Verification, scopeKey(), DeviceStatus, isRecord() (+7 more)

### Community 42 - "(dashboard)/layout.tsx"
Cohesion: 0.44
Nodes (6): DashboardLayout(), AccessCheckFailed(), portalDecision(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "energy-service.ts"
Cohesion: 0.09
Nodes (22): shift(), Bucket, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge(), phase() (+14 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "store-analytics-widget.tsx"
Cohesion: 0.14
Nodes (34): AlertBell(), load(), onVisible(), GalleryToolbar(), STATUS_LABELS, MonthlyCostCard(), CustomXAxisTick(), formatDateToIso() (+26 more)

### Community 47 - "telemetry-date-picker.tsx"
Cohesion: 0.22
Nodes (9): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Interactive Telemetry Date Calendar Picker (+1 more)

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "store-service.ts"
Cohesion: 0.15
Nodes (19): isCaptureStalled(), parseWibTimestamp(), EnergyTotal, getEnergyIndexWithin(), CaptureReport, getIotDeviceDataList, IotDeviceData, LatestRow (+11 more)

### Community 52 - "session-service.ts"
Cohesion: 0.17
Nodes (18): dynamic, GET(), Struktur File, Task 7: Halaman Sesi Rekaman, parseSessionId(), getRecordingSessions(), getSessionRecords(), loadSessionRows() (+10 more)

### Community 53 - "health-service.ts"
Cohesion: 0.13
Nodes (23): ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL, deviceAlerts(), fmt() (+15 more)

### Community 54 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.21
Nodes (10): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, checkAgentTaskNote checker (scripts/check-agent-task-note.mjs), SPARTA Brand CSS Tokens (oklch primary) (+2 more)

### Community 55 - "perangkat/page.tsx"
Cohesion: 0.15
Nodes (29): DashboardError(), DashboardLoading(), DevicesPage(), dynamic, metadata, MetricCard(), submit(), DeviceSettings() (+21 more)

### Community 56 - "next"
Cohesion: 0.11
Nodes (26): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+18 more)

### Community 57 - "pools.ts"
Cohesion: 0.33
Nodes (6): Dual-Database Architecture (sparta_energy + energy_meter), Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig(), POOL_STATEMENT_TIMEOUT_MS

### Community 58 - "access.ts"
Cohesion: 0.24
Nodes (7): AccessDeniedPage(), metadata, jobScope, RequestAccess, AccessScope, INTERNAL_TOKEN_HEADER, spartaUrl()

### Community 59 - "workbook.ts"
Cohesion: 0.11
Nodes (33): newSheet(), CONFIRM_TITLE, emptyTemplate(), readError(), toSpec(), WorkbookBuilder(), open(), post() (+25 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 62 - "Dashboard Shell (Tahap 1) Implementation Plan"
Cohesion: 0.21
Nodes (14): app/globals.css, AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Final Polish & Metadata, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle (+6 more)

### Community 63 - "getTelemetryPool"
Cohesion: 0.16
Nodes (13): register(), EnergyIndex, EnergyState, lastId(), lastReplay(), readBuckets(), refresh(), Row (+5 more)

### Community 64 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.18
Nodes (10): Fakta dari Flask yang dipakai plan ini, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah), Task 1: Modul fase bersama, Task 3: Route live per toko, Task 4: Grafik real-time di detail toko (+2 more)

### Community 65 - "[deviceId]/page.tsx"
Cohesion: 0.27
Nodes (8): DevicePage(), dynamic, metadata, dynamic, loadSessions(), metadata, SessionsPage(), canControlDevices()

### Community 66 - "device-health.tsx"
Cohesion: 0.33
Nodes (8): AlertList(), DATE_OPTIONS, dayClass(), DeviceHealthSection(), formatTime(), percentOf(), Alert, HEALTH_DAYS

### Community 67 - "access-rules.ts"
Cohesion: 0.19
Nodes (15): dynamic, POST(), anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, DEV_ROLE_COOKIE, PATHNAME_HEADER, ROLES (+7 more)

### Community 68 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 69 - "mail-settings.ts"
Cohesion: 0.13
Nodes (18): asRecord(), fail(), isUserId(), MAIL_PROVIDERS, MailProvider, MailSettings, parseGroup(), parseMailSettings() (+10 more)

### Community 70 - "smtp.ts"
Cohesion: 0.14
Nodes (13): RFC-2047, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail, oneLine() (+5 more)

### Community 71 - "react"
Cohesion: 0.16
Nodes (24): Check(), Choice, Field(), SelectField(), DAYS, FREQUENCIES, SchedulePanel(), toggled() (+16 more)

### Community 72 - "report-service.ts"
Cohesion: 0.11
Nodes (27): dynamic, GET(), dynamic, firstReport(), metadata, ReportsPage(), Loaded, formatDuration() (+19 more)

### Community 73 - "check-agent-task-note.mjs"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 74 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 75 - "store-gallery.tsx"
Cohesion: 0.14
Nodes (21): StoreGalleryProps, SangatBorosPriorityProps, Changed Files, Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope (+13 more)

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 77 - "logout/route.ts"
Cohesion: 0.29
Nodes (8): dynamic, GET(), Access Control, clearSessionCookie(), expiredSessionCookies(), relativeRedirect(), contentSecurityPolicy(), httpOrigin()

### Community 78 - "types.ts"
Cohesion: 0.10
Nodes (35): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection() (+27 more)

### Community 80 - "allowBuilds"
Cohesion: 0.33
Nodes (6): allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver

### Community 81 - "server-only"
Cohesion: 0.16
Nodes (13): dynamic, POST(), isSubscribed(), ReportsLayout(), ReportNav(), Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history` (+5 more)

### Community 83 - "store-card.tsx"
Cohesion: 0.13
Nodes (11): GalleryToolbarProps, StatusBadgeProps, formatRelativeTime(), StoreCard(), StoreCardProps, Dynamic Equipment Naming from devices.sensors and history.phase_name, Dynamic Recording Indicator (isRecording), Bugfix: Hydration & Base UI Button (+3 more)

### Community 84 - "app/layout.tsx"
Cohesion: 0.22
Nodes (11): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+3 more)

### Community 86 - "ref_node_assert"
Cohesion: 0.17
Nodes (5): BackoffError, createSharedFetch(), Entry, SharedFetchOptions, T0

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 483 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `next`, `app/layout.tsx`, `Package Manifest`, `Runtime Dependencies`, `cn`, `report-mail-service.ts`, `getStoreAnalyticsData`, `capture-controls.tsx`, `report-mail-service.ts`, `device-control.ts`, `device-tree-service.ts`, `monthly-cost-kpi-card.tsx`, `(dashboard)/layout.tsx`, `store-analytics-widget.tsx`, `breadcrumb.tsx`, `session-service.ts`, `perangkat/page.tsx`, `access.ts`, `workbook.ts`, `[deviceId]/page.tsx`, `device-health.tsx`, `access-rules.ts`, `react`, `report-service.ts`, `types.ts`, `server-only`, `store-card.tsx`, `app/layout.tsx`?**
  _High betweenness centrality (0.107) - this node is a cross-community bridge._
- **What connects `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.14039408866995073 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `store-detail-analytics.tsx`, `monthly-cost-kpi-card.tsx`, `Button`, `react`, `store-analytics-widget.tsx`, `types.ts`, `telemetry-date-picker.tsx`, `server-only`, `phase-gauge-grid.tsx`, `store-card.tsx`, `app/layout.tsx`, `breadcrumb.tsx`, `perangkat/page.tsx`, `workbook.ts`, `store-monitoring-page.tsx`, `capture-controls.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `types.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12380952380952381 - nodes in this community are weakly interconnected._
- **Why does `react` connect `capture-controls.tsx` to `Button`, `Package Manifest`, `Runtime Dependencies`, `cn`, `session-actions.tsx`, `getStoreAnalyticsData`, `store-service.ts`, `store-monitoring-page.tsx`, `store-detail-analytics.tsx`, `monthly-cost-kpi-card.tsx`, `store-analytics-widget.tsx`, `telemetry-date-picker.tsx`, `breadcrumb.tsx`, `store-service.ts`, `health-service.ts`, `perangkat/page.tsx`, `access.ts`, `workbook.ts`, `react`, `store-gallery.tsx`, `types.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.063) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
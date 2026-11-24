# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 282 files · ~130,318 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1691 nodes · 5145 edges · 86 communities (82 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 257 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fefd7bb6`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- Rapikan File Graphify dan Isi Repo
- Store Analytics Widget with Load Profile
- workbook.ts
- access-rules.ts
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
- telemetry-service.ts
- store-service.ts
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- capture-controls.tsx
- excel/page.tsx
- device-control.ts
- telemetry-api.ts
- Tambah skill frontend-design dari sparta-office
- health-service.ts
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
- Portal Akses Role (Admin, Auditor, GS)
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- getStoreAnalyticsData
- session-service.ts
- health-service.ts
- DESIGN.md - UI/UX Specification
- perangkat/page.tsx
- requireApiAccess
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- session-records.ts
- workbook-builder.tsx
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- pools.ts
- Dashboard Shell (Tahap 1) Implementation Plan
- getTelemetryPool
- Fakta dari Flask yang dipakai plan ini
- readOnlyQuery
- sheet.tsx
- proxy.ts
- laporan/page.tsx
- mail-settings.ts
- smtp.ts
- react
- report-service.ts
- check-agent-task-note.mjs
- Dual-Database Integration Architecture
- getStoreAnalyticsData
- Tahap
- logout/route.ts
- types.ts
- Pindah fitur Smart Energy Meter ke portal: Tahap 1
- allowBuilds
- runAsJob
- app/globals.css
- Sidebar Active Indicator and Modern Hover
- app/layout.tsx
- ref_node_assert

## God Nodes (most connected - your core abstractions)
1. `cn()` - 159 edges
2. `next` - 56 edges
3. `react` - 52 edges
4. `Button()` - 45 edges
5. `WorkbookBuilder()` - 38 edges
6. `requireApiAccess()` - 35 edges
7. `lucide-react` - 35 edges
8. `Store` - 32 edges
9. `Input()` - 31 edges
10. `getTelemetryPool()` - 31 edges

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

## Communities (86 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.12
Nodes (24): dynamic, POST(), dynamic, POST(), dynamic, POST(), Preview, requireControlAccess() (+16 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "Store Analytics Widget with Load Profile"
Cohesion: 0.32
Nodes (4): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData()

### Community 3 - "workbook.ts"
Cohesion: 0.09
Nodes (37): TemplateView, isIsoDate(), SavedTemplate, ADDITIVE, asRecord(), compare(), DateRange, dueSlot() (+29 more)

### Community 4 - "access-rules.ts"
Cohesion: 0.20
Nodes (17): Task 1: Aturan role dan lingkup (modul murni, TDD), getAssignedDeviceIds(), jobScope, RequestAccess, INTERNAL_TOKEN_HEADER, isDeviceAllowed(), isRole(), isValidInternalToken() (+9 more)

### Community 5 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.17
Nodes (16): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template, Project Governance Implementation Plan, GitHub Actions Deploy Workflow (+8 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.14
Nodes (8): ASSET_DIRS, CONTENT_TYPES, Clean copy-assets Scripts, __dirname, __filename, destDir, srcDir, possibleSrcDirs

### Community 7 - "Button"
Cohesion: 0.13
Nodes (31): AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), initialsOf(), ROLE_LABELS, ShellViewer, signOut() (+23 more)

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
Nodes (47): AppSidebar(), NavItem, NavItemButton(), navItems, Logo(), LogoProps, Avatar(), AvatarBadge() (+39 more)

### Community 13 - "session-actions.tsx"
Cohesion: 0.17
Nodes (22): downloadExcel(), fileName(), BulkDownload(), download(), fetchSession(), downloadSession(), Open, exportExcel() (+14 more)

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
Cohesion: 0.20
Nodes (21): sensorList(), Remaining Work and Risks, Task 2: Parser live buffer, FIELD_MAP, isRecord(), MAIN_PHASES, parseLiveBuffer(), TIME_FORMAT (+13 more)

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
Cohesion: 0.14
Nodes (42): bad(), dynamic, POST(), bad(), dynamic, POST(), dynamic, load() (+34 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.08
Nodes (24): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases (+16 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.10
Nodes (25): dynamic, GET(), dynamic, GET(), dynamic, MonitoringDetailPage(), PageProps, StoreDetail() (+17 more)

### Community 26 - "store-service.ts"
Cohesion: 0.14
Nodes (22): isCaptureStalled(), parseWibTimestamp(), deviceKind(), EnergyTotal, readLastRecordTimes(), DeviceRow, IDLE_CAPTURE, loadManagedDevices() (+14 more)

### Community 27 - "getRequestScope"
Cohesion: 0.14
Nodes (21): dynamic, GET(), dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, NoAssignedDevices() (+13 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.06
Nodes (57): StoreAnalyticsWidgetProps, bufferSyncText(), emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, CustomXAxisTick() (+49 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (15): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+7 more)

### Community 31 - "capture-controls.tsx"
Cohesion: 0.15
Nodes (24): CaptureControls(), submit(), CommandError(), IntervalField(), Open, Message(), SensorRow(), save() (+16 more)

### Community 32 - "excel/page.tsx"
Cohesion: 0.17
Nodes (16): dynamic, formatTime(), loadSaved(), metadata, NOTHING, runText(), Saved, isSubscribed() (+8 more)

### Community 33 - "device-control.ts"
Cohesion: 0.10
Nodes (40): dynamic, POST(), dynamic, POST(), dynamic, POST(), asRecord(), CaptureCommand (+32 more)

### Community 34 - "telemetry-api.ts"
Cohesion: 0.21
Nodes (12): Alamat API Flask dan cache status capture, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification, fetchTelemetryApi(), sendTelemetryCommand() (+4 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "health-service.ts"
Cohesion: 0.22
Nodes (13): dynamic, GET(), CoverageDay, coverageDays(), coverageSummary(), BUCKET_MS, VALID_SAMPLE_SQL, DeviceHealth (+5 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.17
Nodes (29): AccessDeniedPage(), metadata, formatRelativeTime(), StoreTable(), StoreTableProps, dayClass(), DeviceHealthSection(), formatTime() (+21 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "live-buffer-service.ts"
Cohesion: 0.22
Nodes (14): dynamic, GET(), dynamic, GET(), DeviceStatus, isRecord(), parseBufferSync(), parseDeviceStatus() (+6 more)

### Community 42 - "(dashboard)/layout.tsx"
Cohesion: 0.35
Nodes (8): DashboardLayout(), AccessCheckFailed(), AdminShell(), SidebarInset(), spartaUrl(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "energy-service.ts"
Cohesion: 0.12
Nodes (18): Bucket, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge(), summary(), DailyEnergy (+10 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "store-analytics-widget.tsx"
Cohesion: 0.12
Nodes (29): GalleryToolbar(), STATUS_LABELS, CustomXAxisTick(), formatDateToIso(), formatKw(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL (+21 more)

### Community 47 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "getStoreAnalyticsData"
Cohesion: 0.31
Nodes (8): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, getTelemetryHistory()

### Community 52 - "session-service.ts"
Cohesion: 0.14
Nodes (20): Codebase Map, dynamic, GET(), AccessScope, getRecordingSessions(), getSessionRecords(), loadSessionRows(), MAX_SESSION_RECORDS (+12 more)

### Community 53 - "health-service.ts"
Cohesion: 0.15
Nodes (14): Alert, ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL, deviceAlerts() (+6 more)

### Community 54 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.21
Nodes (10): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, checkAgentTaskNote checker (scripts/check-agent-task-note.mjs), SPARTA Brand CSS Tokens (oklch primary) (+2 more)

### Community 55 - "perangkat/page.tsx"
Cohesion: 0.13
Nodes (34): dynamic, GET(), DashboardError(), WorkbookPage(), DashboardLoading(), DevicePage(), dynamic, metadata (+26 more)

### Community 56 - "requireApiAccess"
Cohesion: 0.17
Nodes (15): dynamic, GET(), dynamic, GET(), dynamic, GET(), requireApiAccess(), HistoryParams (+7 more)

### Community 57 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 58 - "session-records.ts"
Cohesion: 0.24
Nodes (10): Struktur File, Task 8: Buka File Rekaman, formatJakartaTime(), energyDeltaKwh(), summarizeSession(), toChartData(), SessionPhaseRecords, SessionRecord (+2 more)

### Community 59 - "workbook-builder.tsx"
Cohesion: 0.23
Nodes (15): newSheet(), CONFIRM_TITLE, emptyTemplate(), readError(), toSpec(), WorkbookBuilder(), open(), post() (+7 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "pools.ts"
Cohesion: 0.14
Nodes (14): Remove Hardcoded DB Secrets, Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen (+6 more)

### Community 62 - "Dashboard Shell (Tahap 1) Implementation Plan"
Cohesion: 0.27
Nodes (12): AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle, CircularGauge SVG Arc Component, lib/mock-data.ts (MOCK_STORES, getMockStore, getMockTelemetry) (+4 more)

### Community 63 - "getTelemetryPool"
Cohesion: 0.14
Nodes (17): Aiven to Biznet VPS PostgreSQL Migration, register(), getAivenPool, getTelemetryPool(), EnergyIndex, EnergyState, getEnergyIndex(), lastId() (+9 more)

### Community 64 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.15
Nodes (12): Fakta dari Flask yang dipakai plan ini, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah), Task 1: Modul fase bersama, Task 4: Grafik real-time di detail toko, Task 6: Export Excel dan backup JSON (+4 more)

### Community 65 - "readOnlyQuery"
Cohesion: 0.24
Nodes (5): Task 5: Data record sesi dan route-nya, QueryClient, QueryPool, readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS

### Community 66 - "sheet.tsx"
Cohesion: 0.21
Nodes (19): AlertBell(), load(), onVisible(), AlertList(), DATE_OPTIONS, MonthlyCostCard(), MonthlyCostKpiCardProps, Sheet() (+11 more)

### Community 67 - "proxy.ts"
Cohesion: 0.24
Nodes (10): Changed Files, anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, PATHNAME_HEADER, contentSecurityPolicy(), httpOrigin(), config (+2 more)

### Community 68 - "laporan/page.tsx"
Cohesion: 0.43
Nodes (6): dynamic, firstReport(), metadata, ReportsPage(), jakartaToday(), getReportStores()

### Community 69 - "mail-settings.ts"
Cohesion: 0.15
Nodes (16): asRecord(), fail(), isUserId(), MailSettings, parseGroup(), parseMailSettings(), resolveRecipients(), derive() (+8 more)

### Community 70 - "smtp.ts"
Cohesion: 0.13
Nodes (15): RFC-2047, ReadyMail, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail (+7 more)

### Community 71 - "react"
Cohesion: 0.14
Nodes (29): Check(), Choice, Field(), SelectField(), AddressInput(), MailSettingsForm(), PasswordHelp(), load() (+21 more)

### Community 72 - "report-service.ts"
Cohesion: 0.12
Nodes (24): dynamic, GET(), Loaded, shift(), buildConsumption(), buildLoadProfile(), buildSummary(), CONSUMPTION (+16 more)

### Community 73 - "check-agent-task-note.mjs"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 74 - "Dual-Database Integration Architecture"
Cohesion: 0.29
Nodes (5): IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture, 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), smart-energy-meter-vps (sister project), sparta-energy (sister project)

### Community 75 - "getStoreAnalyticsData"
Cohesion: 0.13
Nodes (22): Services, Default Analytics to Latest Recorded Date, Remove Hardcoded Date Fallbacks, Changed Files, Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks (+14 more)

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 77 - "logout/route.ts"
Cohesion: 0.22
Nodes (12): dynamic, POST(), dynamic, GET(), DEV_ROLE_COOKIE, SESSION_COOKIE, SESSION_DENIED_PATH, clearSessionCookie() (+4 more)

### Community 78 - "types.ts"
Cohesion: 0.09
Nodes (44): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection() (+36 more)

### Community 79 - "Pindah fitur Smart Energy Meter ke portal: Tahap 1"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Scope, Verification, num()

### Community 80 - "allowBuilds"
Cohesion: 0.33
Nodes (6): allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver

### Community 81 - "runAsJob"
Cohesion: 0.40
Nodes (4): Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history`, runAsJob()

### Community 83 - "Sidebar Active Indicator and Modern Hover"
Cohesion: 0.22
Nodes (3): Sidebar Active Indicator and Modern Hover, MOCK_AUDIT_SESSIONS, MOCK_STORES

### Community 84 - "app/layout.tsx"
Cohesion: 0.15
Nodes (12): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 86 - "ref_node_assert"
Cohesion: 0.13
Nodes (9): Changed Files, Task 3: Route live per toko, Task 7: Halaman Sesi Rekaman, BackoffError, createSharedFetch(), Entry, SharedFetchOptions, RecordingSessionSummary (+1 more)

## Ambiguous Edges - Review These
- `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` → `Dual-Database Architecture (sparta_energy + energy_meter)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `RFC-2047`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `August 28 MQTT Topic Format Migration`, `.gitignore` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 472 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `access-rules.ts`, `app/layout.tsx`, `Package Manifest`, `Runtime Dependencies`, `cn`, `report-mail-service.ts`, `telemetry-service.ts`, `getRequestScope`, `capture-controls.tsx`, `excel/page.tsx`, `device-control.ts`, `health-service.ts`, `monthly-cost-kpi-card.tsx`, `live-buffer-service.ts`, `(dashboard)/layout.tsx`, `store-analytics-widget.tsx`, `breadcrumb.tsx`, `session-service.ts`, `perangkat/page.tsx`, `requireApiAccess`, `workbook-builder.tsx`, `sheet.tsx`, `proxy.ts`, `laporan/page.tsx`, `react`, `report-service.ts`, `logout/route.ts`, `types.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **What connects `RFC-2047`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.11895161290322581 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `excel/page.tsx`, `sheet.tsx`, `monthly-cost-kpi-card.tsx`, `Button`, `react`, `(dashboard)/layout.tsx`, `store-analytics-widget.tsx`, `types.ts`, `breadcrumb.tsx`, `phase-gauge-grid.tsx`, `app/layout.tsx`, `perangkat/page.tsx`, `workbook-builder.tsx`, `store-monitoring-page.tsx`, `capture-controls.tsx`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Should `workbook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08859357696567 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `access-rules.ts`, `Button`, `Package Manifest`, `Runtime Dependencies`, `cn`, `session-actions.tsx`, `telemetry-service.ts`, `store-service.ts`, `store-monitoring-page.tsx`, `capture-controls.tsx`, `health-service.ts`, `monthly-cost-kpi-card.tsx`, `store-analytics-widget.tsx`, `breadcrumb.tsx`, `perangkat/page.tsx`, `workbook-builder.tsx`, `sheet.tsx`, `types.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.068) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` and `Dual-Database Architecture (sparta_energy + energy_meter)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
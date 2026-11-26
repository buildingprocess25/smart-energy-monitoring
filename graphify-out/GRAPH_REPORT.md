# Graph Report - smart-energy-monitoring  (2026-11-26)

## Corpus Check
- 322 files · ~148,500 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 2016 nodes · 6154 edges · 101 communities (97 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 228 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- myeco-ac-section.tsx
- dashboard-overview.tsx
- report-mail-service.ts
- phase-keys.ts
- telemetry-service.ts
- store-monitoring-page.tsx
- store-analytics-widget.tsx
- cn()
- workbook.ts
- workbook-builder.tsx
- perangkat/page.tsx
- types.ts
- sheet-surface.tsx
- store-service.ts
- device-service.ts
- health-service.ts
- react
- jakartaDate()
- energy-index.ts
- smtp.ts
- xlsx.ts
- live-buffer-service.ts
- package.json
- requireApiAccess()
- myeco-service.ts
- CLAUDE.md
- monthly-cost-kpi-card.tsx
- AI_RULES.md - AI Coding Rules
- This is NOT the Next.js you know
- dependencies
- AGENTS.md Agent Guide
- components.json
- telemetry-date-picker.tsx
- device-control.ts
- (dashboard)/page.tsx
- reports.ts
- request-params.ts
- compilerOptions
- control-commands.ts
- myeco.test.mjs
- usage-insights.ts
- AI Context - SPARTA Smart Energy Monitor
- mail-settings.ts
- logout/route.ts
- ARCHITECTURE_PLAN.md
- telemetry-api.ts
- scripts
- laporan/layout.tsx
- app/layout.tsx
- sheet.tsx
- myeco.ts
- DESIGN.md - UI/UX Specification
- 📐 Rencana Arsitektur Sistem Monitoring &
- alerts.ts
- next
- device-tree-service.ts
- Dashboard Shell (Tahap 1) Implementation
- Sidebar Active Indicator and Modern Hove
- Tahap
- access.ts
- getRequestAccess
- WorkbookBuilder()
- access-rules.ts
- breadcrumb.tsx
- proxy.ts
- workbook.test.mjs
- excel/page.tsx
- phase-gauge-grid.tsx
- utils.ts
- getTelemetryHistory()
- check-agent-task-note.mjs
- allowBuilds
- laporan/page.tsx
- (dashboard)/layout.tsx
- Sembunyikan toko DEMO dari Prioritas Pas
- Agent Docs: Skills Matrix, graphify Rule
- Rapikan File Graphify dan Isi Repo
- Ignore graphify-out
- SSO redirect loop guard
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header por
- Cache per request untuk data toko dan ha
- Store MEP Simulator — Lighting Snap to G
- Tambah skill frontend-design dari sparta
- Sign-out, Ganti Peran, dan security
- Topologi SpartaEnergy
- Global Constraints
- Dashboard streaming dan cache biaya bula
- copy-assets.js
- copy-assets.mjs
- Standardize GitHub Actions Deploy Workfl
- Dual-Database Integration Architecture
- eslint.config.mjs
- Pindah Fitur Smart Energy Meter ke Porta
- Tombol "Kembali ke SPARTA" di header por
- dotenv
- GEMINI.md
- next.config.ts
- app/globals.css
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 167 edges
2. `next` - 60 edges
3. `react` - 58 edges
4. `Button()` - 51 edges
5. `WorkbookBuilder()` - 38 edges
6. `requireApiAccess()` - 38 edges
7. `lucide-react` - 38 edges
8. `Store` - 33 edges
9. `getTelemetryPool()` - 33 edges
10. `Input()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Scope` --references--> `getMonthlyCostSummary()`  [INFERRED]
  docs/agent-notes/2026-11-23-0955-dashboard-streaming-dan-cache-biaya-bulanan.md → lib/services/telemetry-service.ts
- `Task 3: Penyaringan di service` --references--> `getMonthlyCostSummary()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/services/telemetry-service.ts
- `Scope` --references--> `getSangatBorosStores()`  [INFERRED]
  docs/agent-notes/2026-11-03-0702-sembunyikan-toko-demo-sangat-boros.md → lib/services/sangat-boros-service.ts
- `Decisions` --references--> `getStoreAnalyticsData()`  [INFERRED]
  docs/agent-notes/2026-11-23-0955-dashboard-streaming-dan-cache-biaya-bulanan.md → lib/services/telemetry-service.ts
- `Changed Files` --references--> `spartaHref()`  [INFERRED]
  docs/agent-notes/2026-11-03-0745-tombol-kembali-ke-sparta.md → lib/sparta-url.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard Shell Phase 1 Build** — docs_superpowers_plans_2026_08_13_dashboard_shell_phase1, docs_agent_notes_2026_08_13_1615_mock_data_setup, docs_agent_notes_2026_08_13_1621_admin_shell_layout, docs_agent_notes_2026_08_13_1623_overview_gallery, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_lib_types, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_lib_mock_data, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_admin_shell_components, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_store_gallery [EXTRACTED 1.00]
- **Canonical AI Governance and Architecture Documentation Set** — agents_document, claude_document, ai_context_document, architecture_plan_document [EXTRACTED 1.00]
- **SSR/CSR hydration mismatch fixes** — docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_id_id_locale_determinism, docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_suppress_hydration_warning, docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_buttonvariants_link_pattern, app_layout, components_dashboard_store_card [EXTRACTED 1.00]
- **SpartaEnergy CT/Plug Topology Ingestion and Virtual Store Folding** — architecture_plan_device_topology_contract, ai_context_sparta_topology_rules, agents_energy_index_architecture, docs_agent_notes_2026_11_26_1022_topologi_sparta_energy_resilience [EXTRACTED 1.00]
- **Store Detail Sensor Card UI Evolution** — concept_summary_first_dashboard_hierarchy, concept_compact_metric_chips, concept_clean_equipment_names, concept_multi_select_phase_filtering [INFERRED 0.75]
- **Store-to-device session linking** — docs_agent_notes_2026_08_14_1030_iot_session_assignment_architecture_iot_audit_session, docs_agent_notes_2026_08_18_1130_dual_db_integration_architecture_store_id_column_devices_history, docs_agent_notes_2026_08_14_1030_iot_session_assignment_architecture_gps_via_store_master, docs_agent_notes_2026_08_24_1120_dynamic_sensor_naming_and_session_scoping_session_sensor_scoping [INFERRED 0.75]
- **Date Default and Timezone Resolution** — concept_asia_jakarta_timezone_alignment, concept_latest_recorded_date_default, concept_today_jakarta_fallback [INFERRED 0.85]
- **Energy kWh Correctness Fixes** — concept_per_phase_energy_delta, concept_phase_normalization, concept_interval_delta_energy, concept_physics_bounded_energy_guard [INFERRED 0.85]
- **Real data pipeline from SPARTA and Aiven DBs** — lib_db_pools, lib_services_store_service, lib_services_telemetry_service, docs_agent_notes_2026_08_21_1013_sparta_aiven_real_data_integration_aiven_iot_db, docs_agent_notes_2026_08_21_1013_sparta_aiven_real_data_integration_sparta_energy_db, docs_agent_notes_2026_08_18_1130_dual_db_integration_architecture_dual_database_architecture [INFERRED 0.85]

## Communities (101 total, 4 thin omitted)

### Community 0 - "myeco-ac-section.tsx"
Cohesion: 0.05
Nodes (87): AlertList(), MonthlyCostCard(), formatRelativeTime(), StoreTable(), DeviceHealthSection(), formatTime(), CountRow, CountTable() (+79 more)

### Community 1 - "dashboard-overview.tsx"
Cohesion: 0.10
Nodes (37): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection() (+29 more)

### Community 2 - "report-mail-service.ts"
Cohesion: 0.12
Nodes (47): bad(), dynamic, POST(), bad(), dynamic, POST(), dynamic, load() (+39 more)

### Community 3 - "phase-keys.ts"
Cohesion: 0.10
Nodes (43): sensorList(), Remaining Work and Risks, Fakta dari Flask yang dipakai plan ini, Struktur File, Task 1: Modul fase bersama, Task 2: Parser live buffer, Task 4: Grafik real-time di detail toko, Task 7: Halaman Sesi Rekaman (+35 more)

### Community 4 - "telemetry-service.ts"
Cohesion: 0.08
Nodes (37): dynamic, GET(), PZEM Energy Counter Reset / Rollover, Aiven to Biznet VPS PostgreSQL Migration, Fix Energy Meter Reset Rollover False Spike, getAivenPool, getTelemetryPool(), TopologyMap (+29 more)

### Community 5 - "store-monitoring-page.tsx"
Cohesion: 0.09
Nodes (37): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), bufferSyncText(), emptyMessage(), LIVE_METRICS (+29 more)

### Community 6 - "store-analytics-widget.tsx"
Cohesion: 0.10
Nodes (42): EnergyChart(), EnergyChartControls(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah() (+34 more)

### Community 7 - "cn()"
Cohesion: 0.10
Nodes (42): AppSidebar(), NavItem, NavItemButton(), navItems, Logo(), LogoProps, AvatarBadge(), AvatarGroup() (+34 more)

### Community 8 - "workbook.ts"
Cohesion: 0.09
Nodes (43): dynamic, POST(), dynamic, POST(), Preview, TemplateView, readJsonBody(), deliver() (+35 more)

### Community 9 - "workbook-builder.tsx"
Cohesion: 0.13
Nodes (33): Check(), Choice, Field(), SelectField(), AddressInput(), MailSettingsForm(), PasswordHelp(), DAYS (+25 more)

### Community 10 - "perangkat/page.tsx"
Cohesion: 0.15
Nodes (30): DashboardError(), DashboardLoading(), dynamic, metadata, MonitoringPage(), DevicePage(), dynamic, metadata (+22 more)

### Community 11 - "types.ts"
Cohesion: 0.09
Nodes (36): StoreAnalyticsWidgetProps, StoreGalleryProps, SangatBorosPriorityProps, StoreDetailAnalyticsProps, StoreMonitoringPageProps, Dashboard Time-Grain Switcher and Real Monthly History, Default Analytics to Latest Recorded Date, Changed Files (+28 more)

### Community 12 - "sheet-surface.tsx"
Cohesion: 0.13
Nodes (31): AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), initialsOf(), ROLE_LABELS, ShellViewer, signOut() (+23 more)

### Community 13 - "store-service.ts"
Cohesion: 0.11
Nodes (36): PhaseGaugeGridProps, currentMembers(), end(), expandBucketRows(), isVirtualDeviceId(), macOf(), macsEverIn(), MAIN_PANELS (+28 more)

### Community 14 - "device-service.ts"
Cohesion: 0.10
Nodes (21): Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, Task 5: Data record sesi dan route-nya, isCaptureStalled(), parseWibTimestamp(), createPoolConfig(), getSpartaPool() (+13 more)

### Community 15 - "health-service.ts"
Cohesion: 0.12
Nodes (34): getRequestScope(), isDeviceAllowed(), CoverageDay, buildSummary(), getManagedDevices, getEnergyIndex(), DeviceHealth, getDeviceHealth (+26 more)

### Community 16 - "react"
Cohesion: 0.17
Nodes (27): CaptureControls(), submit(), CommandError(), IntervalField(), Open, save(), SampleCoverageDialog(), SEGMENTS (+19 more)

### Community 17 - "jakartaDate()"
Cohesion: 0.13
Nodes (22): ASSET_DIRS, CONTENT_TYPES, jakartaDate(), createMyEcoArchive(), MyEcoArchive, MYECO_STORES, PowerSample, averageSamples() (+14 more)

### Community 18 - "energy-index.ts"
Cohesion: 0.10
Nodes (22): coverageDays(), coverageSummary(), Bucket, BUCKET_MS, bucketEnergy(), createEnergyIndex(), loadProfile(), merge() (+14 more)

### Community 19 - "smtp.ts"
Cohesion: 0.12
Nodes (15): RFC-2047, ReadyMail, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail (+7 more)

### Community 20 - "xlsx.ts"
Cohesion: 0.15
Nodes (22): downloadExcel(), fileName(), BulkDownload(), download(), fetchSession(), downloadSession(), exportExcel(), Task 6: Export Excel dan backup JSON (+14 more)

### Community 21 - "live-buffer-service.ts"
Cohesion: 0.12
Nodes (21): Changed Files, Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Scope, Verification, Task 3: Route live per toko, scopeKey() (+13 more)

### Community 22 - "package.json"
Cohesion: 0.10
Nodes (27): devDependencies, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, shadcn@^4.23.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/leaflet@^1.9.22, @types/node@^20 (+19 more)

### Community 23 - "requireApiAccess()"
Cohesion: 0.14
Nodes (19): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+11 more)

### Community 24 - "myeco-service.ts"
Cohesion: 0.15
Nodes (23): dynamic, GET(), register(), dailyUsage(), findMyEcoStore(), hourlyUsage(), MeterReading, round3() (+15 more)

### Community 25 - "CLAUDE.md"
Cohesion: 0.08
Nodes (25): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases (+17 more)

### Community 26 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.19
Nodes (20): GalleryToolbar(), GalleryToolbarProps, STATUS_LABELS, StatusBadgeProps, SessionSelector(), SessionSelectorProps, SelectContent(), SelectGroup() (+12 more)

### Community 27 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.17
Nodes (15): Local Commit Enforcement, Required Project Context, Required Task Note, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template (+7 more)

### Community 28 - "This is NOT the Next.js you know"
Cohesion: 0.08
Nodes (24): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases (+16 more)

### Community 29 - "dependencies"
Cohesion: 0.09
Nodes (23): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, pg@^8.23.0 (+15 more)

### Community 30 - "AGENTS.md Agent Guide"
Cohesion: 0.14
Nodes (10): AGENTS.md Agent Guide, Custom Workbook & Scheduled Email Reports, AI_CONTEXT.md Domain & File Map, Store IoT Status Classification (live / historical / unassigned), device_topology Cross-Repo Table Contract, ARCHITECTURE_PLAN.md 3-Pillar Ecosystem, v_toko_sangat_boros Cross-Repo View Contract, CLAUDE.md Claude Code Guide (+2 more)

### Community 31 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "telemetry-date-picker.tsx"
Cohesion: 0.13
Nodes (13): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Dynamic 7-Day Energy Trend Navigation (+5 more)

### Community 33 - "device-control.ts"
Cohesion: 0.19
Nodes (20): CaptureCommand, DeviceCommand, SessionCommand, captureStates(), ControlError, findDevice(), findSession(), runCaptureCommand() (+12 more)

### Community 34 - "(dashboard)/page.tsx"
Cohesion: 0.12
Nodes (17): dynamic, GET(), DashboardPage(), dynamic, NoAssignedDevices(), Changed Files, Context and Sources, Decisions (+9 more)

### Community 35 - "reports.ts"
Cohesion: 0.12
Nodes (18): Loaded, shift(), buildConsumption(), buildLoadProfile(), CONSUMPTION, MAIN, MAX_REPORT_DAYS, PLN_TARIFF (+10 more)

### Community 36 - "request-params.ts"
Cohesion: 0.17
Nodes (15): dynamic, GET(), dynamic, GET(), dynamic, GET(), HistoryParams, isIsoDate() (+7 more)

### Community 37 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 38 - "control-commands.ts"
Cohesion: 0.23
Nodes (14): dynamic, POST(), asRecord(), deviceDisplayName(), fail(), MAX_INTERVAL_S, MIN_INTERVAL_S, parseCaptureCommand() (+6 more)

### Community 39 - "myeco.test.mjs"
Cohesion: 0.16
Nodes (11): createMyEcoClient(), body(), getToken(), requestToken(), send(), MyEcoClientOptions, MyEcoError, MyEcoErrorKind (+3 more)

### Community 40 - "usage-insights.ts"
Cohesion: 0.24
Nodes (14): add(), ascending(), DailyThreshold, dailyThreshold(), findSpikes(), FULL_DAY_HOURS, HourPattern, PeriodSummary (+6 more)

### Community 41 - "AI Context - SPARTA Smart Energy Monitor"
Cohesion: 0.11
Nodes (17): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Codebase Map, Energi (kWh), Format angka (+9 more)

### Community 42 - "mail-settings.ts"
Cohesion: 0.19
Nodes (13): asRecord(), fail(), isUserId(), MAIL_PROVIDERS, MailProvider, MailSettings, parseGroup(), parseMailSettings() (+5 more)

### Community 43 - "logout/route.ts"
Cohesion: 0.24
Nodes (11): dynamic, POST(), dynamic, GET(), DEV_ROLE_COOKIE, SESSION_COOKIE, clearSessionCookie(), expiredSessionCookies() (+3 more)

### Community 44 - "ARCHITECTURE_PLAN.md"
Cohesion: 0.26
Nodes (15): better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification, ESP32 Sensor MQTT Telemetry Ingestion, Interactive Map View (Leaflet), Real-Time 3-Phase Live Gauge Mode, smart-energy-meter-vps (IoT Telemetry Ingestion Engine) (+7 more)

### Community 45 - "telemetry-api.ts"
Cohesion: 0.17
Nodes (14): Alamat API Flask dan cache status capture, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification, fetchTelemetryApi() (+6 more)

### Community 46 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+8 more)

### Community 47 - "laporan/layout.tsx"
Cohesion: 0.19
Nodes (11): dynamic, POST(), isSubscribed(), ReportsLayout(), ReportNav(), Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history` (+3 more)

### Community 48 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 49 - "sheet.tsx"
Cohesion: 0.30
Nodes (12): AlertBell(), load(), onVisible(), Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+4 more)

### Community 50 - "myeco.ts"
Cohesion: 0.20
Nodes (14): DayUsage, HourUsage, isRecord(), listIn(), Log, MYECO_POLL_MS, MyEcoHistory, MyEcoLive (+6 more)

### Community 51 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.21
Nodes (10): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, checkAgentTaskNote checker (scripts/check-agent-task-note.mjs), SPARTA Brand CSS Tokens (oklch primary) (+2 more)

### Community 52 - "📐 Rencana Arsitektur Sistem Monitoring &"
Cohesion: 0.14
Nodes (14): 🏗️ 1. Struktur Ekosistem (3 Proyek Terpisah), 🔗 2. Strategi Dual Database (Isolasi & Sinkronisasi), ⚙️ 3. Alur Penugasan Toko & Sesi Rekaman IoT, 🔑 4. Spesifikasi Environment Variables (`.env`), 🧩 5. Lapisan Akses Data di `smart-energy-monitoring`, 🚚 6. Riwayat Keputusan Infrastruktur, 📜 7. Kontrak View Antar-Repo (DB 1), `device_topology` (DB 2) (+6 more)

### Community 53 - "alerts.ts"
Cohesion: 0.18
Nodes (12): DATE_OPTIONS, Alert, ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL (+4 more)

### Community 54 - "next"
Cohesion: 0.27
Nodes (9): dynamic, POST(), dynamic, POST(), dynamic, GET(), handleControl(), parseSessionId() (+1 more)

### Community 55 - "device-tree-service.ts"
Cohesion: 0.26
Nodes (10): DeviceTree(), formatKwh(), SensorList(), buildDeviceTree(), total(), TreeBranch, TreeDevice, TreeSensor (+2 more)

### Community 56 - "Dashboard Shell (Tahap 1) Implementation"
Cohesion: 0.27
Nodes (12): AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle, CircularGauge SVG Arc Component, lib/mock-data.ts (MOCK_STORES, getMockStore, getMockTelemetry) (+4 more)

### Community 57 - "Sidebar Active Indicator and Modern Hove"
Cohesion: 0.15
Nodes (4): Bugfix: Hydration & Base UI Button, Sidebar Active Indicator and Modern Hover, MOCK_AUDIT_SESSIONS, MOCK_STORES

### Community 58 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 59 - "access.ts"
Cohesion: 0.21
Nodes (9): AccessDeniedPage(), metadata, jobScope, RequestAccess, AccessScope, INTERNAL_TOKEN_HEADER, Role, spartaUrl() (+1 more)

### Community 60 - "getRequestAccess"
Cohesion: 0.27
Nodes (10): dynamic, GET(), dynamic, loadSessions(), metadata, SessionsPage(), getAssignedDeviceIds(), getRequestAccess (+2 more)

### Community 61 - "WorkbookBuilder()"
Cohesion: 0.26
Nodes (10): readError(), toSpec(), WorkbookBuilder(), open(), post(), Tabs(), TabsContent(), TabsList() (+2 more)

### Community 62 - "access-rules.ts"
Cohesion: 0.35
Nodes (10): Task 1: Aturan role dan lingkup (modul murni, TDD), anonymousPageTarget(), isRole(), isValidInternalToken(), parseDeviceIds(), PortalDecision, portalDecision(), resolveRole() (+2 more)

### Community 63 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 64 - "proxy.ts"
Cohesion: 0.25
Nodes (9): BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, PATHNAME_HEADER, SESSION_DENIED_PATH, contentSecurityPolicy(), httpOrigin(), config, proxy() (+1 more)

### Community 65 - "workbook.test.mjs"
Cohesion: 0.24
Nodes (6): mail, schedule(), sheet(), table, template(), workbook()

### Community 66 - "excel/page.tsx"
Cohesion: 0.29
Nodes (9): dynamic, formatTime(), loadSaved(), metadata, NOTHING, runText(), Saved, WorkbookPage() (+1 more)

### Community 67 - "phase-gauge-grid.tsx"
Cohesion: 0.31
Nodes (6): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), SVG Circular Gauge Setup, Recharts

### Community 68 - "utils.ts"
Cohesion: 0.38
Nodes (5): ToggleGroupContext, Toggle(), toggleVariants, @base-ui/react, class-variance-authority

### Community 69 - "getTelemetryHistory()"
Cohesion: 0.31
Nodes (8): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, getTelemetryHistory()

### Community 70 - "check-agent-task-note.mjs"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 71 - "allowBuilds"
Cohesion: 0.20
Nodes (9): Prisma 7 Starter Configuration, pnpm allowBuilds (sharp, prisma, @prisma/engines), allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver (+1 more)

### Community 72 - "laporan/page.tsx"
Cohesion: 0.28
Nodes (7): dynamic, firstReport(), metadata, ReportsPage(), jakartaToday(), appendSample(), createMyEcoState()

### Community 73 - "(dashboard)/layout.tsx"
Cohesion: 0.44
Nodes (6): DashboardLayout(), AccessCheckFailed(), AdminShell(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 74 - "Sembunyikan toko DEMO dari Prioritas Pas"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 75 - "Agent Docs: Skills Matrix, graphify Rule"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 76 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 77 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 78 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 79 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 80 - "Tombol "Kembali ke SPARTA" di header por"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 81 - "Cache per request untuk data toko dan ha"
Cohesion: 0.25
Nodes (7): Cache per request untuk data toko dan halaman loading, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 82 - "Store MEP Simulator — Lighting Snap to G"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 83 - "Tambah skill frontend-design dari sparta"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 84 - "Sign-out, Ganti Peran, dan security"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification

### Community 85 - "Topologi SpartaEnergy"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Topologi SpartaEnergy, Verification

### Community 86 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 87 - "Dashboard streaming dan cache biaya bula"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 88 - "copy-assets.js"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 89 - "copy-assets.mjs"
Cohesion: 0.29
Nodes (5): __dirname, __filename, destDir, srcDir, possibleSrcDirs

### Community 90 - "Standardize GitHub Actions Deploy Workfl"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 91 - "Dual-Database Integration Architecture"
Cohesion: 0.40
Nodes (5): Dual-Database Integration Architecture, Dual-Database Architecture (sparta_energy + energy_meter), 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), smart-energy-meter-vps (sister project), sparta-energy (sister project)

### Community 92 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 93 - "Pindah Fitur Smart Energy Meter ke Porta"
Cohesion: 0.40
Nodes (4): Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah)

### Community 94 - "Tombol "Kembali ke SPARTA" di header por"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 95 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 97 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `getTelemetryChartData` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 580 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `myeco-ac-section.tsx`, `dashboard-overview.tsx`, `report-mail-service.ts`, `telemetry-service.ts`, `store-monitoring-page.tsx`, `store-analytics-widget.tsx`, `cn()`, `workbook.ts`, `workbook-builder.tsx`, `perangkat/page.tsx`, `react`, `jakartaDate()`, `package.json`, `requireApiAccess()`, `myeco-service.ts`, `dependencies`, `(dashboard)/page.tsx`, `request-params.ts`, `control-commands.ts`, `logout/route.ts`, `laporan/layout.tsx`, `app/layout.tsx`, `alerts.ts`, `device-tree-service.ts`, `access.ts`, `getRequestAccess`, `breadcrumb.tsx`, `proxy.ts`, `excel/page.tsx`, `laporan/page.tsx`, `(dashboard)/layout.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.081) - this node is a cross-community bridge._
- **What connects `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `myeco-ac-section.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05406434418427565 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `myeco-ac-section.tsx`, `dashboard-overview.tsx`, `store-monitoring-page.tsx`, `store-analytics-widget.tsx`, `cn()`, `workbook-builder.tsx`, `perangkat/page.tsx`, `sheet-surface.tsx`, `store-service.ts`, `device-service.ts`, `health-service.ts`, `xlsx.ts`, `package.json`, `monthly-cost-kpi-card.tsx`, `dependencies`, `telemetry-date-picker.tsx`, `app/layout.tsx`, `sheet.tsx`, `access.ts`, `breadcrumb.tsx`, `utils.ts`?**
  _High betweenness centrality (0.080) - this node is a cross-community bridge._
- **Should `dashboard-overview.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.10194805194805195 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn()` to `myeco-ac-section.tsx`, `dashboard-overview.tsx`, `telemetry-date-picker.tsx`, `phase-gauge-grid.tsx`, `utils.ts`, `store-monitoring-page.tsx`, `store-analytics-widget.tsx`, `workbook-builder.tsx`, `perangkat/page.tsx`, `sheet-surface.tsx`, `laporan/layout.tsx`, `app/layout.tsx`, `react`, `sheet.tsx`, `monthly-cost-kpi-card.tsx`, `WorkbookBuilder()`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
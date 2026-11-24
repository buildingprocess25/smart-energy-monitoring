# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 310 files · ~144,377 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1912 nodes · 5976 edges · 88 communities (85 shown, 3 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 265 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `24d2aa6e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- workbook.ts
- Rapikan File Graphify dan Isi Repo
- getStoreAnalyticsData
- control-commands.ts
- xlsx.ts
- AI_RULES.md - AI Coding Rules
- app/layout.tsx
- request-params.ts
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- cn
- myeco-service.ts
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- phase-keys.ts
- ESLint Config
- PostCSS Config
- ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture
- Sign-out, Ganti Peran, dan security
- mail/route.ts
- CLAUDE.md
- telemetry-service.ts
- device-service.ts
- workbook-builder.tsx
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- schedule-panel.tsx
- types.ts
- device-control.ts
- store-detail-analytics.tsx
- Tambah skill frontend-design dari sparta-office
- react
- Tombol "Kembali ke SPARTA" di header portal
- Button
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- next
- store-gallery.tsx
- SSO redirect loop guard
- health-service.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- Store
- proxy.ts
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- store-service.ts
- session-service.ts
- toggle-group.tsx
- DESIGN.md - UI/UX Specification
- perangkat/page.tsx
- logout/route.ts
- Pindah fitur Smart Energy Meter ke portal: Tahap 1
- logout/route.ts
- pools.ts
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- Dashboard Shell (Tahap 1) Implementation Plan
- workbook-service.ts
- energy-service.ts
- report-mail-service.ts
- access-rules.ts
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- mail-settings.ts
- smtp.ts
- report-service.ts
- sample-count-service.ts
- Standardize GitHub Actions Deploy Workflow
- Tahap
- dashboard-overview.tsx
- app/layout.tsx
- allowBuilds
- getTelemetryHistory
- sheet-surface.tsx
- network-map-leaflet.tsx
- Dashboard streaming dan cache biaya bulanan
- [storeId]/page.tsx
- (dashboard)/layout.tsx
- copy-assets.mjs
- Portal Akses Role (Admin, Auditor, GS)
- Alamat API Flask dan cache status capture
- report-mail-service.ts
- next.config.ts

## God Nodes (most connected - your core abstractions)
1. `cn()` - 167 edges
2. `next` - 60 edges
3. `react` - 58 edges
4. `Button()` - 51 edges
5. `requireApiAccess()` - 39 edges
6. `WorkbookBuilder()` - 38 edges
7. `lucide-react` - 38 edges
8. `getTelemetryPool()` - 33 edges
9. `Store` - 33 edges
10. `Input()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Global Constraints` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
- `Task 9: Dokumen, catatan task, dan verifikasi akhir` --references--> `readOnlyQuery()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/read-only.ts
- `Domain Rules That Code Must Keep` --references--> `mainPanelKwh()`  [INFERRED]
  CLAUDE.md → lib/format-energy.ts

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

## Communities (88 total, 3 thin omitted)

### Community 0 - "workbook.ts"
Cohesion: 0.08
Nodes (40): Loaded, TemplateView, CONSUMPTION, MAIN, MAX_REPORT_DAYS, PLN_TARIFF, REPORT_COLUMNS, REPORT_TYPES (+32 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "getStoreAnalyticsData"
Cohesion: 0.12
Nodes (21): Default Analytics to Latest Recorded Date, Remove Hardcoded Date Fallbacks, Changed Files, Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope (+13 more)

### Community 3 - "control-commands.ts"
Cohesion: 0.22
Nodes (15): dynamic, POST(), asRecord(), deviceDisplayName(), fail(), isSameOrigin(), MAX_INTERVAL_S, MIN_INTERVAL_S (+7 more)

### Community 4 - "xlsx.ts"
Cohesion: 0.14
Nodes (24): downloadExcel(), fileName(), BulkDownload(), download(), fetchSession(), downloadSession(), exportExcel(), Task 6: Export Excel dan backup JSON (+16 more)

### Community 5 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.17
Nodes (16): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template, Project Governance Implementation Plan, GitHub Actions Deploy Workflow (+8 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 7 - "request-params.ts"
Cohesion: 0.19
Nodes (14): dynamic, GET(), dynamic, GET(), HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam() (+6 more)

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
Nodes (23): dependencies, @base-ui/react@^1.6.0, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, pg@^8.23.0, @prisma/client@^7.9.1 (+15 more)

### Community 12 - "cn"
Cohesion: 0.09
Nodes (53): AdminShell(), AppHeader(), AppSidebar(), NavItem, NavItemButton(), navItems, initialsOf(), ShellViewer (+45 more)

### Community 13 - "myeco-service.ts"
Cohesion: 0.05
Nodes (70): ASSET_DIRS, CONTENT_TYPES, dynamic, GET(), register(), appendSample(), createMyEcoArchive(), MyEcoArchive (+62 more)

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
Cohesion: 0.10
Nodes (39): sensorList(), Remaining Work and Risks, Fakta dari Flask yang dipakai plan ini, Struktur File, Task 1: Modul fase bersama, Task 2: Parser live buffer, Task 4: Grafik real-time di detail toko, Task 7: Halaman Sesi Rekaman (+31 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture"
Cohesion: 0.26
Nodes (16): ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification, ESP32 Sensor MQTT Telemetry Ingestion, Interactive Map View (Leaflet), Real-Time 3-Phase Live Gauge Mode (+8 more)

### Community 22 - "Sign-out, Ganti Peran, dan security"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification

### Community 23 - "mail/route.ts"
Cohesion: 0.22
Nodes (22): bad(), dynamic, POST(), bad(), dynamic, POST(), requireControlAccess(), secretContext() (+14 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.13
Nodes (18): dynamic, GET(), PZEM Energy Counter Reset / Rollover, SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), Fix Weekly Energy kWh Calculation and Telemetry Integration, Fix Energy Meter Reset Rollover False Spike, getAivenPool (+10 more)

### Community 26 - "device-service.ts"
Cohesion: 0.15
Nodes (15): Task 5: Data record sesi dan route-nya, isDeviceAllowed(), isCaptureStalled(), parseWibTimestamp(), QueryClient, QueryPool, readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS (+7 more)

### Community 27 - "workbook-builder.tsx"
Cohesion: 0.23
Nodes (15): newSheet(), CONFIRM_TITLE, emptyTemplate(), readError(), toSpec(), WorkbookBuilder(), open(), post() (+7 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.14
Nodes (24): bufferSyncText(), emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, METRIC_CONFIG, TelemetryChart() (+16 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (15): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+7 more)

### Community 31 - "schedule-panel.tsx"
Cohesion: 0.20
Nodes (21): Check(), Choice, Field(), SelectField(), load(), DAYS, FREQUENCIES, SchedulePanel() (+13 more)

### Community 32 - "types.ts"
Cohesion: 0.16
Nodes (12): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData(), Dashboard Time-Grain Switcher and Real Monthly History, LoadProfilePoint, MonthlyTrendSummary, PaginationMeta (+4 more)

### Community 33 - "device-control.ts"
Cohesion: 0.14
Nodes (26): dynamic, POST(), dynamic, POST(), CaptureCommand, DeviceCommand, SessionCommand, handleControl() (+18 more)

### Community 34 - "store-detail-analytics.tsx"
Cohesion: 0.05
Nodes (75): EnergyChart(), EnergyChartControls(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah() (+67 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "react"
Cohesion: 0.14
Nodes (29): CaptureControls(), submit(), CommandError(), IntervalField(), Open, SensorRow(), save(), send() (+21 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "Button"
Cohesion: 0.07
Nodes (83): AlertBell(), load(), onVisible(), AlertList(), DATE_OPTIONS, MonthlyCostCard(), MonthlyCostKpiCardProps, formatRelativeTime() (+75 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "next"
Cohesion: 0.12
Nodes (24): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+16 more)

### Community 42 - "store-gallery.tsx"
Cohesion: 0.13
Nodes (16): StatusBadgeProps, formatRelativeTime(), StoreCard(), StoreCardProps, StoreGallery(), StoreGalleryProps, SangatBorosPriorityProps, Dynamic Equipment Naming from devices.sensors and history.phase_name (+8 more)

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "health-service.ts"
Cohesion: 0.06
Nodes (42): shift(), ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL, deviceAlerts() (+34 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "Store"
Cohesion: 0.17
Nodes (12): DashboardOverviewProps, StoreAnalyticsWidgetProps, StoreDetailAnalyticsProps, StoreHeroProps, StoreMonitoringPageProps, MOCK_AUDIT_SESSIONS, MOCK_STORES, AuditSession (+4 more)

### Community 47 - "proxy.ts"
Cohesion: 0.27
Nodes (9): anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, PATHNAME_HEADER, contentSecurityPolicy(), httpOrigin(), config, proxy() (+1 more)

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "store-service.ts"
Cohesion: 0.13
Nodes (21): dynamic, GET(), history table (session captures), telemetry table (15-min background monitoring), requireInternalAccess(), getSpartaPool(), EnergyTotal, getEnergyIndexWithin() (+13 more)

### Community 52 - "session-service.ts"
Cohesion: 0.10
Nodes (32): Codebase Map, dynamic, loadSessions(), metadata, SessionsPage(), Task 3: Route live per toko, getRequestScope(), scopeKey() (+24 more)

### Community 53 - "toggle-group.tsx"
Cohesion: 0.43
Nodes (5): ToggleGroupContext, Toggle(), toggleVariants, class-variance-authority@^0.7.1, class-variance-authority

### Community 54 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.21
Nodes (10): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, checkAgentTaskNote checker (scripts/check-agent-task-note.mjs), SPARTA Brand CSS Tokens (oklch primary) (+2 more)

### Community 55 - "perangkat/page.tsx"
Cohesion: 0.12
Nodes (35): DashboardError(), DashboardLoading(), dynamic, metadata, MonitoringPage(), DevicePage(), dynamic, metadata (+27 more)

### Community 56 - "logout/route.ts"
Cohesion: 0.24
Nodes (9): AccessDeniedPage(), metadata, dynamic, POST(), DEV_ROLE_COOKIE, SESSION_COOKIE, spartaUrl(), Fetch (+1 more)

### Community 57 - "Pindah fitur Smart Energy Meter ke portal: Tahap 1"
Cohesion: 0.29
Nodes (6): Changed Files, Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Scope, Verification

### Community 58 - "logout/route.ts"
Cohesion: 0.35
Nodes (7): dynamic, GET(), Access Control, SESSION_DENIED_PATH, clearSessionCookie(), expiredSessionCookies(), relativeRedirect()

### Community 59 - "pools.ts"
Cohesion: 0.14
Nodes (6): Remove Hardcoded DB Secrets, createPoolConfig(), POOL_STATEMENT_TIMEOUT_MS, createStaleCache(), Entry, StaleCacheOptions

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 62 - "Dashboard Shell (Tahap 1) Implementation Plan"
Cohesion: 0.21
Nodes (14): app/globals.css, AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Final Polish & Metadata, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle (+6 more)

### Community 63 - "workbook-service.ts"
Cohesion: 0.22
Nodes (15): dynamic, POST(), dynamic, POST(), Preview, readJsonBody(), buildPreview(), buildWorkbook() (+7 more)

### Community 65 - "energy-service.ts"
Cohesion: 0.13
Nodes (19): Data Layer, Databases, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah), getTelemetryPool(), EnergyIndex (+11 more)

### Community 66 - "report-mail-service.ts"
Cohesion: 0.12
Nodes (34): dynamic, POST(), dynamic, load(), MailSettingsPage(), metadata, dynamic, formatTime() (+26 more)

### Community 67 - "access-rules.ts"
Cohesion: 0.19
Nodes (17): Context and Sources, Task 1: Aturan role dan lingkup (modul murni, TDD), getAssignedDeviceIds(), jobScope, RequestAccess, AccessScope, INTERNAL_TOKEN_HEADER, isRole() (+9 more)

### Community 68 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 69 - "mail-settings.ts"
Cohesion: 0.14
Nodes (18): asRecord(), fail(), isUserId(), MAIL_PROVIDERS, MailProvider, MailSettings, parseGroup(), parseMailSettings() (+10 more)

### Community 70 - "smtp.ts"
Cohesion: 0.09
Nodes (19): RFC-2047, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail, oneLine() (+11 more)

### Community 72 - "report-service.ts"
Cohesion: 0.12
Nodes (30): dynamic, firstReport(), metadata, ReportsPage(), Services, buildDeviceTree(), total(), TreeBranch (+22 more)

### Community 73 - "sample-count-service.ts"
Cohesion: 0.17
Nodes (23): addCounts(), countDays(), countHours(), empty(), HOUR_MS, hoursOfDate(), Range, recordingRanges() (+15 more)

### Community 74 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 78 - "dashboard-overview.tsx"
Cohesion: 0.24
Nodes (17): DashboardPage(), dynamic, DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback() (+9 more)

### Community 79 - "app/layout.tsx"
Cohesion: 0.22
Nodes (11): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+3 more)

### Community 80 - "allowBuilds"
Cohesion: 0.33
Nodes (6): allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver

### Community 81 - "getTelemetryHistory"
Cohesion: 0.33
Nodes (7): August 28 MQTT Topic Format Migration, raw_combined CTE for Phase Grouping, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, jakartaRange(), getTelemetryHistory(), loadHistory()

### Community 82 - "sheet-surface.tsx"
Cohesion: 0.15
Nodes (24): noSubscription(), THEME_OPTIONS, ThemeToggle(), ROLE_LABELS, signOut(), UserMenuContent(), cellText(), ColumnMenu() (+16 more)

### Community 83 - "network-map-leaflet.tsx"
Cohesion: 0.09
Nodes (19): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, NetworkMapLeaflet, NetworkMapWidget(), NetworkMapWidgetProps (+11 more)

### Community 84 - "Dashboard streaming dan cache biaya bulanan"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 85 - "[storeId]/page.tsx"
Cohesion: 0.38
Nodes (8): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreMonitoringPage(), Monitoring Detail Page Setup

### Community 86 - "(dashboard)/layout.tsx"
Cohesion: 0.50
Nodes (5): DashboardLayout(), AccessCheckFailed(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 88 - "copy-assets.mjs"
Cohesion: 0.22
Nodes (7): Sync Logo and Branding with Sparta Energy, Clean copy-assets Scripts, __dirname, __filename, destDir, srcDir, possibleSrcDirs

### Community 89 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Changed Files, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 92 - "Alamat API Flask dan cache status capture"
Cohesion: 0.19
Nodes (13): Alamat API Flask dan cache status capture, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification, fetchTelemetryApi() (+5 more)

### Community 94 - "report-mail-service.ts"
Cohesion: 0.21
Nodes (14): Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history`, runAsJob(), deliver(), ReadyMail, sendTemplate(), tick() (+6 more)

### Community 95 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

## Ambiguous Edges - Review These
- `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` → `Dual-Database Architecture (sparta_energy + energy_meter)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `RFC-2047`, `getTelemetryChartData`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `.gitignore` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 519 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `control-commands.ts`, `request-params.ts`, `Package Manifest`, `Runtime Dependencies`, `cn`, `myeco-service.ts`, `mail/route.ts`, `telemetry-service.ts`, `workbook-builder.tsx`, `schedule-panel.tsx`, `device-control.ts`, `store-detail-analytics.tsx`, `react`, `Button`, `store-gallery.tsx`, `proxy.ts`, `breadcrumb.tsx`, `store-service.ts`, `session-service.ts`, `perangkat/page.tsx`, `logout/route.ts`, `workbook-service.ts`, `report-mail-service.ts`, `access-rules.ts`, `report-service.ts`, `dashboard-overview.tsx`, `app/layout.tsx`, `network-map-leaflet.tsx`, `[storeId]/page.tsx`, `(dashboard)/layout.tsx`, `next.config.ts`?**
  _High betweenness centrality (0.103) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `requireApiAccess()` (e.g. with `Access Control` and `Changed Files`) actually correct?**
  _`requireApiAccess()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-2047`, `getTelemetryChartData`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `workbook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.08084163898117387 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `xlsx.ts`, `Package Manifest`, `Runtime Dependencies`, `cn`, `device-service.ts`, `workbook-builder.tsx`, `store-monitoring-page.tsx`, `schedule-panel.tsx`, `store-detail-analytics.tsx`, `Button`, `store-gallery.tsx`, `health-service.ts`, `breadcrumb.tsx`, `store-service.ts`, `toggle-group.tsx`, `perangkat/page.tsx`, `access-rules.ts`, `sample-count-service.ts`, `dashboard-overview.tsx`, `app/layout.tsx`, `sheet-surface.tsx`, `network-map-leaflet.tsx`, `[storeId]/page.tsx`?**
  _High betweenness centrality (0.075) - this node is a cross-community bridge._
- **Should `getStoreAnalyticsData` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` and `Dual-Database Architecture (sparta_energy + energy_meter)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
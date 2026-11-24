# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 304 files · ~141,116 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1862 nodes · 5751 edges · 92 communities (88 shown, 4 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 262 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `a8223f62`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- next
- Rapikan File Graphify dan Isi Repo
- types.ts
- myeco-service.ts
- xlsx.ts
- AI_RULES.md - AI Coding Rules
- app/layout.tsx
- Button
- Package Manifest
- shadcn Config
- TypeScript Config
- Runtime Dependencies
- cn
- myeco-samples.ts
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
- getTelemetryPool
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- schedule-panel.tsx
- mail-settings.test.mjs
- device-control.ts
- store-detail-analytics.tsx
- Tambah skill frontend-design dari sparta-office
- react
- Tombol "Kembali ke SPARTA" di header portal
- myeco-ac-section.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- live-buffer-service.ts
- Store
- SSO redirect loop guard
- energy-service.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- store-analytics-widget.tsx
- myeco.test.mjs
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- store-service.ts
- session-service.ts
- health-service.ts
- DESIGN.md - UI/UX Specification
- device-settings.tsx
- next
- session-records.ts
- (dashboard)/layout.tsx
- device-tree-service.ts
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- Dashboard Shell (Tahap 1) Implementation Plan
- pools.ts
- ref_node_assert
- request-params.ts
- report-mail-service.ts
- access-rules.ts
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- mail-settings.ts
- smtp.ts
- myeco/route.ts
- report-service.ts
- perangkat/page.tsx
- Standardize GitHub Actions Deploy Workflow
- Fakta dari Flask yang dipakai plan ini
- Tahap
- SPARTA & Aiven Real Data Integration
- dashboard-overview.tsx
- app/layout.tsx
- allowBuilds
- getRequestAccess
- workbook-builder.tsx
- Store
- Dashboard streaming dan cache biaya bulanan
- [storeId]/page.tsx
- scopeKey
- dotenv
- [filename]/route.ts
- Portal Akses Role (Admin, Auditor, GS)
- TemplateSpec
- Dual-Database Integration Architecture

## God Nodes (most connected - your core abstractions)
1. `cn()` - 161 edges
2. `next` - 59 edges
3. `react` - 55 edges
4. `Button()` - 45 edges
5. `WorkbookBuilder()` - 38 edges
6. `requireApiAccess()` - 37 edges
7. `lucide-react` - 36 edges
8. `Store` - 33 edges
9. `Input()` - 31 edges
10. `getTelemetryPool()` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Context and Sources` --references--> `resolveRole()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/access-rules.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Global Constraints` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
- `Jaminan untuk Alur IoT` --references--> `getTelemetryPool()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/pools.ts

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

## Communities (92 total, 4 thin omitted)

### Community 0 - "next"
Cohesion: 0.12
Nodes (34): dynamic, POST(), dynamic, POST(), Preview, readJsonBody(), buildPreview(), buildWorkbook() (+26 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "types.ts"
Cohesion: 0.16
Nodes (15): StoreGalleryProps, SangatBorosPriorityProps, Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData(), Changed Files, DailyConsumption (+7 more)

### Community 3 - "myeco-service.ts"
Cohesion: 0.12
Nodes (28): register(), appendSample(), dailyUsage(), DayUsage, findMyEcoStore(), hourlyUsage(), HourUsage, isRecord() (+20 more)

### Community 4 - "xlsx.ts"
Cohesion: 0.17
Nodes (20): BulkDownload(), download(), fetchSession(), downloadSession(), exportExcel(), downloadFile(), exportFileName(), sessionSheets() (+12 more)

### Community 5 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.19
Nodes (15): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template, Project Governance Implementation Plan, checkAgentTaskNote checker (scripts/check-agent-task-note.mjs) (+7 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.15
Nodes (11): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote(), __dirname, __filename (+3 more)

### Community 7 - "Button"
Cohesion: 0.14
Nodes (28): AdminShell(), AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), initialsOf(), ROLE_LABELS, ShellViewer (+20 more)

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
Cohesion: 0.09
Nodes (49): AppSidebar(), NavItem, NavItemButton(), navItems, Logo(), LogoProps, Avatar(), AvatarBadge() (+41 more)

### Community 13 - "myeco-samples.ts"
Cohesion: 0.19
Nodes (18): jakartaDate(), createMyEcoArchive(), MyEcoArchive, PowerSample, averageSamples(), datesBetween(), decodeSamples(), encodeSamples() (+10 more)

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
Cohesion: 0.17
Nodes (19): sensorList(), Task 2: Parser live buffer, FIELD_MAP, formatJakartaTime(), isRecord(), MAIN_PHASES, parseLiveBuffer(), TIME_FORMAT (+11 more)

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
Cohesion: 0.17
Nodes (31): bad(), dynamic, POST(), bad(), dynamic, POST(), secretContext(), loadMail() (+23 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.08
Nodes (22): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Debugging, Development Workflow (+14 more)

### Community 25 - "getStoreAnalyticsData"
Cohesion: 0.08
Nodes (35): Codebase Map, dynamic, GET(), Services, August 28 MQTT Topic Format Migration, history table (session captures), PZEM Energy Counter Reset / Rollover, raw_combined CTE for Phase Grouping (+27 more)

### Community 26 - "getTelemetryPool"
Cohesion: 0.13
Nodes (17): Aiven to Biznet VPS PostgreSQL Migration, Decisions, Task 5: Data record sesi dan route-nya, getTelemetryPool(), QueryClient, QueryPool, readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS (+9 more)

### Community 27 - "getRequestScope"
Cohesion: 0.19
Nodes (18): dynamic, GET(), dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, NoAssignedDevices() (+10 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.13
Nodes (26): bufferSyncText(), emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, METRIC_CONFIG, TelemetryChart() (+18 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (15): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+7 more)

### Community 31 - "schedule-panel.tsx"
Cohesion: 0.18
Nodes (22): Check(), Choice, Field(), SelectField(), MailSettingsForm(), PasswordHelp(), DAYS, FREQUENCIES (+14 more)

### Community 32 - "mail-settings.test.mjs"
Cohesion: 0.25
Nodes (6): derive(), openSecret(), SealedSecret, sealSecret(), KEY, subscribers

### Community 33 - "device-control.ts"
Cohesion: 0.06
Nodes (57): dynamic, POST(), dynamic, POST(), dynamic, POST(), Alamat API Flask dan cache status capture, Changed Files (+49 more)

### Community 34 - "store-detail-analytics.tsx"
Cohesion: 0.06
Nodes (52): EnergyChart(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah(), formatUnit() (+44 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "react"
Cohesion: 0.21
Nodes (20): CaptureControls(), CommandError(), IntervalField(), Open, useCommand(), AddressInput(), RecipientGroups(), Open (+12 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "myeco-ac-section.tsx"
Cohesion: 0.09
Nodes (51): AlertList(), formatRelativeTime(), StoreTable(), StoreTableProps, dayClass(), DeviceHealthSection(), formatTime(), percentOf() (+43 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "live-buffer-service.ts"
Cohesion: 0.26
Nodes (12): dynamic, GET(), DeviceStatus, isRecord(), parseBufferSync(), parseDeviceStatus(), text(), parseSinceParam() (+4 more)

### Community 42 - "Store"
Cohesion: 0.17
Nodes (17): DashboardOverviewProps, GalleryToolbarProps, StatusBadgeProps, StoreAnalyticsWidgetProps, formatRelativeTime(), StoreCard(), StoreCardProps, StoreGallery() (+9 more)

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "energy-service.ts"
Cohesion: 0.12
Nodes (19): shift(), Bucket, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge(), summary() (+11 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "store-analytics-widget.tsx"
Cohesion: 0.11
Nodes (42): AlertBell(), load(), onVisible(), EnergyChartControls(), kwhText(), PeriodSummary(), GalleryToolbar(), STATUS_LABELS (+34 more)

### Community 47 - "myeco.test.mjs"
Cohesion: 0.16
Nodes (11): createMyEcoClient(), body(), getToken(), requestToken(), send(), MyEcoClientOptions, MyEcoError, MyEcoErrorKind (+3 more)

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.31
Nodes (6): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), SVG Circular Gauge Setup, Recharts

### Community 51 - "store-service.ts"
Cohesion: 0.14
Nodes (23): PhaseGaugeGridProps, isDeviceAllowed(), isCaptureStalled(), parseWibTimestamp(), deviceKind(), EnergyTotal, readLastRecordTimes(), DeviceRow (+15 more)

### Community 52 - "session-service.ts"
Cohesion: 0.09
Nodes (24): Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope, Verification, AccessScope, getRecordingSessions() (+16 more)

### Community 53 - "health-service.ts"
Cohesion: 0.11
Nodes (26): DATE_OPTIONS, Alert, ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL (+18 more)

### Community 54 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.23
Nodes (9): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, SPARTA Brand CSS Tokens (oklch primary), PRODUCT.md - Product Context (+1 more)

### Community 55 - "device-settings.tsx"
Cohesion: 0.19
Nodes (25): DashboardError(), DashboardLoading(), DevicesPage(), MetricCard(), submit(), DeviceSettings(), Message(), SensorRow() (+17 more)

### Community 56 - "next"
Cohesion: 0.11
Nodes (22): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+14 more)

### Community 57 - "session-records.ts"
Cohesion: 0.24
Nodes (13): Struktur File, Task 8: Buka File Rekaman, normalizePhaseKey(), sensorColor(), energyDeltaKwh(), groupSessionRows(), num(), summarizeSession() (+5 more)

### Community 58 - "(dashboard)/layout.tsx"
Cohesion: 0.14
Nodes (20): AccessDeniedPage(), metadata, dynamic, POST(), dynamic, GET(), DashboardLayout(), Access Control (+12 more)

### Community 59 - "device-tree-service.ts"
Cohesion: 0.23
Nodes (11): DeviceTree(), formatKwh(), SensorList(), buildDeviceTree(), total(), TreeBranch, TreeDevice, TreeSensor (+3 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 62 - "Dashboard Shell (Tahap 1) Implementation Plan"
Cohesion: 0.21
Nodes (14): app/globals.css, AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Final Polish & Metadata, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle (+6 more)

### Community 63 - "pools.ts"
Cohesion: 0.19
Nodes (13): Databases, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig(), getSpartaPool(), POOL_STATEMENT_TIMEOUT_MS, getSangatBorosByCode() (+5 more)

### Community 64 - "ref_node_assert"
Cohesion: 0.16
Nodes (4): JAKARTA_OFFSET_MS, jakartaRange(), jakartaToday(), createMyEcoState()

### Community 65 - "request-params.ts"
Cohesion: 0.21
Nodes (12): dynamic, GET(), HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam(), parseHistoryParams(), parsePositiveInt() (+4 more)

### Community 66 - "report-mail-service.ts"
Cohesion: 0.12
Nodes (31): dynamic, load(), MailSettingsPage(), metadata, dynamic, formatTime(), loadSaved(), metadata (+23 more)

### Community 67 - "access-rules.ts"
Cohesion: 0.14
Nodes (23): Task 1: Aturan role dan lingkup (modul murni, TDD), getAssignedDeviceIds(), jobScope, RequestAccess, anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, INTERNAL_TOKEN_HEADER (+15 more)

### Community 68 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 69 - "mail-settings.ts"
Cohesion: 0.18
Nodes (16): Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history`, runAsJob(), asRecord(), fail(), isUserId(), MAIL_PROVIDERS (+8 more)

### Community 70 - "smtp.ts"
Cohesion: 0.09
Nodes (19): RFC-2047, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail, oneLine() (+11 more)

### Community 71 - "myeco/route.ts"
Cohesion: 0.22
Nodes (12): dynamic, GET(), isPowerRange(), getMyEcoHistory(), getMyEcoLive(), getMyEcoPower(), getMyEcoStore(), state() (+4 more)

### Community 72 - "report-service.ts"
Cohesion: 0.12
Nodes (25): dynamic, GET(), dynamic, firstReport(), metadata, ReportsPage(), Loaded, formatDuration() (+17 more)

### Community 73 - "perangkat/page.tsx"
Cohesion: 0.30
Nodes (9): DevicePage(), dynamic, metadata, dynamic, metadata, CaptureFacts(), DeviceBadges(), formatWib() (+1 more)

### Community 74 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 75 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.17
Nodes (11): Fakta dari Flask yang dipakai plan ini, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah), Task 1: Modul fase bersama, Task 6: Export Excel dan backup JSON, Task 7: Halaman Sesi Rekaman (+3 more)

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 77 - "SPARTA & Aiven Real Data Integration"
Cohesion: 0.25
Nodes (5): SessionSelectorProps, SPARTA & Aiven Real Data Integration, MOCK_AUDIT_SESSIONS, MOCK_STORES, AuditSession

### Community 78 - "dashboard-overview.tsx"
Cohesion: 0.25
Nodes (17): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection(), MonthlyCostKpiCard() (+9 more)

### Community 79 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 80 - "allowBuilds"
Cohesion: 0.22
Nodes (8): pnpm allowBuilds (sharp, prisma, @prisma/engines), allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver, packages

### Community 81 - "getRequestAccess"
Cohesion: 0.16
Nodes (18): dynamic, GET(), dynamic, POST(), WorkbookPage(), isSubscribed(), ReportsLayout(), dynamic (+10 more)

### Community 82 - "workbook-builder.tsx"
Cohesion: 0.19
Nodes (18): newSheet(), SheetSurface(), usePreview(), CONFIRM_TITLE, emptyTemplate(), readError(), toSpec(), WorkbookBuilder() (+10 more)

### Community 83 - "Store"
Cohesion: 0.13
Nodes (12): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeafletProps, NetworkMapLeaflet, NetworkMapWidgetProps, StatusBadge() (+4 more)

### Community 84 - "Dashboard streaming dan cache biaya bulanan"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 85 - "[storeId]/page.tsx"
Cohesion: 0.17
Nodes (10): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreMonitoringPage(), Monitoring Detail Page Setup (+2 more)

### Community 86 - "scopeKey"
Cohesion: 0.25
Nodes (8): Changed Files, Context and Sources, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Remaining Work and Risks, Scope, Verification, Task 3: Route live per toko, scopeKey()

### Community 87 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 89 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 90 - "TemplateSpec"
Cohesion: 0.50
Nodes (4): TemplateView, SavedTemplate, Recipients, TemplateSpec

### Community 91 - "Dual-Database Integration Architecture"
Cohesion: 0.40
Nodes (5): Dual-Database Integration Architecture, Dual-Database Architecture (sparta_energy + energy_meter), 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), smart-energy-meter-vps (sister project), sparta-energy (sister project)

## Ambiguous Edges - Review These
- `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` → `Dual-Database Architecture (sparta_energy + energy_meter)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `.gitignore` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 510 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `next`, `Package Manifest`, `Runtime Dependencies`, `cn`, `report-mail-service.ts`, `getStoreAnalyticsData`, `getRequestScope`, `schedule-panel.tsx`, `device-control.ts`, `react`, `myeco-ac-section.tsx`, `live-buffer-service.ts`, `Store`, `store-analytics-widget.tsx`, `breadcrumb.tsx`, `health-service.ts`, `device-settings.tsx`, `(dashboard)/layout.tsx`, `device-tree-service.ts`, `request-params.ts`, `report-mail-service.ts`, `access-rules.ts`, `myeco/route.ts`, `report-service.ts`, `perangkat/page.tsx`, `dashboard-overview.tsx`, `app/layout.tsx`, `getRequestAccess`, `workbook-builder.tsx`, `Store`, `[storeId]/page.tsx`, `[filename]/route.ts`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **What connects `RFC-2047`, `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.11605937921727395 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `store-detail-analytics.tsx`, `react`, `myeco-ac-section.tsx`, `Button`, `Store`, `dashboard-overview.tsx`, `store-analytics-widget.tsx`, `app/layout.tsx`, `getRequestAccess`, `phase-gauge-grid.tsx`, `Store`, `workbook-builder.tsx`, `[storeId]/page.tsx`, `breadcrumb.tsx`, `device-settings.tsx`, `store-monitoring-page.tsx`, `schedule-panel.tsx`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `myeco-service.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12473118279569892 - nodes in this community are weakly interconnected._
- **Why does `react` connect `react` to `xlsx.ts`, `Button`, `Package Manifest`, `Runtime Dependencies`, `cn`, `getRequestScope`, `store-monitoring-page.tsx`, `schedule-panel.tsx`, `store-detail-analytics.tsx`, `myeco-ac-section.tsx`, `Store`, `store-analytics-widget.tsx`, `breadcrumb.tsx`, `store-service.ts`, `health-service.ts`, `device-settings.tsx`, `access-rules.ts`, `perangkat/page.tsx`, `dashboard-overview.tsx`, `app/layout.tsx`, `workbook-builder.tsx`, `Store`, `[storeId]/page.tsx`?**
  _High betweenness centrality (0.070) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` and `Dual-Database Architecture (sparta_energy + energy_meter)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
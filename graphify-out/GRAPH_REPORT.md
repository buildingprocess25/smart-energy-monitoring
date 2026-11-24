# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 207 files · ~96,825 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1203 nodes · 3029 edges · 80 communities (74 shown, 6 thin omitted)
- Extraction: 93% EXTRACTED · 7% INFERRED · 0% AMBIGUOUS · INFERRED: 222 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `63059999`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- api-guard.ts
- Rapikan File Graphify dan Isi Repo
- sangat-boros-service.ts
- (dashboard)/layout.tsx
- access-rules.ts
- 3-Pillar Architecture Plan
- app/layout.tsx
- next
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
- POST
- Store Analytics Widget with Load Profile
- CLAUDE.md
- telemetry-service.ts
- store-service.ts
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- app-header.tsx
- Fakta dari Flask yang dipakai plan ini
- app-sidebar.tsx
- sesi-rekaman/page.tsx
- Tambah skill frontend-design dari sparta-office
- SPARTA & Aiven Real Data Integration
- Tombol "Kembali ke SPARTA" di header portal
- store-table.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- live-buffer-service.ts
- session-invalid/route.ts
- SSO redirect loop guard
- energy-service.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- getStoreAnalyticsData
- Portal Akses Role (Admin, Auditor, GS)
- next.config.ts
- GEMINI.md
- phase-gauge-grid.tsx
- Standardize GitHub Actions Deploy Workflow
- [storeId]/page.tsx
- store-analytics-widget.tsx
- session-service.ts
- lucide-react
- requireApiAccess
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- scopeKey
- next
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- Angka energi dan performa
- Alamat API Flask dan cache status capture
- Dashboard streaming dan cache biaya bulanan
- Sidebar Active Indicator and Modern Hover
- package.json
- dashboard-overview.tsx
- Backlog
- Store
- Tabel prioritas dan sesi rekaman
- react
- monthly-cost-kpi-card.tsx
- Telemetry Interval Delta Energy
- IoT Session Assignment & Multi-Session Architecture
- breadcrumb.tsx
- Migrasi fitur dashboard meter lama ke portal
- akses-ditolak/page.tsx
- Tampilan mengikuti Energy
- contentSecurityPolicy

## God Nodes (most connected - your core abstractions)
1. `cn()` - 130 edges
2. `react` - 33 edges
3. `Store` - 32 edges
4. `next` - 32 edges
5. `getStoreAnalyticsData()` - 26 edges
6. `lucide-react` - 26 edges
7. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
8. `Button()` - 22 edges
9. `requireApiAccess()` - 22 edges
10. `getTelemetryPool()` - 22 edges

## Surprising Connections (you probably didn't know these)
- `Tahap 2 (garis besar, dibuat sebagai plan terpisah)` --references--> `POST()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → app/api/auth/logout/route.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
- `Task 2: Akses per request` --references--> `getSpartaPool()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/db/pools.ts
- `Jaminan untuk Alur IoT` --references--> `getTelemetryPool()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/pools.ts
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

## Communities (80 total, 6 thin omitted)

### Community 0 - "api-guard.ts"
Cohesion: 0.29
Nodes (10): dynamic, GET(), getAssignedDeviceIds(), getRequestAccess, requireInternalAccess(), getSpartaPool(), getIotDeviceDataList, loadStoreById() (+2 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "sangat-boros-service.ts"
Cohesion: 0.19
Nodes (18): Services, StoreGalleryProps, SangatBorosPriorityProps, Changed Files, Scope, getEnergyIndex(), compareWithSangatBoros(), getSangatBorosByCode() (+10 more)

### Community 3 - "(dashboard)/layout.tsx"
Cohesion: 0.30
Nodes (9): DashboardLayout(), AccessCheckFailed(), AdminShell(), portalDecision(), Fetch, revokeSpartaSession(), ROLE_SWITCH_ROLES, roleSwitchUrl() (+1 more)

### Community 4 - "access-rules.ts"
Cohesion: 0.14
Nodes (26): dynamic, Context and Sources, Task 1: Aturan role dan lingkup (modul murni, TDD), RequestAccess, AccessScope, anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS (+18 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.10
Nodes (14): ASSET_DIRS, CONTENT_TYPES, Agent Task Note Pre-Commit Guard, Clean copy-assets Scripts, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt() (+6 more)

### Community 7 - "next"
Cohesion: 0.16
Nodes (11): dynamic, GET(), dynamic, GET(), dynamic, GET(), Global Constraints, Jaminan untuk Alur IoT (+3 more)

### Community 8 - "Package Manifest"
Cohesion: 0.11
Nodes (19): devDependencies, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, shadcn@^4.23.0, tailwindcss@^4, @types/leaflet@^1.9.22, @types/pg@^8.23.1, @types/react@^19 (+11 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.10
Nodes (21): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, next-themes@^0.4.6 (+13 more)

### Community 12 - "cn"
Cohesion: 0.13
Nodes (29): AvatarBadge(), AvatarGroup(), AvatarGroupCount(), AvatarImage(), Input(), Separator(), SidebarContext, SidebarContextProps (+21 more)

### Community 13 - "getTelemetryHistory"
Cohesion: 0.31
Nodes (8): August 28 MQTT Topic Format Migration, history table (session captures), raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), Fix Weekly Energy kWh Calculation and Telemetry Integration, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, getTelemetryHistory()

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
Cohesion: 0.12
Nodes (31): sensorList(), Remaining Work and Risks, Task 2: Parser live buffer, Task 8: Buka File Rekaman, FIELD_MAP, formatJakartaTime(), isRecord(), parseLiveBuffer() (+23 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 22 - "POST"
Cohesion: 0.13
Nodes (15): POST(), Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification (+7 more)

### Community 23 - "Store Analytics Widget with Load Profile"
Cohesion: 0.19
Nodes (9): StatusBadgeProps, Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData(), PaginationMeta, SessionInfo, StoreStatus (+1 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.08
Nodes (23): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases, Debugging (+15 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.13
Nodes (20): Codebase Map, dynamic, GET(), Aiven to Biznet VPS PostgreSQL Migration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), Remove Hardcoded DB Secrets, createPoolConfig(), getAivenPool (+12 more)

### Community 26 - "store-service.ts"
Cohesion: 0.26
Nodes (10): EnergyTotal, getEnergyIndexWithin(), IotDeviceData, LatestRow, loadCaptureStatus, loadEnergyIndex(), loadIotDeviceDataList(), loadLatestRows() (+2 more)

### Community 27 - "getRequestScope"
Cohesion: 0.22
Nodes (14): dynamic, GET(), dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, StoreGallery() (+6 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.15
Nodes (22): emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, METRIC_CONFIG, TelemetryChart(), TelemetryChartProps (+14 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.07
Nodes (28): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+20 more)

### Community 31 - "app-header.tsx"
Cohesion: 0.16
Nodes (23): AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), ROLE_LABELS, ShellViewer, signOut(), SpartaLinks (+15 more)

### Community 32 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.13
Nodes (14): Fakta dari Flask yang dipakai plan ini, Task 1: Modul fase bersama, Task 3: Route live per toko, Task 4: Grafik real-time di detail toko, Task 5: Data record sesi dan route-nya, Task 6: Export Excel dan backup JSON, Task 9: Dokumen, catatan task, dan verifikasi akhir, QueryClient (+6 more)

### Community 33 - "app-sidebar.tsx"
Cohesion: 0.18
Nodes (18): AppSidebar(), NavItem, NavItemButton(), navItems, initialsOf(), Logo(), LogoProps, Avatar() (+10 more)

### Community 34 - "sesi-rekaman/page.tsx"
Cohesion: 0.22
Nodes (8): dynamic, loadSessions(), metadata, SessionsPage(), BackoffError, createSharedFetch(), Entry, SharedFetchOptions

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "SPARTA & Aiven Real Data Integration"
Cohesion: 0.20
Nodes (7): SessionSelectorProps, Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, SPARTA Energy DB (stores, audits), MOCK_AUDIT_SESSIONS, MOCK_STORES, AuditSession

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "store-table.tsx"
Cohesion: 0.32
Nodes (16): formatRelativeTime(), StoreTable(), formatDate(), formatKwh(), SangatBorosPriority(), DATE_OPTIONS, formatEpoch(), SessionTable() (+8 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "live-buffer-service.ts"
Cohesion: 0.33
Nodes (9): dynamic, GET(), getStoreLiveBuffer(), loadLiveBuffer, resolveDeviceId, fetchTelemetryApi(), telemetryApiBase(), TelemetryApiError (+1 more)

### Community 42 - "session-invalid/route.ts"
Cohesion: 0.39
Nodes (6): dynamic, GET(), Access Control, clearSessionCookie(), expiredSessionCookies(), relativeRedirect()

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "energy-service.ts"
Cohesion: 0.08
Nodes (28): register(), Bucket, BUCKET_MS, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge() (+20 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "getStoreAnalyticsData"
Cohesion: 0.28
Nodes (6): Fix Weekly Chart Switching and Timezone Alignment, Default Analytics to Latest Recorded Date, Remove Hardcoded Date Fallbacks, getStoreAnalyticsData(), getTelemetryChartData, hourlyAverageDiffPct()

### Community 47 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.33
Nodes (5): Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 48 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 52 - "[storeId]/page.tsx"
Cohesion: 0.43
Nodes (7): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreMonitoringPage()

### Community 53 - "store-analytics-widget.tsx"
Cohesion: 0.08
Nodes (32): CustomXAxisTick(), formatDateToIso(), formatKw(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget() (+24 more)

### Community 54 - "session-service.ts"
Cohesion: 0.17
Nodes (18): dynamic, GET(), Struktur File, Task 7: Halaman Sesi Rekaman, scopeKey(), parseSessionId(), getRecordingSessions(), getSessionRecords() (+10 more)

### Community 55 - "lucide-react"
Cohesion: 0.20
Nodes (15): GalleryToolbar(), GalleryToolbarProps, STATUS_LABELS, SessionSelector(), SelectContent(), SelectGroup(), SelectItem(), SelectLabel() (+7 more)

### Community 56 - "requireApiAccess"
Cohesion: 0.26
Nodes (11): HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam(), parseHistoryParams(), parsePositiveInt(), ParseResult, parseSinceParam() (+3 more)

### Community 57 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 58 - "scopeKey"
Cohesion: 0.29
Nodes (6): Changed Files, Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Scope, Verification

### Community 59 - "next"
Cohesion: 0.26
Nodes (15): createStoreIcon(), FloatingMapControls(), MapViewController(), NetworkMapLeaflet(), NetworkMapLeaflet, NetworkMapWidget(), StatusBadge(), formatRelativeTime() (+7 more)

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 62 - "Angka energi dan performa"
Cohesion: 0.25
Nodes (7): Angka energi dan performa, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 63 - "Alamat API Flask dan cache status capture"
Cohesion: 0.25
Nodes (7): Alamat API Flask dan cache status capture, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 64 - "Dashboard streaming dan cache biaya bulanan"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 66 - "package.json"
Cohesion: 0.15
Nodes (12): react-dom@19.2.4, tw-animate-css@^1.4.0, @tailwindcss/postcss@^4, @types/node@^20, name, private, type, version (+4 more)

### Community 67 - "dashboard-overview.tsx"
Cohesion: 0.27
Nodes (15): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection(), MonthlyCostKpiCard() (+7 more)

### Community 69 - "Store"
Cohesion: 0.24
Nodes (11): DashboardOverviewProps, NetworkMapLeafletProps, NetworkMapWidgetProps, StoreAnalyticsWidgetProps, StoreCardProps, StoreTableProps, StoreDetailAnalyticsProps, StoreHeroProps (+3 more)

### Community 70 - "Tabel prioritas dan sesi rekaman"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tabel prioritas dan sesi rekaman, Verification

### Community 71 - "react"
Cohesion: 0.18
Nodes (20): DashboardError(), DashboardLoading(), fontMono, geist, metadata, RootLayout(), MetricCard(), isTypingTarget() (+12 more)

### Community 72 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.23
Nodes (15): MonthlyCostCard(), Badge(), badgeVariants, Sheet(), SheetContent(), SheetDescription(), SheetFooter(), SheetHeader() (+7 more)

### Community 73 - "Telemetry Interval Delta Energy"
Cohesion: 0.33
Nodes (3): PZEM Energy Counter Reset / Rollover, Telemetry Interval Delta Energy, Fix Energy Meter Reset Rollover False Spike

### Community 74 - "IoT Session Assignment & Multi-Session Architecture"
Cohesion: 0.14
Nodes (7): IoT Session Assignment & Multi-Session Architecture, IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture, 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), Integrate Real Leaflet Mapping, smart-energy-meter-vps (sister project), sparta-energy (sister project)

### Community 75 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 76 - "Migrasi fitur dashboard meter lama ke portal"
Cohesion: 0.33
Nodes (5): Aturan tetap, Index, Keputusan fitur, Migrasi fitur dashboard meter lama ke portal, Perlu dicek di DB 2 (hanya baca, dengan izin user)

### Community 77 - "akses-ditolak/page.tsx"
Cohesion: 0.67
Nodes (3): AccessDeniedPage(), metadata, spartaUrl()

### Community 78 - "Tampilan mengikuti Energy"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tampilan mengikuti Energy, Verification

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **6 isolated node(s):** `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData`, `sparta-energy project`, `.gitignore` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 389 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `api-guard.ts`, `(dashboard)/layout.tsx`, `access-rules.ts`, `app/layout.tsx`, `next`, `Runtime Dependencies`, `telemetry-service.ts`, `getRequestScope`, `app-sidebar.tsx`, `sesi-rekaman/page.tsx`, `store-table.tsx`, `live-buffer-service.ts`, `next.config.ts`, `[storeId]/page.tsx`, `store-analytics-widget.tsx`, `session-service.ts`, `package.json`, `dashboard-overview.tsx`, `react`, `breadcrumb.tsx`, `akses-ditolak/page.tsx`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `August 28 MQTT Topic Format Migration`, `PZEM Energy Counter Reset / Rollover`, `getTelemetryChartData` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `access-rules.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13763440860215054 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `app-sidebar.tsx`, `dashboard-overview.tsx`, `store-table.tsx`, `react`, `monthly-cost-kpi-card.tsx`, `breadcrumb.tsx`, `phase-gauge-grid.tsx`, `[storeId]/page.tsx`, `store-analytics-widget.tsx`, `lucide-react`, `next`, `store-monitoring-page.tsx`, `app-header.tsx`?**
  _High betweenness centrality (0.094) - this node is a cross-community bridge._
- **Should `3-Pillar Architecture Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.05485232067510549 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
# Graph Report - smart-energy-monitoring  (2026-11-24)

## Corpus Check
- 199 files · ~96,120 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1161 nodes · 2898 edges · 69 communities (65 shown, 4 thin omitted)
- Extraction: 92% EXTRACTED · 8% INFERRED · 0% AMBIGUOUS · INFERRED: 221 edges (avg confidence: 0.92)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bfdce714`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- access.ts
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
- getStoreAnalyticsData
- npm Scripts
- Cache per request untuk data toko dan halaman loading
- Asset Copy Script
- session-records.ts
- ESLint Config
- PostCSS Config
- dotenv
- POST
- types.ts
- CLAUDE.md
- telemetry-service.ts
- store-service.ts
- getRequestScope
- store-monitoring-page.tsx
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- ref_node_assert
- Fakta dari Flask yang dipakai plan ini
- Struktur File
- store-analytics-widget.tsx
- Tambah skill frontend-design dari sparta-office
- SPARTA & Aiven Real Data Integration
- Tombol "Kembali ke SPARTA" di header portal
- dashboard-overview.tsx
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- live-buffer-service.ts
- session-invalid/route.ts
- SSO redirect loop guard
- energy-service.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- store-detail-analytics.tsx
- Portal Akses Role (Admin, Auditor, GS)
- next.config.ts
- GEMINI.md
- phase-gauge-grid.tsx
- Standardize GitHub Actions Deploy Workflow
- getTelemetryPool
- telemetry-date-picker.tsx
- session-service.ts
- getStores
- requireApiAccess
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- scopeKey
- [storeId]/page.tsx
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- Angka energi dan performa
- Alamat API Flask dan cache status capture
- Dashboard streaming dan cache biaya bulanan
- getSessionRecords
- Integrasi 12 Toko Sangat Boros
- Migrasi fitur dashboard meter lama ke portal
- Backlog

## God Nodes (most connected - your core abstractions)
1. `cn()` - 124 edges
2. `Store` - 32 edges
3. `next` - 32 edges
4. `react` - 28 edges
5. `getStoreAnalyticsData()` - 26 edges
6. `lucide-react` - 25 edges
7. `ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture` - 24 edges
8. `requireApiAccess()` - 22 edges
9. `getTelemetryPool()` - 22 edges
10. `MonthlyCostCard()` - 20 edges

## Surprising Connections (you probably didn't know these)
- `Tahap 2 (garis besar, dibuat sebagai plan terpisah)` --references--> `POST()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → app/api/auth/logout/route.ts
- `Context and Sources` --references--> `resolveRole()`  [INFERRED]
  docs/agent-notes/2026-10-26-0920-portal-akses-role.md → lib/auth/access-rules.ts
- `Task 4: Proxy dan route API` --references--> `requireApiAccess()`  [INFERRED]
  docs/superpowers/plans/2026-10-26-portal-akses-role.md → lib/auth/api-guard.ts
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

## Communities (69 total, 4 thin omitted)

### Community 0 - "access.ts"
Cohesion: 0.23
Nodes (11): AccessDeniedPage(), metadata, getAssignedDeviceIds(), getRequestAccess, RequestAccess, AccessScope, INTERNAL_TOKEN_HEADER, Role (+3 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "sangat-boros-service.ts"
Cohesion: 0.33
Nodes (10): Changed Files, getSangatBorosByCode(), getSangatBorosStores(), mapRow(), MONTH_SHORT, toNumber(), toOptionalNumber(), DailyConsumption (+2 more)

### Community 3 - "(dashboard)/layout.tsx"
Cohesion: 0.50
Nodes (5): DashboardLayout(), AccessCheckFailed(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 4 - "access-rules.ts"
Cohesion: 0.20
Nodes (18): Task 1: Aturan role dan lingkup (modul murni, TDD), anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, isDeviceAllowed(), isRole(), isValidInternalToken(), parseDeviceIds() (+10 more)

### Community 5 - "3-Pillar Architecture Plan"
Cohesion: 0.05
Nodes (62): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, app/globals.css, ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification (+54 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.06
Nodes (31): ASSET_DIRS, CONTENT_TYPES, fontMono, inter, metadata, RootLayout(), isTypingTarget(), ThemeHotkey() (+23 more)

### Community 7 - "next"
Cohesion: 0.18
Nodes (12): dynamic, GET(), dynamic, GET(), dynamic, GET(), Global Constraints, Jaminan untuk Alur IoT (+4 more)

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
Cohesion: 0.10
Nodes (20): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, @prisma/client@^7.9.1 (+12 more)

### Community 12 - "cn"
Cohesion: 0.05
Nodes (103): GalleryToolbar(), AdminShell(), AppHeader(), AppSidebar(), NavItem, NavItemButton(), navItems, BreadcrumbNav() (+95 more)

### Community 13 - "getStoreAnalyticsData"
Cohesion: 0.23
Nodes (12): Data Layer, Databases, Services, August 28 MQTT Topic Format Migration, raw_combined CTE for Phase Grouping, Normalize Phase Mapping to Eliminate Weekly Chart Disparity, Fix GROUP BY Aggregate Function Error in Sensor Query, Default Analytics to Latest Recorded Date (+4 more)

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
Cohesion: 0.21
Nodes (20): sensorList(), Task 2: Parser live buffer, FIELD_MAP, formatJakartaTime(), isRecord(), parseLiveBuffer(), TIME_FORMAT, toNumber() (+12 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 22 - "POST"
Cohesion: 0.13
Nodes (15): POST(), Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification (+7 more)

### Community 23 - "types.ts"
Cohesion: 0.12
Nodes (13): StoreMonitoringPageProps, Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData(), MOCK_AUDIT_SESSIONS, MOCK_STORES, AuditSession (+5 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.13
Nodes (14): history table (session captures), PZEM Energy Counter Reset / Rollover, telemetry table (15-min background monitoring), Time Range Modes (Harian, Bulanan, Tahunan, Sesi Audit), Fix Weekly Energy kWh Calculation and Telemetry Integration, Fix Weekly Chart Switching and Timezone Alignment, Store Detail Analytics Tabs and Time Range Modes, Fix Energy Meter Reset Rollover False Spike (+6 more)

### Community 26 - "store-service.ts"
Cohesion: 0.20
Nodes (13): Toko Sangat Boros, Decisions, EnergyTotal, getEnergyIndexWithin(), extractStoreCode(), IotDeviceData, LatestRow, loadCaptureStatus (+5 more)

### Community 27 - "getRequestScope"
Cohesion: 0.26
Nodes (12): dynamic, metadata, MonitoringPage(), DashboardPage(), dynamic, StoreGallery(), NoAssignedDevices(), Changed Files (+4 more)

### Community 28 - "store-monitoring-page.tsx"
Cohesion: 0.16
Nodes (20): emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, METRIC_CONFIG, TelemetryChart(), TelemetryChartProps (+12 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.13
Nodes (14): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+6 more)

### Community 31 - "ref_node_assert"
Cohesion: 0.16
Nodes (8): Changed Files, Task 7: Halaman Sesi Rekaman, BackoffError, createSharedFetch(), Entry, SharedFetchOptions, RecordingSessionSummary, T0

### Community 32 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.18
Nodes (9): Fakta dari Flask yang dipakai plan ini, Task 1: Modul fase bersama, Task 3: Route live per toko, Task 5: Data record sesi dan route-nya, Task 9: Dokumen, catatan task, dan verifikasi akhir, QueryClient, QueryPool, readOnlyQuery() (+1 more)

### Community 33 - "Struktur File"
Cohesion: 0.19
Nodes (12): Struktur File, Task 6: Export Excel dan backup JSON, Task 8: Buka File Rekaman, Energy, sensorColor(), energyDeltaKwh(), summarizeSession(), toChartData() (+4 more)

### Community 34 - "store-analytics-widget.tsx"
Cohesion: 0.19
Nodes (12): CustomXAxisTick(), formatDateToIso(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, StoreAnalyticsWidget(), Dashboard Time-Grain Switcher and Real Monthly History (+4 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "SPARTA & Aiven Real Data Integration"
Cohesion: 0.26
Nodes (9): Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig(), POOL_STATEMENT_TIMEOUT_MS, pg@^8.23.0 (+1 more)

### Community 37 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 38 - "dashboard-overview.tsx"
Cohesion: 0.05
Nodes (76): DashboardLoading(), dynamic, loadSessions(), metadata, SessionsPage(), DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview() (+68 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "live-buffer-service.ts"
Cohesion: 0.27
Nodes (11): dynamic, GET(), parseSinceParam(), getStoreLiveBuffer(), loadLiveBuffer, resolveDeviceId, fetchTelemetryApi(), telemetryApiBase() (+3 more)

### Community 42 - "session-invalid/route.ts"
Cohesion: 0.19
Nodes (13): dynamic, dynamic, GET(), Access Control, DEV_ROLE_COOKIE, SESSION_COOKIE, clearSessionCookie(), expiredSessionCookies() (+5 more)

### Community 43 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 44 - "energy-service.ts"
Cohesion: 0.08
Nodes (29): register(), Bucket, BUCKET_MS, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge() (+21 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "store-detail-analytics.tsx"
Cohesion: 0.21
Nodes (11): CustomXAxisTick(), formatDateToIso(), formatPct(), ID_DAYS_FULL, ID_DAYS_SHORT, ID_MONTHS_FULL, ID_MONTHS_SHORT, SangatBorosComparisonBar() (+3 more)

### Community 47 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 48 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.29
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 52 - "getTelemetryPool"
Cohesion: 0.36
Nodes (9): Codebase Map, dynamic, GET(), getAivenPool, getTelemetryPool(), getStoreById, getAuditSessions(), getLiveTelemetry() (+1 more)

### Community 53 - "telemetry-date-picker.tsx"
Cohesion: 0.22
Nodes (9): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Interactive Telemetry Date Calendar Picker (+1 more)

### Community 54 - "session-service.ts"
Cohesion: 0.25
Nodes (10): getRecordingSessions(), loadSessionRows(), MAX_SESSION_RECORDS, SessionListRow, SessionMetaRow, SessionRows, sessionRowsCache, sharedSessions (+2 more)

### Community 55 - "getStores"
Cohesion: 0.36
Nodes (8): dynamic, GET(), requireInternalAccess(), getIotDeviceDataList, getStores, loadStoreById(), loadStores(), storeEnergy()

### Community 56 - "requireApiAccess"
Cohesion: 0.22
Nodes (12): dynamic, GET(), HistoryParams, isIsoDate(), MAX_PAGE_SIZE, parseDateParam(), parseHistoryParams(), parsePositiveInt() (+4 more)

### Community 57 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 58 - "scopeKey"
Cohesion: 0.25
Nodes (8): Changed Files, Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Remaining Work and Risks, Scope, Verification, scopeKey()

### Community 59 - "[storeId]/page.tsx"
Cohesion: 0.43
Nodes (7): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreMonitoringPage()

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
Cohesion: 0.29
Nodes (6): Alamat API Flask dan cache status capture, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 64 - "Dashboard streaming dan cache biaya bulanan"
Cohesion: 0.29
Nodes (6): Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope, Verification

### Community 65 - "getSessionRecords"
Cohesion: 0.53
Nodes (5): dynamic, GET(), parseSessionId(), getSessionRecords(), SessionTooLargeError

### Community 66 - "Integrasi 12 Toko Sangat Boros"
Cohesion: 0.33
Nodes (5): Context and Sources, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope, Verification

### Community 67 - "Migrasi fitur dashboard meter lama ke portal"
Cohesion: 0.33
Nodes (5): Aturan tetap, Index, Keputusan fitur, Migrasi fitur dashboard meter lama ke portal, Perlu dicek di DB 2 (hanya baca, dengan izin user)

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **6 isolated node(s):** `August 28 MQTT Topic Format Migration`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `PZEM Energy Counter Reset / Rollover`, `sparta-energy project`, `getTelemetryChartData` (+1 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 372 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `access.ts`, `getSessionRecords`, `store-analytics-widget.tsx`, `(dashboard)/layout.tsx`, `access-rules.ts`, `app/layout.tsx`, `dashboard-overview.tsx`, `Package Manifest`, `live-buffer-service.ts`, `session-invalid/route.ts`, `Runtime Dependencies`, `cn`, `next.config.ts`, `getTelemetryPool`, `getStores`, `requireApiAccess`, `[storeId]/page.tsx`?**
  _High betweenness centrality (0.114) - this node is a cross-community bridge._
- **Are the 5 inferred relationships involving `getStoreAnalyticsData()` (e.g. with `Codebase Map` and `Services`) actually correct?**
  _`getStoreAnalyticsData()` has 5 INFERRED edges - model-reasoned connections that need verification._
- **What connects `August 28 MQTT Topic Format Migration`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `PZEM Energy Counter Reset / Rollover` to the rest of the system?**
  _6 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `3-Pillar Architecture Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.05485232067510549 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn` to `store-analytics-widget.tsx`, `dashboard-overview.tsx`, `app/layout.tsx`, `store-detail-analytics.tsx`, `phase-gauge-grid.tsx`, `telemetry-date-picker.tsx`, `[storeId]/page.tsx`, `store-monitoring-page.tsx`?**
  _High betweenness centrality (0.089) - this node is a cross-community bridge._
- **Should `app/layout.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.05550416281221091 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
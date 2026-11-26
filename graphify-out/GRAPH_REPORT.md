# Graph Report - smart-energy-monitoring  (2026-11-26)

## Corpus Check
- 313 files · ~149,253 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 2006 nodes · 6142 edges · 101 communities (97 shown, 4 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 228 edges (avg confidence: 0.9)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `37b6a079`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Button
- dashboard-overview.tsx
- report-template-store.ts
- phase-keys.ts
- telemetry-service.ts
- store-monitoring-page.tsx
- store-analytics-widget.tsx
- cn()
- workbook.ts
- workbook-builder.tsx
- perangkat/page.tsx
- sangat-boros-service.ts
- sheet-surface.tsx
- store-service.ts
- device-service.ts
- session-service.ts
- sample-count-service.ts
- jakartaDate()
- energy-index.ts
- smtp.ts
- xlsx.ts
- live-buffer-service.ts
- package.json
- myeco-ac-section.tsx
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
- Portal Akses Role (Admin, Auditor, GS)
- report-service.ts
- next
- compilerOptions
- types.ts
- myeco.test.mjs
- usage-insights.ts
- AI Context - SPARTA Smart Energy Monitor
- mail-settings.ts
- session-invalid/route.ts
- ARCHITECTURE_PLAN.md
- Alamat API Flask dan cache status capture
- scripts
- laporan/layout.tsx
- app/layout.tsx
- energy-service.ts
- myeco.ts
- DESIGN.md - UI/UX Specification
- 📐 Rencana Arsitektur Sistem Monitoring &
- health-service.ts
- ref_node_assert
- device-tree-service.ts
- Dashboard Shell (Tahap 1) Implementation
- [storeId]/page.tsx
- Tahap
- access.ts
- store-service.ts
- session-records.ts
- access-rules.ts
- breadcrumb.tsx
- proxy.ts
- store-detail-analytics.tsx
- report-mail-service.ts
- phase-gauge-grid.tsx
- utils.ts
- load-profile-chart.tsx
- check-agent-task-note.mjs
- allowBuilds
- Remove Hardcoded Date Fallbacks
- (dashboard)/layout.tsx
- Pindah fitur Smart Energy Meter ke portal: Tahap 1
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
- [filename]/route.ts
- Global Constraints
- Dashboard streaming dan cache biaya bula
- copy-assets.js
- copy-assets.mjs
- Standardize GitHub Actions Deploy Workfl
- IoT Session Assignment & Multi-Session Architecture
- eslint.config.mjs
- Fakta dari Flask yang dipakai plan ini
- Tombol "Kembali ke SPARTA" di header por
- dotenv
- GEMINI.md
- next.config.ts
- Dashboard Time-Grain Switcher and Real Monthly History
- postcss.config.mjs

## God Nodes (most connected - your core abstractions)
1. `cn()` - 167 edges
2. `next` - 60 edges
3. `react` - 58 edges
4. `Button()` - 51 edges
5. `WorkbookBuilder()` - 38 edges
6. `requireApiAccess()` - 38 edges
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
- `Jaminan untuk Alur IoT` --references--> `getTelemetryPool()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/pools.ts
- `Task 9: Dokumen, catatan task, dan verifikasi akhir` --references--> `readOnlyQuery()`  [INFERRED]
  docs/superpowers/plans/2026-11-09-pindah-fitur-smart-energy-meter.md → lib/db/read-only.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Dashboard Shell Phase 1 Build** — docs_superpowers_plans_2026_08_13_dashboard_shell_phase1, docs_agent_notes_2026_08_13_1615_mock_data_setup, docs_agent_notes_2026_08_13_1621_admin_shell_layout, docs_agent_notes_2026_08_13_1623_overview_gallery, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_lib_types, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_lib_mock_data, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_admin_shell_components, docs_superpowers_plans_2026_08_13_dashboard_shell_phase1_store_gallery [EXTRACTED 1.00]
- **Canonical AI Governance and Architecture Documentation Set** — agents_document, claude_document, ai_context_document, architecture_plan_document [EXTRACTED 1.00]
- **SSR/CSR hydration mismatch fixes** — docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_id_id_locale_determinism, docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_suppress_hydration_warning, docs_agent_notes_2026_08_13_1638_bugfix_hydration_and_button_buttonvariants_link_pattern, app_layout, components_dashboard_store_card [EXTRACTED 1.00]
- **Store Detail Sensor Card UI Evolution** — concept_summary_first_dashboard_hierarchy, concept_compact_metric_chips, concept_clean_equipment_names, concept_multi_select_phase_filtering [INFERRED 0.75]
- **Store-to-device session linking** — docs_agent_notes_2026_08_14_1030_iot_session_assignment_architecture_iot_audit_session, docs_agent_notes_2026_08_18_1130_dual_db_integration_architecture_store_id_column_devices_history, docs_agent_notes_2026_08_14_1030_iot_session_assignment_architecture_gps_via_store_master, docs_agent_notes_2026_08_24_1120_dynamic_sensor_naming_and_session_scoping_session_sensor_scoping [INFERRED 0.75]
- **Date Default and Timezone Resolution** — concept_asia_jakarta_timezone_alignment, concept_latest_recorded_date_default, concept_today_jakarta_fallback [INFERRED 0.85]
- **Energy kWh Correctness Fixes** — concept_per_phase_energy_delta, concept_phase_normalization, concept_interval_delta_energy, concept_physics_bounded_energy_guard [INFERRED 0.85]
- **Real data pipeline from SPARTA and Aiven DBs** — lib_db_pools, lib_services_store_service, lib_services_telemetry_service, docs_agent_notes_2026_08_21_1013_sparta_aiven_real_data_integration_aiven_iot_db, docs_agent_notes_2026_08_21_1013_sparta_aiven_real_data_integration_sparta_energy_db, docs_agent_notes_2026_08_18_1130_dual_db_integration_architecture_dual_database_architecture [INFERRED 0.85]

## Communities (101 total, 4 thin omitted)

### Community 0 - "Button"
Cohesion: 0.12
Nodes (46): AccessDeniedPage(), metadata, AlertList(), DATE_OPTIONS, StoreGallery(), StoreGalleryProps, formatRelativeTime(), StoreTable() (+38 more)

### Community 1 - "dashboard-overview.tsx"
Cohesion: 0.11
Nodes (37): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection() (+29 more)

### Community 2 - "report-template-store.ts"
Cohesion: 0.17
Nodes (27): bad(), dynamic, POST(), TemplateView, sendTemplate(), tick(), claimSlot(), cleanClaims() (+19 more)

### Community 3 - "phase-keys.ts"
Cohesion: 0.20
Nodes (22): sensorList(), Remaining Work and Risks, Task 2: Parser live buffer, Task 7: Halaman Sesi Rekaman, combineLiveBuffers(), FIELD_MAP, isRecord(), MAIN_PHASES (+14 more)

### Community 4 - "telemetry-service.ts"
Cohesion: 0.10
Nodes (30): dynamic, GET(), August 28 MQTT Topic Format Migration, history table (session captures), PZEM Energy Counter Reset / Rollover, raw_combined CTE for Phase Grouping, telemetry table (15-min background monitoring), SPARTA & Aiven Real Data Integration (+22 more)

### Community 5 - "store-monitoring-page.tsx"
Cohesion: 0.14
Nodes (24): bufferSyncText(), emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, METRIC_CONFIG, TelemetryChart() (+16 more)

### Community 6 - "store-analytics-widget.tsx"
Cohesion: 0.17
Nodes (18): EnergyChart(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah(), formatUnit() (+10 more)

### Community 7 - "cn()"
Cohesion: 0.08
Nodes (64): AlertBell(), load(), onVisible(), AppHeader(), AppSidebar(), NavItem, NavItemButton(), navItems (+56 more)

### Community 8 - "workbook.ts"
Cohesion: 0.11
Nodes (38): dynamic, POST(), dynamic, POST(), Preview, readJsonBody(), MAX_REPORT_DAYS, buildPreview() (+30 more)

### Community 9 - "workbook-builder.tsx"
Cohesion: 0.08
Nodes (58): CaptureControls(), CommandError(), IntervalField(), Open, useCommand(), Check(), Choice, Field() (+50 more)

### Community 10 - "perangkat/page.tsx"
Cohesion: 0.12
Nodes (38): DashboardError(), DashboardLoading(), dynamic, metadata, MonitoringPage(), DevicePage(), dynamic, metadata (+30 more)

### Community 11 - "sangat-boros-service.ts"
Cohesion: 0.10
Nodes (24): Changed Files, Context and Sources, Decisions, Integrasi 12 Toko Sangat Boros, Remaining Work and Risks, Scope, Verification, Changed Files (+16 more)

### Community 12 - "sheet-surface.tsx"
Cohesion: 0.16
Nodes (21): noSubscription(), THEME_OPTIONS, ThemeToggle(), cellText(), ColumnMenu(), SheetGrid(), SheetSurface(), usePreview() (+13 more)

### Community 13 - "store-service.ts"
Cohesion: 0.20
Nodes (21): currentMembers(), end(), expandBucketRows(), isVirtualDeviceId(), macOf(), macsEverIn(), MAIN_PANELS, MAIN_PHASES (+13 more)

### Community 14 - "device-service.ts"
Cohesion: 0.15
Nodes (14): Task 5: Data record sesi dan route-nya, isCaptureStalled(), parseWibTimestamp(), QueryClient, QueryPool, readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS, deviceKind() (+6 more)

### Community 15 - "session-service.ts"
Cohesion: 0.18
Nodes (15): dynamic, GET(), Struktur File, AccessScope, parseSessionId(), getSessionRecords(), loadSessionRows(), MAX_SESSION_RECORDS (+7 more)

### Community 16 - "sample-count-service.ts"
Cohesion: 0.14
Nodes (29): CountRow, SampleCoverageDialogProps, SampleCoverageRowProps, addCounts(), countDays(), countHours(), empty(), HOUR_MS (+21 more)

### Community 17 - "jakartaDate()"
Cohesion: 0.19
Nodes (18): jakartaDate(), createMyEcoArchive(), MyEcoArchive, MYECO_STORES, PowerSample, datesBetween(), decodeSamples(), encodeSamples() (+10 more)

### Community 18 - "energy-index.ts"
Cohesion: 0.10
Nodes (20): shift(), Bucket, bucketEnergy(), createEnergyIndex(), loadProfile(), merge(), summary(), DailyEnergy (+12 more)

### Community 19 - "smtp.ts"
Cohesion: 0.08
Nodes (21): RFC-2047, buildMime(), checkLogin(), Connection, Connectors, encodeWords(), Mail, oneLine() (+13 more)

### Community 20 - "xlsx.ts"
Cohesion: 0.17
Nodes (22): downloadExcel(), fileName(), BulkDownload(), download(), fetchSession(), downloadSession(), Open, exportExcel() (+14 more)

### Community 21 - "live-buffer-service.ts"
Cohesion: 0.13
Nodes (23): dynamic, GET(), dynamic, GET(), Changed Files, Changed Files, Task 3: Route live per toko, scopeKey() (+15 more)

### Community 22 - "package.json"
Cohesion: 0.10
Nodes (27): devDependencies, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, shadcn@^4.23.0, tailwindcss@^4, @tailwindcss/postcss@^4, @types/leaflet@^1.9.22, @types/node@^20 (+19 more)

### Community 23 - "myeco-ac-section.tsx"
Cohesion: 0.12
Nodes (23): AXIS, chartTooltip(), clock, dayClock, dayHour, dayLabel(), Grid(), HistoryChart() (+15 more)

### Community 24 - "myeco-service.ts"
Cohesion: 0.15
Nodes (20): dynamic, GET(), register(), appendSample(), MeterReading, MyEcoStore, averageSamples(), isPowerRange() (+12 more)

### Community 25 - "CLAUDE.md"
Cohesion: 0.08
Nodes (25): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases (+17 more)

### Community 26 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.25
Nodes (19): GalleryToolbar(), STATUS_LABELS, MonthlyCostCard(), StoreAnalyticsWidget(), SelectField(), SessionSelector(), SelectContent(), SelectGroup() (+11 more)

### Community 27 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.15
Nodes (17): Local Commit Enforcement, Required Project Context, Required Task Note, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template (+9 more)

### Community 28 - "This is NOT the Next.js you know"
Cohesion: 0.08
Nodes (24): Access Control, Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Data Layer, Databases (+16 more)

### Community 29 - "dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react@^1.6.0, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, pg@^8.23.0, @prisma/client@^7.9.1 (+14 more)

### Community 30 - "AGENTS.md Agent Guide"
Cohesion: 0.13
Nodes (9): AGENTS.md Agent Guide, Custom Workbook & Scheduled Email Reports, AI_CONTEXT.md Domain & File Map, Store IoT Status Classification (live / historical / unassigned), device_topology Cross-Repo Table Contract, ARCHITECTURE_PLAN.md 3-Pillar Ecosystem, v_toko_sangat_boros Cross-Repo View Contract, CLAUDE.md Claude Code Guide (+1 more)

### Community 31 - "components.json"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 32 - "telemetry-date-picker.tsx"
Cohesion: 0.22
Nodes (9): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Interactive Telemetry Date Calendar Picker (+1 more)

### Community 33 - "device-control.ts"
Cohesion: 0.09
Nodes (46): dynamic, POST(), dynamic, POST(), dynamic, POST(), asRecord(), CaptureCommand (+38 more)

### Community 34 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Changed Files, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 35 - "report-service.ts"
Cohesion: 0.12
Nodes (31): dynamic, GET(), dynamic, firstReport(), metadata, ReportsPage(), Loaded, getRequestScope() (+23 more)

### Community 36 - "next"
Cohesion: 0.09
Nodes (37): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, GET() (+29 more)

### Community 37 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 38 - "types.ts"
Cohesion: 0.11
Nodes (15): StoreAnalyticsWidgetProps, SessionSelectorProps, StoreDetailAnalyticsProps, StoreMonitoringPageProps, Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData() (+7 more)

### Community 39 - "myeco.test.mjs"
Cohesion: 0.15
Nodes (12): createMyEcoClient(), body(), getToken(), requestToken(), send(), MyEcoClientOptions, MyEcoError, MyEcoErrorKind (+4 more)

### Community 40 - "usage-insights.ts"
Cohesion: 0.24
Nodes (14): add(), ascending(), DailyThreshold, dailyThreshold(), findSpikes(), FULL_DAY_HOURS, HourPattern, PeriodSummary (+6 more)

### Community 41 - "AI Context - SPARTA Smart Energy Monitor"
Cohesion: 0.11
Nodes (17): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Codebase Map, Energi (kWh), Format angka (+9 more)

### Community 42 - "mail-settings.ts"
Cohesion: 0.21
Nodes (18): bad(), dynamic, POST(), asRecord(), fail(), isUserId(), MAIL_PROVIDERS, MailProvider (+10 more)

### Community 43 - "session-invalid/route.ts"
Cohesion: 0.43
Nodes (5): dynamic, GET(), clearSessionCookie(), expiredSessionCookies(), relativeRedirect()

### Community 44 - "ARCHITECTURE_PLAN.md"
Cohesion: 0.26
Nodes (15): better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification, ESP32 Sensor MQTT Telemetry Ingestion, Interactive Map View (Leaflet), Real-Time 3-Phase Live Gauge Mode, smart-energy-meter-vps (IoT Telemetry Ingestion Engine) (+7 more)

### Community 45 - "Alamat API Flask dan cache status capture"
Cohesion: 0.29
Nodes (6): Alamat API Flask dan cache status capture, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "scripts"
Cohesion: 0.12
Nodes (16): scripts, build, check:agent-note, copy:assets, dev, format, lint, prisma:generate (+8 more)

### Community 47 - "laporan/layout.tsx"
Cohesion: 0.22
Nodes (9): dynamic, POST(), isSubscribed(), ReportsLayout(), ReportNav(), Backlog, Laporan email untuk GS, hanya toko miliknya, Query energi tanpa membaca seluruh `history` (+1 more)

### Community 48 - "app/layout.tsx"
Cohesion: 0.18
Nodes (12): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 49 - "energy-service.ts"
Cohesion: 0.14
Nodes (21): Aiven to Biznet VPS PostgreSQL Migration, getTelemetryPool(), TopologyMap, BucketRow, EnergyIndex, EnergyState, lastId(), lastReplay() (+13 more)

### Community 50 - "myeco.ts"
Cohesion: 0.27
Nodes (13): dailyUsage(), DayUsage, hourlyUsage(), HourUsage, isRecord(), listIn(), Log, numberIn() (+5 more)

### Community 51 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.26
Nodes (9): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, SPARTA Brand CSS Tokens (oklch primary), PRODUCT.md - Product Context (+1 more)

### Community 52 - "📐 Rencana Arsitektur Sistem Monitoring &"
Cohesion: 0.14
Nodes (14): 🏗️ 1. Struktur Ekosistem (3 Proyek Terpisah), 🔗 2. Strategi Dual Database (Isolasi & Sinkronisasi), ⚙️ 3. Alur Penugasan Toko & Sesi Rekaman IoT, 🔑 4. Spesifikasi Environment Variables (`.env`), 🧩 5. Lapisan Akses Data di `smart-energy-monitoring`, 🚚 6. Riwayat Keputusan Infrastruktur, 📜 7. Kontrak View Antar-Repo (DB 1), `device_topology` (DB 2) (+6 more)

### Community 53 - "health-service.ts"
Cohesion: 0.12
Nodes (23): Alert, ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL, deviceAlerts() (+15 more)

### Community 54 - "ref_node_assert"
Cohesion: 0.15
Nodes (4): createStaleCache(), Entry, StaleCacheOptions, T0

### Community 55 - "device-tree-service.ts"
Cohesion: 0.18
Nodes (15): DeviceTree(), formatKwh(), SensorList(), buildDeviceTree(), total(), TreeBranch, TreeDevice, TreeSensor (+7 more)

### Community 56 - "Dashboard Shell (Tahap 1) Implementation"
Cohesion: 0.21
Nodes (14): app/globals.css, AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Final Polish & Metadata, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle (+6 more)

### Community 57 - "[storeId]/page.tsx"
Cohesion: 0.16
Nodes (11): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreHeroProps, StoreMonitoringPage() (+3 more)

### Community 58 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 59 - "access.ts"
Cohesion: 0.23
Nodes (9): dynamic, POST(), jobScope, RequestAccess, DEV_ROLE_COOKIE, INTERNAL_TOKEN_HEADER, Role, spartaUrl() (+1 more)

### Community 60 - "store-service.ts"
Cohesion: 0.11
Nodes (27): dynamic, GET(), Dual-Database Architecture (sparta_energy + energy_meter), Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, getAssignedDeviceIds(), requireInternalAccess() (+19 more)

### Community 61 - "session-records.ts"
Cohesion: 0.21
Nodes (12): Task 8: Buka File Rekaman, formatJakartaTime(), energyDeltaKwh(), groupSessionRows(), HistoryRow, num(), summarizeSession(), toChartData() (+4 more)

### Community 62 - "access-rules.ts"
Cohesion: 0.29
Nodes (9): Context and Sources, Task 1: Aturan role dan lingkup (modul murni, TDD), isDeviceAllowed(), isRole(), isValidInternalToken(), parseDeviceIds(), PortalDecision, resolveRole() (+1 more)

### Community 63 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 64 - "proxy.ts"
Cohesion: 0.24
Nodes (12): anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, PATHNAME_HEADER, ROLES, SESSION_COOKIE, SESSION_DENIED_PATH, contentSecurityPolicy() (+4 more)

### Community 65 - "store-detail-analytics.tsx"
Cohesion: 0.24
Nodes (12): EnergyChartControls(), spikeText(), CustomXAxisTick(), formatDateToIso(), formatKw(), formatPct(), ID_DAYS_FULL, ID_DAYS_SHORT (+4 more)

### Community 66 - "report-mail-service.ts"
Cohesion: 0.13
Nodes (31): dynamic, load(), MailSettingsPage(), metadata, dynamic, formatTime(), loadSaved(), metadata (+23 more)

### Community 67 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 68 - "utils.ts"
Cohesion: 0.23
Nodes (9): MyEcoBadge(), Badge(), badgeVariants, ToggleGroupContext, Toggle(), toggleVariants, class-variance-authority@^0.7.1, @base-ui/react (+1 more)

### Community 69 - "load-profile-chart.tsx"
Cohesion: 0.22
Nodes (10): kw(), LoadProfileChart(), SPIKE_COLOR, SPIKE_LABEL, SPIKE_TEXT, LoadProfilePoint, SPIKE_LIMITS, SpikeLevel (+2 more)

### Community 70 - "check-agent-task-note.mjs"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 71 - "allowBuilds"
Cohesion: 0.22
Nodes (8): pnpm allowBuilds (sharp, prisma, @prisma/engines), allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver, packages

### Community 72 - "Remove Hardcoded Date Fallbacks"
Cohesion: 0.33
Nodes (3): Default Analytics to Latest Recorded Date, Remove Hardcoded Date Fallbacks, getTelemetryChartData

### Community 73 - "(dashboard)/layout.tsx"
Cohesion: 0.27
Nodes (10): DashboardLayout(), AccessCheckFailed(), AdminShell(), SidebarInset(), portalDecision(), Fetch, revokeSpartaSession(), ROLE_SWITCH_ROLES (+2 more)

### Community 74 - "Pindah fitur Smart Energy Meter ke portal: Tahap 1"
Cohesion: 0.33
Nodes (5): Context and Sources, Decisions, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Scope, Verification

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

### Community 86 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 87 - "Dashboard streaming dan cache biaya bula"
Cohesion: 0.19
Nodes (10): DashboardPage(), dynamic, NoAssignedDevices(), Context and Sources, Dashboard streaming dan cache biaya bulanan, Decisions, Remaining Work and Risks, Scope (+2 more)

### Community 88 - "copy-assets.js"
Cohesion: 0.29
Nodes (4): fs, destDir, srcDir, path

### Community 89 - "copy-assets.mjs"
Cohesion: 0.29
Nodes (5): __dirname, __filename, destDir, srcDir, possibleSrcDirs

### Community 90 - "Standardize GitHub Actions Deploy Workfl"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 91 - "IoT Session Assignment & Multi-Session Architecture"
Cohesion: 0.14
Nodes (7): IoT Session Assignment & Multi-Session Architecture, IotAuditSession model (store_id, device_id, start/end time), Dual-Database Integration Architecture, 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), Integrate Real Leaflet Mapping, smart-energy-meter-vps (sister project), sparta-energy (sister project)

### Community 92 - "eslint.config.mjs"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 93 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.15
Nodes (12): Fakta dari Flask yang dipakai plan ini, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah), Task 1: Modul fase bersama, Task 4: Grafik real-time di detail toko, Task 6: Export Excel dan backup JSON (+4 more)

### Community 94 - "Tombol "Kembali ke SPARTA" di header por"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 95 - "dotenv"
Cohesion: 0.40
Nodes (4): dotenv@^17.4.2, prisma@^7.9.1, dotenv, prisma

### Community 97 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

### Community 98 - "Dashboard Time-Grain Switcher and Real Monthly History"
Cohesion: 0.50
Nodes (3): Dashboard Time-Grain Switcher and Real Monthly History, MonthlyTrendSummary, RealMonthlyConsumption

## Ambiguous Edges - Review These
- `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` → `Dual-Database Architecture (sparta_energy + energy_meter)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **10 isolated node(s):** `RFC-2047`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `Custom Workbook & Scheduled Email Reports`, `Store IoT Status Classification (live / historical / unassigned)`, `myECO Sub-Meter API & Recorder Service` (+5 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 573 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `Button`, `dashboard-overview.tsx`, `report-template-store.ts`, `telemetry-service.ts`, `store-analytics-widget.tsx`, `cn()`, `workbook.ts`, `workbook-builder.tsx`, `perangkat/page.tsx`, `session-service.ts`, `live-buffer-service.ts`, `package.json`, `myeco-service.ts`, `dependencies`, `device-control.ts`, `report-service.ts`, `mail-settings.ts`, `laporan/layout.tsx`, `app/layout.tsx`, `device-tree-service.ts`, `[storeId]/page.tsx`, `access.ts`, `store-service.ts`, `breadcrumb.tsx`, `proxy.ts`, `report-mail-service.ts`, `(dashboard)/layout.tsx`, `[filename]/route.ts`, `next.config.ts`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **What connects `RFC-2047`, `PLN B2/TR Tariff (Rp 1.444,7/kWh)`, `Custom Workbook & Scheduled Email Reports` to the rest of the system?**
  _10 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Button` be split into smaller, more focused modules?**
  _Cohesion score 0.1152542372881356 - nodes in this community are weakly interconnected._
- **Why does `react` connect `workbook-builder.tsx` to `Button`, `dashboard-overview.tsx`, `store-monitoring-page.tsx`, `store-analytics-widget.tsx`, `cn()`, `perangkat/page.tsx`, `sheet-surface.tsx`, `device-service.ts`, `sample-count-service.ts`, `xlsx.ts`, `package.json`, `myeco-ac-section.tsx`, `monthly-cost-kpi-card.tsx`, `dependencies`, `telemetry-date-picker.tsx`, `app/layout.tsx`, `health-service.ts`, `[storeId]/page.tsx`, `access.ts`, `store-service.ts`, `breadcrumb.tsx`, `store-detail-analytics.tsx`, `utils.ts`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `dashboard-overview.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.11285846438482887 - nodes in this community are weakly interconnected._
- **Why does `cn()` connect `cn()` to `Button`, `dashboard-overview.tsx`, `store-detail-analytics.tsx`, `phase-gauge-grid.tsx`, `telemetry-date-picker.tsx`, `store-monitoring-page.tsx`, `store-analytics-widget.tsx`, `utils.ts`, `workbook-builder.tsx`, `perangkat/page.tsx`, `(dashboard)/layout.tsx`, `sheet-surface.tsx`, `laporan/layout.tsx`, `app/layout.tsx`, `[storeId]/page.tsx`, `monthly-cost-kpi-card.tsx`, `breadcrumb.tsx`?**
  _High betweenness centrality (0.066) - this node is a cross-community bridge._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)` and `Dual-Database Architecture (sparta_energy + energy_meter)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
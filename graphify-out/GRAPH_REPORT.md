# Graph Report - smart-energy-monitoring  (2026-11-26)

## Corpus Check
- 313 files · ~148,500 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 14 file(s) not represented in the graph (top: (none) 9, .ico 2, .example 1)

## Summary
- 1947 nodes · 6126 edges · 92 communities (87 shown, 5 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 272 edges (avg confidence: 0.91)
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
- AI_RULES.md - AI Coding Rules
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
- energy-index.ts
- Sign-out, Ganti Peran, dan security
- report-template-store.ts
- CLAUDE.md
- telemetry-service.ts
- ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture
- ref_node_assert
- types.ts
- Ignore graphify-out
- AI Context - SPARTA Smart Energy Monitoring
- schedule-panel.tsx
- Dashboard Shell (Tahap 1) Implementation Plan
- device-control.ts
- store-analytics-widget.tsx
- Tambah skill frontend-design dari sparta-office
- session-actions.tsx
- (dashboard)/layout.tsx
- xlsx.ts
- Non-IoT security hardening
- Tombol "Kembali ke SPARTA" di header portal
- myeco.test.mjs
- [storeId]/page.tsx
- logout/route.ts
- device-topology.ts
- Agent Docs: Skills Matrix, graphify Rules, and Project Context
- DESIGN.md - UI/UX Specification
- live-buffer.ts
- breadcrumb.tsx
- GEMINI.md
- phase-gauge-grid.tsx
- energy-service.ts
- session-service.ts
- dashboard-overview.tsx
- proxy.ts
- perangkat/page.tsx
- next
- scopeKey
- access-rules.ts
- allowBuilds
- Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle
- Global Constraints
- Dual-Database Integration Architecture
- SSO redirect loop guard
- [filename]/route.ts
- logout/route.ts
- Sembunyikan toko DEMO dari Prioritas Pasang IoT di production
- report-mail-service.ts
- smtp.ts
- live-buffer-service.ts
- sample-count-service.ts
- report-service.ts
- Standardize GitHub Actions Deploy Workflow
- Fakta dari Flask yang dipakai plan ini
- Tahap
- usage-insights.ts
- jakarta-range.ts
- theme-provider.tsx
- next.config.ts
- Tombol "Kembali ke SPARTA" di header portal
- sheet-surface.tsx
- telemetry-date-picker.tsx
- copy-assets.mjs
- myeco-ac-section.tsx
- lucide-react
- Portal Akses Role (Admin, Auditor, GS)
- pools.ts
- health-service.ts
- excel/page.tsx
- utils.ts
- Store Analytics Widget with Load Profile
- getRequestScope

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

## Communities (92 total, 5 thin omitted)

### Community 0 - "workbook.ts"
Cohesion: 0.07
Nodes (48): Loaded, Preview, CONSUMPTION, MAIN, MAX_REPORT_DAYS, PLN_TARIFF, REPORT_COLUMNS, ReportDevice (+40 more)

### Community 1 - "Rapikan File Graphify dan Isi Repo"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Rapikan File Graphify dan Isi Repo, Remaining Work and Risks, Scope, Verification

### Community 2 - "store-service.ts"
Cohesion: 0.15
Nodes (19): isCaptureStalled(), parseWibTimestamp(), macsEverIn(), EnergyTotal, getEnergyIndexWithin(), CaptureReport, foldPlacedDevices(), IotDeviceData (+11 more)

### Community 3 - "monthly-cost-kpi-card.tsx"
Cohesion: 0.27
Nodes (14): GalleryToolbar(), STATUS_LABELS, SessionSelector(), SessionSelectorProps, SelectContent(), SelectGroup(), SelectItem(), SelectScrollDownButton() (+6 more)

### Community 4 - "laporan/layout.tsx"
Cohesion: 0.17
Nodes (12): dynamic, POST(), dynamic, POST(), isSubscribed(), ReportsLayout(), ReportNav(), Backlog (+4 more)

### Community 5 - "AI_RULES.md - AI Coding Rules"
Cohesion: 0.19
Nodes (15): AGENTS.md - Project Agent Instructions, AI_RULES.md - AI Coding Rules, Task Note: Project Governance and Deployment Template, Task Note: Commit Claude Hook Configuration, Agent Task Notes README, Agent Task Note Template, Project Governance Implementation Plan, checkAgentTaskNote checker (scripts/check-agent-task-note.mjs) (+7 more)

### Community 6 - "app/layout.tsx"
Cohesion: 0.29
Nodes (6): Agent Task Note Pre-Commit Guard, Ignore Scratch Files and Update Gitignore, .gitignore, checkAgentTaskNote(), isExempt(), isTaskNote()

### Community 7 - "myeco-service.ts"
Cohesion: 0.24
Nodes (14): dynamic, GET(), register(), MeterReading, isPowerRange(), nextDelay(), getMyEcoHistory(), getMyEcoLive() (+6 more)

### Community 8 - "Package Manifest"
Cohesion: 0.08
Nodes (33): react-leaflet@^5.0.0, devDependencies, dotenv@^17.4.2, prettier@^3.8.3, prettier-plugin-tailwindcss@^0.8.0, prisma@^7.9.1, shadcn@^4.23.0, tailwindcss@^4 (+25 more)

### Community 9 - "shadcn Config"
Cohesion: 0.09
Nodes (21): aliases, components, hooks, lib, ui, utils, iconLibrary, menuAccent (+13 more)

### Community 10 - "TypeScript Config"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib (+11 more)

### Community 11 - "Runtime Dependencies"
Cohesion: 0.09
Nodes (22): dependencies, @base-ui/react@^1.6.0, class-variance-authority@^0.7.1, clsx@^2.1.1, leaflet@^1.9.4, lucide-react@^1.27.0, next@16.4.6, pg@^8.23.0 (+14 more)

### Community 12 - "cn"
Cohesion: 0.10
Nodes (44): AppSidebar(), NavItem, NavItemButton(), navItems, Logo(), LogoProps, Avatar(), AvatarBadge() (+36 more)

### Community 13 - "jakartaDate"
Cohesion: 0.17
Nodes (19): jakartaDate(), createMyEcoArchive(), MyEcoArchive, MYECO_POLL_MS, PowerSample, datesBetween(), decodeSamples(), encodeSamples() (+11 more)

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
Nodes (23): sensorList(), Struktur File, Task 2: Parser live buffer, Task 8: Buka File Rekaman, comparePhase(), DEFAULT_PALETTE, defaultPhaseName(), isExcludedPhase() (+15 more)

### Community 18 - "ESLint Config"
Cohesion: 0.33
Nodes (5): eslintConfig, eslint@^9, eslint-config-next@16.4.6, eslint, eslint-config-next

### Community 21 - "energy-index.ts"
Cohesion: 0.13
Nodes (16): Bucket, bucketEnergy(), BucketRow, createEnergyIndex(), loadProfile(), merge(), phase(), summary() (+8 more)

### Community 22 - "Sign-out, Ganti Peran, dan security"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Sign-out, Ganti Peran, dan security, Verification

### Community 23 - "report-template-store.ts"
Cohesion: 0.20
Nodes (26): bad(), dynamic, POST(), sendTemplate(), tick(), claimSlot(), cleanClaims(), deleteGroup() (+18 more)

### Community 24 - "CLAUDE.md"
Cohesion: 0.09
Nodes (21): Adding a Feature, antislop, Code Organization Patterns, Common Commands, Component Patterns, Debugging, Development Workflow, Directory Structure (+13 more)

### Community 25 - "telemetry-service.ts"
Cohesion: 0.07
Nodes (48): Codebase Map, dynamic, GET(), Services, August 28 MQTT Topic Format Migration, history table (session captures), PZEM Energy Counter Reset / Rollover, raw_combined CTE for Phase Grouping (+40 more)

### Community 26 - "ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture"
Cohesion: 0.26
Nodes (16): ARCHITECTURE_PLAN.md - 3-Pillar Energy System Architecture, better-auth Shared SSO, DB 1 sparta_energy (stores, users, audits), DB 2 energy_meter (devices, telemetry, history), Environment Variables Specification, ESP32 Sensor MQTT Telemetry Ingestion, Interactive Map View (Leaflet), Real-Time 3-Phase Live Gauge Mode (+8 more)

### Community 28 - "types.ts"
Cohesion: 0.09
Nodes (35): bufferSyncText(), emptyMessage(), LIVE_METRICS, LiveState, LiveTelemetryChart(), STATE_BADGE, StoreMonitoringPageProps, METRIC_CONFIG (+27 more)

### Community 29 - "Ignore graphify-out"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Ignore graphify-out, Remaining Work and Risks, Scope, Verification

### Community 30 - "AI Context - SPARTA Smart Energy Monitoring"
Cohesion: 0.12
Nodes (16): AI Context - SPARTA Smart Energy Monitoring, Alur IoT dan Flask, Alur Pengguna, Aturan Perhitungan Telemetri, Biaya PLN, Energi (kWh), Format angka, Normalisasi fase (+8 more)

### Community 31 - "schedule-panel.tsx"
Cohesion: 0.11
Nodes (40): Check(), Choice, Field(), SelectField(), MailSettingsForm(), PasswordHelp(), DAYS, FREQUENCIES (+32 more)

### Community 32 - "Dashboard Shell (Tahap 1) Implementation Plan"
Cohesion: 0.21
Nodes (14): app/globals.css, AdminShell Collapsible Sidebar Layout, Task Note: Install shadcn Components & Setup Mock Data, Task Note: AdminShell Layout Setup, Task Note: Overview Gallery Toko Setup, Final Polish & Metadata, Dashboard Shell (Tahap 1) Implementation Plan, AdminShell / AppSidebar / AppHeader / BreadcrumbNav / ThemeToggle (+6 more)

### Community 33 - "device-control.ts"
Cohesion: 0.07
Nodes (53): dynamic, POST(), dynamic, POST(), dynamic, POST(), Alamat API Flask dan cache status capture, Changed Files (+45 more)

### Community 34 - "store-analytics-widget.tsx"
Cohesion: 0.09
Nodes (43): EnergyChart(), EnergyChartControls(), EnergyChartType, EnergyLimit, EnergyRow, EnergyUnit, formatAxis(), formatRupiah() (+35 more)

### Community 35 - "Tambah skill frontend-design dari sparta-office"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tambah skill frontend-design dari sparta-office, Verification

### Community 36 - "session-actions.tsx"
Cohesion: 0.14
Nodes (29): CaptureControls(), submit(), CommandError(), IntervalField(), Open, Message(), SensorRow(), save() (+21 more)

### Community 37 - "(dashboard)/layout.tsx"
Cohesion: 0.50
Nodes (5): DashboardLayout(), AccessCheckFailed(), ROLE_SWITCH_ROLES, roleSwitchUrl(), spartaHref()

### Community 38 - "xlsx.ts"
Cohesion: 0.15
Nodes (21): downloadExcel(), fileName(), BulkDownload(), download(), fetchSession(), downloadSession(), exportExcel(), downloadFile() (+13 more)

### Community 39 - "Non-IoT security hardening"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Non-IoT security hardening, Remaining Work and Risks, Scope, Verification

### Community 40 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.40
Nodes (4): Desain, Di luar cakupan, Latar belakang, Tombol "Kembali ke SPARTA" di header portal

### Community 41 - "myeco.test.mjs"
Cohesion: 0.14
Nodes (13): createMyEcoClient(), body(), getToken(), requestToken(), send(), MyEcoClientOptions, MyEcoError, MyEcoErrorKind (+5 more)

### Community 42 - "[storeId]/page.tsx"
Cohesion: 0.16
Nodes (11): dynamic, MonitoringDetailPage(), PageProps, StoreDetail(), StoreDetailFallback(), StoreHero(), StoreHeroProps, StoreMonitoringPage() (+3 more)

### Community 43 - "logout/route.ts"
Cohesion: 0.35
Nodes (7): dynamic, GET(), Access Control, SESSION_DENIED_PATH, clearSessionCookie(), expiredSessionCookies(), relativeRedirect()

### Community 44 - "device-topology.ts"
Cohesion: 0.22
Nodes (19): currentMembers(), end(), expandBucketRows(), isVirtualDeviceId(), macOf(), MAIN_PANELS, MAIN_PHASES, parseNotes() (+11 more)

### Community 45 - "Agent Docs: Skills Matrix, graphify Rules, and Project Context"
Cohesion: 0.25
Nodes (7): Agent Docs: Skills Matrix, graphify Rules, and Project Context, Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Verification

### Community 46 - "DESIGN.md - UI/UX Specification"
Cohesion: 0.23
Nodes (9): DESIGN.md - UI/UX Specification, Multi-Utility & AI Cost Prediction Roadmap, Store Monitoring Detail Page (/monitoring/[storeId]), Overview Gallery Toko (/), Alfamart Store Card (3-column grid), Task Note: Initialize Product Context, SPARTA Brand CSS Tokens (oklch primary), PRODUCT.md - Product Context (+1 more)

### Community 47 - "live-buffer.ts"
Cohesion: 0.28
Nodes (10): combineLiveBuffers(), FIELD_MAP, formatJakartaTime(), isRecord(), MAIN_PHASES, parseLiveBuffer(), TIME_FORMAT, toNumber() (+2 more)

### Community 48 - "breadcrumb.tsx"
Cohesion: 0.40
Nodes (9): BreadcrumbNav(), ROUTE_LABELS, Breadcrumb(), BreadcrumbEllipsis(), BreadcrumbItem(), BreadcrumbLink(), BreadcrumbList(), BreadcrumbPage() (+1 more)

### Community 50 - "phase-gauge-grid.tsx"
Cohesion: 0.26
Nodes (8): CircularGauge(), CircularGaugeProps, getPhaseColor(), PhaseGaugeGrid(), PhaseGaugeGridProps, SVG Circular Gauge Setup, PhaseData, Recharts

### Community 51 - "energy-service.ts"
Cohesion: 0.13
Nodes (26): getTelemetryPool(), readOnlyQuery(), SESSION_QUERY_TIMEOUT_MS, deviceKind(), TopologyMap, EnergyIndex, readLastRecordTimes(), DeviceRow (+18 more)

### Community 52 - "session-service.ts"
Cohesion: 0.11
Nodes (19): Decisions, Task 5: Data record sesi dan route-nya, isDeviceAllowed(), QueryClient, QueryPool, getRecordingSessions(), getSessionRecords(), loadSessionRows() (+11 more)

### Community 53 - "dashboard-overview.tsx"
Cohesion: 0.08
Nodes (47): DashboardKpiSummary(), DashboardKpiSummaryProps, DashboardOverview(), DashboardOverviewProps, MonthlyCostFallback(), MonthlyCostSection(), StoreAnalyticsFallback(), StoreAnalyticsSection() (+39 more)

### Community 54 - "proxy.ts"
Cohesion: 0.27
Nodes (9): anonymousPageTarget(), BOUNCE_COOKIE, BOUNCE_MAX_AGE_SECONDS, PATHNAME_HEADER, contentSecurityPolicy(), httpOrigin(), config, proxy() (+1 more)

### Community 55 - "perangkat/page.tsx"
Cohesion: 0.12
Nodes (35): DashboardError(), DashboardLoading(), DevicePage(), dynamic, metadata, DevicesPage(), dynamic, metadata (+27 more)

### Community 56 - "next"
Cohesion: 0.08
Nodes (44): dynamic, GET(), dynamic, GET(), dynamic, GET(), dynamic, POST() (+36 more)

### Community 57 - "scopeKey"
Cohesion: 0.25
Nodes (8): Changed Files, Context and Sources, Pindah fitur Smart Energy Meter ke portal: Tahap 1, Remaining Work and Risks, Scope, Verification, Task 3: Route live per toko, scopeKey()

### Community 58 - "access-rules.ts"
Cohesion: 0.21
Nodes (16): Task 1: Aturan role dan lingkup (modul murni, TDD), getAssignedDeviceIds(), jobScope, RequestAccess, AccessScope, INTERNAL_TOKEN_HEADER, isRole(), isValidInternalToken() (+8 more)

### Community 59 - "allowBuilds"
Cohesion: 0.22
Nodes (8): pnpm allowBuilds (sharp, prisma, @prisma/engines), allowBuilds, msw, prisma, @prisma/engines, sharp, unrs-resolver, packages

### Community 60 - "Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Store MEP Simulator — Lighting Snap to Gypsum Tile Main Tee Grid & Asymmetry Shift Cycle, Verification

### Community 61 - "Global Constraints"
Cohesion: 0.25
Nodes (7): Global Constraints, Portal Akses Role Implementation Plan, Task 2: Akses per request, Task 3: Penyaringan di service, Task 4: Proxy dan route API, Task 5: Halaman dan tampilan, Task 6: Verifikasi dan dokumen

### Community 62 - "Dual-Database Integration Architecture"
Cohesion: 0.50
Nodes (4): Dual-Database Integration Architecture, 3-Pillar Ecosystem (sparta-energy, smart-energy-meter-vps, smart-energy-monitoring), smart-energy-meter-vps (sister project), sparta-energy (sister project)

### Community 63 - "SSO redirect loop guard"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, SSO redirect loop guard, Verification

### Community 67 - "logout/route.ts"
Cohesion: 0.24
Nodes (9): AccessDeniedPage(), metadata, dynamic, POST(), DEV_ROLE_COOKIE, SESSION_COOKIE, spartaUrl(), Fetch (+1 more)

### Community 68 - "Sembunyikan toko DEMO dari Prioritas Pasang IoT di production"
Cohesion: 0.22
Nodes (8): Changed Files, Context and Sources, Decisions, Lanjutan di sparta-energy, Remaining Work and Risks, Scope, Sembunyikan toko DEMO dari Prioritas Pasang IoT di production, Verification

### Community 69 - "report-mail-service.ts"
Cohesion: 0.16
Nodes (27): bad(), dynamic, POST(), dynamic, load(), metadata, runAsJob(), asRecord() (+19 more)

### Community 70 - "smtp.ts"
Cohesion: 0.09
Nodes (20): RFC-2047, derive(), isSecretKey(), openSecret(), SealedSecret, sealSecret(), buildMime(), checkLogin() (+12 more)

### Community 71 - "live-buffer-service.ts"
Cohesion: 0.22
Nodes (14): dynamic, GET(), dynamic, GET(), DeviceStatus, isRecord(), parseBufferSync(), parseDeviceStatus() (+6 more)

### Community 72 - "sample-count-service.ts"
Cohesion: 0.05
Nodes (92): AlertList(), DATE_OPTIONS, formatRelativeTime(), StoreTable(), DeviceHealthSection(), formatTime(), CountRow, CountTable() (+84 more)

### Community 73 - "report-service.ts"
Cohesion: 0.13
Nodes (24): dynamic, firstReport(), metadata, ReportsPage(), shift(), formatDuration(), UNITS, buildConsumption() (+16 more)

### Community 74 - "Standardize GitHub Actions Deploy Workflow"
Cohesion: 0.40
Nodes (5): Dokploy Webhook CI/CD Deploy, Smart-Energy-Meter-Vps project, sparta-energy project, Standardize GitHub Actions Deploy Workflow, .github/workflows/deploy.yml

### Community 75 - "Fakta dari Flask yang dipakai plan ini"
Cohesion: 0.15
Nodes (12): Fakta dari Flask yang dipakai plan ini, Global Constraints, Jaminan untuk Alur IoT, Pindah Fitur Smart Energy Meter ke Portal: Tahap 1 (Fitur Baca), Tahap 2 (garis besar, dibuat sebagai plan terpisah), Task 1: Modul fase bersama, Task 6: Export Excel dan backup JSON, Task 7: Halaman Sesi Rekaman (+4 more)

### Community 76 - "Tahap"
Cohesion: 0.15
Nodes (12): Aturan tetap, Index, Keputusan fitur, M0. Keamanan Flask (project Flask, sebelum kontrol apa pun), M1. Baca-saja (project portal, tidak menunggu M0), M2. Kontrol rekaman dan sesi (setelah M0), M3. Pengaturan perangkat dan sensor, M4. Pensiun dashboard lama (+4 more)

### Community 77 - "usage-insights.ts"
Cohesion: 0.24
Nodes (14): add(), ascending(), DailyThreshold, dailyThreshold(), findSpikes(), FULL_DAY_HOURS, HourPattern, PeriodSummary (+6 more)

### Community 78 - "jakarta-range.ts"
Cohesion: 0.22
Nodes (6): JAKARTA_OFFSET_MS, jakartaRange(), jakartaToday(), appendSample(), averageSamples(), createMyEcoState()

### Community 79 - "theme-provider.tsx"
Cohesion: 0.18
Nodes (12): fontMono, geist, metadata, RootLayout(), isTypingTarget(), ThemeHotkey(), onKeyDown(), ThemeProvider() (+4 more)

### Community 80 - "next.config.ts"
Cohesion: 0.50
Nodes (3): assetHeaders, nextConfig, securityHeaders

### Community 81 - "Tombol "Kembali ke SPARTA" di header portal"
Cohesion: 0.25
Nodes (7): Changed Files, Context and Sources, Decisions, Remaining Work and Risks, Scope, Tombol "Kembali ke SPARTA" di header portal, Verification

### Community 82 - "sheet-surface.tsx"
Cohesion: 0.13
Nodes (33): AdminShell(), AppHeader(), noSubscription(), THEME_OPTIONS, ThemeToggle(), initialsOf(), ROLE_LABELS, ShellViewer (+25 more)

### Community 83 - "telemetry-date-picker.tsx"
Cohesion: 0.17
Nodes (11): formatIso(), getSevenDaysBefore(), ID_DAYS, ID_MONTHS, parseIso(), TelemetryDatePicker(), TelemetryDatePickerProps, Interactive Telemetry Date Calendar Picker (+3 more)

### Community 84 - "copy-assets.mjs"
Cohesion: 0.29
Nodes (5): __dirname, __filename, destDir, srcDir, possibleSrcDirs

### Community 85 - "myeco-ac-section.tsx"
Cohesion: 0.19
Nodes (17): dailyUsage(), DayUsage, hourlyUsage(), HourUsage, isRecord(), listIn(), Log, MyEcoHistory (+9 more)

### Community 87 - "lucide-react"
Cohesion: 0.28
Nodes (14): AlertBell(), load(), onVisible(), MonthlyCostCard(), Sheet(), SheetContent(), SheetDescription(), SheetFooter() (+6 more)

### Community 89 - "Portal Akses Role (Admin, Auditor, GS)"
Cohesion: 0.29
Nodes (6): Context and Sources, Decisions, Portal Akses Role (Admin, Auditor, GS), Remaining Work and Risks, Scope, Verification

### Community 90 - "pools.ts"
Cohesion: 0.22
Nodes (10): Data Layer, Databases, Dual-Database Architecture (sparta_energy + energy_meter), SPARTA & Aiven Real Data Integration, Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history), SPARTA Energy DB (stores, audits), Remove Hardcoded DB Secrets, createPoolConfig() (+2 more)

### Community 91 - "health-service.ts"
Cohesion: 0.12
Nodes (25): ALERT_LIMITS, AlertDevice, AlertKind, AlertSensor, computeAlerts(), CRITICAL, deviceAlerts(), fmt() (+17 more)

### Community 95 - "excel/page.tsx"
Cohesion: 0.16
Nodes (17): dynamic, formatTime(), loadSaved(), metadata, NOTHING, runText(), Saved, WorkbookPage() (+9 more)

### Community 97 - "utils.ts"
Cohesion: 0.43
Nodes (5): ToggleGroupContext, Toggle(), toggleVariants, @base-ui/react, class-variance-authority

### Community 98 - "Store Analytics Widget with Load Profile"
Cohesion: 0.32
Nodes (4): Dynamic 7-Day Energy Trend Navigation, DailyConsumption interface, Store Analytics Widget with Load Profile, getStoreAnalyticsData()

### Community 105 - "getRequestScope"
Cohesion: 0.12
Nodes (24): dynamic, GET(), dynamic, GET(), dynamic, metadata, MonitoringPage(), DashboardPage() (+16 more)

## Ambiguous Edges - Review These
- `Dual-Database Architecture (sparta_energy + energy_meter)` → `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`  [AMBIGUOUS]
  docs/agent-notes/2026-08-21-1013-sparta-aiven-real-data-integration.md · relation: conceptually_related_to

## Knowledge Gaps
- **7 isolated node(s):** `RFC-2047`, `.gitignore`, `August 28 MQTT Topic Format Migration`, `sparta-energy project`, `PZEM Energy Counter Reset / Rollover` (+2 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 527 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `laporan/layout.tsx`, `myeco-service.ts`, `Package Manifest`, `Runtime Dependencies`, `cn`, `report-template-store.ts`, `telemetry-service.ts`, `schedule-panel.tsx`, `device-control.ts`, `store-analytics-widget.tsx`, `session-actions.tsx`, `(dashboard)/layout.tsx`, `[storeId]/page.tsx`, `breadcrumb.tsx`, `dashboard-overview.tsx`, `proxy.ts`, `perangkat/page.tsx`, `access-rules.ts`, `[filename]/route.ts`, `logout/route.ts`, `report-mail-service.ts`, `live-buffer-service.ts`, `sample-count-service.ts`, `report-service.ts`, `theme-provider.tsx`, `next.config.ts`, `excel/page.tsx`, `getRequestScope`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **Are the 6 inferred relationships involving `requireApiAccess()` (e.g. with `Access Control` and `Changed Files`) actually correct?**
  _`requireApiAccess()` has 6 INFERRED edges - model-reasoned connections that need verification._
- **What connects `RFC-2047`, `.gitignore`, `August 28 MQTT Topic Format Migration` to the rest of the system?**
  _7 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `workbook.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07017543859649122 - nodes in this community are weakly interconnected._
- **Why does `react` connect `session-actions.tsx` to `store-service.ts`, `monthly-cost-kpi-card.tsx`, `Package Manifest`, `Runtime Dependencies`, `cn`, `types.ts`, `schedule-panel.tsx`, `store-analytics-widget.tsx`, `xlsx.ts`, `[storeId]/page.tsx`, `breadcrumb.tsx`, `energy-service.ts`, `dashboard-overview.tsx`, `perangkat/page.tsx`, `access-rules.ts`, `sample-count-service.ts`, `theme-provider.tsx`, `sheet-surface.tsx`, `telemetry-date-picker.tsx`, `lucide-react`, `health-service.ts`, `utils.ts`, `getRequestScope`?**
  _High betweenness centrality (0.085) - this node is a cross-community bridge._
- **Should `Package Manifest` be split into smaller, more focused modules?**
  _Cohesion score 0.08067226890756303 - nodes in this community are weakly interconnected._

### Low-confidence Hints
_AMBIGUOUS edges — the extractor was unsure. Verify before acting on these._

- **What is the exact relationship between `Dual-Database Architecture (sparta_energy + energy_meter)` and `Aiven IoT PostgreSQL/TimescaleDB (devices, telemetry, history)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
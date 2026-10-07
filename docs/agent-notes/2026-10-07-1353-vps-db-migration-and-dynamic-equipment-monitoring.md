# VPS Database Migration and Dynamic Equipment Monitoring

## Scope

Migrate database connection configuration in `smart-energy-monitoring` from legacy Aiven Cloud to the dedicated Biznet VPS PostgreSQL database (`energy-meter`), and make sensor and equipment naming dynamic throughout the telemetry, store, and dashboard analytics components.

## Context and Sources

- `.env`: Database connection string configuration.
- `lib/db/pools.ts`: PostgreSQL pool creation and SSL connection management.
- `lib/services/store-service.ts`: Store and IoT device metadata resolution.
- `lib/services/telemetry-service.ts`: Telemetry, load profile, sensor metadata, and color palette resolution.
- `components/monitoring/store-monitoring-page.tsx` and `components/monitoring/telemetry-chart.tsx`: Telemetry visualization, equipment cards, and time-range navigation.
- `components/dashboard/store-analytics-widget.tsx`: Tab naming and load profile rendering.

## Changed Files

- `.env`: Configured `TELEMETRY_DATABASE_URL` and `DATABASE_URL` to point to VPS PostgreSQL (`energy-meter`), and preserved `AIVEN_DATABASE_URL_LEGACY` for future data migration scripts.
- `lib/db/pools.ts`: Added `getTelemetryPool()` with dynamic `sslmode=disable` detection and fallback to `DATABASE_URL`.
- `lib/services/store-service.ts`: Joined `capture_states` and `devices` coordinates (`latitude`, `longitude`) to dynamically resolve live recording sessions and device locations. Handled multi-device stores (such as `[TI90] Ruko Elevee` containing `EM-0002` through `EM-0007`) by aggregating all devices under one store entity, combining their equipment channels, summing their total energy, and detecting active recording states from any associated sub-device. Calculated accurate total kWh and latest phase metrics across both `history` and `telemetry` tables with case-insensitive store matching, and added in-memory caching to eliminate sequential table scan overhead on 1.25M+ row history tables.
- `lib/services/telemetry-service.ts`: Updated pool usage, added monthly cost query caching, and enhanced `getSensorColor` to recognize equipment categories.
- `lib/types.ts`: Added `isRecording`, `recordingSessionName`, and `isOnline` to `Store` interface.
- `components/dashboard/network-map-leaflet.tsx` & `network-map-widget.tsx`: Added Next/Prev direct navigation buttons (header, on-map floating controller, shortcut chips) to instantly glide across store GPS coordinates without manual panning.
- `components/dashboard/status-badge.tsx`, `store-card.tsx`, and `store-table.tsx`: Integrated dynamic recording indicator.
- `components/monitoring/store-monitoring-page.tsx`: Updated sub-tab names and enhanced equipment breakdown cards.
- `components/dashboard/store-analytics-widget.tsx`: Standardized analytics tab labels to "Harian (24 Jam)", "Mingguan (7 Hari)", and "Bulanan (Riil)".

## Decisions

- Renamed database pool abstraction from Aiven to `TelemetryPool` while keeping an alias `getAivenPool` for backward compatibility.
- Retained legacy Aiven connection string under `AIVEN_DATABASE_URL_LEGACY` for upcoming data copy/migration tooling.
- Multi-Device Aggregation: Grouped multiple IoT devices sharing the same store code (e.g. `TI90`) into a unified Store object so active sessions on sub-devices (e.g. `EM-0005` & `EM-0006`) are properly elevated to the store level instead of being masked by idle devices (`EM-0002` / `EM-0007`).
- Maintained dynamic resolution for equipment names from `devices.sensors` and `history.phase_name` so sub-metering equipment channels are accurately presented alongside standard 3-phase lines.

## Verification

- Verified `.env` and `lib/db/pools.ts` configuration.
- Verified dynamic regex parsing for device codes `[TI90]` and `(2JC2)`.
- Verified live database records for `EM-0005`, `EM-0006`, and `EM-0010` actively recording under session "Rekaman 07/10/2026 13:25".
- Verified component prop alignments and clean TypeScript typings.

## Remaining Work and Risks

- None.


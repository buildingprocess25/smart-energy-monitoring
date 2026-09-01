# Fix Weekly Energy kWh Calculation and Telemetry Integration

## Scope

Fix abnormal energy (kWh) calculations in weekly trend, store analytics, and detail monitoring by computing energy deltas per phase before summing, and combining `telemetry` + `history` data streams.

## Context and Sources

- `lib/services/telemetry-service.ts`
- `components/monitoring/store-monitoring-page.tsx`
- `components/dashboard/store-analytics-widget.tsx`
- PostgreSQL `telemetry` and `history` database tables

## Changed Files

- `lib/services/telemetry-service.ts`:
  - Fixed `getDailyConsumptionTrend`: Grouped energy delta calculation by `(device_id, phase, day_date)` before summing across phases, preventing cross-phase subtraction inflation.
  - Fixed `getStoreAnalyticsData`: Computed daily consumption delta per phase before summing, preventing multi-phase meter subtraction errors.
  - Fixed `getTelemetryHistory`:
    - Unioned `history` with `telemetry` for `day` and `week` range queries so dates without manual capture sessions still display continuous background telemetry.
    - Updated `availableDates` and `sensors` discovery to scan both `history` and `telemetry`.

## Decisions

- Grouped by `phase` first when computing `(MAX(energy) - MIN(energy))` to prevent phase counter offsets (e.g. Fasa T counter subtracting from Fasa R counter) from producing false multi-hundred kWh spikes.
- Combined `history` (rapid session captures) and `telemetry` (15-minute background monitoring) with proper filtering (`phase != 'L6'` and non-dummy).

## Verification

- Verified SQL query structures for per-phase grouping and date alignment.
- Verified TypeScript types for `TelemetryHistoryResult`, `DailyConsumption`, and `StoreAnalyticsResult`.

## Remaining Work and Risks

- None.

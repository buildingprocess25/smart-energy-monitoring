# Normalize Phase Mapping to Eliminate Weekly Chart Disparity

## Scope

Eliminate the sudden drop and spike ("jomplang") in the weekly energy consumption and telemetry history charts by unifying legacy phase identifiers (`L12`, `L13`, `L14` / `L1`, `L2`, `L3`) and modern identifiers (`R`, `S`, `T`) into a single continuous stream in SQL.

## Context and Sources

- `lib/services/telemetry-service.ts`
- Database tables `telemetry` and `history`
- Topic format change on August 28th

## Changed Files

- `lib/services/telemetry-service.ts`:
  - Updated `getDailyConsumptionTrend`: Added SQL `CASE` clause to map `L12/L1/R` -> `R`, `L13/L2/S` -> `S`, `L14/L3/T` -> `T`.
  - Updated `getStoreAnalyticsData`: Added SQL `CASE` phase normalization.
  - Updated `getTelemetryHistory`:
    - Unified `sensors` discovery into clean 3-phase records (`R`, `S`, `T`).
    - Standardized `raw_day`, `raw_week`, and `raw_sess` queries so data before Aug 28 and after Aug 28 blend continuously for Phase R, S, and T without dropping to 0 or creating split duplicate curves.

## Decisions

- Grouped equivalent phase keys (`L12/L1/R` -> `R`, `L13/L2/S` -> `S`, `L14/L3/T` -> `T`) across all queries to preserve historical continuity before and after the August 28 MQTT topic migration.

## Verification

- Verified SQL queries for day, week, and session ranges.
- Verified TypeScript types.

## Remaining Work and Risks

- None.

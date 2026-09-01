# Fix GROUP BY Aggregate Function Error in Sensor Query

## Scope

Fix console error `aggregate functions are not allowed in GROUP BY` occurring in `getTelemetryHistory` on `/monitoring/[storeId]`.

## Context and Sources

- `lib/services/telemetry-service.ts`
- PostgreSQL `GROUP BY` rules regarding expressions containing aggregate functions (`MAX(phase_name)`).

## Changed Files

- `lib/services/telemetry-service.ts`:
  - Refactored `sensorSql` and fallback sensor discovery to evaluate phase normalization inside a `raw_combined` CTE and group cleanly by `phase`.
  - Refactored `getDailyConsumptionTrend` and `getStoreAnalyticsData` CTEs to group by `phase` directly.

## Decisions

- Grouped by `phase` on the outer query after aggregating `MAX(phase_name)` rather than referencing positional columns containing `MAX()`.

## Verification

- Verified SQL query syntax for `sensorSql`, fallback, `getDailyConsumptionTrend`, and `getStoreAnalyticsData`.

## Remaining Work and Risks

- None.

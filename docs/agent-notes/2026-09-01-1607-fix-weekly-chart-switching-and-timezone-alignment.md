# Fix Weekly Chart Switching and Timezone Alignment

## Scope

Fix the issue where switching from daily to weekly mode in `/monitoring/[storeId]` appeared static or empty due to UTC timezone offsets in raw date filtering and lack of weekly data point dot rendering.

## Context and Sources

- `lib/services/telemetry-service.ts`
- `components/monitoring/telemetry-chart.tsx`
- `components/monitoring/store-monitoring-page.tsx`

## Changed Files

- `lib/services/telemetry-service.ts`: Updated `raw_day` and `raw_week` date boundary comparisons to explicitly convert `epoch` timestamps using `(TO_TIMESTAMP(epoch / 1000.0) AT TIME ZONE 'Asia/Jakarta')::date` to ensure 7-day windows match WIB calendar days.
- `components/monitoring/telemetry-chart.tsx`: Added `rangeType` prop, configured X-axis ticks to display all weekly day labels without skipping, and added visible dot markers (`dot={{ r: 4, strokeWidth: 1.5 }}`) for weekly range and sparse data points.
- `components/monitoring/store-monitoring-page.tsx`: Passed `rangeType` down to `TelemetryChart`.

## Decisions

- Explicitly converted epoch to `Asia/Jakarta` date objects in SQL to prevent UTC offset truncation (where data recorded after 00:00 WIB was previously misattributed to the previous UTC day).
- Enabled prominent circle dot markers on weekly charts so discrete 7-day data points are clearly identifiable.

## Verification

- Verified SQL date window comparisons and X-axis mapping in `TelemetryChart`.

## Remaining Work and Risks

- None.

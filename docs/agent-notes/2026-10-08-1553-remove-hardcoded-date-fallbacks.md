# Remove Legacy Hardcoded Date Fallbacks Across Telemetry and Analytics

## Scope

- Replaced all legacy hardcoded date strings (e.g. `'2026-08-26'`, `'2026-08-18'`) with dynamic evaluation of the database's latest recorded date (`availableDates[0]`), falling back dynamically to current local date in Asia/Jakarta timezone (`new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })`).

## Context and Sources

- `d:\Coding\smart-energy-monitoring\lib\services\telemetry-service.ts`: Backend service queries and date resolution.
- `d:\Coding\smart-energy-monitoring\components\monitoring\store-monitoring-page.tsx`: Store detail monitoring page default date state.
- `d:\Coding\smart-energy-monitoring\components\monitoring\telemetry-date-picker.tsx`: Date picker calendar selected date parsing.
- `d:\Coding\smart-energy-monitoring\components\dashboard\store-analytics-widget.tsx`: Dashboard load profile widget anchor calculation.
- `d:\Coding\smart-energy-monitoring\components\monitoring\store-detail-analytics.tsx`: Store detail load profile tab anchor calculation.

## Changed Files

- `lib/services/telemetry-service.ts`: Replaced `'2026-08-26'` and `'2026-08-18'` with dynamic `todayJakarta` fallback in `getStoreAnalyticsData` and `getTelemetryChartData`.
- `components/monitoring/store-monitoring-page.tsx`: Updated `defaultDate` to dynamic `todayJakarta`.
- `components/monitoring/telemetry-date-picker.tsx`: Updated `selectedDateObj` to dynamic `todayJakarta`.
- `components/dashboard/store-analytics-widget.tsx`: Updated sliding window anchor to dynamic `todayJakarta`.
- `components/monitoring/store-detail-analytics.tsx`: Updated sliding window anchor to dynamic `todayJakarta`.

## Decisions

- **Full Dynamism**: No static dates are hardcoded anywhere in the active telemetry or analytics workflows. All date defaults are sourced live from PostgreSQL `availableDates[0]` and cleanly fallback to real-time `Asia/Jakarta` date when a new empty store is onboarded.

## Verification

- Verified dynamic date calculation resolves to current date in Asia/Jakarta timezone.
- Verified all fallback paths in TypeScript types and components.

## Remaining Work and Risks

None.

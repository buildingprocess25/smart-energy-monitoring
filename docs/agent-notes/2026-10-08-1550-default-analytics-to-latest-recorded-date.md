# Default Store Analytics & Load Profile to Latest Recorded Date

## Scope

- Set the default date for store analytics load profiles (both in the main Dashboard overview widget and Store Detail "Analitik Profil Beban" tab) to always resolve to the newest recorded date (`availableDates[0]`), matching the Telemetry tab behavior.
- Retained full flashback navigation capability via `<` and `>` arrow buttons to traverse historical dates and weekly windows.

## Context and Sources

- `d:\Coding\smart-energy-monitoring\lib\services\telemetry-service.ts`: `getStoreAnalyticsData()` function date anchor logic.
- `d:\Coding\smart-energy-monitoring\components\dashboard\store-analytics-widget.tsx`: Dashboard 24-hour load curve and multi-granularity widget.
- `d:\Coding\smart-energy-monitoring\components\monitoring\store-detail-analytics.tsx`: Store detail load profile analytics tab.

## Changed Files

- `lib/services/telemetry-service.ts`: Removed legacy hardcoded "yesterday" fallback for live stores in `getStoreAnalyticsData()`. Replaced with `anchorDate = targetDate || availableDates[0] || '2026-08-26'`.

## Decisions

- **Consistent Latest Date Default**: All store analytics and charts now consistently open on the newest recorded date available in the database (e.g. `Kam, 8 Okt 2026` for DC Cianjur).
- **Interactive Flashback Ergonomics**: Users can click the `<` button to flashback step-by-step through older dates (`7 Okt`, `6 Okt`, etc.) and `>` to move forward, or use the quick "Data Terbaru" shortcut in the date picker.

## Verification

- Verified `getStoreAnalyticsData` returns `anchorDate = '2026-10-08'` when no specific date query is supplied.
- Verified date navigation index bounds and date shifting handlers.

## Remaining Work and Risks

None.

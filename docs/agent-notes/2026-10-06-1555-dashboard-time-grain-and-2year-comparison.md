# Implement Dashboard Time-Grain Switcher & Real Monthly History

## Scope

Refined the dashboard analytics widget to support 3 dynamic time-grain modes (Daily 24h load profile, Weekly 7-day trend, and Real Monthly history) displaying purely the actual recorded months from database telemetri without synthetic extrapolations.

## Context and Sources

- `PRODUCT.md` and `DESIGN.md` in `smart-energy-monitoring`.
- `components/dashboard/store-analytics-widget.tsx` and `lib/services/telemetry-service.ts`.
- `lib/types.ts`.

## Changed Files

- `lib/types.ts`: Defined `RealMonthlyConsumption` and `MonthlyTrendSummary`.
- `lib/services/telemetry-service.ts`: Updated `getStoreAnalyticsData` to query real recorded monthly partitions, included `availableDates` in return payload with Asia/Jakarta timezone alignment.
- `components/dashboard/store-analytics-widget.tsx`: Integrated full `TelemetryDatePicker` (matching Detail Toko calendar popover with dot indicators, month/year navigation, and shift controls) for the 24h load profile tab; real monthly bars with actual MoM variance.

## Decisions

- Stripped all synthetic 2025/12-month dummy fills so the monthly tab strictly reflects genuine recorded store data.
- Maintained clean MoM comparison and KPI summary for available recorded months.
- Replaced standard dropdown with the rich, interactive `TelemetryDatePicker` popup calendar matching Detail Toko.
- Removed emojis across all dropdown options, calendar triggers, and badges for a clean UI.

## Verification

- Ran `npm run typecheck` (`tsc --noEmit`), passed with 0 errors.

## Remaining Work and Risks

None.

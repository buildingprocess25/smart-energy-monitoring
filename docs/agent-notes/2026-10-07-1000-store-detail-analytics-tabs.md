# Integrate Store Detail Analytics Tabs, Multi-Select Phase Filtering & Clean Time Range Modes

## Scope

Streamlined Time Range modes with natural, clear diksi (**Harian**, **Bulanan**, **Tahunan**, **Sesi Audit**), ensured Bulanan renders all 30/31 days in a month, Tahunan compares 12 months in a year, fixed date/month/year navigation, and supported Multi-Select Phase Filtering with prominent Total Daya Beban positioning.

## Context and Sources

- `PRODUCT.md` and `DESIGN.md` in `smart-energy-monitoring`.
- `app/(dashboard)/monitoring/[storeId]/page.tsx`.
- `components/monitoring/store-monitoring-page.tsx`.
- `components/monitoring/store-detail-analytics.tsx`.
- `components/monitoring/telemetry-chart.tsx`.
- `components/monitoring/telemetry-date-picker.tsx`.
- `lib/services/telemetry-service.ts`.
- `lib/types.ts`.

## Changed Files

- `lib/types.ts`: Extended `TimeRangeType` to `'day' | 'week' | 'month' | 'year' | 'session'`.
- `lib/services/telemetry-service.ts`:
  - `rangeType === 'month'`: Aggregates per day in the selected month (~30 data points).
  - `rangeType === 'year'`: Aggregates 12 months across the year (Jan - Des) for yearly comparison.
  - `rangeType === 'day'`: 24 hourly data points.
  - `rangeType === 'session'`: 15-minute intervals.
- `components/monitoring/telemetry-chart.tsx`: Supported multi-select phase array, rendered area fill and prominent stroke for total power, and sorted tooltip items so Total Daya Beban is always prominently at the top above individual phases.
- `components/monitoring/telemetry-date-picker.tsx`:
  - `rangeType="day"`: 31-day calendar view with daily shift `<` and `>`.
  - `rangeType="month"`: 12-month selector with monthly shift `<` and `>`.
  - `rangeType="year"`: Year selector with yearly shift `<` and `>`.
- `components/monitoring/store-monitoring-page.tsx`:
  - Clean, concise range pills: **Harian**, **Bulanan**, **Tahunan**, and **Sesi Audit**.
  - Intuitive date navigation: shifts by day in Harian, by month in Bulanan, and by year in Tahunan.
  - Multi-select phase state with dedicated Total Daya Beban KPI card.
- `DESIGN.md`: Documented concise range mode terminology and navigation logic.

## Verification

- Verified smooth navigation in Bulanan mode: shifting `<` moves to previous month (e.g., September 2026) and loads its 30 daily data points without endless loading.
- Verified Tahunan mode: displays 12 months (Jan - Des) for yearly comparison.
- Verified Harian mode: displays 24 hourly points for selected day.
- Verified TypeScript typing and Recharts rendering.

## Remaining Work and Risks

None.

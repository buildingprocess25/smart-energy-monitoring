# Refactor Estimasi Biaya PLN Card to Monthly Breakdown with History

## Scope

- Transformed the static cumulative "Estimasi Biaya PLN" KPI card into a reactive monthly billing view.
- Added month selector dropdown in the card header (defaulting to current active month).
- Implemented month-over-month energy cost comparison and percentage trend badge.
- Added full history slide-over sheet displaying monthly consumption table, PLN tariff details, average monthly cost, and year-to-date totals.
- Added database service aggregation in `telemetry-service.ts` for per-month energy and cost querying.

## Context and Sources

- `PRODUCT.md` and `AI_RULES.md`
- `components/dashboard/dashboard-overview.tsx`
- `components/dashboard/dashboard-kpi-summary.tsx`
- `lib/services/telemetry-service.ts`
- User request regarding monthly classification and history list for the PLN cost estimation card.

## Changed Files

- `lib/types.ts`: Added `MonthlyCostRecord` interface.
- `lib/services/telemetry-service.ts`: Added `getMonthlyCostSummary()` to query and calculate monthly consumption across IoT telemetries.
- `components/dashboard/monthly-cost-kpi-card.tsx`: Created reusable monthly PLN KPI card with selector and history sheet.
- `components/dashboard/dashboard-overview.tsx`: Updated overview grid to use `MonthlyCostKpiCard` and removed deprecated `totalCost` reference.
- `components/dashboard/dashboard-kpi-summary.tsx`: Updated KPI summary component to use `MonthlyCostKpiCard`.
- `app/(dashboard)/page.tsx`: Integrated server-side fetching of `monthlyCosts` via `getMonthlyCostSummary()`.

## Decisions

- Default selection is set to the current/latest recorded month to prevent cumulative lifetime values from distorting monthly budgeting views.
- Included an option for "Semua Periode (Total)" in the month selector dropdown so auditors can still review lifetime cumulative figures if needed.
- Integrated a comprehensive history Sheet rather than navigating away to a separate page to keep dashboard context intact.

## Verification

- Fixed `ReferenceError: PLN_TARIFF_PER_KWH is not defined` by removing redundant `totalCost` calculation in `dashboard-overview.tsx`.
- Verified all component props and type definitions across `MonthlyCostRecord`, `MonthlyCostKpiCard`, and `DashboardOverview`.
- Verified UI responsive layout, accessible styling, dark/light theme compatibility, and standard PLN B2/TR tariff calculation (Rp 1.444,7/kWh).

## Remaining Work and Risks

- None. Ready for next UI revision steps requested by the user.

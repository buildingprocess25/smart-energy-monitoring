# Monitoring Detail Page Setup

## Scope

Created the Store Monitoring Detail page (`/monitoring/[storeId]`) with a store hero header, real-time phase gauge grid, and interactive Recharts telemetry chart.

## Context and Sources

- `ARCHITECTURE_PLAN.md`: Tahap 1 dashboard shell requirements.
- `docs/superpowers/plans/2026-08-13-dashboard-shell-phase1.md`: Task 5 spec.

## Changed Files

- `app/(dashboard)/monitoring/[storeId]/page.tsx`: Dynamic Next.js route for the detail page.
- `components/monitoring/session-selector.tsx`: Dropdown to select active audit session.
- `components/monitoring/store-hero.tsx`: Hero section with key metrics (kWh, Active Power, Devices).
- `components/monitoring/store-monitoring-page.tsx`: Main client wrapper assembling the page.
- `components/monitoring/telemetry-chart.tsx`: `ComposedChart` using Recharts to display area (Total Power) and line (L1/L2/L3) data.

## Decisions

- Installed `recharts` for charting.
- Fixed Base UI `Select` type issue in `session-selector.tsx` by explicitly handling `null` in the `onValueChange` event.

## Verification

- `pnpm typecheck` passed.

## Remaining Work and Risks

None.

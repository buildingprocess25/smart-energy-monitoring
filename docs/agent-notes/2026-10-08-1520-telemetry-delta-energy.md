# Telemetry Interval Delta Energy (ΔkWh) and Clean Equipment UI

## Scope

- Converted Telemetry parameter `energy` (Energi (kWh)) from monotonic cumulative odometer values into dynamic interval consumption ($\Delta\text{kWh}$).
- Cleaned up sensor equipment naming by omitting internal channel hardware IDs (e.g. `(PRODUCTION_01)`) from primary chips while keeping clean Phase badges `(R)`, `(S)`, `(T)`.
- Added dynamic Total KPI summary aggregation for both `Total Beban (W)` and `Total Energi (kWh)`.

## Context and Sources

- `d:\Coding\smart-energy-monitoring\lib\services\telemetry-service.ts`: Telemetry aggregation logic for day, session, week, month, and year intervals.
- `d:\Coding\smart-energy-monitoring\components\monitoring\telemetry-chart.tsx`: Telemetry visualization and tooltips.
- `d:\Coding\smart-energy-monitoring\components\monitoring\store-monitoring-page.tsx`: Interactive multi-select sensor KPI cards and detail layout.
- `d:\Coding\Smart-Energy-Meter-Vps\backend\app.py`: VPS history capture stabilization.

## Changed Files

- `lib/services/telemetry-service.ts`: Updated telemetry queries to compute interval consumption using `GREATEST(0, MAX(energy) - MIN(energy))` with `AVG(power)` fallbacks and `totalEnergy` aggregation.
- `components/monitoring/telemetry-chart.tsx`: Updated metric description, 2-decimal formatting, and Total area curve for `energy`.
- `components/monitoring/store-monitoring-page.tsx`: Computed `totalSummaryStats` for both power and energy, streamlined sensor chips to hide lengthy channel tags, and formatted values with appropriate decimal precision.

## Decisions

- **Interval Delta Energy ($\Delta\text{kWh}$)**: Telemetry charts now show dynamic energy consumption per time bucket (e.g. 5-min, hourly, daily) allowing users to see when equipment consumes more energy (spikes) vs idle/off periods.
- **Equipment Naming Ergonomics**: Cleaned up repetitive names (e.g. `CUP SEALER ET-A9` instead of `CUP SEALER ET-A9 (PRODUCTION_01)`) to avoid clutter and tall wrapping cards.
- **Precision Formatting**: Energy delta values use 2 decimal places (`id-ID` locale format, e.g. `0,08 kWh`) to preserve sub-kWh reading precision across sensors.

## Verification

- Verified SQL queries compute non-negative deltas and calculate overall total energy.
- Verified responsive sensor card grid with multi-select toggling and Total Beban / Total Energi selection.

## Remaining Work and Risks

None.

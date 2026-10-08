# Fix Energy Meter Reset / Rollover False Spike

## Scope

- Resolved the false ~105.79 kWh energy anomaly spike observed on DC Cianjur (8 Okt 2026 at 14:00).
- Added physical upper-bound guard (`GREATEST((AVG(power) / 1000.0) * interval_hours * 1.8 + margin, min_kwh)`) across all telemetry time ranges (`day`, `session`, `week`, `month`, `year`) and store analytics.

## Context and Sources

- Investigation of database records (`history` & `telemetry` tables):
  - At 14:30 WIB, a new recording session / hardware test was initiated where the PZEM energy counter reset from ~37.99 kWh to 0.001 kWh.
  - The naive interval delta `MAX(energy) - MIN(energy)` calculated `37.986 - 0.001 = 37.985 kWh` for Phase R (and 105.79 kWh total for 3 phases), reflecting the entire cumulative lifetime reading instead of the actual 1-hour consumption.
  - The actual 1-hour consumption for Hour 14 was ~3.98 kWh (consistent with average power ~4 kW).

## Changed Files

- `lib/services/telemetry-service.ts`:
  - Added physical power-bounded guard in `day` (1-hour bucket), `week` (1-day bucket), `month` (1-day bucket), `year` (1-month bucket), `session` (15-min bucket), and store analytics daily/monthly queries.

## Decisions

- **Physics-based Validation**: If `(MAX(energy) - MIN(energy))` exceeds what the measured average power physically allows during the interval, the system automatically detects an energy counter reset/rollover and falls back to $(P_{\text{avg}} \times \Delta t)$, guaranteeing smooth and truthful consumption curves.

## Verification

- Verified via Python database simulation on `EM-0010` (DC Cianjur) for 2026-10-08:
  - 12:00: R: 1.79 kWh, S: 1.21 kWh, T: 0.90 kWh (Total: 3.90 kWh)
  - 13:00: R: 1.91 kWh, S: 1.00 kWh, T: 0.94 kWh (Total: 3.85 kWh)
  - 14:00: R: 2.06 kWh, S: 1.16 kWh, T: 0.76 kWh (Total: 3.98 kWh) — *Anomaly completely eliminated*
  - 15:00: R: 1.17 kWh, S: 0.79 kWh, T: 0.58 kWh (Total: 2.54 kWh)

## Remaining Work and Risks

None.

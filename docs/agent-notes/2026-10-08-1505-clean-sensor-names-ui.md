# Simplify Sensor and Equipment Naming in Detail Monitoring UI

## Scope

Clean up the display titles and labels for multi-channel submetering sensors and equipment across the store monitoring cards, filter buttons, and telemetry chart legends to omit redundant technical hardware channel IDs (such as `(PRODUCTION_01)`).

## Context and Sources

- `d:/Coding/smart-energy-monitoring/components/monitoring/store-monitoring-page.tsx`
- `d:/Coding/smart-energy-monitoring/components/monitoring/telemetry-chart.tsx`
- User feedback: Sensors with long hardware channel tags like `CUP SEALER ET-A9 (PRODUCTION_01)` made cards and filter buttons bloated, messy, and unnecessarily long.

## Changed Files

- `components/monitoring/store-monitoring-page.tsx`: Simplified sensor card titles and filter buttons to cleanly display the equipment name (e.g. `CUP SEALER ET-A9`, `SHARP MICROWAVE`) without long internal channel suffixes, while preserving clean `(R)`, `(S)`, `(T)` sub-labels for standard 3-phase incoming feeds.
- `components/monitoring/telemetry-chart.tsx`: Updated line graph `displayName` logic to present clean sensor/equipment names in the chart legend and tooltip.

## Decisions

- **Human-Centric Titles**: Emphasized human-readable equipment names directly as the primary label.
- **Tooltip Preservation**: Retained the full hardware channel ID in the HTML `title` attribute for engineer reference on mouse hover without cluttering visual layout.

## Verification

- Verified TypeScript formatting and clean string interpolation across `store-monitoring-page.tsx` and `telemetry-chart.tsx`.

## Remaining Work and Risks

None.

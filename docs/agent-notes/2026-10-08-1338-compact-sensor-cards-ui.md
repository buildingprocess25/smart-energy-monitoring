# Streamline and Compact Store Detail Sensor Cards Breakdown

## Scope

Redesign and compact the multi-phase sensor breakdown and "Total Beban" summary cards in the store monitoring detail view (`StoreMonitoringPage`) to reduce excessive vertical height and improve readability for multi-sensor configurations.

## Context and Sources

- `d:/Coding/smart-energy-monitoring/components/monitoring/store-monitoring-page.tsx`
- `d:/Coding/smart-energy-monitoring/DESIGN.md`
- User feedback: The summary cards ("Total Beban", "Phase R", "Phase S", "Phase T", etc.) were excessively tall and bulky ("ngejeblag"), pushing down the main telemetry chart and taking too much vertical space especially when there are many sensors.

## Changed Files

- `components/monitoring/store-monitoring-page.tsx`: Replaced oversized multi-line cards with streamlined, compact interactive metric chips (~56px height) featuring clean top line (color dot, sensor/phase name, active status badge) and compact bottom line (average value + unit on left, inline maximum value on right), and dynamic responsive grid layout (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`).

## Decisions

- **Compact Height**: Reduced internal padding to `px-3 py-2` and switched to a two-line horizontal layout per chip.
- **Visual Distinction**: Preserved phase color indicators and subtle background/border tinting matching sensor colors.
- **Multi-select Ergonomics**: Retained full multi-select clickability with accessible button semantic elements and subtle active ring/border styling.

## Verification

- Verified clean TypeScript syntax and component structure in `store-monitoring-page.tsx`.
- Checked responsive grid layout behavior across mobile, tablet, and desktop breakpoints.

## Remaining Work and Risks

None.

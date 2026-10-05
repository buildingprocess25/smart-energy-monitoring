# Reposition Sensor Phase Breakdown Cards Above Telemetry Chart

## Scope

- Reordered layout elements in `/monitoring/[id]` (`components/monitoring/store-monitoring-page.tsx`).
- Moved the "Rincian Statistik Per Sensor / Fasa" KPI summary cards directly above the large telemetry time-series chart.
- Enhanced card interactivity with clear active state badges, hover effects, and helpful filter hints.

## Context and Sources

- `components/monitoring/store-monitoring-page.tsx`
- User feedback regarding UX hierarchy: seeing summary numbers (average/maximum per phase) before inspecting the large graph.

## Changed Files

- `components/monitoring/store-monitoring-page.tsx`: Shifted the sensor phase breakdown grid above the chart card container.

## Decisions

- Following standard analytical dashboard hierarchy ("Summary/KPI first, Time-series chart second").
- Maintained phase-filtering click interactivity on each sensor card, so clicking a phase card above directly highlights and filters the telemetry curve in the chart below.

## Verification

- Verified DOM ordering in `store-monitoring-page.tsx`.
- Verified phase filter toggles, active states, and responsive grid layouts (1 col mobile, 2 cols tablet, 4 cols desktop).

## Remaining Work and Risks

- None.

# Interactive Telemetry Calendar Date Picker

## Scope

Replaced raw HTML `<select>` date dropdown in store monitoring detail page (`/monitoring/[storeId]`) with an interactive popover calendar component (`TelemetryDatePicker`) supporting both Daily and Weekly range modes, telemetry data presence dots, and quick-shift navigators.

## Context and Sources

- `components/monitoring/store-monitoring-page.tsx`
- User feedback regarding confusing date dropdown selector and request for calendar-based date picking interface.

## Changed Files

- `components/monitoring/telemetry-date-picker.tsx`: Created interactive popover calendar component with Indonesian locale, 7-day week range highlighting, and telemetry data indicators.
- `components/monitoring/store-monitoring-page.tsx`: Integrated `TelemetryDatePicker` for Day and Week monitoring modes.

## Decisions

- Retained fast one-click `<`, `>` date shift buttons alongside the calendar trigger for fluid single-day navigation.
- Highlighted dates containing real telemetry data with green dots in the calendar matrix to guide the user.
- Rendered 7-day range highlighting in weekly mode on hover and selection.

## Verification

- Verified component structure, Indonesian date formatting, and responsive popover positioning.

## Remaining Work and Risks

- None.

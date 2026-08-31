# Enhance Week Range Highlight Contrast in Light Mode

## Scope

Improved visual contrast and visibility for the 7-day weekly range highlight within `components/monitoring/telemetry-date-picker.tsx` in `smart-energy-monitoring`.

## Context and Sources

- `components/monitoring/telemetry-date-picker.tsx`
- User feedback regarding 7-day weekly selection being too faint in Light Mode.

## Changed Files

- `components/monitoring/telemetry-date-picker.tsx`: Upgraded background tint to `bg-emerald-100/90`, bold text `text-emerald-950`, day button background `bg-emerald-200/60`, start-range focus ring, and helper instruction in calendar header.

## Decisions

- Increased color contrast from 5% opacity to vibrant emerald tint so that the 7-day selection stands out vividly against the white popover card.

## Verification

- Verified pre-commit task note rule and visual styling consistency.

## Remaining Work and Risks

- None.

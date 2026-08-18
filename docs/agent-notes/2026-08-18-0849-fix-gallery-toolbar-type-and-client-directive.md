# Fix gallery toolbar Select types and client directive

## Scope

- Add `'use client'` directive to `components/dashboard/gallery-toolbar.tsx`.
- Update `Select` component `onValueChange` handlers to properly guard against `null` values from `@base-ui/react`.

## Context and Sources

- `components/dashboard/gallery-toolbar.tsx`
- `components/ui/select.tsx`
- `components/monitoring/session-selector.tsx`

## Changed Files

- `components/dashboard/gallery-toolbar.tsx`: Added `'use client'` directive and handled `null` values in `onValueChange` callbacks.

## Decisions

- Guarded `onValueChange` values with `if (val !== null)` to align with `@base-ui/react`'s `string | null` type contract, resolving TypeScript assignability errors.

## Verification

- Inspected code structure and type compatibility against `@base-ui/react` component props.

## Remaining Work and Risks

None

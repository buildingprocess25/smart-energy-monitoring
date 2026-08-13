# Install shadcn Components & Setup Mock Data

## Scope

Install required shadcn/ui v4 components and create foundational TypeScript
types (`lib/types.ts`) and mock data (`lib/mock-data.ts`) for the dashboard.
Update `app/layout.tsx` to add required `TooltipProvider` and SEO metadata.

## Context and Sources

- `ARCHITECTURE_PLAN.md`: Tahap 1 dashboard shell requirements.
- `DESIGN.md`: UI/UX spec — 6 toko mock data (2 LIVE, 2 HISTORICAL, 2 UNASSIGNED).
- `docs/superpowers/plans/2026-08-13-dashboard-shell-phase1.md`: Task 1 spec.

## Changed Files

- `lib/types.ts`: `StoreStatus`, `PhaseData`, `Store`, `TelemetryPoint`, `AuditSession` interfaces.
- `lib/mock-data.ts`: `MOCK_STORES` (6 stores), `getMockStore`, `getMockTelemetry`, `MOCK_AUDIT_SESSIONS`.
- `app/layout.tsx`: Added `TooltipProvider`, `metadata` export, switched to `JetBrains_Mono`, lang `id`.
- `components/ui/`: sidebar, breadcrumb, badge, input, select, separator, avatar, dropdown-menu, tooltip, skeleton, sheet.
- `hooks/use-mobile.ts`: Added by shadcn sidebar dependency.

## Decisions

- Used `pnpm dlx shadcn@latest add` (shadcn v4) with style `base-nova`.
- Mock data hardcoded in TypeScript for speed; types are structured to be API-ready for Tahap 2.
- `TooltipProvider` wrapped inside `ThemeProvider` per shadcn recommendation.

## Verification

- `pnpm typecheck` → exit 0, no errors.

## Remaining Work and Risks

None.

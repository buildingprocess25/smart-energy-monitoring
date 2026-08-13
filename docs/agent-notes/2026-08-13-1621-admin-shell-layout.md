# AdminShell Layout Setup

## Scope

Created the core `AdminShell` layout, including a collapsible sidebar, header with breadcrumbs and theme toggle, and wrapped the dashboard route group in this layout.

## Context and Sources

- `ARCHITECTURE_PLAN.md`: Tahap 1 dashboard shell requirements.
- `docs/superpowers/plans/2026-08-13-dashboard-shell-phase1.md`: Task 2 spec.

## Changed Files

- `app/(dashboard)/layout.tsx`: Root dashboard layout wrapping `AdminShell`.
- `app/(dashboard)/page.tsx`: Initial dashboard placeholder.
- `components/layout/admin-shell.tsx`: Core layout structure.
- `components/layout/app-header.tsx`: Header with breadcrumbs, quick links, badge.
- `components/layout/app-sidebar.tsx`: Sidebar with SPARTA branding, navigation links.
- `components/layout/breadcrumb-nav.tsx`: Dynamic breadcrumb mapping pathname.
- `components/layout/theme-toggle.tsx`: Dropdown for dark/light/system mode.
- `app/page.tsx`: Deleted to avoid route conflicts with `(dashboard)`.

## Decisions

- Updated shadcn usage to match base-nova API. Specifically, used the `render` prop pattern (from `@base-ui/react`) instead of the Radix `asChild` pattern for `SidebarMenuButton` and `DropdownMenuTrigger`.

## Verification

- `pnpm typecheck` passed after cleaning `.next` cache.

## Remaining Work and Risks

None.

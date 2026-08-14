# IoT Session Assignment & Multi-Session Architecture Notes

## Scope

Records the database schema design, session assignment workflow, and multi-session historical handling for integrating portable ESP32 hardware telemetry with the Sparta Energy store master database.

## Context and Sources

- `d:/Coding/smart-energy-monitoring/ARCHITECTURE_PLAN.md`
- `d:/Coding/sparta-energy/prisma/schema.prisma`
- User discussion regarding custom names on VPS, multi-session interruptions, and manual/automated store-to-device assignment.

## Changed Files

- `ARCHITECTURE_PLAN.md`: Added Section 2.1 detailing `IotAuditSession` schema, 1-to-many store-to-session relationships, and technician SOP workflow.
- `app/globals.css`: Added `scrollbar-gutter: stable` and modern thin scrollbars to prevent layout shifting between Grid and List views.
- `lib/types.ts` & `lib/mock-data.ts`: Added GPS coordinates (`latitude`, `longitude`) to store records matching Sparta Energy store schema.
- `components/layout/app-header.tsx`: Cleaned and decluttered sticky header, retaining only SidebarTrigger, dynamic BreadcrumbNav, and ThemeToggle.
- `components/ui/table.tsx`: Created reusable shadcn Table primitives.
- `components/dashboard/network-map-widget.tsx`: Created interactive GPS map widget plotting active live IoT devices and historical stores with pulsating beacon markers and inspector card.
- `components/dashboard/dashboard-overview.tsx`: Integrated `NetworkMapWidget` into the National Executive Dashboard.
- `components/dashboard/store-table.tsx`: Created clean, dense tabular view of store monitoring master data.
- `components/dashboard/gallery-toolbar.tsx`: Added Grid/List toggle button group alongside branch and status filters.
- `components/dashboard/store-gallery.tsx`: Integrated store gallery and tabular views with search and branch filter.
- `app/(dashboard)/page.tsx`: Updated root route to render executive `DashboardOverview`.
- `app/(dashboard)/monitoring/page.tsx`: Created dedicated `/monitoring` route to render `StoreGallery`.
- `components/layout/app-sidebar.tsx`: Added dedicated `Dashboard` (`/`) and `Monitoring Toko` (`/monitoring`) sidebar navigation items.

## Decisions

- **GPS Map Representation via Store Master Coordinates**: Since physical ESP32 portable hardware lacks an integrated GPS module, device location is determined automatically by linking the active session's `store_id` to the store master GPS coordinates (`latitude`, `longitude`).
- **Interactive Network Map Widget**: Built a high-tech radar/map canvas featuring pulsing beacons for live active sessions, historical pins, store inspection drawer, and filtering.
- **Header Simplification & Decluttering**: Removed redundant quick link buttons (`Smart Energy Meter`, `SPARTA Energy`) and status badge from the top header since they are already neatly organized in the sidebar, providing a clean, distraction-free top bar.
- **Dedicated Dashboard vs Monitoring Routes**: Separated `/` as the executive network-wide summary (`DashboardOverview`) and `/monitoring` as the comprehensive store-by-store telemetries gallery/list (`StoreGallery`), perfectly matching the top navigation breadcrumbs and sidebar hierarchy.
- **Top-Level KPI Overview Summary**: Built an executive overview summarizing network-wide energy metrics (Total kWh, PLN Cost estimation at Rp 1.444,7/kWh, Active live store ratio, and sensor hardware metrics) with Recharts daily trend.
- **Scrollbar Gutter Stability**: Configured `scrollbar-gutter: stable` on `html` so the browser preserves scrollbar width consistently, eliminating jarring horizontal content shifts when toggling between long Grid and compact List views.
- **Hybrid View (Grid vs List)**: Implemented a user-toggleable hybrid mode. Eliminated reliance on mandatory store photos, providing an ultra-dense, fast-scanning table view for operational workflows alongside the visual card gallery.
- **Session Assignment Mechanism**: Decided on a database-backed session model (`IotAuditSession`) linking `store_id` (foreign key to `stores`) with portable `device_id` (ESP32) and time window (`start_time`, `end_time`).
- **Multi-Session & Interruption Handling**: Each audit iteration generates a discrete session record, enabling historical comparisons and preserving data integrity across electrical/network interruptions without overwriting past logs.
- **UI Integration**: Mapped the multi-session model to the `SessionSelector` dropdown in `/monitoring/[storeId]`, automatically defaulting to active live sessions while permitting inspection of historical logs.

## Verification

- Verified schema structure aligns with existing PostgreSQL / Prisma models in `sparta-energy/prisma/schema.prisma`.
- Documented in canonical `ARCHITECTURE_PLAN.md`.

## Remaining Work and Risks

- Implement Prisma migration and API endpoints in Phase 2 backend integration when ready.

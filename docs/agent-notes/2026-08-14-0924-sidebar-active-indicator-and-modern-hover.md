# Modern Sidebar Active Indicator and Interactive Hover

## Scope

Enhances the sidebar navigation in `smart-energy-monitoring` with route-aware active state indicators and modern glassmorphism hover animations.

## Context and Sources

- `d:/Coding/smart-energy-monitoring/components/layout/app-sidebar.tsx`
- `d:/Coding/smart-energy-monitoring/components/ui/sidebar.tsx`
- Impeccable craft guidelines for Operate/Dashboard UI.

## Changed Files

- `lib/types.ts`: Updated `Store` interface to accurately match definite database master data (`code`, `name`, `branch`, `status`, `kwhTotal`, `deviceCount`, `lastUpdate`, `phases`).
- `lib/mock-data.ts`: Updated mock stores with realistic store codes (`TK001`, `AHO1`, etc.) and branch assignments.
- `components/dashboard/gallery-toolbar.tsx`: Added dynamic **Branch Filter** dropdown and updated search placeholder to search by store name or code.
- `components/dashboard/store-gallery.tsx`: Connected branch filtering and search query logic across `MOCK_STORES`.
- `components/dashboard/store-card.tsx`: Displayed store code, store name, and branch badge, removing non-master mock fields.
- `components/monitoring/store-hero.tsx`: Aligned hero banner with store code and branch.

## Decisions

- **Definite Master Data Alignment**: Dropped variable/manual audit assumption fields (operating hours, areas, contract power) from the general overview. Aligned directly with definite store master data: Store Code (`code`), Store Name (`name`), and Branch (`branch`).
- **Dynamic Branch Filtering**: Added a branch selector in `GalleryToolbar` enabling quick filtering by operational branch alongside search and monitoring status.
- **Sticky AppHeader**: Added `sticky top-0 z-30` along with `backdrop-blur-xl` and subtle border separation so the top navigation stays accessible during long page scrolls.
- **Store Card Hover Redesign**: Replaced the full-card frosted blur overlay with an interactive, whole-card clickable link featuring `-translate-y-1` elevation, gradient header zoom, emerald border glow, and a dedicated bottom action footer (`Lihat Detail Monitoring →`).
- **Hydration Fix**: Added `suppressHydrationWarning` on dynamic relative timestamps in `StoreCard` since client-side `Date.now()` differs from server-render snapshot.
- **Active State Indicator**: Added a glowing emerald accent bar on the left edge (`before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-emerald-600`) paired with subtle emerald tinted background and border ring.
- **Modern Hover Effect**: Added smooth slide micro-interaction (`hover:translate-x-0.5`), icon scaling (`group-hover:scale-110`), and an ambient gradient glow (`after:bg-linear-to-r after:from-emerald-500/10`).
- **Route Matching**: Linked `Overview Toko` to `/` and `Monitoring Toko` to active `/monitoring` subpaths.

## Verification

- Verified `usePathname()` dynamically matches active paths.
- Verified styles compile cleanly with Tailwind CSS 4 and Base UI / shadcn sidebar components.

## Remaining Work and Risks

- None.

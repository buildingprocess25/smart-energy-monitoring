# Sync Header/Sidebar Logo and Branding with Sparta Energy

## Scope

Synchronizes the logo presentation in the header/sidebar of `smart-energy-monitoring` with the visual design from `sparta-energy`, imports public assets from `sparta-energy`, and updates the site title and branding to "Smart Energy Monitoring".

## Context and Sources

- `d:/Coding/sparta-energy/components/logo.tsx`
- `d:/Coding/sparta-energy/components/admin/admin-shell.tsx`
- `d:/Coding/sparta-energy/public/assets/`
- User request regarding header logo and website branding.

## Changed Files

- `app/api/assets/[filename]/route.ts`: Dynamic asset API route that automatically reads and serves images from `sparta-energy/public/assets` while syncing local cache.
- `app/layout.tsx`: Updated page metadata title and added server-side asset synchronization helper.
- `components/logo.tsx`: Pointed asset URLs to `/api/assets/` to guarantee instant load.
- `components/layout/app-sidebar.tsx`: Integrated the new `Logo` component into the sidebar header with collapsible icon view and fixed `Link` import.

## Decisions

- Retained responsive/collapsible behavior in the sidebar header: displays full dual-emblem logo with "SMART Energy Monitoring" typography when expanded, and the clean Building logo icon when collapsed.
- Added asset copying script (`scripts/copy-assets.mjs`) ensuring `/assets/Alfamart-Emblem.png` and `/assets/Building-Logo.png` are synced to `public/assets/`.
- Ensured proper Next.js imports (`Link`, `Image`) in `components/layout/app-sidebar.tsx`.

## Verification

- Verified Logo layout and component styling match `sparta-energy/components/logo.tsx`.
- Verified Next.js layout metadata and sidebar headers correctly reference the new component and branding.

## Remaining Work and Risks

- None. Run `npm run dev` or `node scripts/copy-assets.mjs` to populate assets when starting development server.

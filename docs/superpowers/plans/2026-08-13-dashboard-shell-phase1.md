# Smart Energy Monitoring — Dashboard Shell (Tahap 1) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membangun UI shell lengkap `smart-energy-monitoring` — AdminShell layout, Overview Gallery toko, dan halaman Detail Monitoring dengan Circular Gauges & Recharts — semuanya menggunakan mock data, tanpa login/SSO.

**Architecture:**
- Next.js 16 App Router dengan route group `(dashboard)` yang membungkus semua halaman dengan AdminShell layout.
- Semua data menggunakan mock data statis di `lib/mock-data.ts`, dengan tipe TypeScript yang sudah siap untuk diganti dengan API real di Tahap 2.
- Circular Gauge diimplementasikan sebagai komponen SVG arc custom ringan, tanpa library tambahan.

**Tech Stack:** Next.js 16 (App Router), React 19, Tailwind CSS v4, shadcn/ui, Lucide React, Recharts, SVG custom gauge.

## Global Constraints

- Next.js: 16.2.6, React: 19.2.4, Tailwind: v4
- shadcn/ui v4: install via `npx shadcn@latest add <component>`
- Warna aksen SPARTA Energy: `#2c7a57` (emerald hijau)
- Badge status: 🟢 LIVE=emerald, 🔵 HISTORICAL=blue, ⚪ UNASSIGNED=slate
- Semua UI gunakan shadcn sebelum custom markup
- Tidak ada `git commit --no-verify`
- Setiap commit wajib disertai task note di `docs/agent-notes/YYYY-MM-DD-HHMM-<task>.md`

---

## Task 1: Install shadcn Components & Setup Mock Data

**Files:**
- Create: `lib/types.ts`
- Create: `lib/mock-data.ts`

**Interfaces:**
- Produces: `Store`, `PhaseData`, `TelemetryPoint`, `AuditSession` types
- Produces: `MOCK_STORES: Store[]` (6 toko: 2 LIVE, 2 HISTORICAL, 2 UNASSIGNED)
- Produces: `getMockStore(id: string): Store | undefined`
- Produces: `getMockTelemetry(storeId: string): TelemetryPoint[]`
- Produces: `MOCK_AUDIT_SESSIONS: AuditSession[]`

- [ ] **Step 1: Install shadcn components**

```powershell
cd d:\Coding\smart-energy-monitoring
npx shadcn@latest add sidebar breadcrumb badge input select separator avatar dropdown-menu tooltip sheet
```

- [ ] **Step 2: Buat `lib/types.ts`**

```typescript
// lib/types.ts
export type StoreStatus = 'live' | 'historical' | 'unassigned'

export interface PhaseData {
  phase: 'L1' | 'L2' | 'L3'
  voltage: number   // Volt
  current: number   // Ampere
  power: number     // Watt
  powerFactor: number // 0-1
}

export interface Store {
  id: string
  name: string
  address: string
  photoUrl: string
  status: StoreStatus
  kwhTotal: number
  deviceCount: number
  lastUpdate: string // ISO string
  phases: PhaseData[]
}

export interface TelemetryPoint {
  timestamp: string  // "HH:MM"
  powerL1: number
  powerL2: number
  powerL3: number
  totalPower: number
}

export interface AuditSession {
  id: string
  storeId: string
  label: string
  startDate: string
  endDate: string | null
  isActive: boolean
}
```

- [ ] **Step 3: Buat `lib/mock-data.ts`**

```typescript
// lib/mock-data.ts
import type { Store, TelemetryPoint, AuditSession } from './types'

export const MOCK_STORES: Store[] = [
  {
    id: 'pondok-kacang-3',
    name: 'Alfamart Pondok Kacang 3',
    address: 'Jl. Pondok Kacang Raya No. 3, Pondok Karya, Tangerang Selatan',
    photoUrl: '/mock/store-1.jpg',
    status: 'live',
    kwhTotal: 1842.5,
    deviceCount: 3,
    lastUpdate: new Date(Date.now() - 45 * 1000).toISOString(),
    phases: [
      { phase: 'L1', voltage: 221.4, current: 12.8, power: 2834, powerFactor: 0.95 },
      { phase: 'L2', voltage: 219.8, current: 10.2, power: 2241, powerFactor: 0.93 },
      { phase: 'L3', voltage: 222.1, current: 13.5, power: 2999, powerFactor: 0.94 },
    ],
  },
  {
    id: 'exit-tol-jelupang',
    name: 'Alfamart Exit Tol Jelupang',
    address: 'Jl. Raya Serpong, Exit Tol Jelupang, Tangerang Selatan',
    photoUrl: '/mock/store-2.jpg',
    status: 'live',
    kwhTotal: 2103.7,
    deviceCount: 3,
    lastUpdate: new Date(Date.now() - 120 * 1000).toISOString(),
    phases: [
      { phase: 'L1', voltage: 220.0, current: 15.1, power: 3322, powerFactor: 0.92 },
      { phase: 'L2', voltage: 218.5, current: 14.3, power: 3124, powerFactor: 0.91 },
      { phase: 'L3', voltage: 221.3, current: 16.0, power: 3541, powerFactor: 0.93 },
    ],
  },
  {
    id: 'bsd-sektor-7',
    name: 'Alfamart BSD Sektor 7',
    address: 'Jl. Pahlawan Seribu, BSD City, Tangerang Selatan',
    photoUrl: '/mock/store-3.jpg',
    status: 'historical',
    kwhTotal: 3456.2,
    deviceCount: 2,
    lastUpdate: new Date('2026-08-10T14:30:00').toISOString(),
    phases: [],
  },
  {
    id: 'ciputat-timur',
    name: 'Alfamart Ciputat Timur',
    address: 'Jl. Raya Ciputat, Ciputat Timur, Tangerang Selatan',
    photoUrl: '/mock/store-4.jpg',
    status: 'historical',
    kwhTotal: 1928.4,
    deviceCount: 2,
    lastUpdate: new Date('2026-07-28T09:15:00').toISOString(),
    phases: [],
  },
  {
    id: 'pamulang-permai',
    name: 'Alfamart Pamulang Permai',
    address: 'Jl. Surya Kencana, Pamulang, Tangerang Selatan',
    photoUrl: '/mock/store-5.jpg',
    status: 'unassigned',
    kwhTotal: 0,
    deviceCount: 0,
    lastUpdate: '',
    phases: [],
  },
  {
    id: 'serpong-bumi',
    name: 'Alfamart Serpong Bumi',
    address: 'Jl. Raya Serpong, Serpong, Tangerang Selatan',
    photoUrl: '/mock/store-6.jpg',
    status: 'unassigned',
    kwhTotal: 0,
    deviceCount: 0,
    lastUpdate: '',
    phases: [],
  },
]

export function getMockStore(id: string): Store | undefined {
  return MOCK_STORES.find((s) => s.id === id)
}

export function getMockTelemetry(storeId: string): TelemetryPoint[] {
  const base = storeId === 'exit-tol-jelupang' ? 3200 : 2800
  return Array.from({ length: 48 }, (_, i) => {
    const hour = Math.floor(i / 2)
    const minute = i % 2 === 0 ? '00' : '30'
    const isPeak = hour >= 10 && hour <= 14
    const isLow = hour >= 0 && hour <= 5
    const multiplier = isPeak ? 1.4 : isLow ? 0.3 : 1.0
    const jitter = () => (Math.random() - 0.5) * 200
    const p1 = Math.max(0, base * multiplier * 0.33 + jitter())
    const p2 = Math.max(0, base * multiplier * 0.33 + jitter())
    const p3 = Math.max(0, base * multiplier * 0.34 + jitter())
    return {
      timestamp: `${String(hour).padStart(2, '0')}:${minute}`,
      powerL1: Math.round(p1),
      powerL2: Math.round(p2),
      powerL3: Math.round(p3),
      totalPower: Math.round(p1 + p2 + p3),
    }
  })
}

export const MOCK_AUDIT_SESSIONS: AuditSession[] = [
  { id: 's1', storeId: 'pondok-kacang-3', label: '10–17 Agt 2026 (Aktif)', startDate: '2026-08-10', endDate: null, isActive: true },
  { id: 's2', storeId: 'pondok-kacang-3', label: '15–22 Jul 2026', startDate: '2026-07-15', endDate: '2026-07-22', isActive: false },
  { id: 's3', storeId: 'exit-tol-jelupang', label: '10–17 Agt 2026 (Aktif)', startDate: '2026-08-10', endDate: null, isActive: true },
  { id: 's4', storeId: 'bsd-sektor-7', label: '1–10 Agt 2026', startDate: '2026-08-01', endDate: '2026-08-10', isActive: false },
  { id: 's5', storeId: 'ciputat-timur', label: '21–28 Jul 2026', startDate: '2026-07-21', endDate: '2026-07-28', isActive: false },
]
```

- [ ] **Step 4: Verify TypeScript** — `pnpm typecheck` → pass

- [ ] **Step 5: Buat task note & commit**

---

## Task 2: AdminShell Layout — Sidebar & Header

**Files:**
- Create: `app/(dashboard)/layout.tsx`
- Create: `components/layout/admin-shell.tsx`
- Create: `components/layout/app-sidebar.tsx`
- Create: `components/layout/app-header.tsx`
- Create: `components/layout/breadcrumb-nav.tsx`
- Create: `components/layout/theme-toggle.tsx`

**Interfaces:**
- Consumes: shadcn `Sidebar`, `SidebarProvider`, `SidebarTrigger`, `Breadcrumb`, `Separator`, `Avatar`, `DropdownMenu`
- Produces: `AdminShell({ children })`, `AppSidebar()`, `AppHeader()`, `BreadcrumbNav()`, `ThemeToggle()`

AppSidebar menu structure:
- Header: Logo Zap (emerald-600 bg) + "SPARTA Monitoring" text
- Top: LayoutDashboard → Overview Toko (href="/")
- Group "Monitoring": Store → Monitoring Toko, Zap → Sesi Audit IoT, BarChart3 → Analitik Telemetri
- Group "Hardware & Perangkat": Zap (emerald) → Realtime Meter ↗ (external link), Cpu → Perangkat IoT, MapPin → Pemetaan Lokasi
- Group "Ekosistem SPARTA": ClipboardList → SPARTA Audit ↗ (external link)
- Footer: Avatar "AD" + "Admin SPARTA" + DropdownMenu

AppHeader content:
- SidebarTrigger + Separator + BreadcrumbNav
- Right side: Badge "Server Live" (pulse emerald dot), Button "Realtime Meter ↗" (emerald border), Button "Sparta Audit ↗" (slate border), ThemeToggle

- [ ] **Step 1–7**: Buat semua komponen layout

- [ ] **Step 8: Test** `pnpm dev` → sidebar, header, breadcrumb, theme toggle OK

- [ ] **Step 9: Buat task note & commit**

---

## Task 3: Overview Gallery Toko (`/`)

**Files:**
- Modify: `app/(dashboard)/page.tsx`
- Create: `components/dashboard/store-gallery.tsx`
- Create: `components/dashboard/store-card.tsx`
- Create: `components/dashboard/gallery-toolbar.tsx`
- Create: `components/dashboard/status-badge.tsx`

**Interfaces:**
- Consumes: `MOCK_STORES`, `Store`, `StoreStatus`
- Produces: `StoreGallery()`, `StoreCard({ store })`, `GalleryToolbar({ search, onSearch, statusFilter, onStatusFilter })`, `StatusBadge({ status })`

StatusBadge config:
- live: label "LIVE AUDIT IN PROGRESS", bg-emerald-500, animated pulse dot
- historical: label "HISTORICAL AUDIT LOG", bg-blue-500
- unassigned: label "UNASSIGNED", bg-slate-400

StoreCard:
- Image Next.js fill, h-44, `object-cover group-hover:scale-105`
- `bg-gradient-to-t from-black/60 via-black/10 to-transparent` overlay
- StatusBadge di `absolute bottom-3 left-3`
- Hover overlay: Button "View Monitoring" link ke `/monitoring/[id]`
- Metrics grid: kWh total, device count, last update (formatted relative time)
- Unassigned: tampilkan Button "Assign Devices" penuh

GalleryToolbar: Input search (icon Search kiri), Select status filter

StoreGallery: client, useState search+statusFilter, useMemo filtered list, grid cols-1 sm:cols-2 xl:cols-3

- [ ] **Steps 1–7**: Buat semua komponen

- [ ] **Step 6: Test** — 6 kartu, filter bekerja, klik navigasi

- [ ] **Step 7: Buat task note & commit**

---

## Task 4: SVG Circular Gauge Component

**Files:**
- Create: `components/monitoring/circular-gauge.tsx`
- Create: `components/monitoring/phase-gauge-grid.tsx`

**Interfaces:**
- Produces: `CircularGauge({ value, max, unit, label, color?, size?, strokeWidth? })`
- Produces: `PhaseGaugeGrid({ phases: PhaseData[] })`

CircularGauge implementation:
- SVG arc 270° sweep (background track + value fill)
- `strokeDasharray` proportional to `value/max * arcLength`
- CSS `drop-shadow` glow filter on value arc
- Center text: value number + unit text below
- Rotated -225deg so arc starts at bottom-left (135°)

PhaseGaugeGrid:
- Colors: L1=#10b981 (emerald), L2=#3b82f6 (blue), L3=#f59e0b (amber)
- Per fase: card with colored dot label + 4 gauges in a row
- Voltage max=260V, Current max=30A, Power max=5000W, PF max=1

- [ ] **Steps 1–3**: Buat komponens dan typecheck

---

## Task 5: Halaman Detail Monitoring (`/monitoring/[storeId]`)

**Files:**
- Create: `app/(dashboard)/monitoring/[storeId]/page.tsx`
- Create: `components/monitoring/store-monitoring-page.tsx`
- Create: `components/monitoring/telemetry-chart.tsx`
- Create: `components/monitoring/session-selector.tsx`
- Create: `components/monitoring/store-hero.tsx`

**Interfaces:**
- Consumes: `getMockStore`, `getMockTelemetry`, `MOCK_AUDIT_SESSIONS`, `PhaseGaugeGrid`
- Produces: Route `/monitoring/[storeId]` rendering `StoreMonitoringPage`

TelemetryChart (Recharts):
- `ComposedChart` dengan Area (totalPower, emerald fill #10b98115) + 3 Line (L1/L2/L3)
- XAxis: dataKey="timestamp", interval=5
- YAxis: tickFormatter `(v) => `${(v/1000).toFixed(1)}k``
- ReferenceLine jam puncak: x="10:00" dan x="14:00", amber dashed
- Tooltip + Legend

StoreHero:
- Row: StatusBadge + h1 nama toko + MapPin alamat
- Metric cards: kWh Total, W Live (hanya jika status=live), Devices

Page component (`app/(dashboard)/monitoring/[storeId]/page.tsx`):
```typescript
interface PageProps { params: Promise<{ storeId: string }> }
export default async function MonitoringDetailPage({ params }: PageProps) {
  const { storeId } = await params
  return <StoreMonitoringPage storeId={storeId} />
}
```

- [ ] **Step 1**: `pnpm add recharts`
- [ ] **Steps 2–7**: Buat semua komponens
- [ ] **Step 8: Buat task note & commit**

---

## Task 6: Final Polish & Metadata

**Files:**
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

CSS override tambahkan ke `:root` di globals.css:
```css
/* SPARTA Energy brand colors */
--primary: oklch(0.42 0.12 163);
--primary-foreground: oklch(0.985 0 0);
--sidebar-primary: oklch(0.42 0.12 163);
--sidebar-primary-foreground: oklch(0.985 0 0);
--ring: oklch(0.55 0.14 163);
```

Metadata di layout.tsx:
```typescript
export const metadata = {
  title: 'SPARTA Energy Monitoring',
  description: 'Smart Energy & Utility Monitoring System — Alfamart Store Telemetry Dashboard',
}
```

- [ ] **Steps 1–4**: Terapkan CSS, metadata, typecheck+lint, task note & commit final

---

## Verification Plan

1. `pnpm dev` → http://localhost:3001
2. ✅ Sidebar collapsible (Ctrl+B), logo SPARTA emerald
3. ✅ Header: breadcrumb, "Server Live" (pulse), Realtime Meter ↗, Sparta Audit ↗, theme toggle
4. ✅ 6 kartu: 2 LIVE (badge hijau pulse), 2 HISTORICAL (biru), 2 UNASSIGNED (abu + Assign)
5. ✅ Search & filter status berfungsi real-time
6. ✅ Hover kartu → "View Monitoring" muncul
7. ✅ Klik toko LIVE → `/monitoring/pondok-kacang-3` → gauges L1/L2/L3 + chart
8. ✅ Theme toggle light/dark berfungsi
9. ✅ `pnpm typecheck` → pass

'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Zap,
  Activity,
  ArrowRight,
  Crosshair,
  Building2,
  Filter,
} from 'lucide-react'
import { MOCK_STORES } from '@/lib/mock-data'
import { Store } from '@/lib/types'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

// Bounding box koordinat Jabodetabek untuk normalisasi posisi pin (SVG canvas)
// Lat: -6.20 to -6.36, Long: 106.63 to 106.77
const MAP_BOUNDS = {
  minLat: -6.36,
  maxLat: -6.21,
  minLng: 106.63,
  maxLng: 106.77,
}

function projectCoordinates(lat?: number, lng?: number) {
  if (!lat || !lng) return { x: 50, y: 50 }

  const x =
    ((lng - MAP_BOUNDS.minLng) / (MAP_BOUNDS.maxLng - MAP_BOUNDS.minLng)) * 100
  // Invert Y axis because latitude decreases southward
  const y =
    ((MAP_BOUNDS.maxLat - lat) / (MAP_BOUNDS.maxLat - MAP_BOUNDS.minLat)) * 100

  // Clamped between 10% and 90% for safe margin
  return {
    x: Math.min(Math.max(x, 10), 90),
    y: Math.min(Math.max(y, 10), 90),
  }
}

export function NetworkMapWidget() {
  const [filterLiveOnly, setFilterLiveOnly] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(
    MOCK_STORES.find((s) => s.status === 'live') ?? MOCK_STORES[0]
  )

  const displayedStores = useMemo(() => {
    if (filterLiveOnly) {
      return MOCK_STORES.filter((s) => s.status === 'live')
    }
    return MOCK_STORES
  }, [filterLiveOnly])

  const liveStoresCount = MOCK_STORES.filter((s) => s.status === 'live').length

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs">
      {/* Header Widget */}
      <div className="flex flex-col gap-3 border-b p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Peta Sebaran Alat IoT &amp; Jaringan Toko
            </h2>
            <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
              {liveStoresCount} Sesi Aktif
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Titik koordinat GPS toko yang sedang terpasang perangkat Smart Energy Meter.
          </p>
        </div>

        {/* Filter Controls & Legend */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterLiveOnly(!filterLiveOnly)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              filterLiveOnly
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Filter className="size-3.5" />
            {filterLiveOnly ? 'Hanya Alat Aktif' : 'Semua Titik Toko'}
          </button>
        </div>
      </div>

      {/* Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Visual Map Canvas (Col 8) */}
        <div className="relative min-h-[380px] bg-slate-950/90 lg:col-span-8 overflow-hidden">
          {/* High-Tech Grid & Roads Aesthetic Background */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-20 [background-image:radial-gradient(#10b981_1px,transparent_1px),linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:24px_24px,48px_48px,48px_48px]"
          />

          {/* Glowing Ambient Radial in background */}
          <div className="pointer-events-none absolute left-1/3 top-1/2 -translate-x-1/2 -translate-y-1/2 size-96 rounded-full bg-emerald-500/10 blur-3xl" />

          {/* Regional Territory Indicator Watermark */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-1 rounded-lg border border-slate-700/60 bg-slate-900/80 p-2.5 backdrop-blur-md">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Wilayah Operasional
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Jabodetabek Retail Network
            </span>
          </div>

          {/* Map Legend Overlay */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
              <span>Live Aktif</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-400" />
              <span>Riwayat</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-500" />
              <span>Belum Terpasang</span>
            </div>
          </div>

          {/* Interactive Store Pins */}
          {displayedStores.map((store) => {
            const { x, y } = projectCoordinates(store.latitude, store.longitude)
            const isLive = store.status === 'live'
            const isSelected = selectedStore?.id === store.id

            return (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                style={{ left: `${x}%`, top: `${y}%` }}
                className={cn(
                  'group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-125 focus:outline-hidden',
                  isSelected && 'scale-125 z-20'
                )}
                title={`${store.name} (${store.code})`}
              >
                {/* Live Pulsing Beacon Wave */}
                {isLive && (
                  <>
                    <span className="absolute -inset-2 animate-ping rounded-full bg-emerald-400 opacity-60 duration-1000" />
                    <span className="absolute -inset-4 animate-pulse rounded-full bg-emerald-500/20" />
                  </>
                )}

                {/* Marker Pin Outer Ring */}
                <div
                  className={cn(
                    'relative flex size-8 items-center justify-center rounded-full border shadow-lg transition-all',
                    isLive
                      ? 'border-emerald-300 bg-emerald-600 text-white shadow-emerald-500/50'
                      : store.status === 'historical'
                        ? 'border-blue-300 bg-blue-600 text-white shadow-blue-500/30'
                        : 'border-slate-600 bg-slate-700 text-slate-300',
                    isSelected && 'ring-2 ring-white ring-offset-2 ring-offset-slate-900'
                  )}
                >
                  {isLive ? (
                    <Activity className="size-4 animate-pulse" />
                  ) : (
                    <MapPin className="size-4" />
                  )}
                </div>

                {/* Hover / Active Badge Label */}
                <div
                  className={cn(
                    'pointer-events-none absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-md border border-slate-700/80 bg-slate-900/90 px-2 py-0.5 text-[10px] font-semibold text-slate-200 shadow-md backdrop-blur-sm transition-opacity duration-150',
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  )}
                >
                  {store.name}
                </div>
              </button>
            )
          })}
        </div>

        {/* Selected Store Inspector Card (Col 4) */}
        <div className="flex flex-col justify-between border-t p-5 lg:col-span-4 lg:border-l lg:border-t-0 bg-card">
          {selectedStore ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div>
                  <span className="rounded bg-muted px-2 py-0.5 font-mono text-xs font-bold text-muted-foreground">
                    {selectedStore.code}
                  </span>
                  <h3 className="mt-1.5 font-bold text-base text-foreground leading-snug">
                    {selectedStore.name}
                  </h3>
                  <p className="mt-0.5 text-xs text-muted-foreground flex items-center gap-1">
                    <Building2 className="size-3 text-muted-foreground/70" />
                    Cabang {selectedStore.branch}
                  </p>
                </div>
                <StatusBadge status={selectedStore.status} />
              </div>

              {/* GPS Coordinates Info */}
              <div className="rounded-lg border bg-muted/40 p-3 text-xs">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <Crosshair className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    Koordinat GPS Toko
                  </span>
                  <span className="font-mono font-semibold text-foreground">
                    {selectedStore.latitude?.toFixed(4)},{' '}
                    {selectedStore.longitude?.toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Telemetry Metrics */}
              {selectedStore.status !== 'unassigned' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <span className="text-[11px] text-muted-foreground">
                      Total Energi
                    </span>
                    <p className="mt-1 font-bold text-base text-foreground flex items-center gap-1">
                      <Zap className="size-4 text-emerald-600 dark:text-emerald-400" />
                      {selectedStore.kwhTotal.toLocaleString('id-ID')} kWh
                    </p>
                  </div>
                  <div className="rounded-lg border bg-muted/20 p-3">
                    <span className="text-[11px] text-muted-foreground">
                      Sensor Terpasang
                    </span>
                    <p className="mt-1 font-bold text-base text-foreground">
                      {selectedStore.deviceCount} Perangkat
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-lg border border-dashed p-4 text-center">
                  <p className="text-xs italic text-muted-foreground">
                    Belum ada sesi audit IoT yang terpasang di toko ini.
                  </p>
                </div>
              )}

              {/* Action Button */}
              {selectedStore.status !== 'unassigned' ? (
                <Link
                  href={`/monitoring/${selectedStore.id}`}
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2.5 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
                >
                  Buka Monitoring Toko Ini
                  <ArrowRight className="size-3.5" />
                </Link>
              ) : (
                <Link
                  href="/monitoring"
                  className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border py-2.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted"
                >
                  Lihat di Daftar Toko
                </Link>
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-center text-xs text-muted-foreground">
              Klik salah satu titik pin di peta untuk melihat detail status toko.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

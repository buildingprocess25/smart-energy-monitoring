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
import { Store } from '@/lib/types'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

function getDynamicBounds(stores: Store[]) {
  const validStores = stores.filter((s) => s.latitude && s.longitude)
  if (validStores.length === 0) {
    return { minLat: -8.0, maxLat: -5.5, minLng: 105.0, maxLng: 115.0 }
  }

  const lats = validStores.map((s) => s.latitude!)
  const lngs = validStores.map((s) => s.longitude!)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const latSpan = maxLat - minLat || 1
  const lngSpan = maxLng - minLng || 1
  const latPadding = latSpan * 0.12
  const lngPadding = lngSpan * 0.12

  return {
    minLat: minLat - latPadding,
    maxLat: maxLat + latPadding,
    minLng: minLng - lngPadding,
    maxLng: maxLng + lngPadding,
  }
}

function projectCoordinates(lat: number | undefined, lng: number | undefined, bounds: ReturnType<typeof getDynamicBounds>) {
  if (!lat || !lng) return { x: 50, y: 50 }

  const x = ((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * 100
  const y = ((bounds.maxLat - lat) / (bounds.maxLat - bounds.minLat)) * 100

  return {
    x: Math.min(Math.max(x, 8), 92),
    y: Math.min(Math.max(y, 8), 92),
  }
}

interface NetworkMapWidgetProps {
  stores?: Store[]
}

export function NetworkMapWidget({ stores = [] }: NetworkMapWidgetProps) {
  const [filterLiveOnly, setFilterLiveOnly] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(
    stores.find((s) => s.status === 'live') ?? stores[0] ?? null
  )

  const bounds = useMemo(() => getDynamicBounds(stores), [stores])

  const displayedStores = useMemo(() => {
    if (filterLiveOnly) {
      return stores.filter((s) => s.status === 'live')
    }
    return stores
  }, [filterLiveOnly, stores])

  const liveStoresCount = stores.filter((s) => s.status === 'live').length

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
            Titik koordinat GPS toko yang sedang terpasang perangkat Smart Energy Meter dan riwayat audit.
          </p>
        </div>

        {/* Filter Controls */}
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
              Alfamart Retail &amp; DC Network
            </span>
          </div>

          {/* Map Legend Overlay */}
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 flex items-center gap-3 rounded-lg border border-slate-700/60 bg-slate-900/80 px-3 py-1.5 text-[11px] text-slate-300 backdrop-blur-md">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span>Live Telemetry</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500" />
              <span>Audit Historis</span>
            </div>
          </div>

          {/* Simulated Inter-Store Mesh Lines */}
          <svg className="pointer-events-none absolute inset-0 size-full stroke-slate-700/30 stroke-dashed [stroke-dasharray:4_4]">
            {displayedStores.map((store, i) => {
              if (i === 0) return null
              const prevPos = projectCoordinates(displayedStores[i - 1]?.latitude, displayedStores[i - 1]?.longitude, bounds)
              const curPos = projectCoordinates(store.latitude, store.longitude, bounds)
              return (
                <line
                  key={`line-${store.id}`}
                  x1={`${prevPos.x}%`}
                  y1={`${prevPos.y}%`}
                  x2={`${curPos.x}%`}
                  y2={`${curPos.y}%`}
                />
              )
            })}
          </svg>

          {/* Interactive Pins on Canvas */}
          {displayedStores.map((store) => {
            const pos = projectCoordinates(store.latitude, store.longitude, bounds)
            const isSelected = selectedStore?.id === store.id
            const isLive = store.status === 'live'

            return (
              <button
                key={store.id}
                onClick={() => setSelectedStore(store)}
                style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                className={cn(
                  'group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 focus:outline-hidden',
                  isSelected ? 'z-30 scale-125' : 'z-20 hover:scale-115'
                )}
                aria-label={`Pilih toko ${store.name}`}
              >
                {/* Radar Ping for Live Device */}
                {isLive && (
                  <span className="absolute -inset-2.5 animate-ping rounded-full bg-emerald-400/40 opacity-75 duration-1000" />
                )}

                {/* Outer Pin Body */}
                <div
                  className={cn(
                    'relative flex size-7 items-center justify-center rounded-full border-2 shadow-lg transition-all',
                    isLive
                      ? 'border-emerald-300 bg-emerald-600 text-white shadow-emerald-500/50'
                      : 'border-blue-300 bg-blue-600 text-white shadow-blue-500/50',
                    isSelected && 'ring-4 ring-white/40'
                  )}
                >
                  <MapPin className="size-3.5 fill-current" />
                </div>

                {/* Floating Store Code Label */}
                <div
                  className={cn(
                    'absolute left-1/2 top-full mt-1 -translate-x-1/2 whitespace-nowrap rounded px-1.5 py-0.5 text-[10px] font-bold font-mono tracking-tight shadow-md transition-opacity',
                    isSelected
                      ? 'bg-slate-900 text-emerald-400 border border-emerald-500/40 opacity-100'
                      : 'bg-slate-950/80 text-slate-300 opacity-70 group-hover:opacity-100'
                  )}
                >
                  {store.code}
                </div>
              </button>
            )
          })}
        </div>

        {/* Side Inspector Card for Selected Store (Col 4) */}
        <div className="flex flex-col justify-between border-t p-5 bg-card lg:col-span-4 lg:border-t-0 lg:border-l">
          {selectedStore ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-muted-foreground">
                      {selectedStore.code}
                    </span>
                    <StatusBadge status={selectedStore.status} />
                  </div>
                  <h3 className="mt-1 font-bold text-base text-foreground leading-tight">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cabang {selectedStore.branch}
                  </p>
                </div>
              </div>

              {/* Quick Specs Grid */}
              <div className="grid grid-cols-2 gap-2 rounded-lg border bg-muted/30 p-3 text-xs">
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                    Total Energi
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {(selectedStore.kwhTotal || 0).toLocaleString('id-ID', { maximumFractionDigits: 1 })}{' '}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      kWh
                    </span>
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                    Daya Terpasang
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {selectedStore.plnPowerVa ? `${selectedStore.plnPowerVa.toLocaleString('id-ID')} VA` : 'Standar Toko'}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                    Koordinat GPS
                  </span>
                  <span className="font-mono text-[11px] font-medium text-foreground mt-0.5 truncate">
                    {selectedStore.latitude?.toFixed(4)}, {selectedStore.longitude?.toFixed(4)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-muted-foreground text-[10px] uppercase font-semibold">
                    Status IoT
                  </span>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 flex items-center gap-1">
                    {selectedStore.status === 'live' ? (
                      <>
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online ({selectedStore.deviceId})
                      </>
                    ) : (
                      'Tersimpan di Audit'
                    )}
                  </span>
                </div>
              </div>

              {/* 3-Phase Live Preview if available */}
              {selectedStore.phases && selectedStore.phases.length > 0 && selectedStore.status === 'live' && (
                <div className="flex flex-col gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Activity className="size-3 text-emerald-500" />
                      Beban Fasa Saat Ini
                    </span>
                    <span className="font-mono">
                      {Math.round(
                        selectedStore.phases.reduce((acc, p) => acc + (p.power || 0), 0)
                      )}{' '}
                      W
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[10px]">
                    {selectedStore.phases.map((p) => (
                      <div key={p.phase} className="rounded bg-background/80 p-1 border">
                        <div className="text-muted-foreground font-semibold">{p.phase}</div>
                        <div className="font-bold text-foreground">{Math.round(p.power)} W</div>
                        <div className="text-[9px] text-muted-foreground">{p.voltage.toFixed(0)}V</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Link to Store Detail */}
              <Link
                href={`/monitoring/${selectedStore.id}`}
                className="mt-2 flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors"
              >
                Buka Live Monitoring Toko
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center py-10 text-muted-foreground">
              <Crosshair className="size-8 text-muted-foreground/40 mb-2" />
              <p className="text-xs">Pilih salah satu pin toko pada peta untuk melihat detail spesifikasi.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

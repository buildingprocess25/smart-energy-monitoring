'use client'

import { useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  MapPin,
  Activity,
  ArrowRight,
  Crosshair,
  Filter,
  Navigation,
  Building2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Store } from '@/lib/types'
import { StatusBadge } from './status-badge'
import { cn } from '@/lib/utils'

// Dynamic import for Leaflet (SSR is disabled because Leaflet uses browser APIs)
const NetworkMapLeaflet = dynamic(
  () =>
    import('./network-map-leaflet').then((mod) => mod.NetworkMapLeaflet),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] w-full flex-col items-center justify-center gap-3 bg-muted/20 text-muted-foreground">
        <div className="flex size-10 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
          <MapPin className="size-5 animate-bounce" />
        </div>
        <div className="flex flex-col items-center gap-1 text-center">
          <span className="text-xs font-semibold text-foreground">
            Memuat Peta Lokasi Toko...
          </span>
          <span className="text-[11px] text-muted-foreground">
            Menghubungkan ke OpenStreetMap
          </span>
        </div>
      </div>
    ),
  }
)

interface NetworkMapWidgetProps {
  stores?: Store[]
}

export function NetworkMapWidget({ stores = [] }: NetworkMapWidgetProps) {
  const [filterLiveOnly, setFilterLiveOnly] = useState(false)
  const [selectedStore, setSelectedStore] = useState<Store | null>(
    stores.find((s) => s.status === 'live') ?? stores[0] ?? null
  )
  const [focusCount, setFocusCount] = useState(0)

  const displayedStores = useMemo(() => {
    if (filterLiveOnly) {
      return stores.filter((s) => s.status === 'live' || s.isRecording)
    }
    return stores
  }, [filterLiveOnly, stores])

  const liveStoresCount = stores.filter((s) => s.status === 'live' || s.isRecording).length
  const recordingStoresCount = stores.filter((s) => s.isRecording).length

  const currentStoreIndex = useMemo(() => {
    if (!selectedStore) return 0
    const idx = displayedStores.findIndex((s) => s.id === selectedStore.id)
    return idx !== -1 ? idx : 0
  }, [displayedStores, selectedStore])

  const handleSelectAndFocus = (store: Store) => {
    setSelectedStore(store)
    setFocusCount((c) => c + 1)
  }

  const handleNextStore = () => {
    if (displayedStores.length <= 1) return
    const nextIdx = (currentStoreIndex + 1) % displayedStores.length
    handleSelectAndFocus(displayedStores[nextIdx])
  }

  const handlePrevStore = () => {
    if (displayedStores.length <= 1) return
    const prevIdx = (currentStoreIndex - 1 + displayedStores.length) % displayedStores.length
    handleSelectAndFocus(displayedStores[prevIdx])
  }

  return (
    <div className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-xs">
      {/* Header Widget */}
      <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-foreground">
              Peta Sebaran Alat IoT &amp; Jaringan Toko
            </h2>
            {recordingStoresCount > 0 ? (
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 ring-1 ring-emerald-500/30">
                <span className="size-1.5 animate-ping rounded-full bg-emerald-500" />
                {recordingStoresCount} Sedang Merekam
              </span>
            ) : (
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                {liveStoresCount} IoT Online
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            Navigasi instan antar titik koordinat GPS toko yang terpasang perangkat Smart Energy Meter.
          </p>
        </div>

        {/* Controls: Next/Prev Switcher & Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Next/Prev Navigation Button Group */}
          {displayedStores.length > 1 && (
            <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1 shadow-2xs">
              <button
                type="button"
                onClick={handlePrevStore}
                title="Pindah ke Toko Sebelumnya"
                aria-label="Toko Sebelumnya"
                className="flex size-7 items-center justify-center rounded-md bg-background text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-4" />
              </button>

              <div className="px-2 text-xs font-semibold text-foreground select-none">
                <span className="text-emerald-600 dark:text-emerald-400">
                  {currentStoreIndex + 1}
                </span>{' '}
                <span className="text-muted-foreground">/ {displayedStores.length}</span>
              </div>

              <button
                type="button"
                onClick={handleNextStore}
                title="Pindah ke Toko Berikutnya"
                aria-label="Toko Berikutnya"
                className="flex size-7 items-center justify-center rounded-md bg-background text-foreground shadow-xs hover:bg-muted transition-colors cursor-pointer"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}

          <button
            onClick={() => setFilterLiveOnly(!filterLiveOnly)}
            className={cn(
              'flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer',
              filterLiveOnly
                ? 'border-emerald-500 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground'
            )}
          >
            <Filter className="size-3.5" />
            {filterLiveOnly ? 'Hanya Alat Aktif' : 'Semua Titik'}
          </button>
        </div>
      </div>

      {/* Quick Store Shortcut Chips (if multiple stores exist) */}
      {displayedStores.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto border-b bg-muted/20 px-4 py-2 text-xs scrollbar-none">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground shrink-0 flex items-center gap-1">
            <Navigation className="size-3" />
            Lompat Lokasi:
          </span>
          {displayedStores.map((s, idx) => {
            const isSelected = selectedStore?.id === s.id
            const isRec = Boolean(s.isRecording)
            const isLive = s.status === 'live' || isRec
            return (
              <button
                key={s.id}
                onClick={() => handleSelectAndFocus(s)}
                className={cn(
                  'flex items-center gap-1.5 shrink-0 rounded-full px-2.5 py-1 text-xs font-medium transition-all cursor-pointer',
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs font-semibold'
                    : 'bg-background border text-muted-foreground hover:text-foreground hover:border-slate-300'
                )}
              >
                <span
                  className={cn(
                    'size-1.5 rounded-full',
                    isRec ? 'bg-emerald-300 animate-ping' : isLive ? 'bg-emerald-400' : 'bg-blue-400'
                  )}
                />
                <span className="font-mono text-[11px]">{s.code}</span>
                <span className="text-[10.5px] opacity-80 truncate max-w-[120px]">
                  {s.name}
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* Map Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12">
        {/* Real Interactive Leaflet Map (Col 8) */}
        <div className="relative min-h-[400px] lg:col-span-8 overflow-hidden bg-slate-100">
          {/* Floating On-Map Next / Prev Quick Controller Bar */}
          {displayedStores.length > 1 && (
            <div className="absolute top-3 left-14 z-1000 flex items-center gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 px-2 py-1 backdrop-blur-md shadow-md text-slate-800">
              <button
                type="button"
                onClick={handlePrevStore}
                title="Toko Sebelumnya"
                className="flex size-6 items-center justify-center rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                <ChevronLeft className="size-3.5" />
              </button>
              <span className="font-mono text-[11px] font-bold text-emerald-700 px-1 truncate max-w-[150px]">
                {selectedStore?.name || selectedStore?.code}
              </span>
              <button
                type="button"
                onClick={handleNextStore}
                title="Toko Berikutnya"
                className="flex size-6 items-center justify-center rounded hover:bg-slate-100 text-slate-700 transition-colors cursor-pointer"
              >
                <ChevronRight className="size-3.5" />
              </button>
            </div>
          )}

          {/* Top-Right Info Badge */}
          <div className="pointer-events-none absolute right-3 top-3 z-1000 flex flex-col gap-0.5 rounded-lg border border-slate-200/80 bg-white/90 px-3 py-1.5 backdrop-blur-md shadow-xs text-slate-800">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Peta Monitoring IoT
            </span>
            <span className="text-xs font-semibold text-slate-900">
              Titik Toko &amp; DC Terintegrasi
            </span>
          </div>

          {/* Map Legend Overlay */}
          <div className="pointer-events-none absolute bottom-3 left-3 z-1000 flex items-center gap-3 rounded-lg border border-slate-200/80 bg-white/90 px-3 py-1.5 text-[11px] text-slate-700 backdrop-blur-md shadow-xs">
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500 shadow-xs" />
              <span>Telemetri Real-time</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-blue-500 shadow-xs" />
              <span>Data Historis</span>
            </div>
          </div>

          {/* Leaflet Dynamic Component */}
          <NetworkMapLeaflet
            stores={displayedStores}
            selectedStore={selectedStore}
            focusCount={focusCount}
            onSelectStore={(store) => setSelectedStore(store)}
          />
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
                    <StatusBadge
                      status={selectedStore.status}
                      isRecording={selectedStore.isRecording}
                      recordingSessionName={selectedStore.recordingSessionName}
                    />
                  </div>
                  <h3 className="mt-1 font-bold text-base text-foreground leading-tight">
                    {selectedStore.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Cabang {selectedStore.branch}
                  </p>
                </div>

                {/* Focus Shortcut Button */}
                <button
                  onClick={() => setFocusCount((c) => c + 1)}
                  title="Pusatkan Peta ke Lokasi Toko Ini"
                  className="flex items-center gap-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20 transition-colors cursor-pointer"
                >
                  <Crosshair className="size-3.5" />
                  <span>Fokuskan</span>
                </button>
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
                    {selectedStore.latitude ? selectedStore.latitude.toFixed(4) : '-'}, {selectedStore.longitude ? selectedStore.longitude.toFixed(4) : '-'}
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

              {/* Live Phases Preview if available */}
              {selectedStore.phases && selectedStore.phases.length > 0 && selectedStore.status === 'live' && (
                <div className="flex flex-col gap-1.5 rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-emerald-800 dark:text-emerald-300">
                    <span className="flex items-center gap-1">
                      <Activity className="size-3 text-emerald-500" />
                      Beban Fasa Saat Ini
                    </span>
                    <span className="font-mono">
                      {Math.round(
                        selectedStore.phases
                          .filter((p) => !(p.phaseName || '').toLowerCase().includes('dummy'))
                          .reduce((acc, p) => acc + (p.power || 0), 0)
                      )}{' '}
                      W
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-1 pt-1 text-center font-mono text-[10px]">
                    {selectedStore.phases
                      .filter((p) => !(p.phaseName || '').toLowerCase().includes('dummy'))
                      .map((p) => (
                        <div key={p.phase} className="rounded bg-background/80 p-1 border">
                          <div className="text-muted-foreground font-semibold truncate">
                            {p.phaseName || p.phase}
                          </div>
                          <div className="font-bold text-foreground">{Math.round(p.power)} W</div>
                          <div className="text-[9px] text-muted-foreground">{p.voltage.toFixed(0)}V</div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Action Link to Store Detail */}
              <Link
                href={`/monitoring/${selectedStore.code || selectedStore.id}`}
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

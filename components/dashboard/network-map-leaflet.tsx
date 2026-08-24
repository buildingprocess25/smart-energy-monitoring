'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { Store } from '@/lib/types'
import Link from 'next/link'
import { ArrowRight, Cpu, Crosshair, Maximize2, LocateFixed } from 'lucide-react'

// Fix missing Leaflet default icon URLs in bundler environments
// @ts-expect-error - Leaflet workaround for missing _getIconUrl in prototype
delete L.Icon.Default.prototype._getIconUrl

interface NetworkMapLeafletProps {
  stores: Store[]
  selectedStore: Store | null
  focusCount?: number
  onSelectStore: (store: Store) => void
}

// Helper to create clean, floating map marker pins with Energy Zap icon
function createStoreIcon(store: Store, isSelected: boolean) {
  const isLive = store.status === 'live'

  const pinBg = isLive ? '#10b981' : '#3b82f6'
  const pulseEffect = isLive
    ? `<span style="position:absolute; width:38px; height:38px; top:-6px; left:-6px; border-radius:9999px; background:rgba(16,185,129,0.35); animation:leaflet-ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></span>`
    : ''

  const ringStyle = isSelected
    ? 'box-shadow: 0 0 0 3px #fff, 0 0 0 6px #10b981, 0 8px 18px rgba(0,0,0,0.35); transform: scale(1.15);'
    : 'box-shadow: 0 4px 10px rgba(0,0,0,0.25);'

  const html = `
    <div style="position:relative; width:26px; height:26px; display:flex; align-items:center; justify-content:center; cursor:pointer;">
      ${pulseEffect}
      <div style="position:relative; width:26px; height:26px; border-radius:9999px; background:${pinBg}; border:2px solid #ffffff; display:flex; align-items:center; justify-content:center; color:#fff; transition:all 0.2s ease; ${ringStyle}">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="none">
          <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
        </svg>
      </div>
    </div>
  `

  return L.divIcon({
    html,
    className: 'custom-leaflet-pin',
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -16],
  })
}

// Controller component inside MapContainer to provide fly-to and reset actions
function MapViewController({
  stores,
  selectedStore,
  focusCount,
}: {
  stores: Store[]
  selectedStore: Store | null
  focusCount?: number
}) {
  const map = useMap()
  const initialFitDone = useRef(false)

  // Ensure map tile canvas fits container properly
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize()
    }, 250)
    return () => clearTimeout(timer)
  }, [map])

  // Fit bounds on initial load
  useEffect(() => {
    const validStores = stores.filter((s) => s.latitude && s.longitude)

    if (validStores.length === 0) {
      map.setView([-6.8, 107.1], 9)
      return
    }

    if (validStores.length === 1 && !initialFitDone.current) {
      const single = validStores[0]
      map.setView([single.latitude!, single.longitude!], 13)
      initialFitDone.current = true
      return
    }

    if (!initialFitDone.current && validStores.length > 1) {
      const bounds = L.latLngBounds(
        validStores.map((s) => [s.latitude!, s.longitude!])
      )
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 })
      initialFitDone.current = true
    }
  }, [stores, map])

  // Smooth Fly-To when selected store changes or focus button is triggered
  useEffect(() => {
    if (selectedStore?.latitude && selectedStore?.longitude) {
      map.flyTo([selectedStore.latitude, selectedStore.longitude], 14, {
        animate: true,
        duration: 0.8,
      })
    }
  }, [selectedStore, focusCount, map])

  return null
}

// Native Leaflet Control using createPortal so it behaves identically to zoom buttons
function FloatingMapControls({
  stores,
  selectedStore,
}: {
  stores: Store[]
  selectedStore: Store | null
}) {
  const map = useMap()
  const [container, setContainer] = useState<HTMLElement | null>(null)

  useEffect(() => {
    const customControl = new L.Control({ position: 'topleft' })
    customControl.onAdd = function () {
      const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control custom-leaflet-action-bar')
      L.DomEvent.disableClickPropagation(div)
      L.DomEvent.disableScrollPropagation(div)
      return div
    }
    customControl.addTo(map)
    setContainer(customControl.getContainer() || null)

    return () => {
      customControl.remove()
    }
  }, [map])

  if (!container) return null

  const handleFitAll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const validStores = stores.filter((s) => s.latitude && s.longitude)
    if (validStores.length === 0) {
      map.flyTo([-6.8, 107.1], 9, { duration: 0.8 })
      return
    }
    if (validStores.length === 1) {
      map.flyTo([validStores[0].latitude!, validStores[0].longitude!], 13, {
        duration: 0.8,
      })
      return
    }
    const bounds = L.latLngBounds(
      validStores.map((s) => [s.latitude!, s.longitude!])
    )
    map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14, duration: 0.8 })
  }

  const handleFocusSelected = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (selectedStore?.latitude && selectedStore?.longitude) {
      map.flyTo([selectedStore.latitude, selectedStore.longitude], 15, {
        duration: 0.8,
      })
    } else {
      handleFitAll(e)
    }
  }

  return createPortal(
    <>
      <a
        href="#"
        onClick={handleFocusSelected}
        title={
          selectedStore
            ? `Pusatkan ke ${selectedStore.name}`
            : 'Pusatkan ke Toko Terpilih'
        }
        role="button"
        aria-label="Pusatkan ke Toko Terpilih"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
        }}
      >
        <Crosshair className="size-4 text-slate-700" />
      </a>
      <a
        href="#"
        onClick={handleFitAll}
        title="Lihat Semua Sebaran Toko (Fit All)"
        role="button"
        aria-label="Lihat Semua Toko"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '30px',
          height: '30px',
          cursor: 'pointer',
        }}
      >
        <Maximize2 className="size-4 text-slate-700" />
      </a>
    </>,
    container
  )
}

export function NetworkMapLeaflet({
  stores,
  selectedStore,
  focusCount,
  onSelectStore,
}: NetworkMapLeafletProps) {
  // Official OpenStreetMap Standard (Lush green landscape, fresh blue water, crisp roads, zero desert tone)
  const tileLayerUrl = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

  const tileAttribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors'

  const validStores = useMemo(
    () => stores.filter((s) => s.latitude && s.longitude),
    [stores]
  )

  const defaultCenter: [number, number] =
    validStores.length > 0
      ? [validStores[0].latitude!, validStores[0].longitude!]
      : [-6.8167, 107.1333]

  return (
    <div className="relative size-full min-h-[400px] overflow-hidden">
      <MapContainer
        center={defaultCenter}
        zoom={validStores.length === 1 ? 13 : 9}
        scrollWheelZoom={true}
        className="size-full z-0"
        style={{ minHeight: '400px', height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution={tileAttribution}
          url={tileLayerUrl}
          maxZoom={19}
        />

        <MapViewController
          stores={stores}
          selectedStore={selectedStore}
          focusCount={focusCount}
        />

        <FloatingMapControls
          stores={stores}
          selectedStore={selectedStore}
        />

        {validStores.map((store) => {
          const isSelected = selectedStore?.id === store.id
          const icon = createStoreIcon(store, isSelected)
          const isLive = store.status === 'live'

          return (
            <Marker
              key={store.id}
              position={[store.latitude!, store.longitude!]}
              icon={icon}
              eventHandlers={{
                click: () => {
                  onSelectStore(store)
                },
              }}
            >
              <Popup className="clean-store-popup" closeButton={false}>
                <div className="p-3 min-w-[220px] max-w-[260px] font-sans text-slate-800">
                  {/* Header Badge */}
                  <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-100">
                    <span className="font-mono text-xs font-bold text-slate-500">
                      {store.code}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        isLive
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}
                    >
                      {isLive && (
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      )}
                      {isLive ? 'Online Real-time' : 'Riwayat Audit'}
                    </span>
                  </div>

                  {/* Store Name & Location */}
                  <div className="mt-2 mb-3">
                    <h4 className="text-sm font-bold text-slate-900 leading-snug">
                      {store.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Cabang {store.branch || 'Head Office'}
                    </p>
                  </div>

                  {/* Metric Chips */}
                  <div className="grid grid-cols-2 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 text-xs mb-3">
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Total Energi
                      </span>
                      <span className="font-bold font-mono text-slate-800 text-xs">
                        {store.kwhTotal?.toLocaleString('id-ID', {
                          maximumFractionDigits: 1,
                        }) ?? 0}{' '}
                        kWh
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 font-medium block">
                        Perangkat
                      </span>
                      <span className="font-semibold text-slate-800 text-xs flex items-center gap-1">
                        <Cpu className="size-3 text-slate-400" />
                        {store.deviceCount || 1} IoT
                      </span>
                    </div>
                  </div>

                  {/* Navigation Button */}
                  <Link
                    href={`/monitoring/${store.code || store.id}`}
                    className="flex items-center justify-center gap-1.5 w-full rounded-lg bg-slate-900 hover:bg-slate-800 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors"
                  >
                    <span>Buka Telemetri Toko</span>
                    <ArrowRight className="size-3.5" />
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>
    </div>
  )
}

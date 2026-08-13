'use client'

import { useState, useMemo } from 'react'
import { notFound } from 'next/navigation'
import { getMockStore, getMockTelemetry, MOCK_AUDIT_SESSIONS } from '@/lib/mock-data'
import { StoreHero } from './store-hero'
import { PhaseGaugeGrid } from './phase-gauge-grid'
import { TelemetryChart } from './telemetry-chart'
import { SessionSelector } from './session-selector'
import { Separator } from '@/components/ui/separator'
import { Activity, Clock } from 'lucide-react'

interface StoreMonitoringPageProps {
  storeId: string
}

export function StoreMonitoringPage({ storeId }: StoreMonitoringPageProps) {
  const store = getMockStore(storeId)
  
  if (!store) {
    notFound()
  }

  // Get sessions for this store
  const storeSessions = useMemo(() => 
    MOCK_AUDIT_SESSIONS.filter((s) => s.storeId === storeId),
  [storeId])

  // Active session state (default to first active, or just first available)
  const defaultSessionId = storeSessions.find((s) => s.isActive)?.id ?? storeSessions[0]?.id ?? ''
  const [sessionId, setSessionId] = useState(defaultSessionId)

  // Get telemetry data
  const telemetryData = useMemo(() => getMockTelemetry(storeId), [storeId])

  return (
    <div className="flex flex-col gap-8 pb-8">
      <StoreHero store={store} />

      <Separator />

      {/* Realtime / Current Phase Data */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Activity className="size-5 text-emerald-500" />
          <h2 className="text-xl font-semibold tracking-tight">Kelistrikan Saat Ini</h2>
        </div>
        <PhaseGaugeGrid phases={store.phases} />
      </div>

      <Separator />

      {/* Telemetry Chart Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <Clock className="size-5 text-blue-500" />
            <h2 className="text-xl font-semibold tracking-tight">Profil Beban Harian</h2>
          </div>
          
          <SessionSelector 
            sessions={storeSessions}
            activeSessionId={sessionId}
            onSessionChange={setSessionId}
          />
        </div>

        <div className="rounded-xl border bg-card p-4 shadow-sm sm:p-6">
          <div className="mb-6 flex flex-col">
            <h3 className="font-semibold leading-none tracking-tight">Total Daya (W) vs Fase (L1/L2/L3)</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Data interval 30 menit. Area hijau adalah Total Daya; garis menunjukkan keseimbangan fase.
            </p>
          </div>
          
          <TelemetryChart data={telemetryData} className="h-[400px] w-full" />
        </div>
      </div>
    </div>
  )
}

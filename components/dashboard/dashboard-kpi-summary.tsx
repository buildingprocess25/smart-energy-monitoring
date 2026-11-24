import type { ReactNode } from 'react'
import { Activity, Cpu, Zap } from 'lucide-react'
import type { MonthlyCostRecord, Store } from '@/lib/types'
import { formatKwh, mainPanelKwh } from '@/lib/format-energy'
import { MetricCard } from './metric-card'
import { MonthlyCostKpiCard } from './monthly-cost-kpi-card'

interface DashboardKpiSummaryProps {
  stores: Store[]
  monthlyCosts?: MonthlyCostRecord[]
  // Replaces the cost card, for pages that stream it.
  costCard?: ReactNode
}

export function DashboardKpiSummary({ stores, monthlyCosts = [], costCard }: DashboardKpiSummaryProps) {
  const live = stores.filter((s) => s.status === 'live')
  const devices = live.reduce((sum, s) => sum + (s.deviceCount || 0), 0)
  const hasTotal = stores.some((s) => s.energyBasis === 'main')

  return (
    <section aria-label="Ringkasan" className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <MetricCard
        label="Total energi terpantau"
        value={hasTotal ? formatKwh(mainPanelKwh(stores)) : '-'}
        unit="kWh"
        icon={Zap}
      >
        {hasTotal ? 'Panel utama, selama perangkat merekam' : 'Belum tersedia. Muat ulang sebentar lagi.'}
      </MetricCard>
      {costCard ?? <MonthlyCostKpiCard monthlyCosts={monthlyCosts} />}
      <MetricCard label="Toko online" value={live.length} unit={`dari ${stores.length} toko`} icon={Activity}>
        Toko dengan perangkat yang terhubung atau merekam
      </MetricCard>
      <MetricCard label="Perangkat di toko online" value={devices} unit="perangkat" icon={Cpu}>
        Meter energi, CT, dan plug
      </MetricCard>
    </section>
  )
}

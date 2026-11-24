import type { Metadata } from 'next'
import { unstable_rethrow } from 'next/navigation'
import { getRequestScope } from '@/lib/auth/access'
import { ReportBuilder } from '@/components/reports/report-builder'
import { jakartaToday } from '@/lib/jakarta-range'
import type { ReportTable } from '@/lib/reports'
import { buildReport, getReportStores } from '@/lib/services/report-service'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Laporan | Smart Energy Monitoring' }

async function firstReport(from: string, to: string): Promise<ReportTable | null> {
  try {
    const report = await buildReport({ type: 'daily', store: 'all', from, to })
    return 'error' in report ? null : report
  } catch (error) {
    unstable_rethrow(error)
    console.error('Laporan: gagal memuat laporan awal', error)
    return null
  }
}

export default async function ReportsPage() {
  const today = jakartaToday()
  const from = `${today.slice(0, 7)}-01`
  const [scope, stores, report] = await Promise.all([getRequestScope(), getReportStores(), firstReport(from, today)])

  return (
    <ReportBuilder
      stores={stores}
      canCompare={scope.kind === 'all'}
      defaultFrom={from}
      today={today}
      initial={report}
    />
  )
}

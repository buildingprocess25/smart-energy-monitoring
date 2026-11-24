import Link from 'next/link'
import { CircleAlert, TriangleAlert } from 'lucide-react'
import type { Alert } from '@/lib/alerts'

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  timeZone: 'Asia/Jakarta',
  dateStyle: 'medium',
  timeStyle: 'short',
}

export function AlertList({ alerts, onNavigate }: { alerts: Alert[]; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col divide-y">
      {alerts.map((alert) => {
        const critical = alert.severity === 'critical'
        const Icon = critical ? CircleAlert : TriangleAlert
        return (
          <li key={alert.id} className="flex gap-3 py-3">
            <Icon
              aria-hidden="true"
              className={`mt-0.5 size-4 shrink-0 ${critical ? 'text-destructive' : 'text-warning'}`}
            />
            <div className="min-w-0">
              <p className="font-medium text-foreground">
                <span className="sr-only">{critical ? 'Penting: ' : 'Perhatian: '}</span>
                {alert.title}
              </p>
              <p className="text-sm text-muted-foreground">{alert.detail}</p>
              <p className="text-xs text-muted-foreground">
                <Link
                  href={`/perangkat/${encodeURIComponent(alert.deviceId)}`}
                  onClick={onNavigate}
                  className="text-primary underline underline-offset-4"
                >
                  {alert.deviceId}
                </Link>
                {alert.storeCode && `, toko ${alert.storeCode}`}
                {alert.since !== null && `, data terakhir ${new Date(alert.since).toLocaleString('id-ID', DATE_OPTIONS)}`}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

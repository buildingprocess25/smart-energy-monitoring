import type { ManagedDevice } from '@/lib/types'
import { Badge } from '@/components/ui/badge'

export function DeviceBadges({ device }: { device: ManagedDevice }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant={device.online ? 'default' : 'secondary'}>{device.online ? 'Online' : 'Offline'}</Badge>
      <Badge variant="outline">{device.kind}</Badge>
      {device.capture?.active &&
        (device.capture.stalled ? <Badge variant="destructive">Rekaman macet</Badge> : <Badge>Merekam</Badge>)}
      {device.capture?.finalizing && <Badge variant="outline">Menutup rekaman</Badge>}
      {!device.capture && <Badge variant="destructive">Status rekaman tidak terbaca</Badge>}
    </div>
  )
}

function formatWib(epoch: number) {
  return new Date(epoch).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta', dateStyle: 'medium', timeStyle: 'short' })
}

export function CaptureFacts({ device }: { device: ManagedDevice }) {
  const { capture } = device
  if (!capture?.active) return null
  const facts = [
    ['Sesi', capture.sessionName ?? '-'],
    ['Mulai', capture.startedAt ?? '-'],
    ['Interval', capture.interval ? `${capture.interval} detik` : '-'],
    ['Record', capture.count.toLocaleString('id-ID')],
    ['Record terakhir', capture.lastRecordAt ? formatWib(capture.lastRecordAt) : '-'],
  ]
  return (
    <div className="flex flex-col gap-3">
      {capture.stalled && (
        <p role="alert" className="text-sm text-destructive">
          Tidak ada record baru
          {capture.lastRecordAt ? ` sejak ${formatWib(capture.lastRecordAt)}` : ''}. Hentikan rekaman ini, lalu mulai sesi
          baru.
        </p>
      )}
      <dl className="grid grid-cols-2 gap-3 text-sm">
      {facts.map(([label, value]) => (
        <div key={label} className="min-w-0">
          <dt className="text-xs text-muted-foreground">{label}</dt>
          <dd className="break-words font-medium tabular-nums">{value}</dd>
        </div>
      ))}
      </dl>
    </div>
  )
}

import { Badge } from '@/components/ui/badge'
import { StoreStatus } from '@/lib/types'

interface StatusBadgeProps {
  status: StoreStatus
  isRecording?: boolean
  recordingStalled?: boolean
  recordingSessionName?: string
  className?: string
}

export function StatusBadge({
  status,
  isRecording,
  recordingStalled,
  recordingSessionName,
  className,
}: StatusBadgeProps) {
  if (isRecording && recordingStalled) {
    return (
      <Badge variant="destructive" className={className} title={recordingSessionName}>
        Rekaman macet
      </Badge>
    )
  }
  if (isRecording) {
    return (
      <Badge className={className} title={recordingSessionName}>
        <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
        <span className="max-w-40 truncate">
          {recordingSessionName ? `Merekam: ${recordingSessionName}` : 'Sedang merekam'}
        </span>
      </Badge>
    )
  }
  if (status === 'live') return <Badge className={className}>Online</Badge>
  if (status === 'historical') {
    return <Badge variant="secondary" className={className}>Offline, ada riwayat</Badge>
  }
  return <Badge variant="outline" className={className}>Belum ada perangkat</Badge>
}

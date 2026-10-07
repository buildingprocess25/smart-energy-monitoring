import { Badge } from '@/components/ui/badge'
import { StoreStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: StoreStatus
  isRecording?: boolean
  recordingSessionName?: string
  className?: string
}

export function StatusBadge({ status, isRecording, recordingSessionName, className }: StatusBadgeProps) {
  if (isRecording) {
    return (
      <Badge
        variant="default"
        className={cn(
          'gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs font-semibold',
          className
        )}
      >
        <span className="size-1.5 animate-ping rounded-full bg-white" />
        {recordingSessionName ? `MEREKAM: ${recordingSessionName}` : 'SESI REKAMAN AKTIF'}
      </Badge>
    )
  }

  if (status === 'live') {
    return (
      <Badge
        variant="default"
        className={cn(
          'gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-xs font-semibold',
          className
        )}
      >
        <span className="size-1.5 rounded-full bg-white" />
        LIVE AUDIT
      </Badge>
    )
  }

  if (status === 'historical') {
    return (
      <Badge
        variant="default"
        className={cn(
          'bg-blue-500 hover:bg-blue-600 text-white shadow-sm',
          className
        )}
      >
        HISTORICAL AUDIT LOG
      </Badge>
    )
  }

  return (
    <Badge
      variant="secondary"
      className={cn(
        'bg-slate-400 hover:bg-slate-500 text-white shadow-sm',
        className
      )}
    >
      UNASSIGNED
    </Badge>
  )
}

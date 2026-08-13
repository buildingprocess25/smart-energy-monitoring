import { Badge } from '@/components/ui/badge'
import { StoreStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

interface StatusBadgeProps {
  status: StoreStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  if (status === 'live') {
    return (
      <Badge
        variant="default"
        className={cn(
          'gap-1.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-sm',
          className
        )}
      >
        <span className="size-1.5 animate-pulse rounded-full bg-white" />
        LIVE AUDIT IN PROGRESS
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

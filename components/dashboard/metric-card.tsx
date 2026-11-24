import type { ReactNode } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

// Same composition as AdminMetricCard in sparta-energy, without its decorative halo and watermark.
export function MetricCard({
  label,
  value,
  unit,
  icon: Icon,
  children,
}: {
  label: string
  value: ReactNode
  unit?: string
  icon: LucideIcon
  children?: ReactNode
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl tabular-nums">
          {value}
          {unit && <span className="ml-1 text-sm font-normal text-muted-foreground">{unit}</span>}
        </CardTitle>
        <CardAction>
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon aria-hidden="true" className="size-5" />
          </span>
        </CardAction>
      </CardHeader>
      {children && <CardContent className="mt-auto text-xs text-muted-foreground">{children}</CardContent>}
    </Card>
  )
}

import { cn } from '@/lib/utils'

interface CircularGaugeProps {
  value: number
  max: number
  unit: string
  label?: string
  color?: string
  size?: number
  strokeWidth?: number
  className?: string
}

export function CircularGauge({
  value,
  max,
  unit,
  label,
  color = '#10b981', // Default emerald-500
  size = 120,
  strokeWidth = 10,
  className,
}: CircularGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  
  // 270 degree sweep
  const arcLength = circumference * (270 / 360)
  const gapLength = circumference - arcLength
  
  const percentage = Math.min(Math.max(value / max, 0), 1)
  const strokeDashoffset = arcLength - percentage * arcLength

  return (
    <div
      className={cn('relative flex flex-col items-center', className)}
      style={{ width: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="transform"
        style={{ transform: 'rotate(135deg)' }}
      >
        <defs>
          <filter id={`glow-${color.replace('#', '')}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/30"
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeLinecap="round"
        />

        {/* Value Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={`${arcLength} ${gapLength}`}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          filter={`url(#glow-${color.replace('#', '')})`}
        />
      </svg>

      {/* Center Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
        <span className="text-xl font-bold tabular-nums tracking-tight">
          {Number.isInteger(value) ? value : value.toFixed(1)}
        </span>
        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
          {unit}
        </span>
      </div>

      {/* Optional Label below gauge */}
      {label && (
        <span className="mt-1 text-xs font-medium text-muted-foreground">
          {label}
        </span>
      )}
    </div>
  )
}

import Image from 'next/image'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
  compact?: boolean
}

export function Logo({ className, compact = false }: LogoProps) {
  if (compact) {
    return (
      <div className={cn('flex shrink-0 items-center gap-2', className)}>
        <Image
          src="/api/assets/Building-Logo.png"
          alt="Smart Energy Monitoring Logo"
          width={60}
          height={60}
          className="h-7 w-auto object-contain drop-shadow-sm"
          priority
        />
        <div className="flex flex-col leading-none text-foreground">
          <span className="text-sm font-bold tracking-wider">SMART</span>
          <span className="text-[10px] font-medium text-muted-foreground">
            Energy Monitoring
          </span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn('flex shrink-0 items-center gap-3', className)}>
      <div className="flex items-center gap-3 rounded-xl border border-border/40 bg-muted/40 px-3 py-1.5 backdrop-blur-sm md:gap-4 md:px-4 md:py-2">
        <Image
          src="/api/assets/Alfamart-Emblem.png"
          alt="Alfamart"
          width={120}
          height={120}
          className="h-6 w-auto object-contain drop-shadow-sm md:h-8"
          priority
        />

        <div className="h-4 w-px rounded-full bg-border md:h-5" />

        <div className="flex items-center gap-2">
          <Image
            src="/api/assets/Building-Logo.png"
            alt="Smart Energy Logo"
            width={60}
            height={60}
            className="h-6 w-auto object-contain drop-shadow-sm md:h-8"
            priority
          />
          <div className="flex flex-col leading-none text-foreground">
            <span className="text-sm font-bold tracking-wider">SMART</span>
            <span className="text-[10px] font-medium opacity-80">
              Energy Monitoring
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

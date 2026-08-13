import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { BreadcrumbNav } from './breadcrumb-nav'
import { ThemeToggle } from './theme-toggle'
import { Zap, ClipboardList } from 'lucide-react'

const SPARTA_AUDIT_URL = process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL ?? '#'
const REALTIME_METER_URL = process.env.NEXT_PUBLIC_REALTIME_METER_URL ?? '#'

export function AppHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <BreadcrumbNav />

      <div className="ml-auto flex items-center gap-2">
        {/* Live Status Badge */}
        <Badge
          variant="outline"
          className="hidden gap-1.5 border-emerald-500/30 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 sm:flex"
        >
          <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
          Server Live
        </Badge>

        {/* Realtime Meter Quick Link */}
        <a
          href={REALTIME_METER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-md border border-emerald-500/40 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:hover:bg-emerald-950/50 sm:flex"
        >
          <Zap className="size-3" />
          Realtime Meter ↗
        </a>

        {/* SPARTA Audit Quick Link */}
        <a
          href={SPARTA_AUDIT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800/50 sm:flex"
        >
          <ClipboardList className="size-3" />
          Sparta Audit ↗
        </a>

        <ThemeToggle />
      </div>
    </header>
  )
}

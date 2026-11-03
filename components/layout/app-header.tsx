import { ArrowLeft } from 'lucide-react'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { BreadcrumbNav } from './breadcrumb-nav'
import { ThemeToggle } from './theme-toggle'

export function AppHeader({ spartaHref }: { spartaHref: string | null }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 shadow-xs backdrop-blur-xl transition-all supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {spartaHref && (
          // The pseudo-element widens the hit area to 44px without changing the button size.
          <a
            href={spartaHref}
            className={cn(
              buttonVariants({ variant: 'outline' }),
              'relative after:absolute after:-inset-1.5'
            )}
          >
            <ArrowLeft aria-hidden="true" />
            <span className="max-sm:sr-only">Kembali ke SPARTA</span>
          </a>
        )}
        <ThemeToggle />
      </div>
    </header>
  )
}

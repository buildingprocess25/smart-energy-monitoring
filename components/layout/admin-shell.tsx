import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar'
import { AppHeader } from './app-header'
import type { ShellViewer, SpartaLinks } from './user-menu'

export function AdminShell({
  children,
  viewer,
  links,
}: {
  children: React.ReactNode
  viewer: ShellViewer
  links: SpartaLinks
}) {
  return (
    <SidebarProvider
      style={{ '--sidebar-width': '18rem', '--header-height': '3.5rem' } as React.CSSProperties}
    >
      <AppSidebar viewer={viewer} links={links} />
      <SidebarInset className="min-w-0">
        <AppHeader viewer={viewer} links={links} />
        <main className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

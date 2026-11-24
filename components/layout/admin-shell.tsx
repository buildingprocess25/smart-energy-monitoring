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
    <SidebarProvider>
      <AppSidebar viewer={viewer} links={links} />
      <SidebarInset>
        <AppHeader viewer={viewer} links={links} />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

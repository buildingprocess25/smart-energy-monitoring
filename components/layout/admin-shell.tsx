import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar, type SidebarViewer } from './app-sidebar'
import { AppHeader } from './app-header'
import { SPARTA_ENTRY_URL, canReturnToSparta } from '@/lib/sparta-url'

export function AdminShell({
  children,
  viewer,
}: {
  children: React.ReactNode
  viewer: SidebarViewer
}) {
  return (
    <SidebarProvider>
      <AppSidebar viewer={viewer} />
      <SidebarInset>
        <AppHeader spartaHref={canReturnToSparta(viewer.role) ? SPARTA_ENTRY_URL : null} />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar, type SidebarViewer } from './app-sidebar'
import { AppHeader } from './app-header'

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
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-4">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

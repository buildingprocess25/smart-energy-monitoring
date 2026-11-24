'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { AlertBell } from '@/components/alerts/alert-bell'
import { BreadcrumbNav } from './breadcrumb-nav'
import { ThemeToggle } from './theme-toggle'
import { initialsOf, UserMenuContent, type ShellViewer, type SpartaLinks } from './user-menu'

export function AppHeader({ viewer, links }: { viewer: ShellViewer; links: SpartaLinks }) {
  return (
    <header className="sticky top-0 z-30 flex h-(--header-height) shrink-0 items-center justify-between border-b border-border/60 bg-background px-4 lg:px-6 print:hidden">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <AlertBell />
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              // The pseudo-element widens the hit area to 44px without changing the button size.
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                aria-label="Profil"
                className="relative after:absolute after:-inset-1.5"
              />
            }
          >
            <Avatar size="sm">
              <AvatarFallback>{initialsOf(viewer.name)}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <UserMenuContent viewer={viewer} links={links} side="bottom" align="end" />
        </DropdownMenu>
      </div>
    </header>
  )
}

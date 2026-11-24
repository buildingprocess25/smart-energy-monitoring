'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { BreadcrumbNav } from './breadcrumb-nav'
import { ThemeToggle } from './theme-toggle'
import { initialsOf, UserMenuContent, type ShellViewer, type SpartaLinks } from './user-menu'

export function AppHeader({ viewer, links }: { viewer: ShellViewer; links: SpartaLinks }) {
  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border/60 bg-background/80 px-4 shadow-xs backdrop-blur-xl transition-all supports-[backdrop-filter]:bg-background/60">
      <div className="flex min-w-0 items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <BreadcrumbNav />
      </div>

      <div className="flex shrink-0 items-center gap-3">
        <ThemeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              // The pseudo-element widens the hit area to 44px without changing the button size.
              <Button
                type="button"
                variant="ghost"
                size="icon"
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

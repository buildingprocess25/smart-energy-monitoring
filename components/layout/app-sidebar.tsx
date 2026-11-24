'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, History, type LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'
import { initialsOf, UserMenuContent, type ShellViewer, type SpartaLinks } from './user-menu'

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  isActive: (pathname: string) => boolean
}

const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    isActive: (pathname) => pathname === '/',
  },
  {
    title: 'Monitoring Toko',
    href: '/monitoring',
    icon: Store,
    isActive: (pathname) => pathname.startsWith('/monitoring'),
  },
  {
    title: 'Sesi Rekaman',
    href: '/sesi-rekaman',
    icon: History,
    isActive: (pathname) => pathname.startsWith('/sesi-rekaman'),
  },
]

function NavItemButton({
  item,
  pathname,
}: {
  item: NavItem
  pathname: string
}) {
  const Icon = item.icon
  const active = item.isActive(pathname)

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={active}
        className={cn(
          'group/nav relative h-10 w-full px-3 font-medium transition-colors duration-200',
          'group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto',
          'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:text-emerald-950 dark:hover:text-emerald-100',
          active
            ? 'bg-emerald-500/12 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/30'
            : 'text-muted-foreground',
          active &&
            'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-emerald-600 dark:before:bg-emerald-400 before:shadow-[0_0_8px_rgba(16,185,129,0.7)] group-data-[collapsible=icon]:before:hidden'
        )}
        render={
          <Link href={item.href} className="flex size-full items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center">
            <Icon
              className={cn(
                'size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110',
                active
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-muted-foreground group-hover/nav:text-emerald-600 dark:group-hover/nav:text-emerald-400'
              )}
            />
            <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
          </Link>
        }
      />
    </SidebarMenuItem>
  )
}

export function AppSidebar({ viewer, links }: { viewer: ShellViewer; links: SpartaLinks }) {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="h-14 p-2 overflow-hidden flex items-center justify-center">
        <SidebarMenu className="w-full">
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Smart Energy Monitoring"
              className="h-10 w-full p-1.5 transition-colors duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15"
              render={
                <Link href="/" className="flex size-full items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center">
                  <div className="flex shrink-0 group-data-[collapsible=icon]:hidden">
                    <Logo className="scale-90 origin-left" />
                  </div>
                  <div className="hidden size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 p-1 ring-1 ring-emerald-500/20 group-data-[collapsible=icon]:flex">
                    <Image
                      src="/api/assets/Alfamart-Emblem.png"
                      alt="Alfamart"
                      width={60}
                      height={60}
                      className="size-6 object-contain drop-shadow-sm"
                      priority
                    />
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden p-2 gap-0">
        <SidebarMenu className="gap-1">
          {navItems.map((item) => (
            <NavItemButton key={item.href} item={item} pathname={pathname} />
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="h-14 p-2 overflow-hidden flex items-center justify-center">
        <SidebarMenu className="w-full">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={viewer.name}
                    className="h-10 w-full rounded-xl transition-colors duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:ring-1 hover:ring-emerald-500/20"
                  />
                }
              >
                <Avatar className="size-8 rounded-lg ring-1 ring-emerald-500/30">
                  <AvatarFallback className="rounded-lg bg-emerald-600 text-xs font-semibold text-white">
                    {initialsOf(viewer.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-foreground">
                    {viewer.name}
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    {viewer.email}
                  </span>
                </div>
              </DropdownMenuTrigger>
              <UserMenuContent viewer={viewer} links={links} side="top" align="start" />
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

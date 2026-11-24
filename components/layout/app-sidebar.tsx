'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Store, History, type LucideIcon } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
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
        render={
          <Link href={item.href} aria-current={active ? 'page' : undefined}>
            <Icon aria-hidden="true" className={cn(active && 'text-primary')} />
            <span>{item.title}</span>
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Smart Energy Monitoring"
              className="h-auto justify-center p-2 ring-1 ring-sidebar-border/70 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-0!"
              render={
                <Link href="/">
                  <div className="flex shrink-0 group-data-[collapsible=icon]:hidden">
                    <Logo className="scale-90 origin-left" />
                  </div>
                  <div className="hidden size-8 items-center justify-center group-data-[collapsible=icon]:flex">
                    <Image
                      src="/api/assets/Alfamart-Emblem.png"
                      alt="Alfamart"
                      width={60}
                      height={60}
                      className="size-6 object-contain"
                      priority
                    />
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <NavItemButton key={item.href} item={item} pathname={pathname} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip={viewer.name}
                    className="ring-1 ring-sidebar-border/60 group-data-[collapsible=icon]:mx-auto group-data-[collapsible=icon]:justify-center"
                  />
                }
              >
                <Avatar>
                  <AvatarFallback>{initialsOf(viewer.name)}</AvatarFallback>
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

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Zap,
  ClipboardList,
  ExternalLink,
  type LucideIcon,
} from 'lucide-react'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo } from '@/components/logo'
import { cn } from '@/lib/utils'

const SPARTA_AUDIT_URL = process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL ?? '#'
const REALTIME_METER_URL = process.env.NEXT_PUBLIC_REALTIME_METER_URL ?? '#'

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  badge?: string
  external?: boolean
  isActive?: (pathname: string) => boolean
}

const navGroups: { label?: string; items: NavItem[] }[] = [
  {
    items: [
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
    ],
  },
  {
    label: 'Integrasi Ekosistem',
    items: [
      {
        title: 'Smart Energy Meter',
        href: REALTIME_METER_URL,
        icon: Zap,
        badge: 'Live',
        external: true,
      },
      {
        title: 'SPARTA Energy',
        href: SPARTA_AUDIT_URL,
        icon: ClipboardList,
        external: true,
      },
    ],
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
  const active = item.isActive ? item.isActive(pathname) : false

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={active}
        className={cn(
          'group/nav relative h-10 w-full px-3 font-medium transition-colors duration-200',
          'group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto',
          // Modern hover micro-interaction
          'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:text-emerald-950 dark:hover:text-emerald-100',
          // Active state styling: distinct pill & indicator
          active
            ? 'bg-emerald-500/12 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/30'
            : 'text-muted-foreground',
          // Active glowing left accent bar (only visible when expanded)
          active &&
            'before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:rounded-r-full before:bg-emerald-600 dark:before:bg-emerald-400 before:shadow-[0_0_8px_rgba(16,185,129,0.7)] group-data-[collapsible=icon]:before:hidden'
        )}
        render={
          item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex size-full items-center gap-2.5 overflow-hidden group-data-[collapsible=icon]:justify-center"
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110',
                  active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground group-hover/nav:text-emerald-600 dark:group-hover/nav:text-emerald-400'
                )}
              />
              <span className="truncate group-data-[collapsible=icon]:hidden">{item.title}</span>
              {item.badge && (
                <span className="ml-auto shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 group-data-[collapsible=icon]:hidden">
                  {item.badge}
                </span>
              )}
              <ExternalLink className="ml-auto size-3 shrink-0 opacity-40 transition-opacity group-hover/nav:opacity-90 group-data-[collapsible=icon]:hidden" />
            </a>
          ) : (
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
              {item.badge && (
                <span className="ml-auto shrink-0 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300 group-data-[collapsible=icon]:hidden">
                  {item.badge}
                </span>
              )}
            </Link>
          )
        }
      />
    </SidebarMenuItem>
  )
}

export function AppSidebar() {
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
        {navGroups.map((group, groupIdx) => (
          <div key={groupIdx} className="flex flex-col">
            {group.label && (
              <div className="h-8 flex items-center shrink-0">
                <span className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 group-data-[collapsible=icon]:hidden">
                  {group.label}
                </span>
                <div className="hidden w-full items-center justify-center group-data-[collapsible=icon]:flex">
                  <div className="h-px w-6 bg-sidebar-border" />
                </div>
              </div>
            )}
            <SidebarMenu className="gap-1">
              {group.items.map((item) => (
                <NavItemButton
                  key={item.title}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </div>
        ))}
      </SidebarContent>

      <SidebarFooter className="h-14 p-2 overflow-hidden flex items-center justify-center">
        <SidebarMenu className="w-full">
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    tooltip="Admin SPARTA"
                    className="h-10 w-full rounded-xl transition-colors duration-200 group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:mx-auto hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:ring-1 hover:ring-emerald-500/20"
                  />
                }
              >
                <div className="relative shrink-0">
                  <Avatar className="size-8 rounded-lg ring-1 ring-emerald-500/30">
                    <AvatarFallback className="rounded-lg bg-emerald-600 text-xs font-semibold text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                  <span className="truncate font-semibold text-foreground">
                    Admin SPARTA
                  </span>
                  <span className="truncate text-xs text-muted-foreground">
                    admin@sparta.id
                  </span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="start" className="w-56">
                <DropdownMenuItem>Profil</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}

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
  SidebarGroup,
  SidebarGroupLabel,
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
          'group/nav relative h-9.5 px-3 font-medium transition-all duration-200 ease-out',
          // Modern hover micro-interaction
          'hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:text-emerald-950 dark:hover:text-emerald-100 hover:translate-x-0.5',
          // Subtle gradient backdrop on hover
          'after:pointer-events-none after:absolute after:inset-0 after:rounded-md after:bg-linear-to-r after:from-emerald-500/10 after:via-emerald-500/5 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity',
          // Active state styling: distinct pill & indicator
          active
            ? 'bg-emerald-500/12 text-emerald-950 font-semibold shadow-xs ring-1 ring-emerald-500/25 dark:bg-emerald-500/20 dark:text-emerald-200 dark:ring-emerald-400/30'
            : 'text-muted-foreground',
          // Active glowing left accent bar
          active &&
            'before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-1 before:rounded-r-full before:bg-emerald-600 dark:before:bg-emerald-400 before:shadow-[0_0_8px_rgba(16,185,129,0.7)]'
        )}
        render={
          item.external ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center gap-2.5"
            >
              <Icon
                className={cn(
                  'size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110',
                  active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground group-hover/nav:text-emerald-600 dark:group-hover/nav:text-emerald-400'
                )}
              />
              <span className="truncate">{item.title}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300">
                  {item.badge}
                </span>
              )}
              <ExternalLink className="ml-auto size-3 opacity-40 transition-opacity group-hover/nav:opacity-90" />
            </a>
          ) : (
            <Link href={item.href} className="flex w-full items-center gap-2.5">
              <Icon
                className={cn(
                  'size-4 shrink-0 transition-transform duration-200 group-hover/nav:scale-110',
                  active
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-muted-foreground group-hover/nav:text-emerald-600 dark:group-hover/nav:text-emerald-400'
                )}
              />
              <span className="truncate">{item.title}</span>
              {item.badge && (
                <span className="ml-auto rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-500/25 dark:text-emerald-300">
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
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              tooltip="Smart Energy Monitoring"
              className="h-auto p-1.5 transition-all duration-200 group-data-[collapsible=icon]:p-0 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15"
              render={
                <Link href="/" className="flex items-center gap-2">
                  <Logo className="scale-95 origin-left group-data-[collapsible=icon]:hidden" />
                  <div className="hidden size-8 items-center justify-center rounded-lg bg-muted/40 p-1 ring-1 ring-border/50 group-data-[collapsible=icon]:flex">
                    <Image
                      src="/api/assets/Building-Logo.png"
                      alt="Smart Energy Logo"
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

      <SidebarContent>
        {navGroups.map((group, groupIdx) => (
          <SidebarGroup key={groupIdx}>
            {group.label && (
              <SidebarGroupLabel className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 group-data-[collapsible=icon]:opacity-0">
                {group.label}
              </SidebarGroupLabel>
            )}
            <SidebarMenu>
              {group.items.map((item) => (
                <NavItemButton
                  key={item.title}
                  item={item}
                  pathname={pathname}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="h-12 rounded-xl transition-all duration-200 hover:bg-emerald-500/10 dark:hover:bg-emerald-500/15 hover:ring-1 hover:ring-emerald-500/20"
                  />
                }
              >
                <div className="relative">
                  <Avatar className="size-8 rounded-lg ring-1 ring-emerald-500/30">
                    <AvatarFallback className="rounded-lg bg-emerald-600 text-xs font-semibold text-white">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
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

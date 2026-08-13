import Link from 'next/link'
import {
  LayoutDashboard,
  Store,
  Zap,
  BarChart3,
  Cpu,
  MapPin,
  ClipboardList,
  ExternalLink,
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

const SPARTA_AUDIT_URL = process.env.NEXT_PUBLIC_SPARTA_AUDIT_URL ?? '#'
const REALTIME_METER_URL = process.env.NEXT_PUBLIC_REALTIME_METER_URL ?? '#'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
                    <Zap className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      SPARTA Monitoring
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      Smart Energy
                    </span>
                  </div>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Overview */}
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Overview Toko"
                render={
                  <Link href="/">
                    <LayoutDashboard />
                    <span>Overview Toko</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Monitoring */}
        <SidebarGroup>
          <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Monitoring Toko"
                render={
                  <Link href="/">
                    <Store />
                    <span>Monitoring Toko</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Sesi Audit IoT"
                render={
                  <Link href="#">
                    <Zap />
                    <span>Sesi Audit IoT</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Analitik Telemetri"
                render={
                  <Link href="#">
                    <BarChart3 />
                    <span>Analitik Telemetri</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Hardware */}
        <SidebarGroup>
          <SidebarGroupLabel>Hardware &amp; Perangkat</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Realtime Meter"
                render={
                  <a
                    href={REALTIME_METER_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Zap className="text-emerald-500" />
                    <span>Realtime Meter ↗</span>
                  </a>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Perangkat IoT"
                render={
                  <Link href="#">
                    <Cpu />
                    <span>Perangkat IoT</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Pemetaan Lokasi"
                render={
                  <Link href="#">
                    <MapPin />
                    <span>Pemetaan Lokasi</span>
                  </Link>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        {/* Ekosistem */}
        <SidebarGroup>
          <SidebarGroupLabel>Ekosistem SPARTA</SidebarGroupLabel>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="SPARTA Audit"
                render={
                  <a
                    href={SPARTA_AUDIT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ClipboardList />
                    <span>SPARTA Audit ↗</span>
                    <ExternalLink className="ml-auto size-3 opacity-50" />
                  </a>
                }
              />
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger render={<SidebarMenuButton size="lg" />}>
                <Avatar className="size-8 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-emerald-600 text-white text-xs">
                    AD
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Admin SPARTA</span>
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

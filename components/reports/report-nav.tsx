'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export function ReportNav({ canManage }: { canManage: boolean }) {
  const pathname = usePathname()
  const items = [
    { href: '/laporan', label: 'Laporan cepat' },
    { href: '/laporan/excel', label: 'Excel kustom' },
    ...(canManage ? [{ href: '/laporan/email', label: 'Pengaturan email' }] : []),
  ]
  return (
    <nav aria-label="Laporan" className="-mx-4 overflow-x-auto border-b px-4 md:-mx-6 md:px-6 print:hidden">
      <ul className="flex gap-6">
        {items.map((item) => {
          const active = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex h-11 items-center border-b-2 text-sm whitespace-nowrap outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
                  active ? 'border-primary font-semibold text-foreground' : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

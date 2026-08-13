'use client'

import { usePathname } from 'next/navigation'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import React from 'react'

const ROUTE_LABELS: Record<string, string> = {
  monitoring: 'Monitoring Toko',
}

export function BreadcrumbNav() {
  const pathname = usePathname()
  const segments = pathname.split('/').filter(Boolean)

  const finalCrumbs =
    segments.length === 0
      ? [{ label: 'Dashboard', href: '/', isLast: true }]
      : [
          { label: 'Dashboard', href: '/', isLast: false },
          ...segments.map((seg, i) => ({
            label:
              ROUTE_LABELS[seg] ??
              seg
                .replace(/-/g, ' ')
                .replace(/\b\w/g, (c) => c.toUpperCase()),
            href: '/' + segments.slice(0, i + 1).join('/'),
            isLast: i === segments.length - 1,
          })),
        ]

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {finalCrumbs.map((crumb, i) => (
          <React.Fragment key={crumb.href}>
            {i > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {crumb.isLast ? (
                <BreadcrumbPage className="capitalize">
                  {crumb.label}
                </BreadcrumbPage>
              ) : (
                <BreadcrumbLink href={crumb.href} className="capitalize">
                  {crumb.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  )
}

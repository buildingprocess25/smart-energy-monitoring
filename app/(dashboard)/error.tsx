'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DashboardError({ error, retry }: { error: Error; retry: () => void }) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <Card role="alert" className="max-w-lg">
      <CardHeader>
        <CardTitle>Halaman gagal dimuat</CardTitle>
        <CardDescription>
          Data toko atau perangkat tidak bisa diambil. Coba muat lagi. Kalau masih gagal, hubungi admin SPARTA.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button onClick={() => retry()}>Muat Lagi</Button>
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, Suspense, useEffect } from "react"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { FilterOptions } from "@/lib/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import useSWR from "swr"

const fetcher = (url: string) => fetch(url).then(res => res.json())

// Hook useMediaQuery
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(query)
    if (media.matches !== matches) {
      setMatches(media.matches)
    }
    const listener = () => setMatches(media.matches)
    media.addListener(listener)
    return () => media.removeListener(listener)
  }, [matches, query])

  return matches
}

// Componente para mostrar pedidos recientes con enlaces y estados visuales
function RecentOrders({ period }: { period: string }) {
  const { data: orders, isLoading } = useSWR(`/api/admin/dashboard/orders?period=${period}&limit=5`, fetcher)
  if (isLoading) return <Skeleton className="h-[180px] w-full rounded-xl" />
  if (!orders || !orders.length) {
    return <div className="text-muted-foreground">No hay pedidos recientes.</div>
  }
  return (
    <div className="space-y-4">
      {orders.map((order: any) => (
        <Link href={`/admin/pedidos/${order.id}`} key={order.id} className="block">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors">
            <div className="space-y-1 min-w-0">
              <p className="font-medium truncate">{order.customer || order.userId || 'Sin cliente'}</p>
              <p className="text-sm text-muted-foreground truncate">
                {new Date(order.createdAt).toLocaleDateString()} - <span className="font-mono">{order.orderNumber}</span>
              </p>
            </div>
            <Badge variant={order.status === 'COMPLETED' ? 'default' : order.status === 'PROCESSING' ? 'secondary' : 'outline'}>
              {order.status === 'COMPLETED' ? 'Completado' :
                order.status === 'PROCESSING' ? 'Procesando' : order.status === 'CANCELLED' ? 'Cancelado' : 'Pendiente'}
            </Badge>
            <div className="font-medium whitespace-nowrap">${order.total?.toFixed(2)}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}

function TopProductsChart({ period }: { period: string }) {
  const { data: topProducts, isLoading } = useSWR(`/api/admin/dashboard/top-products?period=${period}&limit=5`, fetcher)
  if (isLoading) return <Skeleton className="h-[180px] w-full rounded-xl" />
  if (!topProducts || !topProducts.length) {
    return <div className="text-muted-foreground">No hay ventas en este período.</div>
  }
  return (
    <div className="w-full space-y-4">
      {topProducts.map((product: any) => (
        <Link href={`/admin/productos/${product.id}`} key={product.id} className="block">
          <div className="w-full border rounded-lg p-4 hover:bg-accent transition-colors">
            <div className="flex justify-between items-center w-full">
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{product.name}</p>
                <p className="text-sm text-muted-foreground truncate">
                  ${Number(product.revenue).toFixed(2)} en total
                </p>
              </div>
              <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 whitespace-nowrap">
                {product.sales} ventas
              </Badge>
            </div>
          </div>
        </Link>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    period: "year",
  })
  const { data: statsData, isLoading: statsLoading } = useSWR(`/api/admin/dashboard/stats?period=${filterOptions.period}`, fetcher)

  // Manejar cambio de periodo
  const handlePeriodChange = (value: string) => {
    setFilterOptions({
      ...filterOptions,
      period: value as "day" | "week" | "month" | "year",
    })
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="w-full sm:w-64">
          <Select value={filterOptions.period} onValueChange={handlePeriodChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Hoy</SelectItem>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Suspense fallback={<div className="grid gap-4 md:grid-cols-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}</div>}>
        {statsLoading || !statsData ? (
          <div className="grid gap-4 md:grid-cols-3">{Array(3).fill(0).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-xl" />)}</div>
        ) : (
          <StatsCards data={statsData} />
        )}
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Productos más vendidos</CardTitle>
          <CardDescription>
            Top productos por volumen de ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopProductsChart period={filterOptions.period ?? "year"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos recientes</CardTitle>
          <CardDescription>
            Los últimos 5 pedidos realizados en la tienda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <RecentOrders period={filterOptions.period ?? "year"} />
        </CardContent>
      </Card>
    </div>
  )
}

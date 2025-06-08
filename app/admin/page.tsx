"use client"

import { useState, Suspense, useEffect } from "react"
import { StatsCards } from "@/components/admin/stats-cards"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { FilterOptions } from "@/lib/types"
import { filterSalesData, getFilteredStats, orders } from "@/lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

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

// Componente para mostrar pedidos recientes
function RecentOrders({ orders }: { orders: any[] }) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
          <div className="space-y-1">
            <p className="font-medium">{order.customer}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString()}
            </p>
          </div>
          <Badge variant={order.status === 'completed' ? 'default' : 'secondary'}>
            {order.status === 'completed' ? 'Completado' : 
             order.status === 'processing' ? 'Procesando' : 'Pendiente'}
          </Badge>
          <div className="font-medium">${order.total.toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}

// Componente para los productos más vendidos - Versión simplificada
function TopProductsChart() {
  // Datos de ejemplo para productos más vendidos
  const topProducts = [
    { name: "Taladro Percutor 750W", sales: 45, revenue: 4049.55 },
    { name: "Set Destornilladores", sales: 32, revenue: 799.68 },
    { name: "Pintura Blanco Mate", sales: 28, revenue: 1119.72 },
    { name: "Martillo Carpintero", sales: 25, revenue: 499.75 },
    { name: "Cable Eléctrico 3x2.5mm", sales: 18, revenue: 539.82 },
  ]

  return (
    <div className="w-full space-y-4">
      {topProducts.map((product, index) => (
        <div key={index} className="w-full border rounded-lg p-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{product.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                ${product.revenue.toFixed(2)} en total
              </p>
            </div>
            <Badge variant="outline" className="ml-2 bg-green-100 text-green-800 whitespace-nowrap">
              {product.sales} ventas
            </Badge>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({
    period: "year",
  })

  const statsData = getFilteredStats(filterOptions.period)

  // Obtener los 5 pedidos más recientes
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map((order) => ({
      id: order.id,
      customer: order.customer,
      createdAt: order.date,
      status: order.status,
      paymentStatus: "pending",
      total: order.total,
    }))

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
        <StatsCards data={statsData} />
      </Suspense>

      <Card>
        <CardHeader>
          <CardTitle>Productos más vendidos</CardTitle>
          <CardDescription>
            Top productos por volumen de ventas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <TopProductsChart />
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
          <RecentOrders orders={recentOrders} />
        </CardContent>
      </Card>
    </div>
  )
}

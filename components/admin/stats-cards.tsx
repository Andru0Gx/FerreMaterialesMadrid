"use client"

import { DollarSign, ShoppingCart, CreditCard, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatsData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  data: StatsData
}

export function StatsCards({ data }: StatsCardsProps) {
  // Datos de ejemplo para comparación con período anterior
  const comparisons = {
    sales: 20.1,
    orders: 15.0,
    average: 5.2,
    pending: -3.0,
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalSales.toLocaleString()}</div>
          <p
            className={cn(
              "text-xs flex items-center gap-1",
              comparisons.sales >= 0 ? "text-emerald-500" : "text-red-500",
            )}
          >
            <span className="text-sm">{comparisons.sales >= 0 ? "↑" : "↓"}</span>
            {Math.abs(comparisons.sales)}% respecto al período anterior
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-blue-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle>
          <ShoppingCart className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalOrders}</div>
          <p
            className={cn(
              "text-xs flex items-center gap-1",
              comparisons.orders >= 0 ? "text-emerald-500" : "text-red-500",
            )}
          >
            <span className="text-sm">{comparisons.orders >= 0 ? "↑" : "↓"}</span>
            {Math.abs(comparisons.orders)}% respecto al período anterior
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
          <CreditCard className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.averageOrderValue.toFixed(2)}</div>
          <p
            className={cn(
              "text-xs flex items-center gap-1",
              comparisons.average >= 0 ? "text-emerald-500" : "text-red-500",
            )}
          >
            <span className="text-sm">{comparisons.average >= 0 ? "↑" : "↓"}</span>
            {Math.abs(comparisons.average)}% respecto al período anterior
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.pendingOrders}</div>
          <p
            className={cn(
              "text-xs flex items-center gap-1",
              comparisons.pending >= 0 ? "text-red-500" : "text-emerald-500",
            )}
          >
            <span className="text-sm">{comparisons.pending >= 0 ? "↑" : "↓"}</span>
            {Math.abs(comparisons.pending)}% respecto al período anterior
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

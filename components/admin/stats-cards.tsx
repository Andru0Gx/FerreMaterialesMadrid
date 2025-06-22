"use client"

import { DollarSign, ShoppingCart, CreditCard, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { StatsData } from "@/lib/types"
import { cn } from "@/lib/utils"

interface StatsCardsProps {
  data: StatsData
}

export function StatsCards({ data }: StatsCardsProps) {
  // Comparaciones reales respecto al mes anterior
  const getPercent = (current: number, prev: number) => {
    if (prev === 0) return current === 0 ? 0 : 100;
    return ((current - prev) / prev) * 100;
  };

  const salesPercent = getPercent(data.totalSales, data.prevMonth?.totalSales ?? 0);
  const ordersPercent = getPercent(data.totalOrders, data.prevMonth?.totalOrders ?? 0);
  const avgPercent = getPercent(data.averageOrderValue, data.prevMonth?.averageOrderValue ?? 0);
  const pendingPercent = getPercent(data.pendingOrders, data.prevMonth?.pendingOrders ?? 0);

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="border-l-4 border-l-emerald-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Ventas Totales</CardTitle>
          <DollarSign className="h-4 w-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">${data.totalSales.toLocaleString()}</div>
          <p className={cn("text-xs flex items-center gap-1", salesPercent >= 0 ? "text-emerald-500" : "text-red-500")}>
            <span className="text-sm">{salesPercent >= 0 ? "↑" : "↓"}</span>
            {Math.abs(salesPercent).toFixed(1)}% respecto al mes anterior
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
          <p className={cn("text-xs flex items-center gap-1", ordersPercent >= 0 ? "text-emerald-500" : "text-red-500")}>
            <span className="text-sm">{ordersPercent >= 0 ? "↑" : "↓"}</span>
            {Math.abs(ordersPercent).toFixed(1)}% respecto al mes anterior
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-purple-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Valor Promedio</CardTitle>
          <CreditCard className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{typeof data.averageOrderValue === 'number' && !isNaN(data.averageOrderValue) ? `$${data.averageOrderValue.toFixed(2)}` : '$0.00'}</div>
          <p className={cn("text-xs flex items-center gap-1", avgPercent >= 0 ? "text-emerald-500" : "text-red-500")}>
            <span className="text-sm">{avgPercent >= 0 ? "↑" : "↓"}</span>
            {Math.abs(avgPercent).toFixed(1)}% respecto al mes anterior
          </p>
        </CardContent>
      </Card>
      <Card className="border-l-4 border-l-amber-500">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pedidos Pendientes</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.pendingOrders ?? 0}</div>
          <p className={cn("text-xs flex items-center gap-1", pendingPercent >= 0 ? "text-emerald-500" : "text-red-500")}>
            <span className="text-sm">{pendingPercent >= 0 ? "↑" : "↓"}</span>
            {Math.abs(pendingPercent).toFixed(1)}% respecto al mes anterior
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

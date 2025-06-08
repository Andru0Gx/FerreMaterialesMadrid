"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface RecentOrdersProps {
  orders: Order[]
}

export function RecentOrders({ orders }: RecentOrdersProps) {
  const getStatusColor = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "processing":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80"
      case "shipped":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80"
      case "delivered":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "cancelled":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  const getStatusText = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "processing":
        return "Procesando"
      case "shipped":
        return "Enviado"
      case "delivered":
        return "Entregado"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  const getPaymentStatusColor = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80"
      case "paid":
        return "bg-green-100 text-green-800 hover:bg-green-100/80"
      case "failed":
        return "bg-red-100 text-red-800 hover:bg-red-100/80"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80"
    }
  }

  const getPaymentStatusText = (status: Order["paymentStatus"]) => {
    switch (status) {
      case "pending":
        return "Pendiente"
      case "paid":
        return "Pagado"
      case "failed":
        return "Fallido"
      default:
        return status
    }
  }

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Pedidos Recientes</CardTitle>
        <CardDescription>Los últimos {orders.length} pedidos realizados en la tienda</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pedido</TableHead>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Pago</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">#{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{format(new Date(order.createdAt), "dd MMM yyyy", { locale: es })}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={getStatusColor(order.status)}>
                    {getStatusText(order.status)}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={getPaymentStatusColor(order.paymentStatus)}>
                    {getPaymentStatusText(order.paymentStatus)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">${order.total.toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

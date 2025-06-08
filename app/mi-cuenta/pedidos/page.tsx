"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Package, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// Datos de ejemplo para pedidos del cliente
const clientOrders = [
  {
    id: "ORD-001",
    date: "2023-05-07",
    status: "completed",
    statusText: "Completado",
    paymentStatus: "paid",
    paymentStatusText: "Pagado",
    total: 250.99,
    items: 3,
  },
  {
    id: "ORD-002",
    date: "2023-06-15",
    status: "processing",
    statusText: "En proceso",
    paymentStatus: "paid",
    paymentStatusText: "Pagado",
    total: 120.5,
    items: 2,
  },
  {
    id: "ORD-003",
    date: "2023-07-22",
    status: "pending",
    statusText: "Pendiente",
    paymentStatus: "pending",
    paymentStatusText: "Pendiente",
    total: 350.75,
    items: 5,
  },
  {
    id: "ORD-004",
    date: "2023-08-10",
    status: "shipped",
    statusText: "Enviado",
    paymentStatus: "paid",
    paymentStatusText: "Pagado",
    total: 180.25,
    items: 1,
  },
  {
    id: "ORD-005",
    date: "2023-09-05",
    status: "cancelled",
    statusText: "Cancelado",
    paymentStatus: "refunded",
    paymentStatusText: "Reembolsado",
    total: 420.0,
    items: 4,
  },
]

export default function PedidosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // Si no hay usuario, redirigir al login
  if (!user) {
    router.push("/login?redirect=/mi-cuenta/pedidos")
    return null
  }

  // Filtrar pedidos según búsqueda y filtro de estado
  const filteredOrders = clientOrders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        (order.status === "pending" || order.status === "processing" || order.status === "shipped")) ||
      order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Función para obtener el color de badge según el estado
  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
      case "shipped":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Función para obtener el color de badge según el estado de pago
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "refunded":
        return "bg-purple-100 text-purple-800"
      case "failed":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "d 'de' MMMM, yyyy", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Mis Pedidos</h1>
        <p className="text-gray-500">Consulta el estado y detalles de todos tus pedidos</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por número de pedido..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los pedidos</SelectItem>
            <SelectItem value="active">Pedidos activos</SelectItem>
            <SelectItem value="completed">Completados</SelectItem>
            <SelectItem value="processing">En proceso</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="shipped">Enviados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="border-b p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-lg">{order.id}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {order.statusText}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {order.paymentStatusText}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{order.items} productos</span>
                    </div>
                    <p className="font-medium mt-1">{order.total.toFixed(2)} €</p>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/mi-cuenta/pedidos/${order.id}`}>
                      Ver detalles
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <Package className="h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No se encontraron pedidos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || statusFilter !== "all"
                ? "No hay pedidos que coincidan con tu búsqueda. Intenta con otros criterios."
                : "Cuando realices una compra, tus pedidos aparecerán aquí."}
            </p>
            <Button className="mt-4 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90">
              <Link href="/productos">Ir a comprar</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

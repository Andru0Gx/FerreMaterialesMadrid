"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Package, ChevronRight, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useExchangeRate } from "@/hooks/use-exchange-rate"

export default function PedidosPage() {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  // Define a type for Order que coincida con el schema de Prisma
  type Order = {
    id: string
    orderNumber: string
    createdAt: string
    updatedAt: string
    userId: string
    status: string
    paymentStatus: string
    total: number
    subtotal?: number | null
    discountAmount?: number | null
    taxAmount?: number | null
    shippingAmount?: number | null
    itemsCount: number
    paymentMethod?: string | null
    paymentBank?: string | null
    paymentReference?: string | null
    shippingAddressId?: string | null
    phone?: string | null
    email?: string | null
    notes?: string | null
    discountCode?: string | null
    isInStore?: boolean | null
    nombre?: string | null
    statusText?: string
    paymentStatusText?: string
    items: any[]
    shippingAddress?: any
    user?: any
    // Puedes agregar más campos según tu schema
  }
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const { rate: exchangeRate, loading: rateLoading, error: rateError } = useExchangeRate()

  // Si no hay usuario, redirigir al login
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/mi-cuenta/pedidos")
    }
  }, [user, router])

  // Fetch pedidos del usuario autenticado
  useEffect(() => {
    if (!user?.id) return
    setLoading(true)
    setError("")
    fetch(`/api/orders?userId=${encodeURIComponent(user.id)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("No se pudieron obtener los pedidos")
        const data = await res.json()
        // Ahora el backend ya filtra por userId, así que solo asignamos el array
        setOrders(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        setError(err.message || "Error al cargar pedidos")
        setOrders([])
      })
      .finally(() => setLoading(false))
  }, [user?.id])

  // Filtrar pedidos según búsqueda y filtro de estado
  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        (order.status === "pending" || order.status === "processing" || order.status === "shipped")) ||
      order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  // Traducción de estados y colores para badges (como en admin/pedidos)
  const translateOrderStatus = (status: string): string => {
    const translations: Record<string, string> = {
      PENDING: "Pendiente",
      PROCESSING: "Procesando",
      SHIPPED: "Enviado",
      CANCELLED: "Cancelado",
      COMPLETED: "Completado",
      DELIVERED: "Entregado",
      completed: "Completado",
      processing: "Procesando",
      shipped: "Enviado",
      cancelled: "Cancelado",
      pending: "Pendiente",
      delivered: "Entregado",
    }
    return translations[status] || status
  }
  const translatePaymentStatus = (status: string): string => {
    const translations: Record<string, string> = {
      PENDING: "Pendiente",
      PAID: "Aprobado",
      FAILED: "Fallido",
      paid: "Aprobado",
      pending: "Pendiente",
      failed: "Fallido",
      refunded: "Reembolsado",
      REFUNDED: "Reembolsado",
    }
    return translations[status] || status
  }
  const getStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "COMPLETED": return "bg-green-100 text-green-800"
      case "PROCESSING": return "bg-blue-100 text-blue-800"
      case "SHIPPED": return "bg-cyan-100 text-cyan-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "CANCELLED": return "bg-red-100 text-red-800"
      case "DELIVERED": return "bg-green-200 text-green-900"
      default: return "bg-gray-100 text-gray-800"
    }
  }
  const getPaymentStatusColor = (status: string): string => {
    switch (status.toUpperCase()) {
      case "PAID": return "bg-green-100 text-green-800"
      case "PENDING": return "bg-yellow-100 text-yellow-800"
      case "FAILED": return "bg-red-100 text-red-800"
      case "REFUNDED": return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString)
      return format(date, "d 'de' MMMM, yyyy", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  if (!user) return null

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

      {loading ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-gray-500">Cargando pedidos...</span>
          </CardContent>
        </Card>
      ) : error ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <span className="text-red-500">{error}</span>
          </CardContent>
        </Card>
      ) : filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="border-b p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="font-medium text-lg">{order.orderNumber}</p>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(order.status)}`}
                      >
                        {translateOrderStatus(order.status)}
                      </span>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}
                      >
                        {translatePaymentStatus(order.paymentStatus)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-500">{order.itemsCount} productos</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Subtotal: {order.subtotal?.toLocaleString("es-MX", { style: "currency", currency: "USD" }) || "-"}
                      {order.discountAmount && order.discountAmount > 0 && (
                        <span className="block text-green-600">Descuento: -{order.discountAmount.toLocaleString("es-MX", { style: "currency", currency: "USD" })}</span>
                      )}
                      <span className="block">IVA: {order.taxAmount?.toLocaleString("es-MX", { style: "currency", currency: "USD" }) || "-"}</span>
                      <span className="block">Envío: {order.shippingAmount === 0 ? "Gratis" : order.shippingAmount?.toLocaleString("es-MX", { style: "currency", currency: "USD" })}</span>
                    </div>
                    <p className="font-medium mt-1">
                      {order.total.toLocaleString("es-MX", { style: "currency", currency: "USD" })}
                      {exchangeRate && !rateLoading && (
                        <span className="block text-sm text-gray-500">
                          {`≈ ${(order.total * exchangeRate).toLocaleString("es-VE", { style: "currency", currency: "VES" })} (Bs)`}
                        </span>
                      )}
                    </p>
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

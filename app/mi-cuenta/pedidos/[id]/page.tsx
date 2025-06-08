"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { ChevronLeft, CreditCard, MapPin, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

// Datos de ejemplo para detalles de pedido
const orderDetails = {
  id: "ORD-001",
  date: "2023-05-07",
  status: "completed",
  statusText: "Completado",
  paymentStatus: "paid",
  paymentStatusText: "Pagado",
  total: 250.99,
  subtotal: 229.97,
  shipping: 4.99,
  tax: 16.03,
  items: [
    {
      id: "ITEM-001",
      name: "Taladro Percutor Profesional 750W",
      price: 89.99,
      quantity: 1,
      image: "/placeholder.svg?height=80&width=80&text=Taladro",
    },
    {
      id: "ITEM-002",
      name: "Martillo de Carpintero con Mango de Fibra",
      price: 19.99,
      quantity: 2,
      image: "/placeholder.svg?height=80&width=80&text=Martillo",
    },
  ],
  shippingAddress: {
    name: "Casa",
    address: "Calle Principal 123",
    city: "Madrid",
    state: "Madrid",
    zip: "28001",
  },
  paymentMethod: "Tarjeta de crédito/débito",
  notes: "Entregar en horario de tarde",
  statusHistory: [
    {
      status: "pending",
      statusText: "Pendiente",
      date: "2023-05-05T10:30:00",
      description: "Pedido recibido y en espera de confirmación",
    },
    {
      status: "processing",
      statusText: "En proceso",
      date: "2023-05-06T09:15:00",
      description: "Pedido confirmado y en preparación",
    },
    {
      status: "paid",
      statusText: "Pagado",
      date: "2023-05-06T14:30:00",
      description: "Pago procesado correctamente",
    },
    {
      status: "shipped",
      statusText: "Enviado",
      date: "2023-05-06T16:45:00",
      description: "Pedido despachado para entrega",
    },
    {
      status: "completed",
      statusText: "Completado",
      date: "2023-05-07T14:20:00",
      description: "Pedido entregado exitosamente",
    },
  ],
}

export default function PedidoDetallePage({ params }) {
  const { user } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  const [redirectToLogin, setRedirectToLogin] = useState(false)

  useEffect(() => {
    if (!user) {
      setRedirectToLogin(true)
    }
  }, [user])

  useEffect(() => {
    if (redirectToLogin) {
      router.push(`/login?redirect=/mi-cuenta/pedidos/${params.id}`)
    }
  }, [redirectToLogin, router, params.id])

  useEffect(() => {
    // Simulamos la carga de datos del pedido
    const loadOrder = () => {
      setLoading(true)
      // En un caso real, aquí haríamos una llamada a la API
      setTimeout(() => {
        setOrder(orderDetails)
        setLoading(false)
      }, 500)
    }

    loadOrder()
  }, [params.id])

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "d 'de' MMMM, yyyy", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Formatear fecha y hora
  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "d 'de' MMMM, yyyy 'a las' HH:mm", { locale: es })
    } catch (error) {
      return dateString
    }
  }

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
        </div>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/mi-cuenta/pedidos">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Volver a mis pedidos
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <h3 className="mt-2 text-lg font-medium">Pedido no encontrado</h3>
            <p className="mt-1 text-sm text-gray-500">No pudimos encontrar el pedido que estás buscando.</p>
            <Button className="mt-4 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90" asChild>
              <Link href="/mi-cuenta/pedidos">Ver todos mis pedidos</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/mi-cuenta/pedidos">
            <ChevronLeft className="mr-1 h-4 w-4" />
            Volver a mis pedidos
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Pedido {order.id}</h1>
            <p className="text-gray-500">Realizado el {formatDate(order.date)}</p>
          </div>
          <div className="flex gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${getStatusColor(order.status)}`}
            >
              {order.statusText}
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Productos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-start space-x-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-base font-medium">{item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">Cantidad: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-medium">{item.price.toFixed(2)} €</p>
                      <p className="mt-1 text-sm text-gray-500">Total: {(item.price * item.quantity).toFixed(2)} €</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="my-6" />

              <div className="space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm font-medium">{order.subtotal.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Envío</span>
                  <span className="text-sm font-medium">{order.shipping.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Impuestos</span>
                  <span className="text-sm font-medium">{order.tax.toFixed(2)} €</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">{order.total.toFixed(2)} €</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Seguimiento del pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                {order.statusHistory.map((status, index) => (
                  <div key={index} className="mb-8 flex last:mb-0">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          index === order.statusHistory.length - 1
                            ? "bg-[var(--primary-color)] text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {index + 1}
                      </div>
                      {index < order.statusHistory.length - 1 && <div className="h-full w-0.5 bg-gray-200"></div>}
                    </div>
                    <div className="pb-8">
                      <div className="flex items-center">
                        <Badge variant="outline" className={getStatusColor(status.status)}>
                          {status.statusText}
                        </Badge>
                        <span className="ml-2 text-sm text-gray-500">{formatDateTime(status.date)}</span>
                      </div>
                      <p className="mt-1 text-gray-600">{status.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información de envío</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start">
                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">{order.shippingAddress.name}</p>
                  <p className="text-sm text-gray-500">{order.shippingAddress.address}</p>
                  <p className="text-sm text-gray-500">
                    {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                  </p>
                </div>
              </div>
              {order.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                  <p className="font-medium">Notas:</p>
                  <p className="text-gray-600">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Método de pago</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                <span>{order.paymentMethod}</span>
              </div>
              <div className="mt-2 flex items-center">
                <Badge variant={order.paymentStatus === "paid" ? "success" : "outline"}>
                  {order.paymentStatusText}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>¿Necesitas ayuda?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full" asChild>
                <a
                  href={`https://wa.me/584121234567?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido%20${order.id}%20y%20mi%20voucher%20de%20compra`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Contactar por WhatsApp
                </a>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/mi-cuenta/pedidos/${order.id}/voucher`} target="_blank" rel="noopener noreferrer">
                  Ver voucher de compra
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

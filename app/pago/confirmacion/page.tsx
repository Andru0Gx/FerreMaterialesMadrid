"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState("")
  const [orderId, setOrderId] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const orderId = searchParams?.get("orderId")
        if (!orderId) {
          setError("No se encontró el ID de la orden")
          setLoading(false)
          return
        }

        setOrderId(orderId)
        const response = await fetch(`/api/orders?id=${orderId}`)
        if (!response.ok) {
          throw new Error("Error al obtener la orden")
        }

        const order = await response.json()
        setOrderNumber(order.orderNumber)
        setLoading(false)
      } catch (error) {
        console.error("Error:", error)
        setError("Error al cargar los detalles de la orden")
        setLoading(false)
      }
    }

    fetchOrder()
  }, [searchParams])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <p>Cargando detalles de la orden...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <p className="text-red-500">{error}</p>
          <Link href="/productos">
            <Button variant="outline" className="mt-4">
              Volver a la tienda
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
          {orderNumber && (
            <p className="text-lg font-medium text-gray-700 mb-4">
              Número de orden: {orderNumber}
            </p>
          )}
          <p className="text-gray-600 mb-4">
            Tu pedido ha sido procesado correctamente. Te hemos enviado un correo electrónico con los detalles de tu compra.
          </p>
          <p className="text-gray-600">
            Puedes hacer seguimiento de tu pedido en la sección "Mis Pedidos" de tu cuenta.
          </p>
        </div>

        <div className="space-y-4">
          {orderId && (
            <Link href={`/mi-cuenta/pedidos/${orderId}`}>
              <Button className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90">
                Ver detalles del pedido
              </Button>
            </Link>
          )}
          <Link href="/productos">
            <Button variant="outline" className="w-full">
              Seguir comprando
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <p>Cargando detalles de la orden...</p>
        </div>
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  )
}

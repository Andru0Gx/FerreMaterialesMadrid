"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams()
  const [orderNumber, setOrderNumber] = useState("")

  useEffect(() => {
    // Obtener el ID de la orden de los parámetros de la URL
    const orderId = searchParams?.get("orderId")
    if (orderId) {
      // Formatear el número de orden (por ejemplo, FM-000123)
      const formattedNumber = orderId.slice(-6).padStart(6, "0")
      setOrderNumber(`FM-${formattedNumber}`)
    }
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="mb-8">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold mb-4">¡Pedido Confirmado!</h1>
          {orderNumber && (
            <p className="text-lg font-medium text-gray-700 mb-4">
              Número de orden: #{orderNumber}
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
          {orderNumber && (
            <Link href={`/mi-cuenta/pedidos/${orderNumber}`}>
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

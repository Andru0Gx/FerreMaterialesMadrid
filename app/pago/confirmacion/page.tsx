import Link from "next/link"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function OrderConfirmationPage() {
  const orderNumber = `FM-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <div className="max-w-md mx-auto">
        <div className="flex justify-center mb-6">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-4">¡Pedido completado!</h1>
        <p className="text-gray-600 mb-8">
          Tu pedido #{orderNumber} ha sido recibido y está siendo procesado. Te enviaremos un correo electrónico con los
          detalles de tu compra.
        </p>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Package className="w-6 h-6 text-orange-500" />
            <span className="font-medium">Detalles del envío</span>
          </div>

          <p className="text-gray-600 mb-4">Recibirás tu pedido en un plazo de 24-48 horas laborables.</p>

          <div className="flex justify-center">
            <Link href="/mi-cuenta/pedidos">
              <Button variant="outline" className="flex items-center">
                Seguir mi pedido
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button variant="outline">Volver al inicio</Button>
          </Link>
          <Link href="/productos">
            <Button>Seguir comprando</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

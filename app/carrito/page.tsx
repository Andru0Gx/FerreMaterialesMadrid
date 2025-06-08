"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Trash2, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/context/cart-context"
import { useExchangeRate } from "@/hooks/use-exchange-rate"
import { useToast } from "@/components/ui/use-toast"

// Códigos promocionales de ejemplo
const promoCodes = [
  {
    code: "DESCUENTO10",
    discountType: "percentage",
    discountValue: 10,
    isActive: true,
  },
  {
    code: "AHORRA5",
    discountType: "fixed",
    discountValue: 5,
    isActive: true,
  },
]

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart()
  const { formatPrice } = useExchangeRate()
  const { toast } = useToast()
  const [couponCode, setCouponCode] = useState("")
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

  // Calcular descuento
  let discount = 0
  if (appliedCoupon) {
    if (appliedCoupon.discountType === "percentage") {
      discount = subtotal * (appliedCoupon.discountValue / 100)
    } else {
      discount = appliedCoupon.discountValue
    }
  }

  const subtotalAfterDiscount = subtotal - discount
  const tax = subtotalAfterDiscount * 0.16 // 16% de impuesto
  const shipping = subtotalAfterDiscount > 50 ? 0 : 10 // Envío gratis en compras mayores a $50
  const total = subtotalAfterDiscount + tax + shipping

  const applyCoupon = () => {
    const foundCoupon = promoCodes.find(
      (promo) => promo.code.toLowerCase() === couponCode.toLowerCase() && promo.isActive,
    )

    if (foundCoupon) {
      setAppliedCoupon(foundCoupon)
      toast({
        title: "Código aplicado",
        description: `Se ha aplicado el descuento del código ${foundCoupon.code}`,
      })
    } else {
      toast({
        title: "Código inválido",
        description: "El código promocional no es válido o ha expirado",
        variant: "destructive",
      })
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
    setCouponCode("")
    toast({
      title: "Código removido",
      description: "Se ha removido el código promocional",
    })
  }

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-6">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8">Parece que aún no has agregado productos a tu carrito.</p>
        <Link href="/productos">
          <Button size="lg">Ver productos</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Carrito de compras</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Lista de productos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="hidden md:grid grid-cols-12 gap-4 mb-4 text-sm font-medium text-gray-500">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            <Separator className="mb-6" />

            {cart.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 py-6 border-b">
                {/* Producto */}
                <div className="col-span-6 flex gap-4">
                  <div className="relative w-20 h-20 rounded-md overflow-hidden">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="flex items-center text-sm text-red-500 mt-2"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Eliminar
                    </button>
                  </div>
                </div>

                {/* Precio */}
                <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-gray-500">Precio:</span>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.price).usd}</div>
                    <div className="text-xs text-gray-500">{formatPrice(item.price).bs}</div>
                  </div>
                </div>

                {/* Cantidad */}
                <div className="md:col-span-2 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-gray-500">Cantidad:</span>
                  <div className="flex items-center border rounded-md">
                    <button
                      className="px-3 py-1 text-gray-600"
                      onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    >
                      -
                    </button>
                    <span className="px-3 py-1">{item.quantity}</span>
                    <button
                      className="px-3 py-1 text-gray-600"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className="md:col-span-2 flex justify-between md:justify-center items-center font-medium">
                  <span className="md:hidden text-gray-500">Total:</span>
                  <div className="text-right">
                    <div className="font-medium">{formatPrice(item.price * item.quantity).usd}</div>
                    <div className="text-xs text-gray-500">{formatPrice(item.price * item.quantity).bs}</div>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-6">
              <Button variant="outline" onClick={clearCart}>
                Vaciar carrito
              </Button>
              <Link href="/productos">
                <Button variant="outline">Continuar comprando</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Resumen del pedido */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Resumen del pedido</h2>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <div className="text-right">
                  <div>{formatPrice(subtotal).usd}</div>
                  <div className="text-xs text-gray-500">{formatPrice(subtotal).bs}</div>
                </div>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-green-600">
                  <span className="flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Descuento ({appliedCoupon.code})
                  </span>
                  <div className="text-right">
                    <div>-{formatPrice(discount).usd}</div>
                    <div className="text-xs">-{formatPrice(discount).bs}</div>
                  </div>
                </div>
              )}

              <div className="flex justify-between">
                <span className="text-gray-600">Impuestos (16%)</span>
                <div className="text-right">
                  <div>{formatPrice(tax).usd}</div>
                  <div className="text-xs text-gray-500">{formatPrice(tax).bs}</div>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Envío</span>
                <span>{shipping === 0 ? "Gratis" : formatPrice(shipping).combined}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-bold">
                <span>Total</span>
                <div className="text-right">
                  <div>{formatPrice(total).usd}</div>
                  <div className="text-sm text-gray-600">{formatPrice(total).bs}</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {/* Código promocional */}
              {!appliedCoupon ? (
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de descuento"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <Button variant="outline" onClick={applyCoupon}>
                      Aplicar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-green-700">
                    <Tag className="w-4 h-4 mr-2" />
                    <span className="font-medium">{appliedCoupon.code}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={removeCoupon} className="text-green-700">
                    Remover
                  </Button>
                </div>
              )}

              <Link href="/pago">
                <Button className="w-full">Proceder al pago</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

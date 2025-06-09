"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import { formatCurrency } from "@/lib/utils"
import { useExchangeRate } from "@/hooks/use-exchange-rate"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isHovered, setIsHovered] = useState(false)
  const { rate } = useExchangeRate()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.inStock === false) {
      toast({
        title: "Producto agotado",
        description: "Este producto no está disponible actualmente.",
        variant: "destructive",
      })
      return
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || "/placeholder.svg",
      category: product.category,
      quantity: 1,
    })

    toast({
      title: "Producto añadido",
      description: `${product.name} ha sido añadido al carrito.`,
      duration: 3000,
    })
  }

  const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price
  const bsPrice = rate ? (finalPrice * rate).toFixed(2) : null

  return (
    <Link
      href={`/productos/${product.id}`}
      className="group block bg-white rounded-lg border border-gray-200 overflow-hidden transition-all hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-110" : "scale-100"}`}
        />
        {product.discount > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{product.discount}%
          </div>
        )}
        {product.inStock === false && (
          <div className="absolute bottom-2 left-2 bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded">
            Agotado
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-500 mb-1">{product.category}</div>
        <h3 className="font-medium mb-2 group-hover:text-[var(--primary-color)] transition-colors line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-bold text-[var(--primary-color)]">
                {formatCurrency(finalPrice)}
              </span>
              {product.discount > 0 && (
                <span className="text-sm text-gray-500 line-through">
                  {formatCurrency(product.price)}
                </span>
              )}
            </div>
            {bsPrice && (
              <span className="text-sm text-gray-500">
                Bs. {bsPrice}
              </span>
            )}
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full hover:bg-orange-100 hover:text-[var(--primary-color)]"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="sr-only">Añadir al carrito</span>
          </Button>
        </div>
      </div>
    </Link>
  )
}

"use client"

import { useState } from "react"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/types"

interface AddToCartButtonProps {
  product: Product
  quantity: number
  className?: string
  onAddToCart?: () => void
}

export default function AddToCartButton({ product, quantity, className, onAddToCart }: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleAddToCart = () => {
    setIsLoading(true)

    // Simulamos una pequeña demora para mostrar el estado de carga
    setTimeout(() => {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        category: product.category,
        quantity,
      })

      toast({
        title: "Producto añadido",
        description: `${product.name} ha sido añadido al carrito.`,
        duration: 3000,
      })

      // Llamar al callback si existe
      onAddToCart?.()

      setIsLoading(false)
    }, 300)
  }

  return (
    <Button onClick={handleAddToCart} disabled={isLoading} className={className}>
      <ShoppingCart className="h-5 w-5 mr-2" />
      {isLoading ? "Añadiendo..." : "Añadir al carrito"}
    </Button>
  )
}

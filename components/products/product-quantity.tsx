"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Minus, Plus } from "lucide-react"

interface ProductQuantityProps {
  initialQuantity?: number
  onChange?: (quantity: number) => void
  max?: number
}

export default function ProductQuantity({ initialQuantity = 1, onChange, max = 99 }: ProductQuantityProps) {
  const [quantity, setQuantity] = useState(initialQuantity)

  useEffect(() => {
    onChange?.(quantity)
  }, [quantity, onChange])

  const increment = () => {
    if (quantity < max) {
      const newQuantity = quantity + 1
      setQuantity(newQuantity)
    }
  }

  const decrement = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1
      setQuantity(newQuantity)
    }
  }

  return (
    <div className="flex items-center">
      <span className="mr-4 font-medium">Cantidad:</span>
      <div className="flex items-center border rounded-md">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none border-r"
          onClick={decrement}
        >
          <Minus className="h-4 w-4" />
        </Button>
        <div className="w-12 text-center">{quantity}</div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-none border-l"
          onClick={increment}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

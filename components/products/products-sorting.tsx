"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Product } from "@/lib/types"

interface ProductsSortingProps {
  products: Product[]
  onSort: (sortedProducts: Product[]) => void
}

export default function ProductsSorting({ products, onSort }: ProductsSortingProps) {
  const [sortOption, setSortOption] = useState("relevance")

  useEffect(() => {
    const sortProducts = () => {
      const sorted = [...products]

      switch (sortOption) {
        case "price-low":
          sorted.sort((a, b) => {
            const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price
            const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price
            return priceA - priceB
          })
          break
        case "price-high":
          sorted.sort((a, b) => {
            const priceA = a.discount > 0 ? a.price * (1 - a.discount / 100) : a.price
            const priceB = b.discount > 0 ? b.price * (1 - b.discount / 100) : b.price
            return priceB - priceA
          })
          break
        default:
          // Default relevance - no specific sorting
          break
      }

      onSort(sorted)
    }

    sortProducts()
  }, [sortOption, products, onSort])

  return (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500">
        Mostrando <span className="font-medium">{products.length}</span> productos
      </div>

      <div className="flex items-center space-x-2">
        <span className="text-sm">Ordenar por:</span>
        <Select value={sortOption} onValueChange={setSortOption}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Relevancia" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="relevance">Relevancia</SelectItem>
            <SelectItem value="price-low">Precio: Menor a mayor</SelectItem>
            <SelectItem value="price-high">Precio: Mayor a menor</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}

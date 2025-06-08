"use client"

import { useState, useEffect } from "react"
import ProductCard from "@/components/products/product-card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Product } from "@/lib/types"
import type { Filters } from "./products-filters"

interface ProductsGridProps {
  products: Product[]
  filters: Filters
}

export default function ProductsGrid({ products, filters }: ProductsGridProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

  // Apply filters
  const filteredProducts = products.filter((product) => {
    // Category filter
    if (filters.categories.length > 0 && !filters.categories.includes(product.category.toLowerCase())) {
      return false
    }

    // Price range filter
    const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price

    if (finalPrice < filters.priceRange[0] || finalPrice > filters.priceRange[1]) {
      return false
    }

    // In stock filter
    if (filters.inStock && product.inStock === false) {
      return false
    }

    // On sale filter
    if (filters.onSale && product.discount <= 0) {
      return false
    }

    return true
  })

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  if (filteredProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
        <p className="text-gray-500">Intenta con otros filtros o categorías</p>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-12">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                onClick={() => handlePageChange(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="icon"
              onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

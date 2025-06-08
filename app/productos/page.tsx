"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductsGrid from "@/components/products/products-grid"
import ProductsFilters, { type Filters } from "@/components/products/products-filters"
import ProductsSorting from "@/components/products/products-sorting"
import { Skeleton } from "@/components/ui/skeleton"
import { getProducts } from "@/lib/data"
import type { Product } from "@/lib/types"

export default function ProductsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const products = getProducts()

  // Calculate max price for the price slider
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000; // Valor por defecto si no hay productos
    return Math.ceil(Math.max(...products.map((p) => p.price)) / 100) * 100
  }, [products])

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<Filters>(() => {
    return {
      categories: searchParams.get("category") ? [searchParams.get("category")!.toLowerCase()] : [],
      priceRange: [
        Number(searchParams.get("minPrice")) || 0,
        Number(searchParams.get("maxPrice")) || maxPrice,
      ],
      inStock: searchParams.get("inStock") === "true",
      onSale: searchParams.get("onSale") === "true",
    }
  })

  const [sortedProducts, setSortedProducts] = useState<Product[]>([...products])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    if (filters.categories.length > 0) {
      params.set("category", filters.categories[0])
    }
    if (filters.priceRange[0] > 0) {
      params.set("minPrice", filters.priceRange[0].toString())
    }
    if (filters.priceRange[1] < maxPrice) {
      params.set("maxPrice", filters.priceRange[1].toString())
    }
    if (filters.inStock) {
      params.set("inStock", "true")
    }
    if (filters.onSale) {
      params.set("onSale", "true")
    }

    const search = params.toString()
    const query = search ? `?${search}` : ""
    router.push(`/productos${query}`)
  }, [filters, maxPrice, router])

  // Apply filters
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
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
  }, [products, filters])

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  const handleSort = useCallback((newSortedProducts: Product[]) => {
    setSortedProducts(newSortedProducts)
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros laterales para desktop */}
        <div className="w-full md:w-1/4 hidden md:block">
          <ProductsFilters
            onFiltersChange={handleFiltersChange}
            // productsCount={products.length} // Podrías pasar filteredProducts.length si quieres el contador de los productos filtrados
            productsCount={filteredProducts.length} // O products.length para el total
            maxPrice={maxPrice}
            initialFilters={filters} // Para que los filtros mantengan su estado si es necesario
          />
        </div>

        {/* Productos */}
        <div className="w-full md:w-3/4">
          {/* Filtros móviles */}
          <div className="md:hidden mb-6">
            <ProductsFilters
              onFiltersChange={handleFiltersChange}
              productsCount={filteredProducts.length}
              maxPrice={maxPrice}
              initialFilters={filters}
            />
          </div>

          <div className="mb-6">
            {/*
              Pasas `products` (la lista original completa) y `filteredProducts`.
              `ProductsSorting` debería usar `filteredProducts` como la base para ordenar.
            */}
            <ProductsSorting
              products={products} /* Para el conteo total */
              filteredProducts={filteredProducts} /* Para ordenar y contar los mostrados */
              onSort={handleSort}
            />
          </div>

          {/*
            Deberías mostrar `sortedProducts` ya que es el resultado de aplicar
            filtros Y luego ordenación.
          */}
          <ProductsGrid products={sortedProducts} filters={filters} />
        </div>
      </div>
    </div>
  )
}

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array(9)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <Skeleton className="h-48 w-full mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-2" />
            <Skeleton className="h-6 w-1/4 mb-4" />
            <Skeleton className="h-10 w-full" />
          </div>
        ))}
    </div>
  )
}

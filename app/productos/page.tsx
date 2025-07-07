"use client"

import { useState, useMemo, useCallback, useEffect, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import ProductsGrid from "@/components/products/products-grid"
import ProductsFilters, { type Filters } from "@/components/products/products-filters"
import ProductsSorting from "@/components/products/products-sorting"
import { ProductsSearch } from "@/components/products/products-search"
import { Skeleton } from "@/components/ui/skeleton"
import type { Product } from "@/lib/types"

function ProductsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortedProducts, setSortedProducts] = useState<Product[]>([])

  // Cargar productos desde la base de datos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        setProducts(data)
        setSortedProducts(data) // Inicializar sortedProducts con los mismos datos
      } catch (error) {
        console.error('Error al cargar productos:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Calculate max price for the price slider
  const maxPrice = useMemo(() => {
    if (products.length === 0) return 1000; // Valor por defecto si no hay productos
    return Math.max(...products.map((p) => p.price));
  }, [products])

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState<Filters>(() => {
    const category = searchParams?.get("category")
    const minPrice = searchParams?.get("minPrice")
    const maxPriceParam = searchParams?.get("maxPrice")
    const inStock = searchParams?.get("inStock")
    const onSale = searchParams?.get("onSale")

    return {
      categories: category ? [category.toLowerCase()] : [],
      priceRange: [
        minPrice ? Number(minPrice) : 0,
        maxPriceParam ? Number(maxPriceParam) : Infinity,
      ] as [number, number],
      inStock: inStock === "true",
      onSale: onSale === "true",
    }
  })

  // Sincronizar el filtro de precio máximo con el maxPrice real cuando cambie
  useEffect(() => {
    if (filters.priceRange[1] === Infinity && maxPrice !== 1000 && products.length > 0) {
      setFilters((prev) => ({
        ...prev,
        priceRange: [prev.priceRange[0], maxPrice],
      }))
    }
  }, [maxPrice, products.length])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams(searchParams?.toString() || "")

    if (filters.categories.length > 0) {
      params.set("category", filters.categories[0])
    } else {
      params.delete("category")
    }
    if (filters.priceRange[0] > 0) {
      params.set("minPrice", filters.priceRange[0].toString())
    } else {
      params.delete("minPrice")
    }
    if (filters.priceRange[1] < maxPrice) {
      params.set("maxPrice", filters.priceRange[1].toString())
    } else {
      params.delete("maxPrice")
    }
    if (filters.inStock) {
      params.set("inStock", "true")
    } else {
      params.delete("inStock")
    }
    if (filters.onSale) {
      params.set("onSale", "true")
    } else {
      params.delete("onSale")
    }

    const search = params.toString()
    const query = search ? `?${search}` : ""
    router.push(`/productos${query}`, { scroll: false })
  }, [filters, maxPrice, router, searchParams])

  const handleFiltersChange = useCallback((newFilters: Filters) => {
    setFilters(newFilters)
  }, [])

  const handleSort = useCallback((newSortedProducts: Product[]) => {
    setSortedProducts(newSortedProducts)
  }, [])

  // Aplicar filtros y búsqueda a los productos
  const filteredProducts = useMemo(() => {
    const searchQuery = searchParams?.get("search")?.toLowerCase() || ""

    return products.filter((product) => {
      // Search filter
      if (searchQuery) {
        const matchesSearch =
          product.name.toLowerCase().includes(searchQuery) ||
          product.description.toLowerCase().includes(searchQuery) ||
          product.sku?.toLowerCase().includes(searchQuery) ||
          product.category.toLowerCase().includes(searchQuery)

        if (!matchesSearch) return false
      }

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
      if (filters.inStock && product.stock <= 0) {
        return false
      }

      // On sale filter
      if (filters.onSale && product.discount <= 0) {
        return false
      }

      return true
    })
  }, [products, filters, searchParams])

  // Actualizar productos ordenados cuando cambian los filtros
  useEffect(() => {
    setSortedProducts(filteredProducts)
  }, [filteredProducts])

  if (loading) {
    return <ProductsGridSkeleton />
  }

  return (
    <div className="flex flex-col mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Nuestros Productos</h1>

      {/* Search Bar */}
      <div className="mb-8">
        <ProductsSearch />
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filtros laterales para desktop */}
        <div className="w-full md:w-1/4 hidden md:block">
          <ProductsFilters
            onFiltersChange={handleFiltersChange}
            productsCount={filteredProducts.length}
            maxPrice={maxPrice}
            currentFilters={filters}
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
              currentFilters={filters}
            />
          </div>

          <div className="mb-6">
            <ProductsSorting
              products={filteredProducts}
              onSort={handleSort}
            />
          </div>

          {searchParams?.get("search") && (
            <div className="mb-4">
              <h2 className="text-lg font-semibold">
                Resultados de búsqueda para: "{searchParams.get("search")}"
              </h2>
              <p className="text-gray-500">{filteredProducts.length} productos encontrados</p>
            </div>
          )}

          <ProductsGrid products={sortedProducts} />
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

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsGridSkeleton />}>
      <ProductsContent />
    </Suspense>
  )
}

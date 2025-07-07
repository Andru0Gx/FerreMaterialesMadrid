"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import { categories } from "@/lib/data"
import { useMobile } from "@/hooks/use-mobile"

export interface Filters {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean
  onSale: boolean
}

interface ProductsFiltersProps {
  onFiltersChange: (filters: Filters) => void
  productsCount: number
  maxPrice: number
  currentFilters?: Filters
}

function ProductsFiltersContent({
  onFiltersChange,
  productsCount,
  maxPrice = 1000,
  currentFilters
}: ProductsFiltersProps) {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<Filters>(currentFilters || {
    categories: [],
    priceRange: [0, maxPrice],
    inStock: false,
    onSale: false,
  })
  const [isPriceOpen, setIsPriceOpen] = useState(false)
  const isMobile = useMobile()

  useEffect(() => {
    onFiltersChange(filters)
  }, [filters, onFiltersChange])

  const handleCategoryChange = (category: string) => {
    setFilters((prev) => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category]

      return {
        ...prev,
        categories: updatedCategories,
      }
    })
  }

  const handlePriceChange = (values: number[]) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: [values[0], values[1]] as [number, number],
    }))
  }

  const handleInStockChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      setFilters((prev) => ({
        ...prev,
        inStock: checked,
      }))
    }
  }

  const handleOnSaleChange = (checked: boolean | "indeterminate") => {
    if (typeof checked === "boolean") {
      setFilters((prev) => ({
        ...prev,
        onSale: checked,
      }))
    }
  }

  const handleReset = () => {
    setFilters({
      categories: [],
      priceRange: [0, maxPrice],
      inStock: false,
      onSale: false,
    })
  }

  // Mobile version with horizontal scrolling filters
  if (isMobile) {
    return (
      <div className="mb-6">
        <div className="flex overflow-x-auto pb-4 gap-4 ">
          {/* Categories in horizontal scroll */}
          {categories.map((category) => (
            <div key={category.id} className="flex-shrink-0">
              <Button
                variant={filters.categories.includes(category.id) ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category.id)}
                className="whitespace-nowrap"
              >
                {category.name}
              </Button>
            </div>
          ))}

          {/* Stock and Sale filters */}
          <div className="flex-shrink-0">
            <Button
              variant={filters.inStock ? "default" : "outline"}
              size="sm"
              onClick={() => handleInStockChange(!filters.inStock)}
              className="whitespace-nowrap"
            >
              En Stock
            </Button>
          </div>

          <div className="flex-shrink-0">
            <Button
              variant={filters.onSale ? "default" : "outline"}
              size="sm"
              onClick={() => handleOnSaleChange(!filters.onSale)}
              className="whitespace-nowrap"
            >
              En Oferta
            </Button>
          </div>

          {/* Price filter as button */}
          <div className="flex-shrink-0">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPriceOpen(!isPriceOpen)}
              className="whitespace-nowrap flex items-center gap-1"
            >
              Precio {isPriceOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          {/* Reset button */}
          <div className="flex-shrink-0">
            <Button variant="ghost" size="sm" onClick={handleReset} className="whitespace-nowrap">
              Limpiar
            </Button>
          </div>
        </div>

        {/* Price slider only shown when price filter is clicked */}
        {isPriceOpen && (
          <div className="mt-4 px-2">
            <Slider
              defaultValue={filters.priceRange}
              max={maxPrice}
              step={5}
              value={filters.priceRange}
              onValueChange={handlePriceChange}
              className="mb-6"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm">${filters.priceRange[0]}</span>
              <span className="text-sm">{filters.priceRange[1] === Infinity ? '$ Max' : `$${filters.priceRange[1]}`}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Desktop version
  return (
    <div className="space-y-8">
      {/* Categorías */}
      <div>
        <h3 className="font-medium mb-4">Categorías</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category.id}`}
                checked={filters.categories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
              />
              <label htmlFor={`category-${category.id}`} className="text-sm cursor-pointer">
                {category.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Precio */}
      <div>
        <h3 className="font-medium mb-4">Precio</h3>
        <Slider
          defaultValue={filters.priceRange}
          max={maxPrice}
          step={5}
          value={filters.priceRange}
          onValueChange={handlePriceChange}
          className="mb-6"
        />
        <div className="flex items-center justify-between">
          <span className="text-sm">${filters.priceRange[0]}</span>
          <span className="text-sm">{filters.priceRange[1] === Infinity ? '$ Max' : `$${filters.priceRange[1]}`}</span>
        </div>
      </div>

      {/* Additional Filters */}
      <div>
        <h3 className="font-medium mb-4">Filtros Adicionales</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="in-stock" checked={filters.inStock} onCheckedChange={handleInStockChange} />
            <label htmlFor="in-stock" className="text-sm cursor-pointer">
              En Stock
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="on-sale" checked={filters.onSale} onCheckedChange={handleOnSaleChange} />
            <label htmlFor="on-sale" className="text-sm cursor-pointer">
              En Oferta
            </label>
          </div>
        </div>
      </div>

      {/* Botón de reset */}
      <Button variant="outline" onClick={handleReset} className="w-full">
        Limpiar filtros
      </Button>
    </div>
  )
}

export default function ProductsFilters(props: ProductsFiltersProps) {
  return (
    <Suspense fallback={<div className="animate-pulse space-y-4">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded"></div>
      </div>
    </div>}>
      <ProductsFiltersContent {...props} />
    </Suspense>
  )
}

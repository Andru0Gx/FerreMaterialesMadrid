"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductCard from "@/components/products/product-card"
import type { Product } from "@/lib/types"

interface RelatedProductsProps {
  products: Product[]
}

export default function RelatedProducts({ products }: RelatedProductsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  // Don't render if no related products
  if (products.length === 0) {
    return null
  }

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // 10px buffer
    }
  }

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  useEffect(() => {
    let scrollElement: HTMLDivElement | null = null

    if (scrollRef.current) {
      scrollElement = scrollRef.current
      scrollElement.addEventListener("scroll", handleScroll)
      // Check initial state
      handleScroll()
      return () => scrollElement?.removeEventListener("scroll", handleScroll)
    }

    return () => {
      const element = scrollElement as HTMLDivElement | null
      if (element) {
        element.removeEventListener("scroll", handleScroll)
      }
    }
  }, [])

  return (
    <div className="relative">
      {/* Left scroll button */}
      {showLeftArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md"
          onClick={scrollLeft}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Right scroll button */}
      {showRightArrow && (
        <Button
          variant="outline"
          size="icon"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full shadow-md"
          onClick={scrollRight}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>
      )}

      {/* Scrollable container */}
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-6 py-4 px-2 hide-scrollbar snap-x"
        onScroll={handleScroll}
      >
        {products.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[280px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  )
}

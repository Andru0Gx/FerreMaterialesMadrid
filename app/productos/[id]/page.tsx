"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductQuantity from "@/components/products/product-quantity"
import ProductGallery from "@/components/products/product-gallery"
import RelatedProducts from "@/components/products/related-products"
import AddToCartButton from "@/components/products/add-to-cart-button"
import { useCart } from "@/context/cart-context"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        // Obtener el producto
        const response = await fetch(`/api/products?id=${params.id}`)
        const data = await response.json()

        if (!data) {
          notFound()
          return
        }

        setProduct(data)

        // Obtener productos relacionados
        const relatedResponse = await fetch('/api/products')
        const allProducts = await relatedResponse.json()
        const related = allProducts
          .filter((p: any) => p.category === data.category && p.id !== data.id)
          .slice(0, 4) // Limitar a 4 productos relacionados
        setRelatedProducts(related)
      } catch (error) {
        console.error('Error al cargar el producto:', error)
        notFound()
      } finally {
        setLoading(false)
      }
    }
    fetchProduct()
  }, [params.id])

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleBuyNow = () => {
    if (!product) return

    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      category: product.category,
      quantity,
    })

    router.push("/carrito")
  }

  if (loading) {
    return (
      <div className="flex flex-col px-10 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="h-96 bg-gray-200 animate-pulse rounded-lg"></div>
          <div className="flex flex-col gap-6">
            <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
            <div className="border-t border-b py-4">
              <div className="h-20 bg-gray-200 animate-pulse rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    notFound()
  }

  return (
    <div className="flex flex-col px-10 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Galería de imágenes */}
        <ProductGallery images={product.images} />

        {/* Información del producto */}
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <p className="text-2xl font-bold text-[var(--primary-color)]">
              {product.discount > 0 ? (
                <span className="flex items-center gap-2">
                  {new Intl.NumberFormat("us-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(product.price * (1 - product.discount / 100))}
                  <span className="text-base text-gray-500 line-through">
                    {new Intl.NumberFormat("us-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(product.price)}
                  </span>
                </span>
              ) : (
                new Intl.NumberFormat("us-US", {
                  style: "currency",
                  currency: "USD",
                }).format(product.price)
              )}
            </p>
          </div>

          <div className="border-t border-b py-4">
            <p className="text-gray-700">{product.shortDescription}</p>
          </div>

          <div className="flex flex-col gap-4">
            <ProductQuantity initialQuantity={1} onChange={handleQuantityChange} />

            <div className="flex flex-col sm:flex-row gap-4">
              <AddToCartButton product={product} quantity={quantity} className="flex-1" />
              <Button variant="outline" className="flex-1" onClick={handleBuyNow}>
                Comprar ahora
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            <div className="flex items-center gap-2">
              <Truck className="w-5 h-5 text-[var(--primary-color)]" />
              <span className="text-sm">Envío gratis en pedidos superiores a $50</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[var(--primary-color)]" />
              <span className="text-sm">Garantía de 30 días</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tabs - New Design */}
      <div className="mb-16">
        <div className="border-b border-gray-200">
          <ul className="flex flex-wrap -mb-px">
            <li className="mr-2">
              <a
                href="#description"
                className="inline-block p-4 border-b-2 border-[var(--primary-color)] rounded-t-lg active font-medium text-[var(--primary-color)]"
              >
                Descripción
              </a>
            </li>
            <li className="mr-2">
              <a
                href="#specifications"
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
              >
                Especificaciones
              </a>
            </li>
          </ul>
        </div>

        {/* Tab content */}
        <div className="py-6">
          <div id="description" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Descripción</h2>
            <p className="text-gray-700">{product.description}</p>
          </div>

          <div id="specifications" className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Especificaciones</h2>
            <ul className="list-disc pl-5 space-y-2">
              {Array.isArray(product.specifications) ? (
                product.specifications.map((spec: any, index: number) => (
                  <li key={index} className="text-gray-700">
                    {typeof spec === 'string' ? spec : `${spec.title}: ${spec.value}`}
                  </li>
                ))
              ) : (
                <li className="text-gray-700">No hay especificaciones disponibles</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Productos relacionados */}
      {relatedProducts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <RelatedProducts products={relatedProducts} />
        </div>
      )}
    </div>
  )
}

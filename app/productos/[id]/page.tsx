"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Truck, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductQuantity from "@/components/products/product-quantity"
import ProductGallery from "@/components/products/product-gallery"
import RelatedProducts from "@/components/products/related-products"
import AddToCartButton from "@/components/products/add-to-cart-button"
import { getProductById, getRelatedProducts } from "@/lib/data"
import { useCart } from "@/context/cart-context"

export default function ProductPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = getProductById(params.id)
  const [quantity, setQuantity] = useState(1)
  const { addToCart } = useCart()

  if (!product) {
    notFound()
  }

  const relatedProducts = getRelatedProducts(product.category, product.id)

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity)
  }

  const handleBuyNow = () => {
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
            <li className="mr-2">
              <a
                href="#questions"
                className="inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300"
              >
                Preguntas
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
              {product.specifications.map((spec, index) => (
                <li key={index} className="text-gray-700">
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div id="questions">
            <h2 className="text-xl font-semibold mb-4">Preguntas frecuentes</h2>
            {product.questions.length > 0 ? (
              <div className="space-y-6">
                {product.questions.map((q, index) => (
                  <div key={index} className="border-b pb-4">
                    <p className="font-medium mb-2">P: {q.question}</p>
                    <p className="text-gray-700">R: {q.answer}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay preguntas todavía para este producto.</p>
            )}
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

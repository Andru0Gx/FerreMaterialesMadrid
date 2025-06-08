import Image from "next/image"
import { Button } from "@/components/ui/button"
import { getFeaturedProducts } from "@/lib/data"
import { formatCurrency } from "@/lib/utils"

export default function FeaturedProducts() {
  const featuredProducts = getFeaturedProducts().slice(0, 3)

  return (
    <section className="py-12 ">
      <div className="p-10 pt-8 flex flex-col space-y-5 overflow-hidden">
        <h2 className="text-2xl font-bold mb-8">Productos Destacados</h2>

        <div className="lg:flex grid grid-flow-col space-x-10 justify-evenly overflow-x-auto p-5">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-md overflow-hidden shadow-sm h-96 w-60 sm:w-80 xl:hover:scale-105 transition-all">
              <div className="p-4">
                <div className="relative h-48 mb-4 bg-gray-100 rounded-md flex items-center justify-center">
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="object-contain"
                  />
                </div>
                <h3 className="font-medium mb-2 truncate">{product.name}</h3>
                <div className="flex justify-between items-center mb-4">
                  <div className="text-lg font-bold">{formatCurrency(product.price)}</div>
                  <div className="text-sm text-gray-500">Bs. {(product.price * 27.99).toFixed(2)}</div>
                </div>
                <Button className="w-full bg-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color),#000_10%)]">
                  Agregar al Carrito
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

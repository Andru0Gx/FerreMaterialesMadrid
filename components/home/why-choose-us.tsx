import { Package, Truck, CreditCard } from "lucide-react"

export default function WhyChooseUs() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-12">¿Por qué Elegir Ferre Materiales Madrid?</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <Package className="h-8 w-8 text-[var(--primary-color)]" />
            </div>
            <h3 className="font-medium mb-2">Amplio Catálogo</h3>
            <p className="text-gray-600 text-sm">Miles de productos de ferretería para tus proyectos</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <Truck className="h-8 w-8 text-[var(--primary-color)]" />
            </div>
            <h3 className="font-medium mb-2">Entrega Rápida</h3>
            <p className="text-gray-600 text-sm">Recibe tus productos en la comodidad de tu hogar en Maturín</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-full mb-4 shadow-sm">
              <CreditCard className="h-8 w-8 text-[var(--primary-color)]" />
            </div>
            <h3 className="font-medium mb-2">Pago Seguro</h3>
            <p className="text-gray-600 text-sm">Múltiples opciones de pago para tu comodidad</p>
          </div>
        </div>
      </div>
    </section>
  )
}

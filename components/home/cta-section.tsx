import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="bg-orange-500 rounded-lg p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">¿Listo para comenzar tu próximo proyecto?</h2>
          <p className="text-white/90 mb-8 text-lg">
            Tenemos todo lo que necesitas para hacer realidad tus ideas. Visita nuestra tienda o explora nuestro
            catálogo online.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/productos">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Ver productos
              </Button>
            </Link>
            <Link href="/contacto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white/10"
              >
                Contactar
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

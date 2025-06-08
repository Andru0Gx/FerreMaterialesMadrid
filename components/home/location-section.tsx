import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

export default function LocationSection() {
  return (
    <section className="py-12 bg-secondary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl font-bold mb-8">Nuestra Ubicación</h2>

        <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex justify-center mb-4">
            <MapPin className="h-10 w-10 text-[var(--primary-color)]" />
          </div>

          <p className="mb-4">
            Carrera 5, cerca de la Plaza Bolívar a 20M de la Wrangler
            <br />
            Maturín, Estado Monagas, Venezuela
          </p>

          <Button className="bg-[var(--primary-color)] hover:bg-[color-mix(in_srgb,var(--primary-color),#000_10%)]">
            Ver en Google Maps
          </Button>
        </div>
      </div>
    </section>
  )
}

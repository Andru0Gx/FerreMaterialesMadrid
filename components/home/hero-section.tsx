import Link from "next/link"
import { Button } from "@/components/ui/button"
import { COMPANY_INFO } from "@/lib/data"

export default function HeroSection() {
  return (
    <section className="bg-[var(--primary-color)] py-16 md:py-24">
      <div
        className="w-full bg-primary flex flex-col justify-center items-center text-white space-y-5 p-4"
      >
        <h1 className="text-lg font-bold text-center sm:text-4xl">
          Bienvenido a {COMPANY_INFO.nombre}
        </h1>
        <p className="text-center text-xs sm:text-base">
          Tu ferretería de confianza en {COMPANY_INFO.direccion.split(",")[2]?.trim() || "Maturín, Venezuela"}
        </p>
        <Link href="/productos">
          <Button
            size="lg"
            className="bg-white text-[var(--primary-color)] hover:bg-white/90 hover:text-[var(--primary-color)]"
          >
            Comprar Ahora
          </Button>
        </Link>
      </div>
    </section>
  )
}

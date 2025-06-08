import Image from "next/image"
import { Star } from "lucide-react"
import { testimonials } from "@/lib/data"

export default function TestimonialsSection() {
  return (
    <section className="container mx-auto px-4">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nos enorgullece la satisfacción de nuestros clientes. Estas son algunas de sus opiniones.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            <div className="flex items-center mb-4">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`}
                  />
                ))}
            </div>

            <p className="text-gray-700 mb-6">"{testimonial.text}"</p>

            <div className="flex items-center">
              <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
                <Image
                  src={testimonial.avatar || "/placeholder.svg"}
                  alt={testimonial.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h4 className="font-medium">{testimonial.name}</h4>
                <p className="text-sm text-gray-500">{testimonial.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

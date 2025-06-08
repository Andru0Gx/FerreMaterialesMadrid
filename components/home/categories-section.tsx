import Link from "next/link"
import { categories } from "@/lib/data"

export default function CategoriesSection() {
  return (
    <section className="py-12 bg-secondary">
      <div className="flex flex-col px-10">
        <h2 className="text-2xl font-bold mb-8">Categorías Destacadas</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.slice(0, 4).map((category) => (
            <Link
              key={category.id}
              href={`/productos?category=${category.id}`}
              className="bg-white rounded-md p-4 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <h3 className="font-medium">{category.name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

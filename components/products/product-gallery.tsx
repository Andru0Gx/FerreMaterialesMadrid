"use client"

import { useState } from "react"
import Image from "next/image"

interface ProductGalleryProps {
  images: string[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="flex flex-col gap-4">
      {/* Imagen principal */}
      <div className="relative h-[400px] rounded-lg overflow-hidden border">
        <Image
          src={images[selectedImage] || "/placeholder.svg"}
          alt="Imagen del producto"
          fill
          className="object-contain"
        />
      </div>

      {/* Miniaturas */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {images.map((image, index) => (
          <button
            key={index}
            className={`relative h-20 w-20 rounded-md overflow-hidden border-2 ${selectedImage === index ? "border-primary" : "border-transparent"
              }`}
            onClick={() => setSelectedImage(index)}
          >
            <Image src={image || "/placeholder.svg"} alt={`Miniatura ${index + 1}`} fill className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  )
}

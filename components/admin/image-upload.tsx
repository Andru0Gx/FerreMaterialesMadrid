"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload } from "lucide-react"
import { cn } from "@/lib/utils"

interface ImageUploadProps {
  onUpload: (urls: string[]) => void
  maxFiles?: number
  className?: string
  productId?: number | string // Nuevo: para asociar imágenes al producto
}

export function ImageUpload({ onUpload, maxFiles = 5, className, productId, initialImages = [] }: ImageUploadProps & { initialImages?: string[] }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [imageList, setImageList] = useState<string[]>(initialImages)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = async (files: FileList) => {
    const fileArray = Array.from(files)
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/")).slice(0, maxFiles)
    if (imageFiles.length === 0) return
    setIsUploading(true)
    try {
      // Subir cada imagen al endpoint /api/upload/products
      const uploadPromises = imageFiles.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)
        if (productId) formData.append("productId", String(productId))
        const res = await fetch("/api/upload/products", {
          method: "POST",
          body: formData,
        })
        if (!res.ok) throw new Error("Error al subir imagen")
        const data = await res.json()
        return data.url as string
      })
      const urls = await Promise.all(uploadPromises)
      handleUpload(urls)
    } catch (error) {
      console.error("Error al cargar imágenes:", error)
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
  }

  const handleDelete = async (url: string) => {
    try {
      const res = await fetch(`/api/upload/products?url=${encodeURIComponent(url)}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Error al eliminar la imagen')
      const newList = imageList.filter(img => img !== url)
      setImageList(newList)
      onUpload(newList)
    } catch (error) {
      console.error('Error al eliminar imagen:', error)
    }
  }

  // Modificar onUpload para actualizar el estado local
  const handleUpload = (urls: string[]) => {
    const newList = [...imageList, ...urls]
    setImageList(newList)
    onUpload(newList)
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg p-4 transition-colors",
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25",
        className,
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center gap-2 text-center">
        <Upload className="h-8 w-8 text-muted-foreground" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Arrastra y suelta imágenes aquí o</p>
          <p className="text-xs text-muted-foreground">PNG, JPG o GIF. Máximo {maxFiles} archivos.</p>
        </div>
        <Button type="button" variant="secondary" size="sm" disabled={isUploading} onClick={handleButtonClick}>
          {isUploading ? "Subiendo..." : "Seleccionar archivos"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
          disabled={isUploading}
        />
      </div>
      {/* Mostrar imágenes y botón de eliminar */}
      <div className="flex flex-wrap gap-2 mt-4">
        {imageList.map((url) => (
          <div key={url} className="relative group">
            <img src={url} alt="Imagen del producto" className="w-24 h-24 object-cover rounded" />
            <button
              type="button"
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-80 hover:opacity-100"
              onClick={() => handleDelete(url)}
              title="Eliminar imagen"
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

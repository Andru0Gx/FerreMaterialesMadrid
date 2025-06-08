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
}

export function ImageUpload({ onUpload, maxFiles = 5, className }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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
    // Convertir FileList a Array para poder filtrar
    const fileArray = Array.from(files)

    // Filtrar solo archivos de imagen
    const imageFiles = fileArray.filter((file) => file.type.startsWith("image/")).slice(0, maxFiles)

    if (imageFiles.length === 0) return

    setIsUploading(true)

    try {
      // Simular carga de archivos
      // En un entorno real, aquí se cargarían los archivos a un servidor
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Generar URLs temporales para las imágenes
      // En un entorno real, estas serían las URLs devueltas por el servidor
      const urls = imageFiles.map((file) => URL.createObjectURL(file))

      onUpload(urls)
    } catch (error) {
      console.error("Error al cargar imágenes:", error)
    } finally {
      setIsUploading(false)

      // Limpiar el input de archivos
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleButtonClick = () => {
    fileInputRef.current?.click()
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
    </div>
  )
}

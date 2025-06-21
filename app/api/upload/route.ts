import { NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import path from "path"
import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const orderId = formData.get("orderId") as string

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Verificar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Convertir el archivo a Buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Crear el nombre del archivo
    const filename = `${orderId}-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '')}`

    // Asegurarnos de que el directorio existe
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'receipts')
    try {
      await writeFile(path.join(uploadDir, filename), buffer)
    } catch (error) {
      // Si hay error al escribir, probablemente el directorio no existe
      const fs = require('fs/promises')
      await fs.mkdir(uploadDir, { recursive: true })
      await writeFile(path.join(uploadDir, filename), buffer)
    }

    // Construir la URL del archivo
    const fileUrl = `/uploads/receipts/${filename}`

    // Actualizar la orden con la URL del comprobante
    if (orderId) {
      await prisma.order.update({
        where: { id: orderId },
        data: {
          paymentReceipt: fileUrl,
          paymentStatus: "PENDING"
        }
      })
    }

    return NextResponse.json({ url: fileUrl })
  } catch (error) {
    console.error("Error al subir la imagen:", error)
    return NextResponse.json({
      error: "Error al subir la imagen",
      details: error instanceof Error ? error.message : "Error desconocido"
    }, { status: 500 })
  }
}

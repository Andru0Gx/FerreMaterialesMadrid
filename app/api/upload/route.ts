import { put } from "@vercel/blob"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No se proporcionó ningún archivo" }, { status: 400 })
    }

    // Verificar el tipo de archivo
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 })
    }

    // Generar un nombre único para el archivo
    const filename = `${Date.now()}-${file.name}`

    // Subir el archivo a Vercel Blob
    const blob = await put(filename, file, {
      access: "public",
    })

    // Devolver la URL del archivo subido
    return NextResponse.json({ url: blob.url })
  } catch (error) {
    console.error("Error al subir la imagen:", error)
    return NextResponse.json({ error: "Error al subir la imagen" }, { status: 500 })
  }
}

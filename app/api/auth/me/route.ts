import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
    try {
        // Obtener el token del header
        const authHeader = request.headers.get("Authorization")
        if (!authHeader) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const token = authHeader.replace("Bearer ", "")

        // Verificar y decodificar el token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string }

        // Buscar el usuario según el rol
        let user
        if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
            user = await prisma.admin.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    status: true,
                    phone: true,
                },
            })

            if (user) {
                // Convertir el formato del admin al formato de usuario
                user = {
                    ...user,
                    isActive: user.status === "ACTIVE",
                    isSubscribed: false,
                }
            }
        } else {
            user = await prisma.user.findUnique({
                where: { id: decoded.id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    isActive: true,
                    phone: true,
                    isSubscribed: true,
                },
            })
        }

        if (!user) {
            return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 })
        }

        return NextResponse.json({ user })
    } catch (error) {
        console.error("Error al obtener usuario:", error)
        return NextResponse.json(
            { error: "Error al obtener usuario" },
            { status: 500 }
        )
    }
} 
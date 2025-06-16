import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET(request: Request) {
    try {
        // Obtener el userId del header de autorización
        const userId = request.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { cart: true }
        })

        return NextResponse.json({ cart: user?.cart || [] })
    } catch (error) {
        console.error('Error fetching cart:', error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        // Obtener el userId del header de autorización
        const userId = request.headers.get('x-user-id')

        if (!userId) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const { cart } = await request.json()

        await prisma.user.update({
            where: { id: userId },
            data: { cart }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating cart:', error)
        return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 })
    }
} 
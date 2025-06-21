import { NextResponse } from 'next/server'
import { getOrders, getOrderById, getOrderItems, createOrder } from '@/lib/db-queries'
import prisma from "@/lib/prisma"
import { getServerSession } from "@/lib/session"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const includeItems = searchParams.get('includeItems') === 'true'

        if (id) {
            const order = await getOrderById(id)
            if (!order.rows[0]) {
                return NextResponse.json(
                    { status: 'error', message: 'Pedido no encontrado' },
                    { status: 404 }
                )
            }

            if (includeItems) {
                const items = await getOrderItems(id)
                return NextResponse.json({
                    ...order.rows[0],
                    items: items.rows
                })
            }

            return NextResponse.json(order.rows[0])
        }

        const result = await getOrders()
        return NextResponse.json(result.rows)
    } catch (error) {
        console.error('Error al obtener pedidos:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al obtener pedidos',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

// Middleware para verificar el token
async function verifyToken(request: Request) {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
        return null
    }

    const token = authHeader.replace("Bearer ", "")
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string }
        return decoded
    } catch (error) {
        return null
    }
}

export async function POST(request: Request) {
    try {
        const decoded = await verifyToken(request)
        if (!decoded) {
            console.log("Token verification failed")
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        console.log("Decoded token:", decoded)

        // Verificar que el usuario existe
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        })

        if (!user) {
            console.log("User not found with ID:", decoded.id)
            return NextResponse.json({
                error: "Usuario no encontrado",
                details: `No se encontró un usuario con el ID: ${decoded.id}`
            }, { status: 404 })
        }

        const data = await request.json()
        const {
            items,
            total,
            shippingAddressId,
            paymentMethod,
            paymentReference,
            paymentReceipt
        } = data

        // Crear la orden
        const order = await prisma.order.create({
            data: {
                userId: user.id,
                status: "PENDING",
                total,
                itemsCount: items.length,
                paymentStatus: "PENDING",
                shippingAddressId,
                items: {
                    create: items.map((item: any) => ({
                        productId: parseInt(item.id),
                        quantity: item.quantity,
                        price: item.price,
                        discount: item.discount || 0
                    }))
                }
            },
            include: {
                items: true,
                shippingAddress: true
            }
        })

        // Actualizar el stock de los productos
        for (const item of items) {
            await prisma.product.update({
                where: { id: parseInt(item.id) },
                data: {
                    stock: {
                        decrement: item.quantity
                    }
                }
            })
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error("Error creating order:", error)
        return NextResponse.json(
            { error: "Error al crear la orden" },
            { status: 500 }
        )
    }
} 
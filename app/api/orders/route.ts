import { NextResponse } from 'next/server'
import { getOrders, getOrderById, getOrderItems, createOrder } from '@/lib/db-queries'
import prisma from "@/lib/prisma"
import jwt from "jsonwebtoken"
import { AccountType, OrderStatus, PaymentStatus } from "@prisma/client"
import { generateOrderNumber } from "@/lib/utils"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const includeItems = searchParams.get('includeItems') === 'true'

        if (id) {
            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    items: includeItems,
                    shippingAddress: true
                }
            })

            if (!order) {
                return NextResponse.json(
                    { status: 'error', message: 'Pedido no encontrado' },
                    { status: 404 }
                )
            }

            return NextResponse.json(order)
        }

        const orders = await prisma.order.findMany({
            include: {
                items: includeItems,
                shippingAddress: true
            }
        })
        return NextResponse.json(orders)
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
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        // Verificar que el usuario existe
        const user = await prisma.user.findUnique({
            where: { id: decoded.id }
        })

        if (!user) {
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
            paymentBank,
            paymentReference,
            phone,
            email,
            discount
        } = data

        if (!paymentBank) {
            return NextResponse.json({
                error: "Datos de pago incompletos",
                details: "Debe seleccionar un banco"
            }, { status: 400 })
        }

        // Generar número de orden
        const orderNumber = await generateOrderNumber()

        // Preparar los datos de la orden
        const orderData: any = {
            orderNumber,
            userId: user.id,
            status: OrderStatus.PENDING,
            total,
            itemsCount: items.length,
            paymentStatus: PaymentStatus.PENDING,
            shippingAddressId,
            phone: phone || user.phone,
            email: email || user.email,
            // Datos del pago
            paymentMethod: paymentMethod as AccountType,
            paymentBank,
            paymentReference,
            items: {
                create: items.map((item: any) => ({
                    productId: parseInt(item.id),
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount || 0
                }))
            }
        }

        // Agregar datos de descuento si existen
        if (discount?.code) {
            orderData.discountCode = discount.code
        }
        if (discount?.discountAmount) {
            orderData.discountAmount = discount.discountAmount
        }

        // Crear la orden
        const order = await prisma.order.create({
            data: orderData,
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
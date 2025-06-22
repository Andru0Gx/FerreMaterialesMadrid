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
        const userId = searchParams.get('userId')
        const includeItems = searchParams.get('includeItems') === 'true'

        if (id) {
            const order = await prisma.order.findUnique({
                where: { id },
                include: {
                    items: {
                        include: {
                            product: true
                        }
                    },
                    shippingAddress: true,
                    user: true
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

        // Si se pasa userId, filtrar por usuario
        let where = {}
        if (userId) {
            where = { userId }
        }

        const orders = await prisma.order.findMany({
            where,
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                shippingAddress: true,
                user: true
            },
            orderBy: {
                createdAt: 'desc'
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
        let decodedUser = null;
        let foundUser = null;
        try {
            decodedUser = await verifyToken(request);
        } catch { }
        if (decodedUser) {
            foundUser = await prisma.user.findUnique({ where: { id: decodedUser.id } });
        }
        const reqData = await request.json();
        // Si no hay usuario, es venta en tienda física
        if (!foundUser) {
            // Validar datos mínimos
            if (!reqData.user?.name || !reqData.items || !Array.isArray(reqData.items) || reqData.items.length === 0) {
                return NextResponse.json({ error: "Datos insuficientes para venta en tienda física" }, { status: 400 });
            }
            // Generar número de orden
            const orderNumber = await generateOrderNumber();
            // Calcular total
            const total = reqData.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
            // Crear la orden
            const itemsToCreate = reqData.items.map((item: any) => {
                const prodId = item.productId !== undefined ? item.productId : item.id;
                const parsedId = parseInt(prodId);
                if (isNaN(parsedId)) {
                    throw new Error(`ID de producto inválido: ${prodId}`);
                }
                return {
                    productId: parsedId,
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount || 0
                };
            });
            const order = await prisma.order.create({
                data: {
                    orderNumber,
                    status: OrderStatus.COMPLETED,
                    total,
                    itemsCount: reqData.items.length,
                    paymentStatus: PaymentStatus.PAID,
                    phone: reqData.user.phone || null,
                    paymentMethod: reqData.paymentMethod || null,
                    paymentReference: reqData.paymentReference || null,
                    notes: reqData.notes || null, // <-- Campo de notas
                    isInStore: reqData.isInStore === true, // Guardar si es venta en tienda
                    nombre: reqData.nombre || reqData.user.name || null, // Guardar nombre del cliente en tienda
                    items: {
                        create: itemsToCreate
                    }
                } as any, // Forzar el tipo para aceptar notes
                include: {
                    items: true
                }
            });
            // Actualizar stock
            for (const item of itemsToCreate) {
                await prisma.product.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } }
                });
            }
            return NextResponse.json(order);
        }

        // Verificar que el usuario existe
        const user = foundUser;
        if (!user) {
            return NextResponse.json({
                error: "Usuario no encontrado",
                details: `No se encontró un usuario con el ID: ${decodedUser?.id}`
            }, { status: 404 })
        }
        const data = reqData;

        if (!data.paymentBank) {
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
            total: data.total,
            itemsCount: data.items.length,
            paymentStatus: PaymentStatus.PENDING,
            shippingAddressId: data.shippingAddressId,
            phone: data.phone || user.phone,
            email: data.email || user.email,
            // Datos del pago
            paymentMethod: data.paymentMethod as AccountType,
            paymentBank: data.paymentBank,
            paymentReference: data.paymentReference,
            notes: data.notes || null,
            items: {
                create: data.items.map((item: any) => ({
                    productId: parseInt(item.id),
                    quantity: item.quantity,
                    price: item.price,
                    discount: item.discount || 0
                }))
            }
        }

        // Agregar datos de descuento si existen
        if (data.discount?.code) {
            orderData.discountCode = data.discount.code
        }
        if (data.discount?.discountAmount) {
            orderData.discountAmount = data.discount.discountAmount
        }

        // Crear la orden
        const order = await prisma.order.create({
            data: orderData,
            include: {
                items: true,
                shippingAddress: true
            }
        })

        // Si la orden tiene código de descuento por uso, descuéntale 1 y desactívalo si llega a 0
        if (data.discount?.code) {
            const promo = await prisma.promotion.findFirst({
                where: { couponCode: data.discount.code }
            })
            if (promo && promo.maxUsage !== null) {
                const newMaxUsage = promo.maxUsage - 1
                await prisma.promotion.update({
                    where: { id: promo.id },
                    data: {
                        maxUsage: newMaxUsage,
                        active: newMaxUsage > 0
                    }
                })
            }
        }

        // Actualizar el stock de los productos
        for (const item of data.items) {
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
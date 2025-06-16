import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import type { CartItem } from "@/lib/types"

// Códigos promocionales de ejemplo (en producción esto vendría de la base de datos)
const promoCodes = [
    {
        code: "DESCUENTO10",
        discountType: "percentage",
        discountValue: 10,
        isActive: true,
    },
    {
        code: "AHORRA5",
        discountType: "fixed",
        discountValue: 5,
        isActive: true,
    },
]

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

        // Obtener el código de descuento de los query params
        const url = new URL(request.url)
        const discountCode = url.searchParams.get('discountCode')?.toUpperCase()

        let cart = user?.cart as CartItem[] || []
        let discount = 0
        let discountInfo = null

        // Si hay un código de descuento, calcular el descuento
        if (discountCode) {
            const promoCode = await prisma.promotion.findFirst({
                where: {
                    couponCode: discountCode,
                    active: true,
                    AND: [
                        {
                            OR: [
                                { startDate: null },
                                { startDate: { lte: new Date() } }
                            ]
                        },
                        {
                            OR: [
                                { endDate: null },
                                { endDate: { gte: new Date() } }
                            ]
                        },
                        {
                            OR: [
                                { maxUsage: null },
                                { maxUsage: { gt: 0 } }
                            ]
                        }
                    ]
                }
            })

            if (promoCode) {
                const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)

                if (promoCode.discountType === "PORCENTAJE") {
                    discount = subtotal * (promoCode.discountValue / 100)
                } else if (promoCode.discountType === "FIJO") {
                    discount = promoCode.discountValue
                }

                discountInfo = {
                    code: promoCode.couponCode,
                    type: promoCode.discountType === "PORCENTAJE" ? "percentage" : "fixed",
                    value: promoCode.discountValue,
                    discountAmount: discount
                }
            }
        }

        return NextResponse.json({
            cart,
            discount: discountInfo
        })
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
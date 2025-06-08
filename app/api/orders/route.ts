import { NextResponse } from 'next/server'
import { getOrders, getOrderById, getOrderItems, createOrder } from '@/lib/db-queries'

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

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { customer_id, items, total_amount, status } = body

        if (!customer_id || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { status: 'error', message: 'Datos de pedido inválidos' },
                { status: 400 }
            )
        }

        const result = await createOrder({
            customer_id,
            items,
            total_amount,
            status: status || 'pending'
        })

        return NextResponse.json(result.rows[0], { status: 201 })
    } catch (error) {
        console.error('Error al crear pedido:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al crear pedido',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
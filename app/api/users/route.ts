import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: Request) {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                addresses: {
                    where: {
                        isDefault: true
                    },
                    select: {
                        address: true,
                        city: true
                    },
                    take: 1
                },
                orders: {
                    select: {
                        id: true,
                        createdAt: true,
                        status: true,
                        total: true,
                        items: {
                            select: {
                                quantity: true,
                                price: true,
                                product: {
                                    select: {
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })

        // Transform the data to match the frontend format
        const transformedUsers = users.map(user => ({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: user.addresses[0] ? `${user.addresses[0].address}, ${user.addresses[0].city}` : '',
            status: user.isActive ? 'active' : 'inactive',
            orders: user.orders.map(order => ({
                id: order.id,
                date: order.createdAt.toISOString(),
                total: order.total,
                status: order.status.toLowerCase(),
                items: order.items.map(item => ({
                    name: item.product.name,
                    price: item.price,
                    quantity: item.quantity
                }))
            })),
            totalSpent: user.orders.reduce((total, order) => total + order.total, 0)
        }))

        return NextResponse.json(transformedUsers)
    } catch (error) {
        console.error('Error al obtener usuarios:', error)
        return NextResponse.json(
            {
                error: 'Error al obtener usuarios',
                details: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json(
                { status: 'error', message: 'ID requerido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const { status } = body

        // Validar que el estado sea válido
        if (!['active', 'inactive'].includes(status)) {
            return NextResponse.json(
                { status: 'error', message: 'Estado inválido. Debe ser "active" o "inactive"' },
                { status: 400 }
            )
        }

        // Actualizar el usuario
        const user = await prisma.user.update({
            where: { id },
            data: {
                isActive: status === 'active'
            }
        })

        return NextResponse.json({
            id: user.id,
            status: user.isActive ? 'active' : 'inactive'
        })
    } catch (error) {
        console.error('Error al actualizar usuario:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al actualizar usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
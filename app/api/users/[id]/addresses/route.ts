import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Prisma } from '@prisma/client'

// Obtener todas las direcciones de un usuario
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id

        const addresses = await prisma.address.findMany({
            where: {
                userId
            },
            orderBy: {
                name: 'asc'
            }
        })

        return NextResponse.json(addresses)
    } catch (error) {
        console.error('Error al obtener direcciones:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al obtener direcciones',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

// Crear una nueva dirección
export async function POST(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const body = await request.json()
        const { name, address, city, zip } = body

        // Validaciones básicas
        if (!name || !address || !city || !zip) {
            return NextResponse.json(
                { status: 'error', message: 'Todos los campos son obligatorios' },
                { status: 400 }
            )
        }

        // Crear la nueva dirección
        const newAddress = await prisma.address.create({
            data: {
                userId,
                name,
                address,
                city,
                zip
            }
        })

        return NextResponse.json(newAddress)
    } catch (error) {
        console.error('Error al crear dirección:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al crear dirección',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

// Actualizar una dirección existente
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const body = await request.json()
        const { id, name, address, city, zip } = body

        if (!id) {
            return NextResponse.json(
                { status: 'error', message: 'ID de dirección requerido' },
                { status: 400 }
            )
        }

        // Validaciones básicas
        if (!name || !address || !city || !zip) {
            return NextResponse.json(
                { status: 'error', message: 'Todos los campos son obligatorios' },
                { status: 400 }
            )
        }

        // Verificar que la dirección pertenece al usuario
        const existingAddress = await prisma.address.findFirst({
            where: {
                id,
                userId
            }
        })

        if (!existingAddress) {
            return NextResponse.json(
                { status: 'error', message: 'Dirección no encontrada' },
                { status: 404 }
            )
        }

        // Actualizar la dirección
        const updatedAddress = await prisma.address.update({
            where: { id },
            data: {
                name,
                address,
                city,
                zip
            }
        })

        return NextResponse.json(updatedAddress)
    } catch (error) {
        console.error('Error al actualizar dirección:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al actualizar dirección',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

// Eliminar una dirección
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const { searchParams } = new URL(request.url)
        const addressId = searchParams.get('addressId')

        if (!addressId) {
            return NextResponse.json(
                { status: 'error', message: 'ID de dirección requerido' },
                { status: 400 }
            )
        }

        // Verificar que la dirección pertenece al usuario
        const address = await prisma.address.findFirst({
            where: {
                id: addressId,
                userId
            }
        })

        if (!address) {
            return NextResponse.json(
                { status: 'error', message: 'Dirección no encontrada' },
                { status: 404 }
            )
        }

        // Eliminar la dirección
        await prisma.address.delete({
            where: { id: addressId }
        })

        return NextResponse.json({ status: 'success', message: 'Dirección eliminada correctamente' })
    } catch (error) {
        console.error('Error al eliminar dirección:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al eliminar dirección',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}
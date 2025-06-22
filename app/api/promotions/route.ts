import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { DiscountType } from '@prisma/client'

// Validar que un string sea un tipo de descuento válido
function isValidDiscountType(type: string): type is keyof typeof DiscountType {
    return Object.keys(DiscountType).includes(type);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (id) {
            const promo = await prisma.promotion.findUnique({ where: { id } })
            if (!promo) return NextResponse.json(null)
            return NextResponse.json(promo)
        }
        const promos = await prisma.promotion.findMany()
        return NextResponse.json(promos)
    } catch (error) {
        console.error('Error al obtener promociones:', error)
        return NextResponse.json({ status: 'error', message: 'Error al obtener promociones', error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        console.log('Body recibido:', body); // Debug log

        const {
            discountType,
            discountValue,
            startDate,
            endDate,
            couponCode,
            maxUsage,
            active,
        } = body

        if (!discountType || typeof discountValue !== 'number' || !couponCode) {
            return NextResponse.json({ status: 'error', message: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // Validar que el tipo de descuento sea válido
        if (!isValidDiscountType(discountType)) {
            console.log('Tipo de descuento recibido:', discountType); // Debug log
            console.log('Tipos válidos:', Object.keys(DiscountType)); // Debug log
            return NextResponse.json({
                status: 'error',
                message: `Tipo de descuento inválido. Debe ser uno de: ${Object.keys(DiscountType).join(', ')}`
            }, { status: 400 })
        }

        // Crear el objeto de datos para Prisma
        const promoData = {
            discountType: DiscountType[discountType],
            discountValue,
            couponCode,
            maxUsage: typeof maxUsage === 'number' ? maxUsage : null,
            active: typeof active === 'boolean' ? active : true,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };

        console.log('Datos a guardar en Prisma:', promoData); // Debug log

        // Si ya existe una promoción con el mismo couponCode, actualízala en vez de crearla
        const existing = await prisma.promotion.findUnique({ where: { couponCode } })
        if (existing) {
            const updated = await prisma.promotion.update({
                where: { id: existing.id },
                data: promoData
            })
            return NextResponse.json(updated)
        }

        // Crear la promoción en Prisma
        const promo = await prisma.promotion.create({
            data: promoData
        });

        return NextResponse.json(promo)
    } catch (error) {
        console.error('Error al crear promoción:', error)
        return NextResponse.json({
            status: 'error',
            message: 'Error al crear promoción',
            error: error instanceof Error ? error.message : 'Error desconocido',
            details: error
        }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) {
            return NextResponse.json({ status: 'error', message: 'ID requerido' }, { status: 400 })
        }
        const body = await request.json()
        console.log('Body recibido:', body); // Debug log

        const {
            discountType,
            discountValue,
            startDate,
            endDate,
            couponCode,
            maxUsage,
            active,
        } = body

        if (!discountType || typeof discountValue !== 'number' || !couponCode) {
            return NextResponse.json({ status: 'error', message: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // Validar que el tipo de descuento sea válido
        if (!isValidDiscountType(discountType)) {
            console.log('Tipo de descuento recibido:', discountType); // Debug log
            console.log('Tipos válidos:', Object.keys(DiscountType)); // Debug log
            return NextResponse.json({
                status: 'error',
                message: `Tipo de descuento inválido. Debe ser uno de: ${Object.keys(DiscountType).join(', ')}`
            }, { status: 400 })
        }

        // Crear el objeto de datos para Prisma
        const updateData = {
            discountType: DiscountType[discountType],
            discountValue,
            couponCode,
            maxUsage: typeof maxUsage === 'number' ? maxUsage : null,
            active: typeof active === 'boolean' ? active : true,
            startDate: startDate ? new Date(startDate) : null,
            endDate: endDate ? new Date(endDate) : null,
        };

        console.log('Datos a actualizar en Prisma:', updateData); // Debug log

        // Actualizar la promoción en Prisma
        const promo = await prisma.promotion.update({
            where: { id },
            data: updateData
        });

        return NextResponse.json(promo)
    } catch (error) {
        console.error('Error al actualizar promoción:', error)
        return NextResponse.json({
            status: 'error',
            message: 'Error al actualizar promoción',
            error: error instanceof Error ? error.message : 'Error desconocido',
            details: error
        }, { status: 500 })
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const type = searchParams.get('type')

        if (type === 'free_shipping') {
            // Eliminar todas las promociones de envío gratis activas
            await prisma.promotion.deleteMany({
                where: {
                    discountType: 'ENVIO_GRATIS',
                    active: true
                }
            })
            return NextResponse.json({ status: 'ok' })
        }

        if (!id) {
            return NextResponse.json({ status: 'error', message: 'ID requerido' }, { status: 400 })
        }

        await prisma.promotion.delete({ where: { id } })
        return NextResponse.json({ status: 'ok' })
    } catch (error) {
        console.error('Error al eliminar promoción:', error)
        return NextResponse.json({ status: 'error', message: 'Error al eliminar promoción', error: error instanceof Error ? error.message : 'Error desconocido' }, { status: 500 })
    }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import slugify from "slugify"

// Lista predefinida de categorías
export const CATEGORIES = [
    'Herramientas',
    'Materiales',
    'Electricidad',
    'Plomeria',
    'Jardineria',
    'Pinturas',
    'Otros',
]

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (id) {
            const numericId = Number(id)
            if (isNaN(numericId)) {
                return NextResponse.json({ status: 'error', message: 'ID inválido' }, { status: 400 })
            }
            const product = await prisma.product.findUnique({ where: { id: numericId }, include: { images: true } })
            if (!product) return NextResponse.json(null)
            return NextResponse.json({
                ...product,
                id: String(product.id),
                images: Array.isArray((product as any).images) ? (product as any).images.map((img: any) => img.imageUrl) : [],
                inStock: typeof (product as any).stock === 'number' ? (product as any).stock > 0 : false,
            })
        }
        const products = await prisma.product.findMany({ include: { images: true } })
        return NextResponse.json(products.map(product => ({
            ...product,
            id: String(product.id),
            images: Array.isArray((product as any).images) ? (product as any).images.map((img: any) => img.imageUrl) : [],
            inStock: typeof (product as any).stock === 'number' ? (product as any).stock > 0 : false,
        })))
    } catch (error) {
        console.error('Error al obtener productos:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al obtener productos',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            name,
            sku,
            price,
            stock,
            shortDescription,
            description,
            specifications,
            images,
            discount,
            inStock,
            slug,
            category // string simple
        } = body

        if (!name || typeof price !== 'number' || isNaN(price)) {
            return NextResponse.json({ status: 'error', message: 'Nombre y precio son obligatorios' }, { status: 400 })
        }

        // Validar categoría
        if (category && !CATEGORIES.includes(category)) {
            return NextResponse.json({ status: 'error', message: 'Categoría no válida' }, { status: 400 })
        }

        // Asegurar que specifications sea objeto/array
        let specs = specifications
        if (typeof specs === 'string') {
            try { specs = JSON.parse(specs) } catch { specs = {} }
        }

        const data: any = {
            name,
            sku: sku || undefined,
            price,
            description,
            shortDescription: shortDescription || undefined,
            discount: discount || 0,
            stock: typeof stock === 'number' ? stock : (typeof stock === 'string' ? parseInt(stock, 10) : 0),
            slug: slug || slugify(name, { lower: true, strict: true }),
            category,
            specifications: specs || {}, // Guardar como JSON
            images: images && Array.isArray(images) && images.length > 0 ? {
                create: images.map((imageUrl: string) => ({ imageUrl }))
            } : undefined,
        }

        const product = await prisma.product.create({ data, include: { images: true } })
        return NextResponse.json({
            ...product,
            id: String(product.id),
            images: Array.isArray(product.images) ? product.images.map((img: any) => img.imageUrl) : [],
            inStock: typeof product.stock === 'number' ? product.stock > 0 : false,
        })
    } catch (error) {
        console.error('Error al crear producto:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al crear producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

export async function PUT(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ status: 'error', message: 'ID requerido' }, { status: 400 })
        }
        const numericId = Number(id)
        const body = await request.json()
        const {
            name,
            sku,
            price,
            stock,
            shortDescription,
            description,
            specifications,
            images,
            discount,
            inStock,
            slug,
            category // string simple
        } = body

        if (!name || typeof price !== 'number' || isNaN(price)) {
            return NextResponse.json({ status: 'error', message: 'Nombre y precio son obligatorios' }, { status: 400 })
        }
        if (category && !CATEGORIES.includes(category)) {
            return NextResponse.json({ status: 'error', message: 'Categoría no válida' }, { status: 400 })
        }

        // Asegurar que specifications sea objeto/array
        let specs = specifications
        if (typeof specs === 'string') {
            try { specs = JSON.parse(specs) } catch { specs = {} }
        }

        const data: any = {
            name,
            sku: sku || undefined,
            price,
            description,
            shortDescription: shortDescription || undefined,
            discount: discount || 0,
            stock: typeof stock === 'number' ? stock : (typeof stock === 'string' ? parseInt(stock, 10) : 0),
            slug: slug || slugify(name, { lower: true, strict: true }),
            category,
            specifications: specs || {}, // Guardar como JSON
        }

        // Si se pasan imágenes, primero eliminamos las existentes y luego creamos las nuevas
        let product: any
        if (images && Array.isArray(images)) {
            // Actualiza el producto
            product = await prisma.product.update({
                where: { id: numericId },
                data,
            })
            // Borra imágenes anteriores
            await prisma.productImage.deleteMany({ where: { productId: product.id } })
            // Crea nuevas imágenes
            if (images.length > 0) {
                await prisma.productImage.createMany({
                    data: images.map((imageUrl: string) => ({ imageUrl, productId: product.id }))
                })
            }
            // Devuelve el producto con imágenes actualizadas
            const updatedProduct = await prisma.product.findUnique({
                where: { id: product.id },
                include: { images: true },
            })
            return NextResponse.json({
                ...updatedProduct,
                id: String(updatedProduct?.id),
                images: Array.isArray(updatedProduct?.images) ? updatedProduct.images.map((img: any) => img.imageUrl) : [],
                inStock: typeof updatedProduct?.stock === 'number' ? updatedProduct.stock > 0 : false,
            })
        } else {
            // Si no se pasan imágenes, solo actualiza el producto
            product = await prisma.product.update({
                where: { id: numericId },
                data,
            })
            const updatedProduct = await prisma.product.findUnique({
                where: { id: numericId },
                include: { images: true },
            })
            return NextResponse.json({
                ...updatedProduct,
                id: String(updatedProduct?.id),
                images: Array.isArray(updatedProduct?.images) ? updatedProduct.images.map((img: any) => img.imageUrl) : [],
                inStock: typeof updatedProduct?.stock === 'number' ? updatedProduct.stock > 0 : false,
            })
        }
    } catch (error) {
        console.error('Error al actualizar producto:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al actualizar producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id || isNaN(Number(id))) {
            return NextResponse.json({ status: 'error', message: 'ID requerido' }, { status: 400 })
        }
        const numericId = Number(id)

        // Primero eliminamos las imágenes asociadas
        await prisma.productImage.deleteMany({
            where: { productId: numericId }
        })

        // Luego eliminamos el producto
        await prisma.product.delete({ where: { id: numericId } })
        return NextResponse.json({ status: 'ok' })
    } catch (error) {
        console.error('Error al eliminar producto:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al eliminar producto',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
import { NextResponse } from 'next/server'
import { getProducts, getProductById, getProductsByCategory } from '@/lib/db-queries'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        const categoryId = searchParams.get('categoryId')

        if (id) {
            const result = await getProductById(id)
            return NextResponse.json(result.rows[0])
        }

        if (categoryId) {
            const result = await getProductsByCategory(categoryId)
            return NextResponse.json(result.rows)
        }

        const result = await getProducts()
        return NextResponse.json(result.rows)
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
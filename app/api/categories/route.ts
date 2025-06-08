import { NextResponse } from 'next/server'
import { getCategories, getCategoryById } from '@/lib/db-queries'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (id) {
            const result = await getCategoryById(id)
            return NextResponse.json(result.rows[0])
        }

        const result = await getCategories()
        return NextResponse.json(result.rows)
    } catch (error) {
        console.error('Error al obtener categorías:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al obtener categorías',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
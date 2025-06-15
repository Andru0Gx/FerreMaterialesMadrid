import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(request: Request) {
    try {
        const { email } = await request.json()

        if (!email) {
            return NextResponse.json(
                { message: 'El correo electrónico es requerido' },
                { status: 400 }
            )
        }

        // Buscar el correo en la tabla de usuarios
        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Si no se encuentra en usuarios, buscar en la tabla de administradores
        const admin = await prisma.admin.findUnique({
            where: { email }
        })

        return NextResponse.json({
            exists: !!(user || admin)
        })

    } catch (error) {
        console.error('Error al verificar el correo:', error)
        return NextResponse.json(
            { message: 'Error al verificar el correo electrónico' },
            { status: 500 }
        )
    }
} 
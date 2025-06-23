import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword, verifyPassword } from '@/lib/auth'

// Obtener un usuario específico
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id

        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                role: true,
                addresses: {
                    select: {
                        id: true,
                        name: true,
                        address: true,
                        city: true,
                        zip: true
                    }
                }
            }
        })

        if (!user) {
            return NextResponse.json(
                { status: 'error', message: 'Usuario no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(user)
    } catch (error) {
        console.error('Error al obtener usuario:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al obtener usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
}

// Actualizar un usuario específico
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const userId = params.id
        const body = await request.json()
        const { name, email, phone, currentPassword, newPassword, isSubscribed } = body

        // Si se están enviando contraseñas, es una actualización de contraseña
        if (currentPassword && newPassword) {
            const user = await prisma.user.findUnique({
                where: { id: userId },
                select: {
                    password: true
                }
            })

            if (!user) {
                return NextResponse.json(
                    { status: 'error', message: 'Usuario no encontrado' },
                    { status: 404 }
                )
            }

            // Verificar la contraseña actual
            const isPasswordValid = verifyPassword(user.password, currentPassword)
            if (!isPasswordValid) {
                return NextResponse.json(
                    { status: 'error', message: 'La contraseña actual es incorrecta' },
                    { status: 400 }
                )
            }

            // Hash de la nueva contraseña
            const hashedPassword = hashPassword(newPassword)

            // Actualizar la contraseña
            await prisma.user.update({
                where: { id: userId },
                data: { password: hashedPassword }
            })

            return NextResponse.json({
                status: 'success',
                message: 'Contraseña actualizada correctamente'
            })
        }

        // Si no hay contraseñas, es una actualización de perfil
        if (!name || !email) {
            return NextResponse.json(
                { status: 'error', message: 'El nombre y email son obligatorios' },
                { status: 400 }
            )
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { status: 'error', message: 'Formato de email inválido' },
                { status: 400 }
            )
        }

        // Verificar si el email ya está en uso por otro usuario
        const existingUser = await prisma.user.findFirst({
            where: {
                email,
                NOT: {
                    id: userId
                }
            }
        })

        if (existingUser) {
            return NextResponse.json(
                { status: 'error', message: 'El email ya está en uso por otro usuario' },
                { status: 400 }
            )
        }

        // Actualizar datos del perfil
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                name,
                email,
                phone,
                isSubscribed: isSubscribed !== undefined ? isSubscribed : undefined
            },
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                isActive: true,
                role: true,
                isSubscribed: true
            }
        })

        return NextResponse.json(updatedUser)
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
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'

// Función para generar el hash de la contraseña
function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

export async function POST(request: Request) {
    try {
        const { email, newPassword } = await request.json()

        if (!email || !newPassword) {
            return NextResponse.json(
                { message: 'El correo electrónico y la nueva contraseña son requeridos' },
                { status: 400 }
            )
        }

        // Buscar el usuario en la tabla de usuarios
        let user = await prisma.user.findUnique({
            where: { email }
        })

        // Si no se encuentra en usuarios, buscar en la tabla de administradores
        let admin = null
        if (!user) {
            admin = await prisma.admin.findUnique({
                where: { email }
            })
        }

        // Si no existe ni como usuario ni como administrador
        if (!user && !admin) {
            return NextResponse.json(
                { message: 'No se encontró una cuenta con este correo electrónico' },
                { status: 404 }
            )
        }

        // Generar el hash de la nueva contraseña
        const hashedPassword = hashPassword(newPassword)

        // Actualizar la contraseña según el tipo de usuario
        if (user) {
            await prisma.user.update({
                where: { email },
                data: { password: hashedPassword }
            })
        } else {
            await prisma.admin.update({
                where: { email },
                data: { password: hashedPassword }
            })
        }

        return NextResponse.json({
            message: 'Contraseña actualizada correctamente'
        })

    } catch (error) {
        console.error('Error al actualizar la contraseña:', error)
        return NextResponse.json(
            { message: 'Error al actualizar la contraseña' },
            { status: 500 }
        )
    }
} 
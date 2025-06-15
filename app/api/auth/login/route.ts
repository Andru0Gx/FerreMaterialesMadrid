import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'
import { Prisma, User, Admin } from '@prisma/client'

interface UserWithPassword extends User {
    password: string;
}

interface AdminWithPassword extends Admin {
    password: string;
}

// Función para verificar la contraseña
function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
    const [salt, hash] = storedPassword.split(':')
    const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex')
    return hash === suppliedHash
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { email, password } = body

        // Validaciones básicas
        if (!email || !password) {
            return NextResponse.json(
                { status: 'error', message: 'Faltan campos obligatorios' },
                { status: 400 }
            )
        }

        // Primero buscar en la tabla de usuarios
        let user = await prisma.user.findUnique({
            where: { email }
        }) as UserWithPassword | null

        // Si no se encuentra en usuarios, buscar en la tabla de administradores
        let admin = null
        if (!user) {
            admin = await prisma.admin.findUnique({
                where: { email }
            }) as AdminWithPassword | null
        }

        // Si no existe ni como usuario ni como administrador
        if (!user && !admin) {
            return NextResponse.json(
                { status: 'error', message: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Verificar la contraseña según el tipo de usuario
        const isValid = user
            ? verifyPassword(user.password, password)
            : verifyPassword(admin!.password, password)

        if (!isValid) {
            return NextResponse.json(
                { status: 'error', message: 'Credenciales inválidas' },
                { status: 401 }
            )
        }

        // Si es un usuario normal
        if (user) {
            // Verificar si el usuario está activo
            if (!user.isActive) {
                return NextResponse.json(
                    { status: 'error', message: 'Tu cuenta está desactivada. Por favor, contacta con soporte.' },
                    { status: 403 }
                )
            }

            // Devolver los datos del usuario (sin la contraseña)
            const { password: _, ...userWithoutPassword } = user
            return NextResponse.json({
                status: 'success',
                user: userWithoutPassword
            })
        }

        // Si es un administrador
        if (admin) {
            // Verificar si el administrador está activo
            if (admin.status !== 'ACTIVE') {
                return NextResponse.json(
                    { status: 'error', message: 'Tu cuenta de administrador está desactivada.' },
                    { status: 403 }
                )
            }

            // Devolver los datos del administrador (sin la contraseña)
            const { password: _, ...adminWithoutPassword } = admin
            return NextResponse.json({
                status: 'success',
                user: {
                    ...adminWithoutPassword,
                    role: admin.role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN'
                }
            })
        }

    } catch (error) {
        console.error('Error al iniciar sesión:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al iniciar sesión',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
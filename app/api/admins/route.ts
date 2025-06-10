import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { AdminRole, AdminStatus, Prisma } from '@prisma/client'
import crypto from 'crypto'

// Función para hashear la contraseña
function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

// Función para verificar la contraseña
function verifyPassword(storedPassword: string, suppliedPassword: string): boolean {
    const [salt, hash] = storedPassword.split(':')
    const suppliedHash = crypto.pbkdf2Sync(suppliedPassword, salt, 1000, 64, 'sha512').toString('hex')
    return hash === suppliedHash
}

// Validar que un string sea un rol de admin válido
function isValidAdminRole(role: string): role is keyof typeof AdminRole {
    return Object.keys(AdminRole).includes(role);
}

// Validar que un string sea un estado de admin válido
function isValidAdminStatus(status: string): status is keyof typeof AdminStatus {
    return Object.keys(AdminStatus).includes(status);
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        const select = {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            status: true,
        } as const

        if (id) {
            const admin = await prisma.admin.findUnique({
                where: { id },
                select
            })
            if (!admin) return NextResponse.json(null)
            return NextResponse.json(admin)
        }

        const admins = await prisma.admin.findMany({
            select
        })
        return NextResponse.json(admins)
    } catch (error) {
        console.error('Error al obtener administradores:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al obtener administradores',
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
            email,
            password,
            role,
            phone,
            status = 'ACTIVE'
        } = body

        // Validaciones básicas
        if (!name || !email || !password || !role) {
            return NextResponse.json(
                { status: 'error', message: 'Faltan campos obligatorios' },
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

        // Validar que el rol sea válido
        if (!isValidAdminRole(role)) {
            return NextResponse.json(
                { status: 'error', message: `Rol inválido. Debe ser uno de: ${Object.keys(AdminRole).join(', ')}` },
                { status: 400 }
            )
        }

        // Validar que el estado sea válido
        if (!isValidAdminStatus(status)) {
            return NextResponse.json(
                { status: 'error', message: `Estado inválido. Debe ser uno de: ${Object.keys(AdminStatus).join(', ')}` },
                { status: 400 }
            )
        }

        // Verificar si ya existe un admin con ese email
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        })

        if (existingAdmin) {
            return NextResponse.json(
                { status: 'error', message: 'Ya existe un administrador con ese email' },
                { status: 400 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = hashPassword(password)

        const select = {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            status: true,
        } as const

        // Crear el administrador
        const createData = {
            name,
            email,
            password: hashedPassword,
            role: role as AdminRole,
            phone,
            status: status as AdminStatus
        } as unknown as Prisma.AdminCreateInput

        const admin = await prisma.admin.create({
            data: createData,
            select
        })

        return NextResponse.json(admin)
    } catch (error) {
        console.error('Error al crear administrador:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al crear administrador',
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

        if (!id) {
            return NextResponse.json(
                { status: 'error', message: 'ID requerido' },
                { status: 400 }
            )
        }

        const body = await request.json()
        const {
            name,
            email,
            role,
            phone,
            status,
            password
        } = body

        // Validaciones básicas
        if (!name || !email || !role) {
            return NextResponse.json(
                { status: 'error', message: 'Faltan campos obligatorios' },
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

        // Validar que el rol sea válido
        if (!isValidAdminRole(role)) {
            return NextResponse.json(
                { status: 'error', message: `Rol inválido. Debe ser uno de: ${Object.keys(AdminRole).join(', ')}` },
                { status: 400 }
            )
        }

        // Validar que el estado sea válido
        if (status && !isValidAdminStatus(status)) {
            return NextResponse.json(
                { status: 'error', message: `Estado inválido. Debe ser uno de: ${Object.keys(AdminStatus).join(', ')}` },
                { status: 400 }
            )
        }

        // Verificar si el email ya está en uso por otro admin
        if (email) {
            const existingAdmin = await prisma.admin.findFirst({
                where: {
                    email,
                    NOT: {
                        id
                    }
                }
            })

            if (existingAdmin) {
                return NextResponse.json(
                    { status: 'error', message: 'El email ya está en uso por otro administrador' },
                    { status: 400 }
                )
            }
        }

        // Preparar los datos para actualizar
        // @ts-ignore - Prisma types are not correctly handling the password field
        const updateData: Prisma.AdminUpdateInput = {
            name,
            email,
            role: role as AdminRole,
            phone,
            status: status ? (status as AdminStatus) : undefined,
            ...(password ? { password: hashPassword(password) } : {})
        }

        const select = {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            status: true,
        } as const

        // Actualizar el administrador
        const admin = await prisma.admin.update({
            where: { id },
            data: updateData,
            select
        })

        return NextResponse.json(admin)
    } catch (error) {
        console.error('Error al actualizar administrador:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al actualizar administrador',
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

        if (!id) {
            return NextResponse.json(
                { status: 'error', message: 'ID requerido' },
                { status: 400 }
            )
        }

        await prisma.admin.delete({ where: { id } })
        return NextResponse.json({ status: 'success', message: 'Administrador eliminado correctamente' })
    } catch (error) {
        console.error('Error al eliminar administrador:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al eliminar administrador',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
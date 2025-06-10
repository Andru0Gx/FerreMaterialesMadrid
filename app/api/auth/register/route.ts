import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import crypto from 'crypto'
import { Role } from '@prisma/client'
import { Prisma } from '@prisma/client'

// Función para hashear la contraseña
function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    return `${salt}:${hash}`
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const {
            name,
            email,
            password,
            phone,
            address,
            city,
            zip
        } = body

        // Validaciones básicas
        if (!name || !email || !password) {
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

        // Validar que la ciudad sea Maturín
        if (city !== "Maturín") {
            return NextResponse.json(
                { status: 'error', message: 'La ciudad debe ser Maturín' },
                { status: 400 }
            )
        }

        // Verificar si ya existe un usuario con ese email
        const existingUser = await prisma.user.findUnique({
            where: { email }
        })

        if (existingUser) {
            return NextResponse.json(
                { status: 'error', message: 'Ya existe un usuario con ese email' },
                { status: 400 }
            )
        }

        // Hash de la contraseña
        const hashedPassword = hashPassword(password)

        // Crear el usuario y su dirección en una transacción
        const result = await prisma.$transaction(async (tx) => {
            // Crear el usuario
            const user = await tx.user.create({
                data: {
                    name,
                    email,
                    password: hashedPassword,
                    role: Role.CUSTOMER,
                    phone,
                    isActive: true,
                    isSubscribed: false
                } as unknown as Prisma.UserCreateInput,
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    phone: true,
                    isActive: true,
                    isSubscribed: true
                }
            })

            // Si se proporcionó una dirección, crearla
            if (address && zip) {
                await tx.address.create({
                    data: {
                        userId: user.id,
                        name: "Principal",
                        address: address,
                        city: city,
                        zip: zip,
                        isDefault: true
                    } as unknown as Prisma.AddressCreateInput
                })
            }

            return user
        })

        return NextResponse.json({
            status: 'success',
            message: 'Usuario registrado correctamente',
            user: result
        })
    } catch (error) {
        console.error('Error al registrar usuario:', error)
        return NextResponse.json(
            {
                status: 'error',
                message: 'Error al registrar usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            },
            { status: 500 }
        )
    }
} 
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "@/lib/session"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

// Middleware para verificar el token
async function verifyToken(request: Request) {
    const authHeader = request.headers.get("Authorization")
    if (!authHeader) {
        return null
    }

    const token = authHeader.replace("Bearer ", "")
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string }
        return decoded
    } catch (error) {
        return null
    }
}

// GET /api/bank-accounts
export async function GET(request: Request) {
    try {
        const accounts = await prisma.bankAccount.findMany()
        return NextResponse.json(accounts)
    } catch (error) {
        console.error("Error al obtener las cuentas bancarias:", error)
        return NextResponse.json(
            { error: "Error al obtener las cuentas bancarias" },
            { status: 500 }
        )
    }
}

// POST /api/bank-accounts
export async function POST(request: Request) {
    try {
        // Verificar autenticación
        const decoded = await verifyToken(request)
        if (!decoded || !["ADMIN", "SUPER_ADMIN"].includes(decoded.role)) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            )
        }

        const data = await request.json()

        // Validar datos requeridos
        if (!data.type || !data.bank || !data.document || !data.accountHolder) {
            return NextResponse.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            )
        }

        // Validar que si es pago móvil tenga teléfono
        if (data.type === "pago-movil" && !data.phone) {
            return NextResponse.json(
                { error: "El teléfono es requerido para Pago Móvil" },
                { status: 400 }
            )
        }

        // Validar que si es transferencia tenga número de cuenta
        if (data.type === "transferencia" && !data.accountNumber) {
            return NextResponse.json(
                { error: "El número de cuenta es requerido para Transferencia" },
                { status: 400 }
            )
        }

        const account = await prisma.bankAccount.create({
            data: {
                type: data.type === "pago-movil" ? "PAGO_MOVIL" : "TRANSFERENCIA",
                bank: data.bank,
                accountNumber: data.accountNumber,
                phone: data.phone,
                document: data.document,
                accountHolder: data.accountHolder,
            },
        })

        return NextResponse.json(account)
    } catch (error) {
        console.error("Error al crear la cuenta bancaria:", error)
        return NextResponse.json(
            { error: "Error al crear la cuenta bancaria" },
            { status: 500 }
        )
    }
}

// PATCH /api/bank-accounts/[id]
export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession()
        if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const data = await request.json()
        const { id } = params

        // Validar datos requeridos
        if (!data.type || !data.bank || !data.document || !data.accountHolder) {
            return NextResponse.json(
                { error: "Faltan datos requeridos" },
                { status: 400 }
            )
        }

        // Validar que si es pago móvil tenga teléfono
        if (data.type === "PAGO_MOVIL" && !data.phone) {
            return NextResponse.json(
                { error: "El teléfono es requerido para Pago Móvil" },
                { status: 400 }
            )
        }

        // Validar que si es transferencia tenga número de cuenta
        if (data.type === "TRANSFERENCIA" && !data.accountNumber) {
            return NextResponse.json(
                { error: "El número de cuenta es requerido para Transferencia" },
                { status: 400 }
            )
        }

        const account = await prisma.bankAccount.update({
            where: { id },
            data: {
                type: data.type,
                bank: data.bank,
                accountNumber: data.accountNumber,
                phone: data.phone,
                document: data.document,
                accountHolder: data.accountHolder,
            },
        })

        return NextResponse.json(account)
    } catch (error) {
        console.error("Error al actualizar la cuenta bancaria:", error)
        return NextResponse.json(
            { error: "Error al actualizar la cuenta bancaria" },
            { status: 500 }
        )
    }
}

// DELETE /api/bank-accounts/[id]
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession()
        if (!session?.user || !["ADMIN", "SUPER_ADMIN"].includes(session.user.role)) {
            return NextResponse.json({ error: "No autorizado" }, { status: 401 })
        }

        const { id } = params

        // En lugar de eliminar, marcamos como inactivo
        const account = await prisma.bankAccount.delete({
            where: { id },
        })

        return NextResponse.json(account)
    } catch (error) {
        console.error("Error al eliminar la cuenta bancaria:", error)
        return NextResponse.json(
            { error: "Error al eliminar la cuenta bancaria" },
            { status: 500 }
        )
    }
} 
import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { cookies } from "next/headers"

// PUT /api/bank-accounts/[id]
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
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
                type: data.type === "PAGO_MOVIL" ? "PAGO_MOVIL" : "TRANSFERENCIA",
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
        const account = await prisma.bankAccount.delete({
            where: {
                id: params.id,
            },
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
import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma"
import { OrderStatus, PaymentStatus } from "@prisma/client"
import jwt from "jsonwebtoken"
import { sendMail } from '@/lib/email'
import { orderStatusUpdateTemplate } from '@/lib/email-templates'
import { COMPANY_INFO } from '@/lib/data'

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

export async function PATCH(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const decoded = await verifyToken(request);
        if (!decoded || !["ADMIN", "SUPER_ADMIN"].includes(decoded.role)) {
            return NextResponse.json(
                { error: "No autorizado" },
                { status: 401 }
            );
        }

        const data = await request.json();
        const { status, paymentStatus } = data;

        const updateData: { status?: OrderStatus; paymentStatus?: PaymentStatus } = {};

        if (status) {
            if (!Object.values(OrderStatus).includes(status)) {
                return NextResponse.json(
                    { error: "Estado de pedido inválido" },
                    { status: 400 }
                );
            }
            updateData.status = status;
        }

        if (paymentStatus) {
            if (!Object.values(PaymentStatus).includes(paymentStatus)) {
                return NextResponse.json(
                    { error: "Estado de pago inválido" },
                    { status: 400 }
                );
            }
            updateData.paymentStatus = paymentStatus;
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No se proporcionaron datos para actualizar" },
                { status: 400 }
            );
        }

        // Run update and history creation atomically
        const result = await prisma.$transaction(async (tx) => {
            const updatedOrder = await tx.order.update({
                where: { id: params.id },
                data: updateData,
                include: {
                    items: { include: { product: true } },
                    shippingAddress: true,
                    user: true,
                },
            });

            // Build history record
            const historyData: any = { orderId: params.id };
            if (updateData.status) historyData.status = updateData.status;
            if (updateData.paymentStatus) historyData.paymentStatus = updateData.paymentStatus;

            await tx.orderHistory.create({ data: historyData });

            // Notificar al cliente por correo si hay email disponible
            let userEmail = updatedOrder.user?.email || updatedOrder.email;
            let userName = updatedOrder.user?.name || updatedOrder.nombre || 'Cliente';
            if (userEmail) {
                // Traducir estados
                const statusMap = {
                    PENDING: 'Pendiente',
                    PROCESSING: 'Procesando',
                    SHIPPED: 'Enviado',
                    CANCELLED: 'Cancelado',
                    COMPLETED: 'Completado',
                    DELIVERED: 'Entregado',
                };
                const paymentStatusMap = {
                    PENDING: 'Pendiente',
                    PAID: 'Aprobado',
                    FAILED: 'Fallido',
                };
                const orderLink = `localhost:3000/mi-cuenta/pedidos/${updatedOrder.id}`;
                await sendMail({
                    to: userEmail,
                    subject: `Actualización de tu pedido ${updatedOrder.orderNumber}`,
                    html: orderStatusUpdateTemplate({
                        user: userName,
                        orderNumber: updatedOrder.orderNumber,
                        newStatus: updateData.status ? statusMap[updateData.status] : undefined,
                        newPaymentStatus: updateData.paymentStatus ? paymentStatusMap[updateData.paymentStatus] : undefined,
                        orderLink,
                    }),
                });
            }

            return updatedOrder;
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error('Error actualizando pedido:', error);
        return NextResponse.json(
            { error: "Error al actualizar el pedido" },
            { status: 500 }
        );
    }
}

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const order = await prisma.order.findUnique({
            where: { id: params.id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                shippingAddress: true,
                user: true
            }
        })

        if (!order) {
            return NextResponse.json(
                { error: "Pedido no encontrado" },
                { status: 404 }
            )
        }

        return NextResponse.json(order)
    } catch (error) {
        console.error('Error obteniendo pedido:', error)
        return NextResponse.json(
            { error: "Error al obtener el pedido" },
            { status: 500 }
        )
    }
}
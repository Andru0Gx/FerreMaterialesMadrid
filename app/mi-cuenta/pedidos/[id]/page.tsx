"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import {
    ChevronLeft,
    CreditCard,
    MapPin,
    AlertCircle,
    Printer,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useExchangeRate } from "@/hooks/use-exchange-rate";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { LogoExtendido } from "@/components/ui/logo";
import { COMPANY_INFO } from "@/lib/data";

// Interfaces basadas en schema.prisma
interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN";
    phone?: string | null;
    isActive: boolean;
    isSubscribed: boolean;
    cart?: any;
    addresses: Address[];
    orders: Order[];
}

interface Address {
    id: string;
    userId: string;
    name: string;
    address: string;
    city: string;
    zip: string;
    user: User;
    orders: Order[];
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    description: string;
    shortDescription: string;
    discount: number;
    stock: number;
    slug: string;
    category: string;
    specifications: any;
    images: ProductImage[];
    orderItems: OrderItem[];
}

interface ProductImage {
    id: number;
    imageUrl: string;
    product: Product;
    productId: number;
}

interface OrderItem {
    id: number;
    orderId: string;
    productId: number;
    quantity: number;
    price: number;
    discount: number;
    createdAt: string;
    order: Order;
    product: Product;
}

interface OrderHistory {
    id: number;
    orderId: string;
    status?:
    | "PENDING"
    | "PROCESSING"
    | "COMPLETED"
    | "CANCELLED"
    | "SHIPPED"
    | null;
    paymentStatus?: "PENDING" | "PAID" | "FAILED" | null;
    changedAt: string;
    order: Order;
}

interface Order {
    id: string;
    orderNumber: string;
    userId?: string | null;
    status: "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "SHIPPED";
    total: number;
    subtotal?: number | null;
    discountAmount?: number | null;
    taxAmount?: number | null;
    shippingAmount?: number | null;
    itemsCount: number;
    phone?: string | null;
    email?: string | null;
    nombre?: string | null;
    isInStore: boolean;
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    shippingAddressId?: string | null;
    paymentReceipt?: string | null;
    discountCode?: string | null;
    createdAt: string;
    updatedAt: string;
    paymentMethod?:
    | "PAGO_MOVIL"
    | "TRANSFERENCIA"
    | "EFECTIVO"
    | "TARJETA"
    | "OTRO"
    | null;
    paymentBank?: string | null;
    paymentReference?: string | null;
    notes?: string | null;
    user?: User | null;
    shippingAddress?: Address | null;
    items: OrderItem[];
    histories: OrderHistory[];
}

// Elimina los datos de ejemplo y usa el estado para el pedido

export default function PedidoDetallePage({
    params,
}: {
    params: { id: string };
}) {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [isNotaDialogOpen, setIsNotaDialogOpen] = useState(false);
    const notaRef = useRef<HTMLDivElement>(null);
    const { rate, loading: rateLoading, error: rateError } = useExchangeRate();

    // Utilidad para formatear moneda
    const formatCurrency = (amount: number) =>
        amount.toLocaleString("es-VE", {
            style: "currency",
            currency: "VES",
            minimumFractionDigits: 2,
        });

    // Utilidad para traducir método de pago
    const translatePaymentMethod = (method: string | null | undefined) => {
        if (!method) return "No especificado";
        const translations: Record<string, string> = {
            PAGO_MOVIL: "Pago Móvil",
            TRANSFERENCIA: "Transferencia",
            EFECTIVO: "Efectivo",
            TARJETA: "Tarjeta",
            OTRO: "Otro",
        };
        return translations[method] || method;
    };

    // Cálculos igual que en el carrito
    const subtotal = order?.subtotal ?? 0;
    const discountAmount = order?.discountAmount ?? 0;
    const tax = order?.taxAmount ?? 0;
    const shipping = order?.shippingAmount ?? 0;
    const total = order?.total ?? 0;

    useEffect(() => {
        if (!authLoading && !user) {
            setRedirectToLogin(true);
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (redirectToLogin) {
            router.push(`/login?redirect=/mi-cuenta/pedidos/${params.id}`);
        }
    }, [redirectToLogin, router, params.id]);

    useEffect(() => {
        if (!user) return;
        setLoading(true);
        fetch(`/api/orders?id=${encodeURIComponent(params.id)}`)
            .then(async (res) => {
                if (!res.ok) throw new Error("No se pudo obtener el pedido");
                const data = await res.json();
                setOrder(data);
            })
            .catch((err) => {
                setOrder(null);
                toast({
                    title: "Error",
                    description: err.message || "No se pudo cargar el pedido",
                    variant: "destructive",
                });
            })
            .finally(() => setLoading(false));
    }, [params.id, user, toast]);

    // Formatear fecha
    interface FormatDate {
        (dateString: string): string;
    }

    const formatDate: FormatDate = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, "d 'de' MMMM, yyyy", { locale: es });
        } catch (error) {
            return dateString;
        }
    };

    // Formatear fecha y hora
    interface FormatDateTime {
        (dateString: string): string;
    }

    const formatDateTime: FormatDateTime = (dateString) => {
        try {
            const date = new Date(dateString);
            return format(date, "d 'de' MMMM, yyyy 'a las' HH:mm", {
                locale: es,
            });
        } catch (error) {
            return dateString;
        }
    };

    // Traducción de estados y colores para badges (como en mi-cuenta/pedidos)
    const translateOrderStatus = (status: string): string => {
        const translations: Record<string, string> = {
            PENDING: "Pendiente",
            PROCESSING: "Procesando",
            SHIPPED: "Enviado",
            CANCELLED: "Cancelado",
            COMPLETED: "Completado",
            DELIVERED: "Entregado",
            completed: "Completado",
            processing: "Procesando",
            shipped: "Enviado",
            cancelled: "Cancelado",
            pending: "Pendiente",
            delivered: "Entregado",
        };
        return translations[status] || status;
    };
    const translatePaymentStatus = (status: string): string => {
        const translations: Record<string, string> = {
            PENDING: "Pendiente",
            PAID: "Aprobado",
            FAILED: "Fallido",
            paid: "Aprobado",
            pending: "Pendiente",
            failed: "Fallido",
            refunded: "Reembolsado",
            REFUNDED: "Reembolsado",
        };
        return translations[status] || status;
    };
    const getStatusColor = (status: string): string => {
        switch (status?.toUpperCase()) {
            case "COMPLETED":
                return "bg-green-100 text-green-800";
            case "PROCESSING":
                return "bg-blue-100 text-blue-800";
            case "SHIPPED":
                return "bg-cyan-100 text-cyan-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "CANCELLED":
                return "bg-red-100 text-red-800";
            case "DELIVERED":
                return "bg-green-200 text-green-900";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };
    const getPaymentStatusColor = (status: string): string => {
        switch (status?.toUpperCase()) {
            case "PAID":
                return "bg-green-100 text-green-800";
            case "PENDING":
                return "bg-yellow-100 text-yellow-800";
            case "FAILED":
                return "bg-red-100 text-red-800";
            case "REFUNDED":
                return "bg-purple-100 text-purple-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (authLoading || loading) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary-color)]"></div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="mb-4">
                        <Link href="/mi-cuenta/pedidos">
                            <ChevronLeft className="mr-1 h-4 w-4" />
                            Volver a mis pedidos
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <AlertCircle className="h-12 w-12 text-red-500" />
                        <h3 className="mt-2 text-lg font-medium">
                            Pedido no encontrado
                        </h3>
                        <p className="mt-1 text-sm text-gray-500">
                            No pudimos encontrar el pedido que estás buscando.
                        </p>
                        <Button
                            className="mt-4 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                            asChild
                        >
                            <Link href="/mi-cuenta/pedidos">
                                Ver todos mis pedidos
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-6">
                <Button variant="ghost" size="sm" asChild className="mb-4">
                    <Link href="/mi-cuenta/pedidos">
                        <ChevronLeft className="mr-1 h-4 w-4" />
                        Volver a mis pedidos
                    </Link>
                </Button>
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">
                            Pedido {order.orderNumber}
                        </h1>
                        <p className="text-gray-500">
                            Realizado el {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-sm font-medium ${getStatusColor(
                                order.status
                            )}`}
                        >
                            {translateOrderStatus(order.status)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {order.items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="flex items-start space-x-4"
                                    >
                                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border">
                                            <img
                                                src={
                                                    item.product.images &&
                                                        item.product.images.length >
                                                        0
                                                        ? item.product.images[0]
                                                            .imageUrl
                                                        : "/placeholder.svg"
                                                }
                                                alt={item.product.name}
                                                className="h-full w-full object-contain"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-base font-medium">
                                                {item.product.name}
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Cantidad: {item.quantity}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-base font-medium">
                                                {item.price
                                                    .toLocaleString("es-MX", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    })
                                                    .replace("USD", "$")}
                                                {rate &&
                                                    !rateLoading && (
                                                        <span className="block text-xs text-gray-500">
                                                            ≈{" "}
                                                            {(
                                                                item.price *
                                                                rate
                                                            ).toLocaleString(
                                                                "es-VE",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "VES",
                                                                }
                                                            )}
                                                        </span>
                                                    )}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Separator className="my-6" />

                            <div className="space-y-1.5">
                                <div className="flex justify-between">
                                    <span className="text-sm">Subtotal</span>
                                    <span className="text-sm font-medium text-right">
                                        {subtotal
                                            .toLocaleString("es-MX", {
                                                style: "currency",
                                                currency: "USD",
                                            })
                                            .replace("USD", "$")}
                                        {rate && !rateLoading && (
                                            <span className="block text-xs text-gray-500 text-right">
                                                ≈{" "}
                                                {(
                                                    subtotal * rate
                                                ).toLocaleString("es-VE", {
                                                    style: "currency",
                                                    currency: "VES",
                                                })}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                {discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="flex items-center">
                                            Descuento
                                        </span>
                                        <span className="text-right">
                                            -
                                            {discountAmount
                                                .toLocaleString("es-MX", {
                                                    style: "currency",
                                                    currency: "USD",
                                                })
                                                .replace("USD", "$")}
                                            {rate && !rateLoading && (
                                                <span className="block text-xs text-right">
                                                    -
                                                    {(
                                                        discountAmount *
                                                        rate
                                                    ).toLocaleString("es-VE", {
                                                        style: "currency",
                                                        currency: "VES",
                                                    })}
                                                </span>
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex justify-between">
                                    <span className="text-sm">
                                        Impuestos (16%)
                                    </span>
                                    <span className="text-sm font-medium text-right">
                                        {tax
                                            .toLocaleString("es-MX", {
                                                style: "currency",
                                                currency: "USD",
                                            })
                                            .replace("USD", "$")}
                                        {rate && !rateLoading && (
                                            <span className="block text-xs text-gray-500 text-right">
                                                ≈{" "}
                                                {(
                                                    tax * rate
                                                ).toLocaleString("es-VE", {
                                                    style: "currency",
                                                    currency: "VES",
                                                })}
                                            </span>
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-sm">Envío</span>
                                    <span className="text-sm font-medium text-right">
                                        {shipping === 0 ? (
                                            <span className="text-green-600">
                                                Gratis
                                            </span>
                                        ) : (
                                            <>
                                                {shipping
                                                    .toLocaleString("es-MX", {
                                                        style: "currency",
                                                        currency: "USD",
                                                    })
                                                    .replace("USD", "$")}
                                                {rate &&
                                                    !rateLoading && (
                                                        <span className="block text-xs text-gray-500 text-right">
                                                            ≈{" "}
                                                            {(
                                                                shipping *
                                                                rate
                                                            ).toLocaleString(
                                                                "es-VE",
                                                                {
                                                                    style: "currency",
                                                                    currency:
                                                                        "VES",
                                                                }
                                                            )}
                                                        </span>
                                                    )}
                                            </>
                                        )}
                                    </span>
                                </div>
                                <Separator className="my-2" />
                                <div className="flex justify-between font-bold">
                                    <span>Total</span>
                                    <span className="font-bold text-right">
                                        {total
                                            .toLocaleString("es-MX", {
                                                style: "currency",
                                                currency: "USD",
                                            })
                                            .replace("USD", "$")}
                                        {rate && !rateLoading && (
                                            <span className="block text-xs text-gray-500 text-right">
                                                ≈{" "}
                                                {(
                                                    total * rate
                                                ).toLocaleString("es-VE", {
                                                    style: "currency",
                                                    currency: "VES",
                                                })}
                                            </span>
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="mt-6">
                        <CardHeader>
                            <CardTitle>Seguimiento del pedido</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {order.histories &&
                                    Array.isArray(order.histories) &&
                                    order.histories.length > 0 ? (
                                    order.histories.map((history, index) => (
                                        <div
                                            key={history.id}
                                            className="mb-8 flex last:mb-0"
                                        >
                                            <div className="flex flex-col items-center mr-4">
                                                <div
                                                    className={`rounded-full h-8 w-8 flex items-center justify-center ${index ===
                                                        order.histories.length -
                                                        1
                                                        ? "bg-[var(--primary-color)] text-white"
                                                        : "bg-gray-200"
                                                        }`}
                                                >
                                                    {index + 1}
                                                </div>
                                                {index <
                                                    order.histories.length -
                                                    1 && (
                                                        <div
                                                            className="flex-1 w-0.5 bg-gray-200"
                                                            style={{
                                                                minHeight: 32,
                                                            }}
                                                        ></div>
                                                    )}
                                            </div>
                                            <div className="pb-8 flex-1">
                                                <div className="flex items-center gap-2">
                                                    {history.status && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                                                                history.status
                                                            )}`}
                                                        >
                                                            {translateOrderStatus(
                                                                history.status
                                                            )}
                                                        </span>
                                                    )}
                                                    {history.paymentStatus && (
                                                        <span
                                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(
                                                                history.paymentStatus
                                                            )}`}
                                                        >
                                                            {translatePaymentStatus(
                                                                history.paymentStatus
                                                            )}
                                                        </span>
                                                    )}
                                                    <span className="ml-2 text-sm text-gray-500">
                                                        {formatDateTime(
                                                            history.changedAt
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-gray-500 text-sm">
                                        No hay historial de cambios para este
                                        pedido.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de envío</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                                <div>
                                    <p className="font-medium">
                                        {order.shippingAddress?.name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.shippingAddress
                                            ? order.shippingAddress.address
                                            : "Dirección no disponible"}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {order.shippingAddress?.city},{" "}
                                        {order.shippingAddress?.zip}
                                    </p>
                                </div>
                            </div>
                            {order.notes && (
                                <div className="mt-4 p-3 bg-gray-50 rounded text-sm">
                                    <p className="font-medium">Notas:</p>
                                    <p className="text-gray-600">
                                        {order.notes}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Método de pago</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center">
                                <CreditCard className="h-5 w-5 text-gray-500 mr-2" />
                                <span>{order.paymentMethod}</span>
                            </div>
                            <div className="mt-2 flex items-center">
                                <span
                                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPaymentStatusColor(
                                        order.paymentStatus
                                    )}`}
                                >
                                    {translatePaymentStatus(
                                        order.paymentStatus
                                    )}
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>¿Necesitas ayuda?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="outline"
                                className="w-full"
                                asChild
                            >
                                <a
                                    href={`https://wa.me/${COMPANY_INFO.telefono.replace(
                                        /\D/g,
                                        ""
                                    )}?text=Hola,%20necesito%20ayuda%20con%20mi%20pedido%20${order.orderNumber
                                        }%20y%20mi%20nota%20de%20compra`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Contactar por WhatsApp
                                </a>
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => setIsNotaDialogOpen(true)}
                            >
                                Ver nota de compra
                            </Button>
                            <Dialog
                                open={isNotaDialogOpen}
                                onOpenChange={setIsNotaDialogOpen}
                            >
                                <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle className="flex items-center justify-between">
                                            <span>
                                                NOTA DE COMPRA{" "}
                                                {order.orderNumber}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => window.print()}
                                            >
                                                <Printer className="h-4 w-4 mr-2" />
                                                Imprimir Nota
                                            </Button>
                                        </DialogTitle>
                                    </DialogHeader>
                                    <div
                                        ref={notaRef}
                                        className="p-8 bg-gray-50 rounded-lg shadow-md"
                                    >
                                        <div className="flex justify-between items-center mb-8 border-b pb-4">
                                            <div className="flex items-center">
                                                <LogoExtendido className="h-12 w-auto" />
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold text-lg text-gray-700">
                                                    {order.orderNumber}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Fecha:{" "}
                                                    {formatDate(
                                                        order.createdAt
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div className="space-y-2">
                                                <p className="font-bold text-sm text-gray-600">
                                                    DATOS DE LA EMPRESA
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    RIF: {COMPANY_INFO.rif}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {COMPANY_INFO.direccion}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Teléfono:{" "}
                                                    {COMPANY_INFO.telefono}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    Email: {COMPANY_INFO.email}
                                                </p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-bold text-sm text-gray-600">
                                                    CLIENTE
                                                </p>
                                                {order.isInStore ? (
                                                    <>
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium">
                                                                Nombre:
                                                            </span>{" "}
                                                            {order.nombre ||
                                                                "Nombre no disponible"}
                                                        </p>
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium">
                                                                Teléfono:
                                                            </span>{" "}
                                                            {order.phone ||
                                                                "Teléfono no disponible"}
                                                        </p>
                                                    </>
                                                ) : (
                                                    <>
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium">
                                                                Nombre:
                                                            </span>{" "}
                                                            {order.user?.name ||
                                                                "Nombre no disponible"}
                                                        </p>
                                                        {order.user?.email && (
                                                            <p className="text-sm text-gray-500">
                                                                <span className="font-medium">
                                                                    Email:
                                                                </span>{" "}
                                                                {
                                                                    order.user
                                                                        ?.email
                                                                }
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            <span className="font-medium">
                                                                Teléfono:
                                                            </span>{" "}
                                                            {order.user
                                                                ?.phone ||
                                                                "Teléfono no disponible"}
                                                        </p>
                                                        {order.shippingAddress && (
                                                            <p className="text-sm text-gray-500">
                                                                <span className="font-medium">
                                                                    Dirección:
                                                                </span>{" "}
                                                                {order
                                                                    .shippingAddress
                                                                    .address ||
                                                                    "Dirección no disponible"}
                                                            </p>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                        <div className="border rounded-md overflow-hidden mb-8">
                                            <table className="w-full border-collapse">
                                                <thead className="bg-gray-100">
                                                    <tr>
                                                        <th className="text-left py-3 px-4 border-b text-sm text-gray-600">
                                                            Producto
                                                        </th>
                                                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">
                                                            Cantidad
                                                        </th>
                                                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">
                                                            Precio Unit. ($)
                                                        </th>
                                                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">
                                                            Precio Unit. (Bs.)
                                                        </th>
                                                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">
                                                            Total ($)
                                                        </th>
                                                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">
                                                            Total (Bs.)
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {order.items.map((item) => (
                                                        <tr
                                                            key={`nota-item-${item.id}`}
                                                            className="bg-white"
                                                        >
                                                            <td className="py-2 px-4 border-b">
                                                                {item.product
                                                                    ?.name ||
                                                                    item.product
                                                                        .name ||
                                                                    "Nombre no disponible"}
                                                            </td>
                                                            <td className="text-right py-2 px-4 border-b">
                                                                {item.quantity}
                                                            </td>
                                                            <td className="text-right py-2 px-4 border-b">
                                                                {item.price.toLocaleString("es-MX", { style: "currency", currency: "USD" }).replace("USD", "$")}
                                                            </td>
                                                            <td className="text-right py-2 px-4 border-b">
                                                                {rate ? `${(item.price * rate).toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}` : '--'}
                                                            </td>
                                                            <td className="text-right py-2 px-4 border-b">
                                                                {(
                                                                    item.price * item.quantity
                                                                )
                                                                    .toLocaleString("es-MX", {
                                                                        style: "currency",
                                                                        currency: "USD",
                                                                    })
                                                                    .replace("USD", "$")}
                                                            </td>
                                                            <td className="text-right py-2 px-4 border-b">
                                                                {rate ? `${(item.price * item.quantity * rate).toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}` : '--'}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="flex justify-end mb-8">
                                            <div className="w-64 space-y-3">
                                                <div className="flex justify-between py-2">
                                                    <span className="font-medium text-gray-600">
                                                        Subtotal:
                                                    </span>
                                                    <span className="text-gray-700">
                                                        {subtotal
                                                            .toLocaleString("es-MX", {
                                                                style: "currency",
                                                                currency: "USD",
                                                            })
                                                            .replace("USD", "$")}
                                                    </span>
                                                    <span className="text-gray-700 ml-4">
                                                        {rate ? `${(subtotal * rate).toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}` : '--'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-2">
                                                    <span className="font-medium text-gray-600">
                                                        IVA (16%):
                                                    </span>
                                                    <span className="text-gray-700">
                                                        {tax
                                                            .toLocaleString("es-MX", {
                                                                style: "currency",
                                                                currency: "USD",
                                                            })
                                                            .replace("USD", "$")}
                                                    </span>
                                                    <span className="text-gray-700 ml-4">
                                                        {rate ? `${(tax * rate).toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}` : '--'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between py-2 border-t mt-2 pt-2">
                                                    <span className="font-bold text-gray-800">
                                                        TOTAL:
                                                    </span>
                                                    <span className="font-bold text-gray-800">
                                                        {total
                                                            .toLocaleString("es-MX", {
                                                                style: "currency",
                                                                currency: "USD",
                                                            })
                                                            .replace("USD", "$")}
                                                    </span>
                                                    <span className="font-bold text-gray-800 ml-4">
                                                        {rate ? `${(total * rate).toLocaleString('es-VE', { style: 'currency', currency: 'VES' })}` : '--'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                            <div>
                                                <h3 className="font-bold mb-2 text-sm text-gray-600">
                                                    FORMA DE PAGO
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {translatePaymentMethod(
                                                        order.paymentMethod
                                                    )}
                                                </p>
                                                {order.paymentReference && (
                                                    <p className="text-sm text-gray-500">
                                                        Referencia:{" "}
                                                        {order.paymentReference}
                                                    </p>
                                                )}
                                            </div>
                                            {order.notes && (
                                                <div>
                                                    <h3 className="font-bold mb-2 text-sm text-gray-600">
                                                        NOTAS
                                                    </h3>
                                                    <p className="text-sm text-gray-500">
                                                        {order.notes}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                        <div className="text-center text-sm mt-12 pt-4 border-t">
                                            <p className="mb-2 text-gray-600">
                                                Gracias por su compra
                                            </p>
                                            <p className="text-gray-500">
                                                Este documento es una nota
                                                válida
                                            </p>
                                        </div>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

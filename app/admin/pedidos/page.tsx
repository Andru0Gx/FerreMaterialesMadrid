"use client"

import { useState, useRef, useEffect, useMemo } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Plus,
  Eye,
  Truck,
  FileText,
  Phone,
  Download,
  Printer,
  Store,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  MoreHorizontal,
  ArrowUpDown,
  Check,
  X
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import type { Order as OriginalOrder } from "@/lib/types"
import useSWR from "swr"

type Order = OriginalOrder & {
  subtotal?: number,
  total?: number,
  taxAmount?: number,
  shippingAmount?: number,
  paymentMethod?: string,
}
import Image from "next/image"
import { LogoExtendido } from "@/components/ui/logo"
import { COMPANY_INFO } from "@/lib/data"

// Actualizar las interfaces
interface OrderItem {
  id: number
  productId: number
  quantity: number
  price: number
  discount: number
  product: {
    id: number
    name: string
    sku: string
    price: number
  }
}

type OrderStatus = "PENDING" | "PROCESSING" | "SHIPPED" | "CANCELLED" | "COMPLETED" | "DELIVERED"
type PaymentStatus = "PENDING" | "PAID" | "FAILED"
type PaymentMethod = "PAGO_MOVIL" | "TRANSFERENCIA"

type SortKey = "orderNumber" | "customer" | "date" | "total" | "status" | "paymentStatus";

type SortConfig = {
  key: SortKey;
  direction: "asc" | "desc";
};

// Actualizar las funciones de traducción
const translateOrderStatus = (status: OrderStatus): string => {
  const translations: Record<OrderStatus, string> = {
    PENDING: "Pendiente",
    PROCESSING: "Procesando",
    SHIPPED: "Enviado",
    CANCELLED: "Cancelado",
    COMPLETED: "Completado",
    DELIVERED: "Entregado", // Agregar valor faltante
  };
  return translations[status] || status;
};

const translatePaymentStatus = (status: PaymentStatus): string => {
  const translations: Record<PaymentStatus, string> = {
    PENDING: "Pendiente",
    PAID: "Aprobado",
    FAILED: "Fallido",
  };
  return translations[status] || status;
};

const translatePaymentMethod = (method: string | null): string => {
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

export default function OrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false)
  const [isAddInStoreOrderOpen, setIsAddInStoreOrderOpen] = useState(false)
  const [isUpdateStatusOpen, setIsUpdateStatusOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [productSearchTerm, setProductSearchTerm] = useState("")
  const [selectedProducts, setSelectedProducts] = useState<any[]>([])
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("")
  const [referenceNumber, setReferenceNumber] = useState<string>("")
  const [customerName, setCustomerName] = useState<string>("")
  const [customerPhone, setCustomerPhone] = useState<string>("")
  const [orderNotes, setOrderNotes] = useState<string>("")
  const [sortColumn, setSortColumn] = useState<SortKey>("orderNumber")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null)
  const [editingProductQuantity, setEditingProductQuantity] = useState<number>(1)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [newStatus, setNewStatus] = useState<OrderStatus>("PROCESSING")
  const [newPaymentStatus, setNewPaymentStatus] = useState<PaymentStatus>("PENDING")
  const invoiceRef = useRef<HTMLDivElement>(null)
  const [isReceiptDialogOpen, setIsReceiptDialogOpen] = useState(false)

  // SWR para pedidos
  const { data: swrOrders, isLoading: swrLoading, mutate } = useSWR('/api/orders', async (url) => {
    const response = await fetch(url)
    if (!response.ok) throw new Error('Error al cargar los pedidos')
    return response.json()
  }, { refreshInterval: 2500 })

  useEffect(() => {
    if (swrOrders) setOrders(swrOrders)
    setLoading(swrLoading)
  }, [swrOrders, swrLoading])

  // Handle column sort
  const handleSort = (column: SortKey) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Actualizar la función de carga de pedidos
  const loadOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/orders')
      if (!response.ok) {
        throw new Error('Error al cargar los pedidos')
      }
      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Error cargando pedidos:', error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los pedidos",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [toast])

  const handleUpdateOrderStatus = async () => {
    if (!selectedOrder || !newStatus) {
      toast({
        title: "Error",
        description: "Por favor selecciona un estado",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status: newStatus,
          paymentStatus: newPaymentStatus
        })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado del pedido')
      }

      const updatedOrder = await response.json()

      // Actualizar la lista de pedidos
      setOrders(orders.map(order =>
        order.id === updatedOrder.id ? updatedOrder : order
      ))

      setIsUpdateStatusOpen(false)
      toast({
        title: "Estado actualizado",
        description: "El estado del pedido ha sido actualizado correctamente",
      })
    } catch (error) {
      console.error('Error actualizando estado:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del pedido",
        variant: "destructive",
      })
    }
  }


  const processedOrders = useMemo(() => {
    let filteredOrders: Order[] = [...orders];

    // Filter by status
    if (statusFilter !== "all") {
      filteredOrders = filteredOrders.filter(order => order.status === statusFilter);
    }

    // Filter by search term
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      filteredOrders = filteredOrders.filter(order => {
        return (
          order.orderNumber.toLowerCase().includes(lowercasedFilter) ||
          (order.user?.name || '').toLowerCase().includes(lowercasedFilter) ||
          (order.user?.email || '').toLowerCase().includes(lowercasedFilter) ||
          translateOrderStatus(order.status).toLowerCase().includes(lowercasedFilter) ||
          translatePaymentStatus(order.paymentStatus).toLowerCase().includes(lowercasedFilter) ||
          order.id.toLowerCase().includes(lowercasedFilter)
        );
      });
    }

    // Sort orders
    const sorted = [...filteredOrders].sort((a, b) => {
      let aValue: string | number = '';
      let bValue: string | number = '';

      switch (sortColumn) {
        case 'orderNumber':
          aValue = a.orderNumber;
          bValue = b.orderNumber;
          break;
        case 'customer':
          aValue = a.user?.name || '';
          bValue = b.user?.name || '';
          break;
        case 'date':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'total':
          aValue = a.total;
          bValue = b.total;
          break;
        case 'status':
          aValue = a.status;
          bValue = b.status;
          break;
        case 'paymentStatus':
          aValue = a.paymentStatus;
          bValue = b.paymentStatus;
          break;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      }
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });

    return sorted;
  }, [orders, searchTerm, statusFilter, sortColumn, sortDirection]);

  // Get all products desde la API
  const [allProducts, setAllProducts] = useState<any[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch('/api/products');
        if (!res.ok) throw new Error('No se pudieron cargar los productos');
        const data = await res.json();
        setAllProducts(data);
      } catch (err) {
        toast({
          title: 'Error',
          description: 'No se pudieron cargar los productos',
          variant: 'destructive',
        });
      }
    };
    fetchProducts();
  }, [toast]);

  // Filter products based on search term
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      String(product.id).toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      (product.sku?.toLowerCase() || '').includes(productSearchTerm.toLowerCase()),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  // Actualizar la función de manejo de vista de detalles
  const handleViewOrderDetail = (order: Order) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  // Actualizar la función de manejo de vista de factura
  const handleViewInvoice = (order: Order) => {
    setSelectedOrder(order)
    setIsInvoiceOpen(true)
  }

  // Agrega este estado al inicio del componente
  const [selectedProductId, setSelectedProductId] = useState<string>("");

  // Modifica la función handleAddProduct
  const handleAddProduct = () => {
    if (!selectedProductId) {
      toast({
        title: "Error",
        description: "Por favor selecciona un producto.",
        variant: "destructive",
      });
      return;
    }

    const product = allProducts.find(p => p.id === selectedProductId);

    if (!product) {
      toast({
        title: "Error",
        description: "Producto no encontrado.",
        variant: "destructive",
      });
      return;
    }

    const quantityInput = document.getElementById("productQuantity") as HTMLInputElement;
    const quantity = Number.parseInt(quantityInput?.value || "1");

    // Verificar si el producto ya está agregado
    const existingProductIndex = selectedProducts.findIndex(p => p.id === product.id);

    if (existingProductIndex >= 0) {
      // Actualizar cantidad si ya existe
      const updatedProducts = [...selectedProducts];
      updatedProducts[existingProductIndex].quantity += quantity;
      setSelectedProducts(updatedProducts);
    } else {
      // Agregar nuevo producto
      setSelectedProducts([
        ...selectedProducts,
        {
          id: product.id,
          name: product.name,
          quantity: quantity,
          price: product.price,
        },
      ]);
    }

    // Reset product selection
    setSelectedProductId("");
    setProductSearchTerm("");
    if (quantityInput) {
      quantityInput.value = "1";
    }

    toast({
      title: "Producto agregado",
      description: `${product.name} agregado a la venta.`,
    });
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = [...selectedProducts]
    newProducts.splice(index, 1)
    setSelectedProducts(newProducts)
  }

  const handleEditProduct = (index: number) => {
    setEditingProductIndex(index)
    setEditingProductQuantity(selectedProducts[index].quantity)
  }

  const handleSaveProductEdit = () => {
    if (editingProductIndex === null) return

    const updatedProducts = [...selectedProducts]
    updatedProducts[editingProductIndex] = {
      ...updatedProducts[editingProductIndex],
      quantity: editingProductQuantity,
    }

    setSelectedProducts(updatedProducts)
    setEditingProductIndex(null)

    toast({
      title: "Producto actualizado",
      description: "La cantidad del producto ha sido actualizada.",
    })
  }

  const calculateTotal = () => {
    return selectedProducts.reduce((total, product) => total + product.price * product.quantity, 0)
  }

  const handleSaveInStoreOrder = async () => {
    if (!customerName || selectedProducts.length === 0 || !selectedPaymentMethod) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos.",
        variant: "destructive",
      })
      return
    }

    // Validate reference number for transfer or mobile payment
    if ((selectedPaymentMethod === "transfer" || selectedPaymentMethod === "mobile") && !referenceNumber) {
      toast({
        title: "Error",
        description: "Por favor ingresa el número de referencia de la transacción.",
        variant: "destructive",
      })
      return
    }

    // Construir el objeto de orden para el backend
    const newOrder = {
      user: {
        name: customerName,
        phone: customerPhone,
      },
      items: selectedProducts.map((p) => ({
        productId: p.id,
        quantity: p.quantity,
        price: p.price,
      })),
      paymentMethod:
        selectedPaymentMethod === "cash"
          ? "EFECTIVO"
          : selectedPaymentMethod === "card"
            ? "TARJETA"
            : selectedPaymentMethod === "transfer"
              ? "TRANSFERENCIA"
              : selectedPaymentMethod === "mobile"
                ? "PAGO_MOVIL"
                : "OTRO",
      paymentStatus: "PAID",
      paymentReference: referenceNumber || null,
      notes: orderNotes,
      isInStore: true, // Nuevo campo para diferenciar venta en tienda
      nombre: customerName, // Guardar nombre del cliente en tienda
    }

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(newOrder),
      })
      if (!response.ok) {
        throw new Error("No se pudo registrar la venta en tienda.")
      }
      // Recargar pedidos desde el backend
      await loadOrders()
      setIsAddInStoreOrderOpen(false)
      setCustomerName("")
      setCustomerPhone("")
      setSelectedProducts([])
      setSelectedPaymentMethod("")
      setReferenceNumber("")
      setOrderNotes("")
      toast({
        title: "Venta registrada",
        description: "La venta en tienda ha sido registrada correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo registrar la venta en tienda.",
        variant: "destructive",
      })
    }
  }

  const handlePrintInvoice = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML
      const originalContents = document.body.innerHTML

      document.body.innerHTML = printContents
      window.print()
      document.body.innerHTML = originalContents

      // Reload the page to restore all event listeners
      window.location.reload()
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-medium">Cargando pedidos...</h2>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Pedidos</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-col md:flex-row gap-4 flex-1">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar pedidos..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="PROCESSING">Procesando</SelectItem>
              <SelectItem value="SHIPPED">Enviado</SelectItem>
              <SelectItem value="CANCELLED">Cancelado</SelectItem>
              <SelectItem value="COMPLETED">Completado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Dialog open={isAddInStoreOrderOpen} onOpenChange={setIsAddInStoreOrderOpen}>
          <DialogTrigger asChild>
            <Button className="w-full md:w-auto">
              <Store className="mr-2 h-4 w-4" />
              Registrar Venta en Tienda
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Registrar Venta en Tienda Física</DialogTitle>
              <DialogDescription>
                Completa el formulario para registrar una venta realizada en la tienda física.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="customerName">Nombre del Cliente</Label>
                  <Input
                    id="customerName"
                    placeholder="Nombre completo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="customerPhone">Teléfono</Label>
                  <Input
                    id="customerPhone"
                    placeholder="+58 412 123 4567"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">Método de Pago</Label>
                <Select
                  value={selectedPaymentMethod}
                  onValueChange={setSelectedPaymentMethod}
                >
                  <SelectTrigger id="paymentMethod" className="bg-white">
                    <SelectValue placeholder="Seleccionar método" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="cash">Efectivo</SelectItem>
                    <SelectItem value="card">Tarjeta</SelectItem>
                    <SelectItem value="transfer">Transferencia</SelectItem>
                    <SelectItem value="mobile">Pago Móvil</SelectItem>
                    <SelectItem value="other">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {(selectedPaymentMethod === "transfer" || selectedPaymentMethod === "mobile") && (
                <div className="space-y-2">
                  <Label htmlFor="referenceNumber">Número de Referencia</Label>
                  <Input
                    id="referenceNumber"
                    placeholder="Número de referencia de la transacción"
                    value={referenceNumber}
                    onChange={(e) => setReferenceNumber(e.target.value)}
                    className="bg-white"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="products">Productos</Label>
                <div className="border rounded-md p-4 space-y-4 bg-white">
                  <div className="space-y-2">
                    <Label htmlFor="productSearch">Buscar Producto (código o nombre)</Label>
                    <Input
                      id="productSearch"
                      placeholder="Buscar producto..."
                      value={productSearchTerm}
                      onChange={(e) => setProductSearchTerm(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedProductId}
                      onValueChange={setSelectedProductId}
                    >
                      <SelectTrigger id="productSelect" className="flex-1 bg-white">
                        <SelectValue placeholder="Seleccionar producto" />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        {filteredProducts.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - {formatCurrency(product.price)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      id="productQuantity"
                      type="number"
                      min="1"
                      placeholder="Cantidad"
                      className="w-24 bg-white"
                      defaultValue="1"
                    />
                    <Button variant="outline" size="icon" onClick={handleAddProduct}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="mt-4 space-y-2">
                      <h4 className="text-sm font-medium">Productos agregados:</h4>
                      <div className="border rounded-md divide-y">
                        {selectedProducts.map((product, index) => (
                          <div key={index} className="p-3 flex justify-between items-center">
                            {editingProductIndex === index ? (
                              <div className="flex items-center gap-2 w-full">
                                <div className="flex-1">
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    Precio: {formatCurrency(product.price)}
                                  </p>
                                </div>
                                <Input
                                  type="number"
                                  min="1"
                                  className="w-20"
                                  value={editingProductQuantity}
                                  onChange={(e) => setEditingProductQuantity(Number(e.target.value))}
                                />
                                <Button
                                  size="sm"
                                  onClick={handleSaveProductEdit}
                                  className="ml-2"
                                >
                                  Guardar
                                </Button>
                              </div>
                            ) : (
                              <>
                                <div>
                                  <p className="font-medium">{product.name}</p>
                                  <p className="text-sm text-muted-foreground">
                                    {product.quantity} × {formatCurrency(product.price)} = {formatCurrency(product.price * product.quantity)}
                                  </p>
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => handleEditProduct(index)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    onClick={() => handleRemoveProduct(index)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between font-medium pt-2">
                        <span>Total:</span>
                        <span>{formatCurrency(calculateTotal())}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  placeholder="Notas adicionales sobre la venta"
                  value={orderNotes}
                  onChange={(e) => setOrderNotes(e.target.value)}
                  className="bg-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddInStoreOrderOpen(false)}>
                Cancelar
              </Button>
              <Button type="button" onClick={handleSaveInStoreOrder}>
                Registrar Venta
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Nueva tabla con diseño mejorado */}
      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("orderNumber")}
                >
                  <div className="flex items-center">
                    ID Pedido
                    {sortColumn === "orderNumber" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center">
                    Cliente
                    {sortColumn === "customer" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("date")}
                >
                  <div className="flex items-center">
                    Fecha
                    {sortColumn === "date" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("total")}
                >
                  <div className="flex items-center">
                    Monto
                    {sortColumn === "total" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("status")}
                >
                  <div className="flex items-center">
                    Estado
                    {sortColumn === "status" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => handleSort("paymentStatus")}
                >
                  <div className="flex items-center">
                    Estado de pago
                    {sortColumn === "paymentStatus" ? (
                      sortDirection === "asc" ? (
                        <ChevronUp className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDown className="ml-1 h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                // Columna para ubicación de compra
                >
                  <div className="flex items-center">
                    Ubicación
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {processedOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-8 text-gray-500">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                processedOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b bg-white hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{order.orderNumber}</td>
                    <td className="px-4 py-3 text-sm">
                      {/* Mostrar nombre de cliente según tipo de compra */}
                      {order.isInStore
                        ? order.nombre || (order.phone ? `Cliente en tienda (${order.phone})` : 'Cliente en tienda')
                        : order.user?.name || 'Cliente no registrado'}
                    </td>
                    <td className="px-4 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString('es-ES')}</td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(order.total)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant="outline"
                        className={`
                          ${order.status === "SHIPPED" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          ${order.status === "PROCESSING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${order.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" : ""}
                          ${order.status === "PENDING" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                          ${order.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        `}
                      >
                        {translateOrderStatus(order.status)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant="outline"
                        className={`
                          ${order.paymentStatus === "PAID" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${order.paymentStatus === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${order.paymentStatus === "FAILED" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        `}
                      >
                        {translatePaymentStatus(order.paymentStatus)}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {/* Nueva columna: tipo de compra */}
                      <Badge variant="secondary">
                        {order.isInStore ? 'Tienda física' : 'En línea'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewOrderDetail(order)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewOrderDetail(order)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedOrder(order)
                            setNewStatus(order.status)
                            setNewPaymentStatus(order.paymentStatus)
                            setIsUpdateStatusOpen(true)
                          }}>
                            <Truck className="mr-2 h-4 w-4" />
                            Actualizar estado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewInvoice(order)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver nota de compra
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="bg-white pb-4 border-b">
            <DialogTitle className="text-2xl">Detalles del Pedido {selectedOrder?.orderNumber}</DialogTitle>
            <DialogDescription>
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-500">
                  Fecha: {selectedOrder && new Date(selectedOrder.createdAt).toLocaleDateString('es-ES')}
                </div>
                <div className="flex gap-2">

                  {
                    selectedOrder && selectedOrder.isInStore ? (
                      <Badge variant="secondary">Venta en Tienda</Badge>
                    ) : (
                      <Badge variant="secondary">Venta en Línea</Badge>
                    )
                  }


                  <Badge
                    variant="outline"
                    className={`
                      ${selectedOrder?.status === "SHIPPED" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                      ${selectedOrder?.status === "PROCESSING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                      ${selectedOrder?.status === "CANCELLED" ? "bg-red-50 text-red-700 border-red-200" : ""}
                      ${selectedOrder?.status === "PENDING" ? "bg-orange-50 text-orange-700 border-orange-200" : ""}
                      ${selectedOrder?.status === "COMPLETED" ? "bg-green-50 text-green-700 border-green-200" : ""}
                    `}
                  >
                    {selectedOrder && translateOrderStatus(selectedOrder.status)}
                  </Badge>
                  <Badge
                    variant="outline"
                    className={`
                      ${selectedOrder?.paymentStatus === "PAID" ? "bg-green-50 text-green-700 border-green-200" : ""}
                      ${selectedOrder?.paymentStatus === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                      ${selectedOrder?.paymentStatus === "FAILED" ? "bg-red-50 text-red-700 border-red-200" : ""}
                    `}
                  >
                    {selectedOrder && translatePaymentStatus(selectedOrder.paymentStatus)}
                  </Badge>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Información del cliente */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-lg">Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      {selectedOrder.isInStore ? (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-medium">{selectedOrder.nombre || "Cliente no registrado"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">{selectedOrder.phone || "No especificado"}</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div>
                            <p className="text-sm text-gray-500">Nombre</p>
                            <p className="font-medium">{selectedOrder.user?.name || "Cliente no registrado"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">{selectedOrder.user?.email}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Teléfono</p>
                            <p className="font-medium">{selectedOrder.user?.phone || "No especificado"}</p>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Dirección de envío o Notas para venta en tienda */}
                <Card>
                  <CardHeader className="bg-gray-50 border-b">
                    <CardTitle className="text-lg">
                      {selectedOrder.isInStore ? "Notas" : "Dirección de Envío"}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4">
                    {selectedOrder.isInStore ? (
                      <div className="space-y-1">
                        <p className="font-medium">{selectedOrder.notes || "Sin notas"}</p>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <p className="font-medium">{selectedOrder.shippingAddress?.name}</p>
                        <p>{selectedOrder.shippingAddress?.address || "Dirección no especificada"}</p>
                        <p>{selectedOrder.shippingAddress?.city || "Ciudad no especificada"}, {selectedOrder.shippingAddress?.zip || "Código postal no especificado"}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Detalles del pago */}
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg">Detalles del Pago</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Método de pago</p>
                      <p className="font-medium">{translatePaymentMethod(selectedOrder.paymentMethod)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Banco</p>
                      <p className="font-medium">{selectedOrder.paymentBank}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Referencia</p>
                      <p className="font-medium">{selectedOrder.paymentReference}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estado del pago</p>
                      <Badge
                        variant="outline"
                        className={`
                          ${selectedOrder.paymentStatus === "PAID" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${selectedOrder.paymentStatus === "PENDING" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${selectedOrder.paymentStatus === "FAILED" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        `}
                      >
                        {translatePaymentStatus(selectedOrder.paymentStatus)}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    {selectedOrder?.paymentReceipt ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => setIsReceiptDialogOpen(true)}
                      >
                        <Eye className="w-4 h-4" />
                        Ver comprobante de pago
                      </Button>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No se ha subido comprobante de pago</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Productos */}
              <Card>
                <CardHeader className="bg-gray-50 border-b">
                  <CardTitle className="text-lg">Productos</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 px-4 text-gray-500 font-medium">Producto</th>
                          <th className="text-right py-2 px-4 text-gray-500 font-medium">Cantidad</th>
                          <th className="text-right py-2 px-4 text-gray-500 font-medium">Precio</th>
                          <th className="text-right py-2 px-4 text-gray-500 font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.items.map((item) => (
                          <tr key={`invoice-item-${item.id}`} className="bg-white">
                            <td className="py-2 px-4 border-b">{allProducts.find(product => product.id === String(item.productId))?.name || "Nombre no disponible"}</td>
                            <td className="text-right py-2 px-4 border-b">{item.quantity}</td>
                            <td className="text-right py-2 px-4 border-b">{formatCurrency(item.price)}</td>
                            <td className="text-right py-2 px-4 border-b">
                              {formatCurrency(item.price * item.quantity)}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan={3} className="text-right py-3 px-4 font-medium">Subtotal</td>
                          <td className="text-right py-3 px-4 font-medium">{formatCurrency(selectedOrder.subtotal ?? 0)}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className={`text-right py-3 px-4 ${selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? 'text-green-600' : 'text-gray-500'}`}>Descuento</td>
                          <td className={`text-right py-3 px-4 ${selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                            {selectedOrder.discountAmount && selectedOrder.discountAmount > 0
                              ? `-${formatCurrency(selectedOrder.discountAmount)}`
                              : formatCurrency(0)}
                          </td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right py-3 px-4 font-medium">IVA (16%)</td>
                          <td className="text-right py-3 px-4 font-medium">{formatCurrency(selectedOrder.taxAmount ?? 0)}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right py-3 px-4 font-medium">Envío</td>
                          <td className="text-right py-3 px-4 font-medium">{selectedOrder.shippingAmount === 0 ? "Gratis" : formatCurrency(selectedOrder.shippingAmount ?? 0)}</td>
                        </tr>
                        <tr>
                          <td colSpan={3} className="text-right py-3 px-4 font-medium">Total</td>
                          <td className="text-right py-3 px-4 font-bold text-lg">{formatCurrency(selectedOrder.total)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Payment Receipt Dialog */}
          <Dialog open={isReceiptDialogOpen} onOpenChange={setIsReceiptDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Comprobante de Pago</DialogTitle>
                <DialogDescription>
                  Referencia: {selectedOrder?.paymentReference}
                </DialogDescription>
              </DialogHeader>
              {selectedOrder?.paymentReceipt && (
                <div className="relative w-full h-[60vh] mt-4">
                  <Image
                    src={`${selectedOrder.paymentReceipt}`}
                    alt="Comprobante de pago"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              )}
            </DialogContent>
          </Dialog>
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualizar Estado del Pedido {selectedOrder?.orderNumber}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            handleUpdateOrderStatus()
          }}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Estado del pedido</Label>
                <Select value={newStatus} onValueChange={(value: OrderStatus) => setNewStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PROCESSING">Procesando</SelectItem>
                    <SelectItem value="SHIPPED">Enviado</SelectItem>
                    <SelectItem value="CANCELLED">Cancelado</SelectItem>
                    <SelectItem value="COMPLETED">Completado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Estado del pago</Label>
                <Select value={newPaymentStatus} onValueChange={(value: PaymentStatus) => setNewPaymentStatus(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING">Pendiente</SelectItem>
                    <SelectItem value="PAID">Aprobado</SelectItem>
                    <SelectItem value="FAILED">Fallido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Actualizar estado</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>NOTA DE COMPRA {selectedOrder.orderNumber}</span>
                  <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir Nota
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div ref={invoiceRef} className="p-8 bg-gray-50 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-8 border-b pb-4">
                  <div className="flex items-center">
                    <LogoExtendido className="h-12 w-auto" />
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-lg text-gray-700">{selectedOrder.orderNumber}</p>
                    <p className="text-sm text-gray-500">Fecha: {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-gray-600">DATOS DE LA EMPRESA</p>
                    <p className="text-sm text-gray-500">RIF: {COMPANY_INFO.rif}</p>
                    <p className="text-sm text-gray-500">{COMPANY_INFO.direccion}</p>
                    <p className="text-sm text-gray-500">Teléfono: {COMPANY_INFO.telefono}</p>
                    <p className="text-sm text-gray-500">Email: {COMPANY_INFO.email}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="font-bold text-sm text-gray-600">CLIENTE</p>
                    {selectedOrder.isInStore ? (
                      <>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Nombre:</span> {selectedOrder.nombre || "Nombre no disponible"}
                        </p>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Teléfono:</span> {selectedOrder.phone || "Teléfono no disponible"}
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Nombre:</span> {selectedOrder.user?.name || "Nombre no disponible"}
                        </p>
                        {selectedOrder.user?.email && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Email:</span> {selectedOrder.user?.email || "Email no disponible"}
                          </p>
                        )}
                        <p className="text-sm text-gray-500">
                          <span className="font-medium">Teléfono:</span> {selectedOrder.user?.phone || "Teléfono no disponible"}
                        </p>
                        {selectedOrder.shippingAddress && (
                          <p className="text-sm text-gray-500">
                            <span className="font-medium">Dirección:</span> {selectedOrder.shippingAddress.address || "Dirección no disponible"}
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
                        <th className="text-left py-3 px-4 border-b text-sm text-gray-600">Producto</th>
                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">Cantidad</th>
                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">Precio Unit.</th>
                        <th className="text-right py-3 px-4 border-b text-sm text-gray-600">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr key={`invoice-item-${item.id}`} className="bg-white">
                          <td className="py-2 px-4 border-b">{allProducts.find(product => product.id === String(item.productId))?.name || "Nombre no disponible"}</td>
                          <td className="text-right py-2 px-4 border-b">{item.quantity}</td>
                          <td className="text-right py-2 px-4 border-b">{formatCurrency(item.price)}</td>
                          <td className="text-right py-2 px-4 border-b">
                            {formatCurrency(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Subtotal:</span>
                      <span className="text-gray-700">{formatCurrency(selectedOrder.subtotal ?? 0)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className={`font-medium ${selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? 'text-green-600' : 'text-gray-500'}`}>Descuento:</span>
                      <span className={selectedOrder.discountAmount && selectedOrder.discountAmount > 0 ? 'text-green-600' : 'text-gray-500'}>
                        {selectedOrder.discountAmount && selectedOrder.discountAmount > 0
                          ? `-${formatCurrency(selectedOrder.discountAmount)}`
                          : formatCurrency(0)}
                      </span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">IVA (16%):</span>
                      <span className="text-gray-700">{formatCurrency(selectedOrder.taxAmount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between py-2">
                      <span className="font-medium text-gray-600">Envío:</span>
                      <span className="text-gray-700">{selectedOrder.shippingAmount === 0 ? "Gratis" : formatCurrency(selectedOrder.shippingAmount ?? 0)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-t mt-2 pt-2">
                      <span className="font-bold text-gray-800">TOTAL:</span>
                      <span className="font-bold text-gray-800">{formatCurrency(selectedOrder.total)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3 className="font-bold mb-2 text-sm text-gray-600">FORMA DE PAGO</h3>
                    <p className="text-sm text-gray-500">{translatePaymentMethod(selectedOrder.paymentMethod)}</p>
                    {selectedOrder.paymentReference && (
                      <p className="text-sm text-gray-500">Referencia: {selectedOrder.paymentReference}</p>
                    )}
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="font-bold mb-2 text-sm text-gray-600">NOTAS</h3>
                      <p className="text-sm text-gray-500">{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm mt-12 pt-4 border-t">
                  <p className="mb-2 text-gray-600">Gracias por su compra</p>
                  <p className="text-gray-500">Este documento es una nota válida</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

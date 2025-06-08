"use client"

import { useState, useRef, useEffect } from "react"
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
  ArrowUpDown
} from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { getProducts } from "@/lib/data"

// Mock orders data
const orders = [
  {
    id: "ORD-001",
    customer: {
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+58 412 123 4567",
      address: "Calle Principal 123, Maturín, Venezuela",
    },
    date: "2023-05-10",
    amount: 125.99,
    status: "Completado",
    paymentMethod: "Transferencia",
    paymentStatus: "Pagado",
    voucherUrl: "/placeholder.svg?height=400&width=300&text=Comprobante",
    referenceNumber: "TX123456789",
    products: [
      { id: "taladro-percutor-750w", name: "Taladro Percutor Profesional 750W", quantity: 1, price: 89.99 },
      { id: "set-destornilladores-precision", name: "Set de Destornilladores de Precisión", quantity: 1, price: 24.99 },
    ],
    notes: "Cliente frecuente, entrega sin problemas.",
    inStore: false,
  },
  {
    id: "ORD-002",
    customer: {
      name: "María López",
      email: "maria.lopez@example.com",
      phone: "+58 412 987 6543",
      address: "Avenida Bolívar 456, Maturín, Venezuela",
    },
    date: "2023-05-09",
    amount: 89.99,
    status: "Enviado",
    paymentMethod: "Efectivo",
    paymentStatus: "Pagado",
    voucherUrl: null,
    referenceNumber: null,
    products: [
      { id: "sierra-circular-1200w", name: "Sierra Circular 1200W con Guía Láser", quantity: 1, price: 129.99 },
    ],
    notes: "",
    inStore: false,
  },
  {
    id: "ORD-003",
    customer: {
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      phone: "+58 414 555 1234",
      address: "Calle Miranda 789, Maturín, Venezuela",
    },
    date: "2023-05-08",
    amount: 54.98,
    status: "Procesando",
    paymentMethod: "Transferencia",
    paymentStatus: "Pendiente",
    voucherUrl: "/placeholder.svg?height=400&width=300&text=Comprobante",
    referenceNumber: "TX987654321",
    products: [
      { id: "martillo-carpintero-fibra", name: "Martillo de Carpintero con Mango de Fibra", quantity: 1, price: 19.99 },
      { id: "pintura-interior-blanco-mate", name: "Pintura Interior Blanco Mate 15L", quantity: 1, price: 39.99 },
    ],
    notes: "Cliente solicitó entrega en horario de tarde.",
    inStore: false,
  },
  {
    id: "ORD-004",
    customer: {
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+58 416 789 0123",
      address: "Urbanización El Centro, Casa 12, Maturín, Venezuela",
    },
    date: "2023-05-07",
    amount: 69.99,
    status: "Completado",
    paymentMethod: "Tarjeta",
    paymentStatus: "Pagado",
    voucherUrl: null,
    referenceNumber: null,
    products: [
      {
        id: "grifo-cocina-monomando",
        name: "Grifo de Cocina Monomando con Ducha Extraíble",
        quantity: 1,
        price: 69.99,
      },
    ],
    notes: "",
    inStore: true,
  },
  {
    id: "ORD-005",
    customer: {
      name: "Pedro Sánchez",
      email: "pedro.sanchez@example.com",
      phone: "+58 424 321 6547",
      address: "Avenida Libertador 234, Maturín, Venezuela",
    },
    date: "2023-05-06",
    amount: 34.99,
    status: "Enviado",
    paymentMethod: "Transferencia",
    paymentStatus: "Pagado",
    voucherUrl: "/placeholder.svg?height=400&width=300&text=Comprobante",
    referenceNumber: "TX456789123",
    products: [
      {
        id: "tijeras-podar-profesionales",
        name: "Tijeras de Podar Profesionales con Mango Ergonómico",
        quantity: 1,
        price: 34.99,
      },
    ],
    notes: "",
    inStore: false,
  },
]

export default function OrdersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
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
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [editingProductIndex, setEditingProductIndex] = useState<number | null>(null)
  const [editingProductQuantity, setEditingProductQuantity] = useState<number>(1)
  const [ordersData, setOrdersData] = useState([...orders])
  const [newStatus, setNewStatus] = useState<string>("")
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>("")
  const invoiceRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  // Get all products
  const allProducts = getProducts()

  // Reset form when dialog opens
  useEffect(() => {
    if (isAddInStoreOrderOpen) {
      setCustomerName("")
      setCustomerPhone("")
      setSelectedProducts([])
      setSelectedPaymentMethod("")
      setReferenceNumber("")
      setOrderNotes("")
      setProductSearchTerm("")
    }
  }, [isAddInStoreOrderOpen])

  // Sort orders based on column and direction
  const sortOrders = (orders: any[]) => {
    if (!sortColumn) return orders

    return [...orders].sort((a, b) => {
      let valueA, valueB

      switch (sortColumn) {
        case "id":
          valueA = a.id
          valueB = b.id
          break
        case "customer":
          valueA = a.customer.name.toLowerCase()
          valueB = b.customer.name.toLowerCase()
          break
        case "date":
          valueA = new Date(a.date).getTime()
          valueB = new Date(b.date).getTime()
          break
        case "amount":
          valueA = a.amount
          valueB = b.amount
          break
        case "status":
          valueA = a.status.toLowerCase()
          valueB = b.status.toLowerCase()
          break
        case "payment":
          valueA = a.paymentStatus.toLowerCase()
          valueB = b.paymentStatus.toLowerCase()
          break
        case "type":
          valueA = a.inStore ? "tienda" : "online"
          valueB = b.inStore ? "tienda" : "online"
          break
        default:
          return 0
      }

      if (valueA < valueB) return sortDirection === "asc" ? -1 : 1
      if (valueA > valueB) return sortDirection === "asc" ? 1 : -1
      return 0
    })
  }

  // Handle column sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  // Filter orders based on search term and status filter
  const filteredOrders = ordersData.filter((order) => {
    // Search filter
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.customer.email && order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()))

    // Status filter
    const matchesStatus = statusFilter === "all" || order.status.toLowerCase() === statusFilter.toLowerCase()

    return matchesSearch && matchesStatus
  })

  // Apply sorting to filtered orders
  const sortedOrders = sortOrders(filteredOrders)

  // Filter products based on search term
  const filteredProducts = allProducts.filter(
    (product) =>
      product.name.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.id.toLowerCase().includes(productSearchTerm.toLowerCase()) ||
      product.sku?.toLowerCase().includes(productSearchTerm.toLowerCase()),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value)
  }

  const handleViewOrderDetail = (order: any) => {
    setSelectedOrder(order)
    setIsOrderDetailOpen(true)
  }

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order)
    setNewStatus(order.status.toLowerCase())
    setNewPaymentStatus(order.paymentStatus.toLowerCase())
    setIsUpdateStatusOpen(true)
  }

  const handleViewInvoice = (order: any) => {
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

  const handleSaveInStoreOrder = () => {
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

    // Create new order
    const newOrder = {
      id: `ORD-${Math.floor(Math.random() * 1000)}`,
      customer: {
        name: customerName,
        phone: customerPhone,
      },
      date: new Date().toISOString().split("T")[0],
      amount: calculateTotal(),
      status: "Completado",
      paymentMethod:
        selectedPaymentMethod === "cash"
          ? "Efectivo"
          : selectedPaymentMethod === "card"
            ? "Tarjeta"
            : selectedPaymentMethod === "transfer"
              ? "Transferencia"
              : selectedPaymentMethod === "mobile"
                ? "Pago Móvil"
                : "Otro",
      paymentStatus: "Pagado",
      referenceNumber: referenceNumber || null,
      products: selectedProducts,
      notes: orderNotes,
      inStore: true,
    }

    // Add new order to the orders data
    setOrdersData([newOrder, ...ordersData])

    // Reset form
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
  }

  const handleSaveStatusUpdate = () => {
    if (!selectedOrder || !newStatus || !newPaymentStatus) return

    // Update the order in the orders data
    const updatedOrders = ordersData.map((order) => {
      if (order.id === selectedOrder.id) {
        return {
          ...order,
          status: newStatus.charAt(0).toUpperCase() + newStatus.slice(1),
          paymentStatus: newPaymentStatus.charAt(0).toUpperCase() + newPaymentStatus.slice(1),
          notes: order.notes ? `${order.notes}\n${orderNotes}` : orderNotes,
        }
      }
      return order
    })

    setOrdersData(updatedOrders)
    setIsUpdateStatusOpen(false)

    toast({
      title: "Estado actualizado",
      description: "El estado del pedido ha sido actualizado correctamente.",
    })
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
              <SelectItem value="procesando">Procesando</SelectItem>
              <SelectItem value="enviado">Enviado</SelectItem>
              <SelectItem value="completado">Completado</SelectItem>
              <SelectItem value="cancelado">Cancelado</SelectItem>
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
                  onClick={() => handleSort("id")}
                >
                  <div className="flex items-center">
                    ID Pedido
                    {sortColumn === "id" ? (
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
                  onClick={() => handleSort("amount")}
                >
                  <div className="flex items-center">
                    Monto
                    {sortColumn === "amount" ? (
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
                  onClick={() => handleSort("payment")}
                >
                  <div className="flex items-center">
                    Pago
                    {sortColumn === "payment" ? (
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
                  onClick={() => handleSort("type")}
                >
                  <div className="flex items-center">
                    Tipo
                    {sortColumn === "type" ? (
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
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {sortedOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    No se encontraron pedidos
                  </td>
                </tr>
              ) : (
                sortedOrders.map((order, index) => (
                  <tr
                    key={order.id}
                    className={`border-b bg-white hover:bg-gray-100 transition-colors`}
                  >
                    <td className="px-4 py-3 text-sm font-medium">{order.id}</td>
                    <td className="px-4 py-3 text-sm">{order.customer.name}</td>
                    <td className="px-4 py-3 text-sm">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-sm">{formatCurrency(order.amount)}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant="outline"
                        className={`
                          ${order.status === "Completado" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${order.status === "Enviado" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                          ${order.status === "Procesando" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${order.status === "Cancelado" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        `}
                      >
                        {order.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant="outline"
                        className={`
                          ${order.paymentStatus === "Pagado" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${order.paymentStatus === "Pendiente" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${order.paymentStatus === "Rechazado" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        `}
                      >
                        {order.paymentStatus}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge variant={order.inStore ? "secondary" : "outline"}>
                        {order.inStore ? "Tienda Física" : "En Línea"}
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
                          <DropdownMenuItem onClick={() => handleUpdateStatus(order)}>
                            <Truck className="mr-2 h-4 w-4" />
                            Actualizar estado
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleViewInvoice(order)}>
                            <FileText className="mr-2 h-4 w-4" />
                            Ver factura
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            <a
                              href={`https://wa.me/${order.customer.phone.replace(/\s+/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Contactar por WhatsApp
                            </a>
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
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles del Pedido #{selectedOrder.id}</DialogTitle>
                <DialogDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div>
                    Fecha: {new Date(selectedOrder.date).toLocaleDateString()} |
                    {selectedOrder.inStore ? " Compra en tienda física" : " Compra online"}
                  </div>
                  <div className="ml-auto">
                    <Badge
                      variant="outline"
                      className={`
                        ${selectedOrder.status === "Completado" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${selectedOrder.status === "Enviado" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                        ${selectedOrder.status === "Procesando" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                        ${selectedOrder.status === "Cancelado" ? "bg-red-50 text-red-700 border-red-200" : ""}
                      `}
                    >
                      Estado: {selectedOrder.status}
                    </Badge>
                  </div>
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Customer Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información del Cliente</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Nombre:</span> {selectedOrder.customer.name}
                    </div>
                    {selectedOrder.customer.email && (
                      <div>
                        <span className="font-medium">Email:</span> {selectedOrder.customer.email}
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">Teléfono:</span> {selectedOrder.customer.phone}
                      </div>
                      <a
                        href={`https://wa.me/${selectedOrder.customer.phone.replace(/\s+/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700"
                      >
                        <Phone className="h-4 w-4" />
                      </a>
                    </div>
                    {selectedOrder.customer.address && (
                      <div>
                        <span className="font-medium">Dirección:</span> {selectedOrder.customer.address}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Payment Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Información de Pago</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <span className="font-medium">Método:</span> {selectedOrder.paymentMethod}
                    </div>
                    <div>
                      <span className="font-medium">Estado:</span>{" "}
                      <Badge
                        variant="outline"
                        className={`
                          ${selectedOrder.paymentStatus === "Pagado" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${selectedOrder.paymentStatus === "Pendiente" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                          ${selectedOrder.paymentStatus === "Rechazado" ? "bg-red-50 text-red-700 border-red-200" : ""}
                        `}
                      >
                        {selectedOrder.paymentStatus}
                      </Badge>
                    </div>
                    {selectedOrder.referenceNumber && (
                      <div>
                        <span className="font-medium">Número de referencia:</span> {selectedOrder.referenceNumber}
                      </div>
                    )}
                    {selectedOrder.voucherUrl && (
                      <div>
                        <span className="font-medium">Comprobante:</span>{" "}
                        <Button variant="link" className="p-0 h-auto" asChild>
                          <a href={selectedOrder.voucherUrl} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-1" />
                            Ver comprobante
                          </a>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Order Items */}
              <Card>
                <CardHeader>
                  <CardTitle>Productos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="text-left py-2 px-4 border-b">Producto</th>
                          <th className="text-right py-2 px-4 border-b">Cantidad</th>
                          <th className="text-right py-2 px-4 border-b">Precio</th>
                          <th className="text-right py-2 px-4 border-b">Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.products.map((product: any, index: number) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                            <td className="py-2 px-4 border-b">{product.name}</td>
                            <td className="text-right py-2 px-4 border-b">{product.quantity}</td>
                            <td className="text-right py-2 px-4 border-b">{formatCurrency(product.price)}</td>
                            <td className="text-right py-2 px-4 border-b">
                              {formatCurrency(product.price * product.quantity)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <div></div>
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Total</div>
                    <div className="text-xl font-bold">{formatCurrency(selectedOrder.amount)}</div>
                  </div>
                </CardFooter>
              </Card>

              {/* Notes */}
              {selectedOrder.notes && (
                <div>
                  <h3 className="font-medium mb-2">Notas:</h3>
                  <p className="text-sm text-muted-foreground">{selectedOrder.notes}</p>
                </div>
              )}

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDetailOpen(false)}>
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setIsOrderDetailOpen(false)
                    handleUpdateStatus(selectedOrder)
                  }}
                >
                  Actualizar Estado
                </Button>
                <Button
                  onClick={() => {
                    setIsOrderDetailOpen(false)
                    handleViewInvoice(selectedOrder)
                  }}
                >
                  Ver Factura
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateStatusOpen} onOpenChange={setIsUpdateStatusOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle>Actualizar Estado del Pedido</DialogTitle>
                <DialogDescription>Actualiza el estado del pedido #{selectedOrder.id}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="status">Estado del Pedido</Label>
                  <Select 
                    value={newStatus || selectedOrder.status.toLowerCase()}
                    onValueChange={setNewStatus}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="procesando">Procesando</SelectItem>
                      <SelectItem value="enviado">Enviado</SelectItem>
                      <SelectItem value="completado">Completado</SelectItem>
                      <SelectItem value="cancelado">Cancelado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentStatus">Estado del Pago</Label>
                  <Select 
                    value={newPaymentStatus || selectedOrder.paymentStatus.toLowerCase()}
                    onValueChange={setNewPaymentStatus}
                  >
                    <SelectTrigger id="paymentStatus">
                      <SelectValue placeholder="Seleccionar estado de pago" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="pagado">Pagado</SelectItem>
                      <SelectItem value="rechazado">Rechazado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="statusNotes">Notas</Label>
                  <Textarea 
                    id="statusNotes" 
                    placeholder="Notas adicionales sobre el cambio de estado"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUpdateStatusOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSaveStatusUpdate}>
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Invoice Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedOrder && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>Factura #{selectedOrder.id}</span>
                  <Button variant="outline" size="sm" onClick={handlePrintInvoice}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div ref={invoiceRef} className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                  <div className="flex items-center">
                    <div className="text-2xl font-bold tracking-tight">FERRE MATERIALES MADRID</div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">FACTURA #{selectedOrder.id}</p>
                    <p>Fecha: {new Date(selectedOrder.date).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-500">DATOS DE LA EMPRESA</p>
                    <p>RIF: J-123456789</p>
                    <p>Av. Principal, Maturín, Venezuela</p>
                    <p>Teléfono: +58 412 123 4567</p>
                    <p>Email: info@ferremadrid.com</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-sm text-gray-500">CLIENTE</p>
                    <p>
                      <span className="font-medium">Nombre:</span> {selectedOrder.customer.name}
                    </p>
                    {selectedOrder.customer.email && (
                      <p>
                        <span className="font-medium">Email:</span> {selectedOrder.customer.email}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Teléfono:</span> {selectedOrder.customer.phone}
                    </p>
                    {selectedOrder.customer.address && (
                      <p>
                        <span className="font-medium">Dirección:</span> {selectedOrder.customer.address}
                      </p>
                    )}
                  </div>
                </div>

                <div className="border rounded-md overflow-hidden mb-6">
                  <table className="w-full border-collapse">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left py-2 px-4 border-b">Producto</th>
                        <th className="text-right py-2 px-4 border-b">Cantidad</th>
                        <th className="text-right py-2 px-4 border-b">Precio Unit.</th>
                        <th className="text-right py-2 px-4 border-b">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.products.map((product: any, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          <td className="py-2 px-4 border-b">{product.name}</td>
                          <td className="text-right py-2 px-4 border-b">{product.quantity}</td>
                          <td className="text-right py-2 px-4 border-b">{formatCurrency(product.price)}</td>
                          <td className="text-right py-2 px-4 border-b">
                            {formatCurrency(product.price * product.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mb-6">
                  <div className="w-64">
                    <div className="flex justify-between py-1">
                      <span className="font-medium">Subtotal:</span>
                      <span>{formatCurrency(selectedOrder.amount)}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="font-medium">IVA (16%):</span>
                      <span>{formatCurrency(selectedOrder.amount * 0.16)}</span>
                    </div>
                    <div className="flex justify-between py-1 border-t mt-1 pt-1">
                      <span className="font-bold">TOTAL:</span>
                      <span className="font-bold">{formatCurrency(selectedOrder.amount * 1.16)}</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <h3 className="font-bold mb-2 text-sm text-gray-500">FORMA DE PAGO</h3>
                    <p>{selectedOrder.paymentMethod}</p>
                    {selectedOrder.referenceNumber && <p>Referencia: {selectedOrder.referenceNumber}</p>}
                  </div>
                  {selectedOrder.notes && (
                    <div>
                      <h3 className="font-bold mb-2 text-sm text-gray-500">NOTAS</h3>
                      <p>{selectedOrder.notes}</p>
                    </div>
                  )}
                </div>

                <div className="text-center text-sm mt-10 pt-4 border-t">
                  <p className="mb-1">Gracias por su compra</p>
                  <p>Este documento es una factura válida para fines fiscales</p>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInvoiceOpen(false)}>
                  Cerrar
                </Button>
                <Button onClick={handlePrintInvoice}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Factura
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

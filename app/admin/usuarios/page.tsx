"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Search,
  MoreVertical,
  Eye,
  Phone,
  Lock,
  UserCog,
  ChevronDown,
  ArrowUpDown,
  ShoppingBag,
  ChevronUp,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

type SortConfig = {
  key: keyof User
  direction: "asc" | "desc"
} | null

interface User {
  id: string
  name: string
  email: string
  phone: string
  address: string
  status: string
  orders: {
    id: string
    orderNumber: string // <-- agregar orderNumber
    date: string
    total: number
    status: string
    items: {
      name: string
      price: number
      quantity: number
    }[]
  }[]
  totalSpent: number
}

export default function UsersPage() {
  const [usersData, setUsersData] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false)
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('/api/users')
        if (!response.ok) throw new Error('Error al cargar los usuarios')
        const data = await response.json()
        setUsersData(data)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "No se pudieron cargar los usuarios. Por favor, intente de nuevo.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchUsers()
  }, [toast])

  // Sort function
  const sortedUsers = [...usersData].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig
    const aValue = a[key]
    const bValue = b[key]

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return direction === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1
    if (aValue > bValue) return direction === "asc" ? 1 : -1
    return 0
  })

  // Request sort
  const requestSort = (key: keyof User) => {
    let direction: "asc" | "desc" = "asc"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc"
    }
    setSortConfig({ key, direction })
  }

  // Filter users based on search term and status filter
  const filteredUsers = sortedUsers.filter((user) => {
    // Search filter
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.toLowerCase().includes(searchTerm.toLowerCase())

    // Status filter
    const matchesStatus = statusFilter === "all" || user.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const handleViewUserDetail = (user: User) => {
    setSelectedUser(user)
    setIsUserDetailOpen(true)
  }

  const handleChangeStatus = (user: User) => {
    setSelectedUser(user)
    setIsChangeStatusOpen(true)
  }

  const handleSaveStatusChange = async () => {
    if (!selectedUser) return

    const statusInput = document.querySelector('input[name="status"]:checked') as HTMLInputElement
    const newStatus = statusInput?.value || selectedUser.status

    try {
      const response = await fetch(`/api/users?id=${selectedUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      })

      if (!response.ok) {
        throw new Error('Error al actualizar el estado')
      }

      setUsersData(prevUsers =>
        prevUsers.map(user =>
          user.id === selectedUser.id ? { ...user, status: newStatus } : user
        )
      )

      setSelectedUser(prev => prev ? { ...prev, status: newStatus } : null)

      setIsChangeStatusOpen(false)
      toast({
        title: "Estado actualizado",
        description: "El estado del usuario ha sido actualizado correctamente.",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del usuario. Por favor, intente de nuevo.",
        variant: "destructive"
      })
    }
  }

  const getSortIcon = (key: keyof User) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">Cargando usuarios...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Gestión de Usuarios</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar usuarios..."
            className="pl-8"
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los usuarios</SelectItem>
            <SelectItem value="active">Usuarios activos</SelectItem>
            <SelectItem value="inactive">Usuarios inactivos</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white rounded-md shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center">
                    Usuario
                    {getSortIcon("name")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("email")}
                >
                  <div className="flex items-center">
                    Email
                    {getSortIcon("email")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("phone")}
                >
                  <div className="flex items-center">
                    Teléfono
                    {getSortIcon("phone")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("status")}
                >
                  <div className="flex items-center">
                    Estado
                    {getSortIcon("status")}
                  </div>
                </th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500">
                    No se encontraron usuarios
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b bg-white hover:bg-gray-100 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm">{user.email}</td>
                    <td className="px-4 py-3 text-sm">{user.phone}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant="outline"
                        className={`
                          ${user.status === "active" ? "bg-green-50 text-green-700 border-green-200" : ""}
                          ${user.status === "inactive" ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
                        `}
                      >
                        {user.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleViewUserDetail(user)}>
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Ver detalles</span>
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Abrir menú</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleViewUserDetail(user)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Phone className="mr-2 h-4 w-4" />
                            <a
                              href={`https://wa.me/${user.phone.replace(/\s+/g, "")}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Contactar por WhatsApp
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleChangeStatus(user)}>
                            <UserCog className="mr-2 h-4 w-4" />
                            Cambiar estado
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

      {/* User Detail Dialog */}
      <Dialog open={isUserDetailOpen} onOpenChange={setIsUserDetailOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Detalles del Usuario</DialogTitle>
                <DialogDescription>Información completa del usuario y su historial de compras.</DialogDescription>
              </DialogHeader>

              <Tabs defaultValue="info" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="info">Información</TabsTrigger>
                  <TabsTrigger value="orders">Historial de Pedidos</TabsTrigger>
                </TabsList>
                <TabsContent value="info" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Información Personal</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="font-medium">Nombre:</span> {selectedUser.name}
                        </div>
                        <div>
                          <span className="font-medium">Email:</span> {selectedUser.email}
                        </div>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="font-medium">Teléfono:</span> {selectedUser.phone}
                          </div>
                          <a
                            href={`https://wa.me/${selectedUser.phone.replace(/\s+/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-600 hover:text-green-700"
                          >
                            <Phone className="h-4 w-4" />
                          </a>
                        </div>
                        <div>
                          <span className="font-medium">Dirección:</span> {selectedUser.address}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Información de la Cuenta</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        <div>
                          <span className="font-medium">ID:</span> {selectedUser.id}
                        </div>
                        <div>
                          <span className="font-medium">Estado:</span>{" "}
                          <Badge
                            variant="outline"
                            className={`
                              ${selectedUser.status === "active" ? "bg-green-50 text-green-700 border-green-200" : ""}
                              ${selectedUser.status === "inactive" ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
                            `}
                          >
                            {selectedUser.status === "active" ? "Activo" : "Inactivo"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="orders" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center">
                        <ShoppingBag className="mr-2 h-5 w-5" />
                        Historial de Pedidos
                      </CardTitle>
                      <CardDescription>
                        El usuario ha realizado {selectedUser.orders?.length || 0} pedidos por un total de $
                        {selectedUser.totalSpent?.toFixed(2) || "0.00"}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {selectedUser.orders && selectedUser.orders.length > 0 ? (
                        <div className="space-y-6">
                          {selectedUser.orders.map((order: any) => (
                            <div key={order.id} className="border rounded-lg p-4">
                              <div className="flex justify-between items-center mb-4">
                                <div>
                                  <h4 className="font-semibold">Pedido {order.orderNumber}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {new Date(order.date).toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge
                                  variant="outline"
                                  className={`
                                    ${order.status === "completed" ? "bg-green-50 text-green-700 border-green-200" : ""}
                                    ${order.status === "processing" ? "bg-yellow-50 text-yellow-700 border-yellow-200" : ""}
                                    ${order.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" : ""}
                                  `}
                                >
                                  {order.status === "completed"
                                    ? "Completado"
                                    : order.status === "processing"
                                      ? "En proceso"
                                      : order.status === "cancelled"
                                        ? "Cancelado"
                                        : order.status}
                                </Badge>
                              </div>
                              <div className="space-y-2">
                                <h5 className="text-sm font-medium">Productos:</h5>
                                <ul className="space-y-1">
                                  {order.items.map((item: any, index: number) => (
                                    <li key={index} className="text-sm flex justify-between">
                                      <span>
                                        {item.quantity}x {item.name}
                                      </span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </li>
                                  ))}
                                </ul>
                                <div className="pt-2 border-t mt-2">
                                  <div className="flex justify-between font-medium">
                                    <span>Total:</span>
                                    <span>${order.total.toFixed(2)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          Este usuario no ha realizado ningún pedido.
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              <DialogFooter>
                <Button variant="outline" onClick={() => setIsUserDetailOpen(false)}>
                  Cerrar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Change Status Dialog */}
      <Dialog open={isChangeStatusOpen} onOpenChange={setIsChangeStatusOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Cambiar Estado del Usuario</DialogTitle>
                <DialogDescription>Cambiar el estado de la cuenta de {selectedUser.name}.</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="active"
                      name="status"
                      value="active"
                      defaultChecked={selectedUser.status === "active"}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="active" className="text-sm font-medium text-gray-900">
                      Activo
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="inactive"
                      name="status"
                      value="inactive"
                      defaultChecked={selectedUser.status === "inactive"}
                      className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                    />
                    <label htmlFor="inactive" className="text-sm font-medium text-gray-900">
                      Inactivo
                    </label>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsChangeStatusOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSaveStatusChange}>
                  Guardar Cambios
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

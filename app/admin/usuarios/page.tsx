"use client"

import { useState } from "react"
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
  Mail,
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
  key: string
  direction: "asc" | "desc"
} | null

export default function UsersPage() {
  const [usersData, setUsersData] = useState([
    {
      id: "1",
      name: "Juan Pérez",
      email: "juan.perez@example.com",
      phone: "+58 412 123 4567",
      address: "Calle Principal 123, Maturín, Venezuela",
      registeredDate: "2023-01-15",
      lastLogin: "2023-05-10",
      status: "active",
      orders: [
        {
          id: "ORD-001",
          date: "2023-04-15",
          total: 125.99,
          status: "completed",
          items: [
            { name: "Taladro Percutor", price: 89.99, quantity: 1 },
            { name: "Juego de Brocas", price: 35.99, quantity: 1 },
          ],
        },
        {
          id: "ORD-005",
          date: "2023-05-02",
          total: 199.76,
          status: "completed",
          items: [
            { name: "Sierra Circular", price: 149.99, quantity: 1 },
            { name: "Disco de Corte", price: 24.99, quantity: 2 },
          ],
        },
      ],
      totalSpent: 325.75,
    },
    {
      id: "2",
      name: "María López",
      email: "maria.lopez@example.com",
      phone: "+58 412 987 6543",
      address: "Avenida Bolívar 456, Maturín, Venezuela",
      registeredDate: "2023-02-20",
      lastLogin: "2023-05-09",
      status: "active",
      orders: [
        {
          id: "ORD-002",
          date: "2023-03-20",
          total: 189.99,
          status: "completed",
          items: [
            { name: "Lijadora Orbital", price: 129.99, quantity: 1 },
            { name: "Papel de Lija (Pack)", price: 19.99, quantity: 3 },
          ],
        },
      ],
      totalSpent: 189.99,
    },
    {
      id: "3",
      name: "Carlos Rodríguez",
      email: "carlos.rodriguez@example.com",
      phone: "+58 414 555 1234",
      address: "Calle Miranda 789, Maturín, Venezuela",
      registeredDate: "2023-03-05",
      lastLogin: "2023-05-08",
      status: "active",
      orders: [
        {
          id: "ORD-003",
          date: "2023-04-05",
          total: 79.99,
          status: "completed",
          items: [
            { name: "Juego de Destornilladores", price: 45.99, quantity: 1 },
            { name: "Cinta Métrica", price: 12.99, quantity: 1 },
            { name: "Nivel de Burbuja", price: 21.0, quantity: 1 },
          ],
        },
        {
          id: "ORD-006",
          date: "2023-05-07",
          total: 74.99,
          status: "processing",
          items: [
            { name: "Martillo de Carpintero", price: 34.99, quantity: 1 },
            { name: "Clavos (Caja)", price: 9.99, quantity: 4 },
          ],
        },
      ],
      totalSpent: 154.98,
    },
    {
      id: "4",
      name: "Ana Martínez",
      email: "ana.martinez@example.com",
      phone: "+58 416 789 0123",
      address: "Urbanización El Centro, Casa 12, Maturín, Venezuela",
      registeredDate: "2023-03-15",
      lastLogin: "2023-05-07",
      status: "inactive",
      orders: [
        {
          id: "ORD-004",
          date: "2023-03-25",
          total: 69.99,
          status: "completed",
          items: [
            { name: "Juego de Llaves Allen", price: 29.99, quantity: 1 },
            { name: "Guantes de Trabajo", price: 19.99, quantity: 2 },
          ],
        },
      ],
      totalSpent: 69.99,
    },
    {
      id: "5",
      name: "Pedro Sánchez",
      email: "pedro.sanchez@example.com",
      phone: "+58 424 321 6547",
      address: "Avenida Libertador 234, Maturín, Venezuela",
      registeredDate: "2023-04-10",
      lastLogin: "2023-05-06",
      status: "active",
      orders: [
        {
          id: "ORD-007",
          date: "2023-04-20",
          total: 84.98,
          status: "completed",
          items: [
            { name: "Alicates", price: 24.99, quantity: 1 },
            { name: "Pinzas", price: 19.99, quantity: 1 },
            { name: "Cortacables", price: 39.99, quantity: 1 },
          ],
        },
      ],
      totalSpent: 84.98,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [isUserDetailOpen, setIsUserDetailOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isChangeStatusOpen, setIsChangeStatusOpen] = useState(false)
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailMessage, setEmailMessage] = useState("")
  const [sortConfig, setSortConfig] = useState<SortConfig>(null)
  const { toast } = useToast()

  // Sort function
  const sortedUsers = [...usersData].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig

    if (a[key] < b[key]) {
      return direction === "asc" ? -1 : 1
    }
    if (a[key] > b[key]) {
      return direction === "asc" ? 1 : -1
    }
    return 0
  })

  // Request sort
  const requestSort = (key: string) => {
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

  const handleViewUserDetail = (user: any) => {
    setSelectedUser(user)
    setIsUserDetailOpen(true)
  }

  const handleResetPassword = (user: any) => {
    setSelectedUser(user)
    setIsResetPasswordOpen(true)
  }

  const handleChangeStatus = (user: any) => {
    setSelectedUser(user)
    setIsChangeStatusOpen(true)
  }

  const handleSendEmail = (user: any) => {
    setSelectedUser(user)
    setEmailSubject("")
    setEmailMessage("")
    setIsEmailDialogOpen(true)
  }

  const handleSaveResetPassword = () => {
    setIsResetPasswordOpen(false)
    toast({
      title: "Contraseña restablecida",
      description: "Se ha enviado un correo al usuario con instrucciones para restablecer su contraseña.",
    })
  }

  const handleSaveStatusChange = () => {
    const newStatus = document.querySelector('input[name="status"]:checked')?.value || selectedUser.status;
    
    setUsersData(prevUsers => 
      prevUsers.map(user => 
        user.id === selectedUser.id ? { ...user, status: newStatus } : user
      )
    );

    setSelectedUser(prev => ({ ...prev, status: newStatus }));

    setIsChangeStatusOpen(false);
    toast({
      title: "Estado actualizado",
      description: "El estado del usuario ha sido actualizado correctamente.",
    });
  }

  const handleSendEmailSubmit = () => {
    setIsEmailDialogOpen(false)
    toast({
      title: "Correo enviado",
      description: `Se ha enviado un correo a ${selectedUser.email} correctamente.`,
    })
  }

  const getSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="ml-1 h-4 w-4" />
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
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
                  onClick={() => requestSort("registeredDate")}
                >
                  <div className="flex items-center">
                    Fecha de Registro
                    {getSortIcon("registeredDate")}
                  </div>
                </th>
                <th
                  className="px-4 py-3 text-left text-sm font-medium text-gray-500 cursor-pointer"
                  onClick={() => requestSort("lastLogin")}
                >
                  <div className="flex items-center">
                    Último Acceso
                    {getSortIcon("lastLogin")}
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
                  <td colSpan={7} className="text-center py-8 text-gray-500">
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
                      {new Date(user.registeredDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {new Date(user.lastLogin).toLocaleDateString()}
                    </td>
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
                          <DropdownMenuItem onClick={() => handleSendEmail(user)}>
                            <Mail className="mr-2 h-4 w-4" />
                            Enviar correo
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
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                            <Lock className="mr-2 h-4 w-4" />
                            Restablecer contraseña
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
                          <span className="font-medium">Fecha de registro:</span>{" "}
                          {new Date(selectedUser.registeredDate).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="font-medium">Último acceso:</span>{" "}
                          {new Date(selectedUser.lastLogin).toLocaleDateString()}
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
                                  <h4 className="font-semibold">Pedido #{order.id}</h4>
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
                <Button
                  onClick={() => {
                    setIsUserDetailOpen(false)
                    handleSendEmail(selectedUser)
                  }}
                >
                  Enviar Mensaje
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Restablecer Contraseña</DialogTitle>
                <DialogDescription>
                  Enviar un correo electrónico para restablecer la contraseña de {selectedUser.name}.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <p className="mb-4">
                  Se enviará un correo electrónico a <strong>{selectedUser.email}</strong> con instrucciones para
                  restablecer la contraseña.
                </p>
                <p className="text-sm text-muted-foreground">El enlace de restablecimiento será válido por 24 horas.</p>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSaveResetPassword}>
                  Enviar Correo
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
                <div className="mt-4">
                  <label htmlFor="statusReason" className="block text-sm font-medium text-gray-700 mb-1">
                    Razón del cambio (opcional)
                  </label>
                  <Input id="statusReason" placeholder="Razón del cambio de estado" />
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

      {/* Send Email Dialog */}
      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {selectedUser && (
            <>
              <DialogHeader>
                <DialogTitle>Enviar Correo Electrónico</DialogTitle>
                <DialogDescription>
                  Enviar un mensaje a {selectedUser.name} ({selectedUser.email}).
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label htmlFor="emailSubject" className="block text-sm font-medium text-gray-700 mb-1">
                    Asunto
                  </label>
                  <Input
                    id="emailSubject"
                    placeholder="Asunto del correo"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </div>
                <div>
                  <label htmlFor="emailMessage" className="block text-sm font-medium text-gray-700 mb-1">
                    Mensaje
                  </label>
                  <Textarea
                    id="emailMessage"
                    placeholder="Escribe tu mensaje aquí..."
                    rows={5}
                    value={emailMessage}
                    onChange={(e) => setEmailMessage(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button type="button" onClick={handleSendEmailSubmit}>
                  Enviar Correo
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

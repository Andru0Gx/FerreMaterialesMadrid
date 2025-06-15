"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/hooks/use-auth"
import {
  Package,
  User,
  LogOut,
  ShoppingBag,
  MapPin,
  Trash,
  PencilLine,
  Plus,
  Check,
  Eye,
  EyeOff,
  ChevronRight,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Address {
  id: string
  name: string
  address: string
  city: string
  zip: string
}

interface FormData {
  name: string
  email: string
  phone: string
  currentPassword: string
  newPassword: string
  confirmPassword: string
  isSubscribed: boolean
}

interface AddressFormData {
  id: string
  name: string
  address: string
  city: string
  zip: string
}

// Datos de ejemplo para pedidos
const clientOrders = [
  {
    id: "ORD-001",
    date: "2023-05-07",
    status: "completed",
    statusText: "Completado",
    total: 250.99,
    items: 3,
  },
  {
    id: "ORD-002",
    date: "2023-06-15",
    status: "processing",
    statusText: "En proceso",
    total: 120.5,
    items: 2,
  },
  {
    id: "ORD-003",
    date: "2023-07-22",
    status: "pending",
    statusText: "Pendiente",
    total: 350.75,
    items: 5,
  },
]

// Datos de ejemplo para direcciones
const initialAddresses = [
  {
    id: "addr-1",
    name: "Casa",
    address: "Calle Principal 123",
    city: "Madrid",
    zip: "28001",
  },
  {
    id: "addr-2",
    name: "Trabajo",
    address: "Avenida Comercial 456",
    city: "Madrid",
    zip: "28045",
  },
]

export default function MiCuentaPage() {
  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("perfil")
  const [addresses, setAddresses] = useState<Address[]>(initialAddresses)

  // Estados para formularios
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
    isSubscribed: false,
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [editingAddress, setEditingAddress] = useState<string | null>(null)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [addressFormData, setAddressFormData] = useState<AddressFormData>({
    id: "",
    name: "",
    address: "",
    city: "",
    zip: "",
  })

  const loadAddresses = async () => {
    try {
      const response = await fetch(`/api/users/${user?.id}/addresses`)
      if (response.ok) {
        const data = await response.json()
        setAddresses(data)
      }
    } catch (error) {
      console.error("Error cargando direcciones:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar las direcciones.",
        variant: "destructive",
      })
    }
  }

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
        isSubscribed: user.isSubscribed || false,
      })
      loadAddresses()
    }
  }, [user])

  // Si no hay usuario, mostrar pantalla de carga
  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })
    router.push("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveProfile = async () => {
    // Validar campos
    if (!formData.name.trim()) {
      toast({
        title: "Error",
        description: "El nombre es obligatorio",
        variant: "destructive",
      })
      return
    }

    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast({
        title: "Error",
        description: "Introduce un correo electrónico válido",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          isSubscribed: formData.isSubscribed
        })
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Error al actualizar el perfil')
      }

      const updatedUser = await response.json()
      updateUser(updatedUser)

      toast({
        title: "Perfil actualizado",
        description: "Tus datos han sido actualizados correctamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar el perfil",
        variant: "destructive"
      })
    }
  }

  const handleChangePassword = async () => {
    // Validar contraseñas
    if (!formData.currentPassword) {
      toast({
        title: "Error",
        description: "Debes introducir tu contraseña actual",
        variant: "destructive",
      })
      return
    }

    if (formData.newPassword.length < 8) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe tener al menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch(`/api/users/${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al cambiar la contraseña')
      }

      // Limpiar campos de contraseña
      setFormData(prev => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }))

      toast({
        title: "Contraseña actualizada",
        description: data.message || "Tu contraseña ha sido actualizada correctamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al cambiar la contraseña",
        variant: "destructive"
      })
    }
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Funciones para gestionar direcciones
  const handleAddAddress = () => {
    setAddressFormData({
      id: "",
      name: "",
      address: "",
      city: "",
      zip: ""
    })
    setEditingAddress(null)
    setIsAddressDialogOpen(true)
  }

  const handleEditAddress = (address: Address) => {
    setAddressFormData(address)
    setEditingAddress(address.id)
    setIsAddressDialogOpen(true)
  }

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const response = await fetch(`/api/users/${user.id}/addresses?addressId=${addressId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Error al eliminar la dirección')
      }

      await loadAddresses()

      toast({
        title: "Dirección eliminada",
        description: "La dirección ha sido eliminada correctamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "No se pudo eliminar la dirección",
        variant: "destructive"
      })
    }
  }

  const handleAddressInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveAddress = async () => {
    try {
      // Validar campos
      if (!addressFormData.name || !addressFormData.address || !addressFormData.city || !addressFormData.zip) {
        toast({
          title: "Error",
          description: "Todos los campos son obligatorios",
          variant: "destructive",
        })
        return
      }

      const method = editingAddress ? 'PUT' : 'POST'
      const response = await fetch(`/api/users/${user.id}/addresses`, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: editingAddress ? addressFormData.id : undefined,
          name: addressFormData.name,
          address: addressFormData.address,
          city: addressFormData.city,
          zip: addressFormData.zip
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Error al guardar la dirección')
      }

      await loadAddresses()
      setIsAddressDialogOpen(false)
      setAddressFormData({
        id: "",
        name: "",
        address: "",
        city: "",
        zip: ""
      })

      toast({
        title: editingAddress ? "Dirección actualizada" : "Dirección agregada",
        description: editingAddress
          ? "La dirección ha sido actualizada correctamente"
          : "La dirección ha sido agregada correctamente",
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la dirección",
        variant: "destructive"
      })
    }
  }

  // Formatear fecha
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return format(date, "d 'de' MMMM, yyyy", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Función para obtener el color de badge según el estado
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-blue-100 text-blue-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid gap-8 md:grid-cols-[250px_1fr]">
        {/* Sidebar en desktop / Tabs en móvil */}
        <div className="hidden md:block">
          <Card>
            <CardHeader>
              <CardTitle>Mi cuenta</CardTitle>
              <CardDescription>Gestiona tu información y pedidos</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col space-y-1">
                <Button
                  variant={activeTab === "perfil" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "perfil" ? "bg-[var(--primary-color)]" : ""}`}
                  onClick={() => setActiveTab("perfil")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Perfil
                </Button>
                <Button
                  variant={activeTab === "pedidos" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "pedidos" ? "bg-[var(--primary-color)]" : ""}`}
                  onClick={() => setActiveTab("pedidos")}
                >
                  <Package className="mr-2 h-4 w-4" />
                  Mis pedidos
                </Button>
                <Button
                  variant={activeTab === "direcciones" ? "default" : "ghost"}
                  className={`justify-start ${activeTab === "direcciones" ? "bg-[var(--primary-color)]" : ""}`}
                  onClick={() => setActiveTab("direcciones")}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Direcciones
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Tabs para móvil */}
        <div className="md:hidden">
          <Tabs defaultValue="perfil" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="perfil">
                <User className="mr-2 h-4 w-4" />
                Perfil
              </TabsTrigger>
              <TabsTrigger value="pedidos">
                <Package className="mr-2 h-4 w-4" />
                Pedidos
              </TabsTrigger>
              <TabsTrigger value="direcciones">
                <MapPin className="mr-2 h-4 w-4" />
                Direcciones
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Contenido principal */}
        <div>
          {activeTab === "perfil" && (
            <Card>
              <CardHeader>
                <CardTitle>Información personal</CardTitle>
                <CardDescription>Actualiza tu información personal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} />
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="notifications"
                      name="isSubscribed"
                      className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                      checked={formData.isSubscribed}
                      onChange={handleInputChange}
                    />
                    <Label htmlFor="notifications" className="text-sm font-normal">
                      Recibir notificaciones sobre ofertas y novedades
                    </Label>
                  </div>
                </div>

                <div>
                  <Button
                    className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                    onClick={handleSaveProfile}
                  >
                    Guardar cambios
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-medium mb-4">Cambiar contraseña</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Contraseña actual</Label>
                      <div className="relative">
                        <Input
                          id="current-password"
                          name="currentPassword"
                          type={showPassword.current ? "text" : "password"}
                          value={formData.currentPassword}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => togglePasswordVisibility("current")}
                        >
                          {showPassword.current ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">Nueva contraseña</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          name="newPassword"
                          type={showPassword.new ? "text" : "password"}
                          value={formData.newPassword}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => togglePasswordVisibility("new")}
                        >
                          {showPassword.new ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showPassword.confirm ? "text" : "password"}
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          onClick={() => togglePasswordVisibility("confirm")}
                        >
                          {showPassword.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                  onClick={handleChangePassword}
                >
                  Cambiar contraseña
                </Button>
              </CardFooter>
            </Card>
          )}

          {activeTab === "pedidos" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mis pedidos</CardTitle>
                  <CardDescription>Historial de tus compras recientes</CardDescription>
                </div>
                <Button asChild variant="outline">
                  <Link href="/mi-cuenta/pedidos">
                    Ver todos
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardHeader>
              <CardContent>
                {clientOrders.length > 0 ? (
                  <div className="space-y-4">
                    {clientOrders.map((order) => (
                      <div key={order.id} className="rounded-lg border p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <p className="font-medium">Pedido #{order.id}</p>
                            <p className="text-sm text-gray-500">{formatDate(order.date)}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{order.total.toFixed(2)} €</p>
                            <p className="text-sm text-gray-500">{order.items} productos</p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center justify-between">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                              order.status,
                            )}`}
                          >
                            {order.statusText}
                          </span>
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/mi-cuenta/pedidos/${order.id}`}>Ver detalles</Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No tienes pedidos</h3>
                    <p className="mt-1 text-sm text-gray-500">Cuando realices una compra, aparecerá aquí.</p>
                    <Button className="mt-4 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90">
                      <Link href="/productos">Ir a comprar</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {activeTab === "direcciones" && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Mis direcciones</CardTitle>
                  <CardDescription>Gestiona tus direcciones de envío</CardDescription>
                </div>
                <Button
                  onClick={handleAddAddress}
                  className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Añadir dirección
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map((address) => (
                    <div key={address.id} className="rounded-lg border p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center">
                            <p className="font-medium">{address.name}</p>
                          </div>
                          <p className="text-sm text-gray-500">{address.address}</p>
                          <p className="text-sm text-gray-500">
                            {address.city} {address.zip}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)}>
                            <PencilLine className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Editar</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Eliminar</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <MapPin className="h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium">No tienes direcciones guardadas</h3>
                    <p className="mt-1 text-sm text-gray-500">Añade una dirección para agilizar tus compras.</p>
                    <Button
                      className="mt-4 bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                      onClick={handleAddAddress}
                    >
                      Añadir dirección
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Botón de cerrar sesión en móvil */}
      <div className="mt-8 md:hidden">
        <Button
          variant="outline"
          className="w-full justify-center text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </Button>
      </div>

      {/* Diálogo para añadir/editar dirección */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingAddress ? "Editar dirección" : "Añadir dirección"}</DialogTitle>
            <DialogDescription>
              {editingAddress ? "Modifica los datos de tu dirección" : "Introduce los datos de tu nueva dirección"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="address-name">Nombre de la dirección</Label>
              <Input
                id="address-name"
                name="name"
                placeholder="Ej: Casa, Trabajo..."
                value={addressFormData.name}
                onChange={handleAddressInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-line">Dirección</Label>
              <Input
                id="address-line"
                name="address"
                placeholder="Calle, número, piso..."
                value={addressFormData.address}
                onChange={handleAddressInputChange}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="address-city">Ciudad</Label>
                <Input id="address-city" name="city" value={addressFormData.city} onChange={handleAddressInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address-zip">Código postal</Label>
                <Input id="address-zip" name="zip" value={addressFormData.zip} onChange={handleAddressInputChange} />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddressDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              className="bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
              onClick={handleSaveAddress}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

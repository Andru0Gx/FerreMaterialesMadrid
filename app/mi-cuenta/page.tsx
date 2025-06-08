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
    state: "Madrid",
    zip: "28001",
    isDefault: true,
  },
  {
    id: "addr-2",
    name: "Trabajo",
    address: "Avenida Comercial 456",
    city: "Madrid",
    state: "Madrid",
    zip: "28045",
    isDefault: false,
  },
]

export default function MiCuentaPage() {
  // Crear un usuario de cliente para pruebas
  const clientUser = {
    id: "client-1",
    name: "Cliente Ejemplo",
    email: "cliente@ejemplo.com",
    password: "Password123",
    role: "customer",
    phone: "+34612345678",
  }

  const { user, logout, updateUser } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [activeTab, setActiveTab] = useState("perfil")

  // Estados para formularios
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const [addresses, setAddresses] = useState(initialAddresses)
  const [editingAddress, setEditingAddress] = useState(null)
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false)
  const [addressFormData, setAddressFormData] = useState({
    id: "",
    name: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    isDefault: false,
  })

  // Si no hay usuario, redirigir al login
  useEffect(() => {
    if (!user) {
      router.push("/login?redirect=/mi-cuenta")
    } else {
      // Cargar datos del usuario al montar el componente
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    }
  }, [user, router])

  if (!user) {
    return null
  }

  const handleLogout = () => {
    logout()
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión correctamente.",
    })
    router.push("/")
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSaveProfile = () => {
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

    // Actualizar datos del usuario
    updateUser({
      ...user,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
    })

    toast({
      title: "Perfil actualizado",
      description: "Tus datos han sido actualizados correctamente",
    })
  }

  const handleChangePassword = () => {
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

    // Simular cambio de contraseña
    toast({
      title: "Contraseña actualizada",
      description: "Tu contraseña ha sido actualizada correctamente",
    })

    // Limpiar campos de contraseña
    setFormData((prev) => ({
      ...prev,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    }))
  }

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  // Funciones para gestionar direcciones
  const handleAddAddress = () => {
    setEditingAddress(null)
    setAddressFormData({
      id: `addr-${Date.now()}`,
      name: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      isDefault: addresses.length === 0, // Primera dirección es la predeterminada
    })
    setIsAddressDialogOpen(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address.id)
    setAddressFormData({ ...address })
    setIsAddressDialogOpen(true)
  }

  const handleDeleteAddress = (addressId) => {
    const updatedAddresses = addresses.filter((addr) => addr.id !== addressId)

    // Si eliminamos la dirección predeterminada, establecer la primera como predeterminada
    if (addresses.find((addr) => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true
    }

    setAddresses(updatedAddresses)

    toast({
      title: "Dirección eliminada",
      description: "La dirección ha sido eliminada correctamente",
    })
  }

  const handleSetDefaultAddress = (addressId) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === addressId,
    }))

    setAddresses(updatedAddresses)

    toast({
      title: "Dirección predeterminada",
      description: "Se ha actualizado tu dirección predeterminada",
    })
  }

  const handleAddressInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setAddressFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSaveAddress = () => {
    // Validar campos
    if (
      !addressFormData.name.trim() ||
      !addressFormData.address.trim() ||
      !addressFormData.city.trim() ||
      !addressFormData.state.trim() ||
      !addressFormData.zip.trim()
    ) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      })
      return
    }

    if (editingAddress) {
      // Actualizar dirección existente
      const updatedAddresses = addresses.map((addr) => {
        if (addr.id === editingAddress) {
          return addressFormData
        }

        // Si la nueva dirección es predeterminada, actualizar las demás
        if (addressFormData.isDefault && addr.id !== editingAddress) {
          return { ...addr, isDefault: false }
        }

        return addr
      })

      setAddresses(updatedAddresses)
      toast({
        title: "Dirección actualizada",
        description: "La dirección ha sido actualizada correctamente",
      })
    } else {
      // Añadir nueva dirección
      const newAddresses = addressFormData.isDefault
        ? addresses.map((addr) => ({ ...addr, isDefault: false })).concat({ ...addressFormData })
        : [...addresses, addressFormData]

      setAddresses(newAddresses)
      toast({
        title: "Dirección añadida",
        description: "La dirección ha sido añadida correctamente",
      })
    }

    setIsAddressDialogOpen(false)
  }

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString)
      return format(date, "d 'de' MMMM, yyyy", { locale: es })
    } catch (error) {
      return dateString
    }
  }

  // Función para obtener el color de badge según el estado
  const getStatusColor = (status) => {
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
                            {address.isDefault && (
                              <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                                Predeterminada
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-500">{address.address}</p>
                          <p className="text-sm text-gray-500">
                            {address.city}, {address.state} {address.zip}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleEditAddress(address)}>
                            <PencilLine className="h-4 w-4" />
                            <span className="sr-only md:not-sr-only md:ml-2">Editar</span>
                          </Button>
                          {!address.isDefault && (
                            <Button variant="outline" size="sm" onClick={() => handleSetDefaultAddress(address.id)}>
                              <Check className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Predeterminada</span>
                            </Button>
                          )}
                          {!address.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                              onClick={() => handleDeleteAddress(address.id)}
                            >
                              <Trash className="h-4 w-4" />
                              <span className="sr-only md:not-sr-only md:ml-2">Eliminar</span>
                            </Button>
                          )}
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
                <Label htmlFor="address-state">Provincia</Label>
                <Input
                  id="address-state"
                  name="state"
                  value={addressFormData.state}
                  onChange={handleAddressInputChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="address-zip">Código postal</Label>
              <Input id="address-zip" name="zip" value={addressFormData.zip} onChange={handleAddressInputChange} />
            </div>
            <div className="flex items-center space-x-2 pt-2">
              <input
                type="checkbox"
                id="address-default"
                name="isDefault"
                className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                checked={addressFormData.isDefault}
                onChange={handleAddressInputChange}
              />
              <Label htmlFor="address-default" className="text-sm font-normal">
                Establecer como dirección predeterminada
              </Label>
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

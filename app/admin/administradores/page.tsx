"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
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
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreVertical, Edit, Trash, Shield, Phone, Lock, Eye, ArrowUpDown } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { getAdmins } from "@/lib/data"
import type { Admin } from "@/lib/types"

// Import the existing component content
// Move the existing content to a separate component
function AdminAdministratorsPageContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState<string>("all")
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isChangeRoleOpen, setIsChangeRoleOpen] = useState(false)
  const [isWhatsappOpen, setIsWhatsappOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [isViewAdminOpen, setIsViewAdminOpen] = useState(false)
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null)
  const [newPassword, setNewPassword] = useState("")
  const [whatsappMessage, setWhatsappMessage] = useState("")
  const { toast } = useToast()
  const [administrators, setAdministrators] = useState<Admin[]>([])
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: "ascending" | "descending" } | null>(null)

  // Form states
  const [newAdminData, setNewAdminData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "admin",
    password: "",
    status: "active",
  })

  // Load admins
  useEffect(() => {
    const admins = getAdmins()
    setAdministrators(admins)
  }, [])

  // Sorting function
  const requestSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending"
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }
    setSortConfig({ key, direction })
  }

  // Get sorted items
  const getSortedItems = (items: Admin[]) => {
    if (!sortConfig) return items

    return [...items].sort((a, b) => {
      if (a[sortConfig.key as keyof Admin] < b[sortConfig.key as keyof Admin]) {
        return sortConfig.direction === "ascending" ? -1 : 1
      }
      if (a[sortConfig.key as keyof Admin] > b[sortConfig.key as keyof Admin]) {
        return sortConfig.direction === "ascending" ? 1 : -1
      }
      return 0
    })
  }

  // Filter administrators
  const filteredAdmins = getSortedItems(
    administrators.filter((admin) => {
      const matchesSearch =
        admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        admin.phone?.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRole = roleFilter === "all" || admin.role === roleFilter

      return matchesSearch && matchesRole
    }),
  )

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  // Add Admin
  const handleAddAdmin = () => {
    if (!newAdminData.name || !newAdminData.email || !newAdminData.password) {
      toast({
        title: "Error",
        description: "Por favor completa todos los campos requeridos",
        variant: "destructive",
      })
      return
    }

    const newAdmin: Admin = {
      id: `admin-${administrators.length + 1}`,
      name: newAdminData.name,
      email: newAdminData.email,
      role: newAdminData.role as "admin" | "super_admin",
      permissions: [],
      lastLogin: new Date().toISOString(),
      phone: newAdminData.phone,
      status: newAdminData.status as "active" | "inactive",
    }

    setAdministrators([...administrators, newAdmin])
    setIsAddAdminOpen(false)
    setNewAdminData({
      name: "",
      email: "",
      phone: "",
      role: "admin",
      password: "",
      status: "active",
    })

    toast({
      title: "Administrador agregado",
      description: `${newAdminData.name} ha sido agregado como ${newAdminData.role === "super_admin" ? "Super Administrador" : "Administrador"}.`,
    })
  }

  // Edit Admin
  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setNewAdminData({
      name: admin.name,
      email: admin.email,
      phone: admin.phone || "",
      role: admin.role,
      password: "",
      status: admin.status,
    })
    setIsEditAdminOpen(true)
  }

  const handleUpdateAdmin = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedAdmin) return

    const updatedAdmins = administrators.map((admin) =>
      admin.id === selectedAdmin.id
        ? {
            ...admin,
            name: newAdminData.name,
            email: newAdminData.email,
            phone: newAdminData.phone,
            role: newAdminData.role as "admin" | "super_admin",
            status: newAdminData.status as "active" | "inactive",
          }
        : admin,
    )

    setAdministrators(updatedAdmins)
    setIsEditAdminOpen(false)

    toast({
      title: "Administrador actualizado",
      description: `La información de ${newAdminData.name} ha sido actualizada.`,
    })
  }

  // Delete Admin
  const handleDeleteAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsDeleteConfirmOpen(true)
  }

  const confirmDeleteAdmin = () => {
    if (!selectedAdmin) return

    const updatedAdmins = administrators.filter((admin) => admin.id !== selectedAdmin.id)
    setAdministrators(updatedAdmins)
    setIsDeleteConfirmOpen(false)

    toast({
      title: "Administrador eliminado",
      description: `${selectedAdmin.name} ha sido eliminado del sistema.`,
    })
  }

  // Reset Password
  const handleResetPassword = (admin: Admin) => {
    setSelectedAdmin(admin)
    setNewPassword("")
    setIsResetPasswordOpen(true)
  }

  const handleSaveNewPassword = () => {
    if (!selectedAdmin) return

    if (!newPassword) {
      toast({
        title: "Error",
        description: "Por favor ingresa una nueva contraseña.",
        variant: "destructive",
      })
      return
    }

    setIsResetPasswordOpen(false)

    toast({
      title: "Contraseña restablecida",
      description: `La contraseña de ${selectedAdmin.name} ha sido actualizada.`,
    })
  }

  // Change Role
  const handleChangeRole = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsChangeRoleOpen(true)
  }

  const handleSaveRoleChange = (newRole: string) => {
    if (!selectedAdmin) return

    const updatedAdmins = administrators.map((admin) =>
      admin.id === selectedAdmin.id ? { ...admin, role: newRole as "admin" | "super_admin" } : admin,
    )

    setAdministrators(updatedAdmins)
    setIsChangeRoleOpen(false)

    toast({
      title: "Rol actualizado",
      description: `${selectedAdmin.name} ahora es ${newRole === "super_admin" ? "Super Administrador" : "Administrador"}.`,
    })
  }

  // WhatsApp
  const handleWhatsapp = (admin: Admin) => {
    if (!admin.phone) {
      toast({
        title: "Error",
        description: "El administrador no tiene un número de teléfono registrado.",
        variant: "destructive",
      })
      return
    }
    window.open(`https://wa.me/${admin.phone}`, "_blank")
  }

  // View Admin
  const handleViewAdmin = (admin: Admin) => {
    setSelectedAdmin(admin)
    setIsViewAdminOpen(true)
  }

  // Input handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setNewAdminData((prev) => ({ ...prev, [id]: value }))
  }

  const handleSelectChange = (field: string, value: string) => {
    setNewAdminData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Administradores</h1>
          <p className="text-muted-foreground">Administra los usuarios con permisos de administración del sistema</p>
        </div>
      </div>
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Gestión de Administradores</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6 items-end">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-5 w-5 text-gray-500" />
            <Input
              type="search"
              placeholder="Buscar administradores..."
              className="pl-10"
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <div className="w-full md:w-64">
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filtrar por Rol" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los roles</SelectItem>
                <SelectItem value="admin">Administrador</SelectItem>
                <SelectItem value="super_admin">Super Administrador</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Dialog open={isAddAdminOpen} onOpenChange={setIsAddAdminOpen}>
              <DialogTrigger asChild>
                <Button className="bg-[#f97316] hover:bg-[#ea580c] cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Agregar Administrador
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Agregar Nuevo Administrador</DialogTitle>
                  <DialogDescription>
                    Completa el formulario para agregar un nuevo administrador al sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre*</Label>
                      <Input
                        id="name"
                        placeholder="Nombre completo"
                        value={newAdminData.name}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico*</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        value={newAdminData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Número de teléfono"
                      value={newAdminData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol*</Label>
                    <Select value={newAdminData.role} onValueChange={(value) => handleSelectChange("role", value)}>
                      <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="super_admin">Super Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Contraseña*</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Crear contraseña"
                      value={newAdminData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select value={newAdminData.status} onValueChange={(value) => handleSelectChange("status", value)}>
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setIsAddAdminOpen(false)} className="cursor-pointer">
                    Cancelar
                  </Button>
                  <Button type="button" onClick={handleAddAdmin} className="cursor-pointer">
                    Agregar Administrador
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium" onClick={() => requestSort("name")}>
                  Nombre <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="font-medium" onClick={() => requestSort("email")}>
                  Correo Electrónico <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="hidden md:table-cell font-medium" onClick={() => requestSort("phone")}>
                  Teléfono <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="font-medium" onClick={() => requestSort("role")}>
                  Rol <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="hidden lg:table-cell font-medium" onClick={() => requestSort("lastLogin")}>
                  Último Acceso <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="font-medium" onClick={() => requestSort("status")}>
                  Estado <ArrowUpDown className="inline h-4 w-4 ml-1" />
                </TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAdmins.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No se encontraron administradores
                  </TableCell>
                </TableRow>
              ) : (
                filteredAdmins.map((admin) => (
                  <TableRow key={admin.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">{admin.name}</TableCell>
                    <TableCell>{admin.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{admin.phone || "-"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                        ${admin.role === "super_admin" ? "bg-purple-50 text-purple-700 border-purple-200" : ""}
                        ${admin.role === "admin" ? "bg-blue-50 text-blue-700 border-blue-200" : ""}
                      `}
                      >
                        {admin.role === "super_admin" ? "Super Admin" : "Administrador"}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      {new Date(admin.lastLogin).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`
                        ${admin.status === "active" ? "bg-green-50 text-green-700 border-green-200" : ""}
                        ${admin.status === "inactive" ? "bg-gray-100 text-gray-700 border-gray-200" : ""}
                      `}
                      >
                        {admin.status === "active" ? "Activo" : "Inactivo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 cursor-pointer"
                          onClick={() => handleViewAdmin(admin)}
                        >
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Ver detalles</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                              <MoreVertical className="h-4 w-4" />
                              <span className="sr-only">Abrir menú</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="cursor-pointer">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditAdmin(admin)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleWhatsapp(admin)}>
                              <Phone className="mr-2 h-4 w-4" />
                              Contactar por WhatsApp
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleResetPassword(admin)}>
                              <Lock className="mr-2 h-4 w-4" />
                              Restablecer contraseña
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleChangeRole(admin)}>
                              <Shield className="mr-2 h-4 w-4" />
                              Cambiar rol
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteAdmin(admin)}>
                              <Trash className="mr-2 h-4 w-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* View Admin Dialog */}
        <Dialog open={isViewAdminOpen} onOpenChange={setIsViewAdminOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedAdmin && (
              <>
                <DialogHeader>
                  <DialogTitle>Detalles del Administrador</DialogTitle>
                  <DialogDescription>Información detallada de {selectedAdmin.name}.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label>Nombre</Label>
                    <p className="text-sm">{selectedAdmin.name}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Correo Electrónico</Label>
                    <p className="text-sm">{selectedAdmin.email}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Teléfono</Label>
                    <p className="text-sm">{selectedAdmin.phone || "-"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Rol</Label>
                    <p className="text-sm">
                      {selectedAdmin.role === "super_admin" ? "Super Administrador" : "Administrador"}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label>Estado</Label>
                    <p className="text-sm">{selectedAdmin.status === "active" ? "Activo" : "Inactivo"}</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Último Acceso</Label>
                    <p className="text-sm">{new Date(selectedAdmin.lastLogin).toLocaleString()}</p>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Edit Admin Dialog */}
        <Dialog open={isEditAdminOpen} onOpenChange={setIsEditAdminOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedAdmin && (
              <form onSubmit={handleUpdateAdmin}>
                <DialogHeader>
                  <DialogTitle>Editar Administrador</DialogTitle>
                  <DialogDescription>Modifica la información de {selectedAdmin.name}.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre</Label>
                      <Input
                        id="name"
                        value={newAdminData.name}
                        onChange={(e) => setNewAdminData({ ...newAdminData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input
                        id="email"
                        type="email"
                        value={newAdminData.email}
                        onChange={(e) => setNewAdminData({ ...newAdminData, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={newAdminData.phone}
                      onChange={(e) => setNewAdminData({ ...newAdminData, phone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Rol</Label>
                    <Select
                      value={newAdminData.role}
                      onValueChange={(value) => setNewAdminData({ ...newAdminData, role: value })}
                    >
                      <SelectTrigger id="role" className="w-full">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="super_admin">Super Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Estado</Label>
                    <Select
                      value={newAdminData.status}
                      onValueChange={(value) => setNewAdminData({ ...newAdminData, status: value })}
                    >
                      <SelectTrigger id="status" className="w-full">
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Activo</SelectItem>
                        <SelectItem value="inactive">Inactivo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditAdminOpen(false)}
                    className="cursor-pointer"
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="cursor-pointer">
                    Guardar Cambios
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        {/* Reset Password Dialog */}
        <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Restablecer Contraseña</DialogTitle>
              <DialogDescription>Ingresa una nueva contraseña para {selectedAdmin?.name}.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">Nueva Contraseña</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsResetPasswordOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button type="submit" onClick={handleSaveNewPassword} className="cursor-pointer">
                Guardar Contraseña
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Change Role Dialog */}
        <Dialog open={isChangeRoleOpen} onOpenChange={setIsChangeRoleOpen}>
          <DialogContent className="sm:max-w-md">
            {selectedAdmin && (
              <>
                <DialogHeader>
                  <DialogTitle>Cambiar Rol</DialogTitle>
                  <DialogDescription>Selecciona el nuevo rol para {selectedAdmin.name}.</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="change-role">Rol</Label>
                    <Select defaultValue={selectedAdmin.role} onValueChange={(value) => handleSaveRoleChange(value)}>
                      <SelectTrigger id="change-role" className="w-full">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Administrador</SelectItem>
                        <SelectItem value="super_admin">Super Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="secondary" onClick={() => setIsChangeRoleOpen(false)} className="cursor-pointer">
                    Cancelar
                  </Button>
                </DialogFooter>
              </>
            )}
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirmar Eliminación</DialogTitle>
              <DialogDescription>
                ¿Estás seguro de que quieres eliminar a {selectedAdmin?.name}? Esta acción no se puede deshacer.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setIsDeleteConfirmOpen(false)} className="cursor-pointer">
                Cancelar
              </Button>
              <Button variant="destructive" onClick={confirmDeleteAdmin} className="cursor-pointer">
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"

export default function AdminAdministratorsPage() {
  const { isSuperAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Only super admins can access this page
    if (!isSuperAdmin) {
      router.push("/admin")
      return
    }
  }, [isSuperAdmin, router])

  // Don't render content if user is not super admin
  if (!isSuperAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  return <AdminAdministratorsPageContent />
}

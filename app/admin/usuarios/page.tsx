"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, MoreVertical, Edit, Trash, Shield, Lock, Eye } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

// Componente principal
function AdminsPageContent() {
  // Estados
  const [admins, setAdmins] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [selectedAdmin, setSelectedAdmin] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Estados para diálogos
  const [isAddAdminOpen, setIsAddAdminOpen] = useState(false)
  const [isEditAdminOpen, setIsEditAdminOpen] = useState(false)
  const [isViewAdminOpen, setIsViewAdminOpen] = useState(false)
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  // Estado para formulario
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
    phone: "",
    status: "ACTIVE",
  })

  const { toast } = useToast()

  // Cargar administradores
  useEffect(() => {
    fetchAdmins()
  }, [])

  const fetchAdmins = async () => {
    try {
      const response = await fetch("/api/admins")
      if (!response.ok) throw new Error("Error al cargar administradores")
      const data = await response.json()
      setAdmins(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los administradores",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Filtrar administradores
  const filteredAdmins = admins.filter((admin) => {
    const matchesSearch =
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (admin.phone && admin.phone.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesRole = roleFilter === "all" || admin.role.toLowerCase() === roleFilter.toLowerCase()

    return matchesSearch && matchesRole
  })

  // Handlers para CRUD
  const handleAddAdmin = async () => {
    try {
      const response = await fetch("/api/admins", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al crear administrador")
      }

      await fetchAdmins()
      setIsAddAdminOpen(false)
      resetForm()
      toast({
        title: "Éxito",
        description: "Administrador creado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al crear administrador",
        variant: "destructive",
      })
    }
  }

  const handleEditAdmin = async () => {
    if (!selectedAdmin) return

    try {
      const response = await fetch(`/api/admins?id=${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al actualizar administrador")
      }

      await fetchAdmins()
      setIsEditAdminOpen(false)
      toast({
        title: "Éxito",
        description: "Administrador actualizado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Error al actualizar administrador",
        variant: "destructive",
      })
    }
  }

  const handleDeleteAdmin = async () => {
    if (!selectedAdmin) return

    try {
      const response = await fetch(`/api/admins?id=${selectedAdmin.id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Error al eliminar administrador")

      await fetchAdmins()
      setIsDeleteConfirmOpen(false)
      toast({
        title: "Éxito",
        description: "Administrador eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al eliminar administrador",
        variant: "destructive",
      })
    }
  }

  const handleResetPassword = async () => {
    if (!selectedAdmin || !formData.password) return

    try {
      const response = await fetch(`/api/admins?id=${selectedAdmin.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...selectedAdmin, password: formData.password }),
      })

      if (!response.ok) throw new Error("Error al restablecer contraseña")

      setIsResetPasswordOpen(false)
      toast({
        title: "Éxito",
        description: "Contraseña restablecida correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al restablecer contraseña",
        variant: "destructive",
      })
    }
  }

  // Utilidades
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      password: "",
      role: "ADMIN",
      phone: "",
      status: "ACTIVE",
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Administra los usuarios con permisos de administración del sistema</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Buscar administradores..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="w-full md:w-64">
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="SUPER_ADMIN">Super Administrador</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={() => setIsAddAdminOpen(true)} className="bg-orange-500 hover:bg-orange-600">
          <Plus className="mr-2 h-4 w-4" />
          Agregar Administrador
        </Button>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead>Rol</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAdmins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  No se encontraron administradores
                </TableCell>
              </TableRow>
            ) : (
              filteredAdmins.map((admin) => (
                <TableRow key={admin.id}>
                  <TableCell className="font-medium">{admin.name}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell>{admin.phone || "-"}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={admin.role === "SUPER_ADMIN" ? "bg-purple-50 text-purple-700" : "bg-blue-50 text-blue-700"}
                    >
                      {admin.role === "SUPER_ADMIN" ? "Super Admin" : "Administrador"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={admin.status === "ACTIVE" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}
                    >
                      {admin.status === "ACTIVE" ? "Activo" : "Inactivo"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => {
                          setSelectedAdmin(admin)
                          setIsViewAdminOpen(true)
                        }}>
                          <Eye className="w-4 h-4 mr-2" />
                          Ver detalles
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedAdmin(admin)
                          setFormData({
                            name: admin.name,
                            email: admin.email,
                            role: admin.role,
                            phone: admin.phone || "",
                            status: admin.status,
                            password: "",
                          })
                          setIsEditAdminOpen(true)
                        }}>
                          <Edit className="w-4 h-4 mr-2" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedAdmin(admin)
                          setFormData({ ...formData, password: "" })
                          setIsResetPasswordOpen(true)
                        }}>
                          <Lock className="w-4 h-4 mr-2" />
                          Restablecer contraseña
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => {
                            setSelectedAdmin(admin)
                            setIsDeleteConfirmOpen(true)
                          }}
                        >
                          <Trash className="w-4 h-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Diálogo para agregar/editar administrador */}
      <Dialog open={isAddAdminOpen || isEditAdminOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddAdminOpen(false)
          setIsEditAdminOpen(false)
          resetForm()
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditAdminOpen ? "Editar Administrador" : "Agregar Administrador"}</DialogTitle>
            <DialogDescription>
              {isEditAdminOpen
                ? "Modifica los datos del administrador"
                : "Ingresa los datos para crear un nuevo administrador"}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nombre completo"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="correo@ejemplo.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="+58 412-1234567"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Rol</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                  <SelectItem value="SUPER_ADMIN">Super Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {!isEditAdminOpen && (
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Contraseña"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">Activo</SelectItem>
                  <SelectItem value="INACTIVE">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsAddAdminOpen(false)
              setIsEditAdminOpen(false)
              resetForm()
            }}>
              Cancelar
            </Button>
            <Button onClick={isEditAdminOpen ? handleEditAdmin : handleAddAdmin}>
              {isEditAdminOpen ? "Guardar cambios" : "Crear administrador"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para ver detalles */}
      <Dialog open={isViewAdminOpen} onOpenChange={setIsViewAdminOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Administrador</DialogTitle>
          </DialogHeader>
          {selectedAdmin && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <p className="text-sm">{selectedAdmin.name}</p>
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <p className="text-sm">{selectedAdmin.email}</p>
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <p className="text-sm">{selectedAdmin.phone || "-"}</p>
              </div>
              <div className="space-y-2">
                <Label>Rol</Label>
                <p className="text-sm">{selectedAdmin.role === "SUPER_ADMIN" ? "Super Administrador" : "Administrador"}</p>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <p className="text-sm">{selectedAdmin.status === "ACTIVE" ? "Activo" : "Inactivo"}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo para restablecer contraseña */}
      <Dialog open={isResetPasswordOpen} onOpenChange={setIsResetPasswordOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restablecer Contraseña</DialogTitle>
            <DialogDescription>Ingresa la nueva contraseña para el administrador</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Nueva contraseña"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsResetPasswordOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleResetPassword}>Restablecer contraseña</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar eliminación */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar a este administrador? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteAdmin}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Página principal que verifica permisos
export default function AdminsPage() {
  const { isSuperAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Solo los super admins pueden acceder a esta página
    if (!isSuperAdmin) {
      router.push("/admin")
      return
    }
  }, [isSuperAdmin, router])

  // No renderizar contenido si el usuario no es super admin
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

  return <AdminsPageContent />
}

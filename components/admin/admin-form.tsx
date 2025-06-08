"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Admin } from "@/lib/types"

const adminFormSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  role: z.string({
    required_error: "Por favor selecciona un rol.",
  }),
  isActive: z.boolean().default(true),
  permissions: z.object({
    manageProducts: z.boolean().default(false),
    manageOrders: z.boolean().default(false),
    manageUsers: z.boolean().default(false),
    manageAdmins: z.boolean().default(false),
  }),
})

type AdminFormValues = z.infer<typeof adminFormSchema>

interface AdminFormProps {
  initialData?: Admin
  onSubmit: (data: AdminFormValues) => void
  isSubmitting?: boolean
  currentUserRole?: string
}

export function AdminForm({ initialData, onSubmit, isSubmitting = false, currentUserRole = "admin" }: AdminFormProps) {
  const isSuperAdmin = currentUserRole === "super_admin"

  const form = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          role: initialData.role,
          isActive: initialData.isActive !== false,
          permissions: {
            manageProducts: initialData.permissions?.manageProducts || false,
            manageOrders: initialData.permissions?.manageOrders || false,
            manageUsers: initialData.permissions?.manageUsers || false,
            manageAdmins: initialData.permissions?.manageAdmins || false,
          },
        }
      : {
          name: "",
          email: "",
          role: "admin",
          isActive: true,
          permissions: {
            manageProducts: true,
            manageOrders: true,
            manageUsers: true,
            manageAdmins: false,
          },
        },
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre completo</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="admin@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!isSuperAdmin}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Administrador</SelectItem>
                    {isSuperAdmin && <SelectItem value="super_admin">Super Administrador</SelectItem>}
                  </SelectContent>
                </Select>
                {!isSuperAdmin && (
                  <FormDescription>Solo los Super Administradores pueden cambiar roles</FormDescription>
                )}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Administrador activo</FormLabel>
                  <FormDescription>El administrador puede iniciar sesión y gestionar el sistema</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div>
          <h3 className="text-lg font-medium mb-4">Permisos</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="permissions.manageProducts"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.watch("role") === "super_admin"}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gestionar productos</FormLabel>
                    <FormDescription>Puede crear, editar y eliminar productos</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.manageOrders"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.watch("role") === "super_admin"}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gestionar pedidos</FormLabel>
                    <FormDescription>Puede ver, actualizar y gestionar pedidos</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.manageUsers"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.watch("role") === "super_admin"}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gestionar usuarios</FormLabel>
                    <FormDescription>Puede ver y gestionar usuarios del sistema</FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="permissions.manageAdmins"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value || form.watch("role") === "super_admin"}
                      onCheckedChange={field.onChange}
                      disabled={!isSuperAdmin || form.watch("role") === "super_admin"}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Gestionar administradores</FormLabel>
                    <FormDescription>Puede gestionar otros administradores (solo Super Admin)</FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {form.watch("role") === "super_admin" && (
            <p className="mt-4 text-sm text-amber-600">
              Los Super Administradores tienen todos los permisos por defecto
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initialData ? "Actualizar administrador" : "Crear administrador"}
        </Button>
      </form>
    </Form>
  )
}

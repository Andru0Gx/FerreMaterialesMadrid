"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import type { User } from "@/lib/types"

const userFormSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor ingresa un email válido.",
  }),
  phone: z.string().min(10, {
    message: "El teléfono debe tener al menos 10 dígitos.",
  }),
  address: z
    .string()
    .min(10, {
      message: "La dirección debe tener al menos 10 caracteres.",
    })
    .optional(),
  isActive: z.boolean().default(true),
  isSubscribed: z.boolean().default(false),
})

type UserFormValues = z.infer<typeof userFormSchema>

interface UserFormProps {
  initialData?: User
  onSubmit: (data: UserFormValues) => void
  isSubmitting?: boolean
}

export function UserForm({ initialData, onSubmit, isSubmitting = false }: UserFormProps) {
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          email: initialData.email,
          phone: initialData.phone || "",
          address: initialData.address || "",
          isActive: initialData.isActive !== false,
          isSubscribed: initialData.isSubscribed || false,
        }
      : {
          name: "",
          email: "",
          phone: "",
          address: "",
          isActive: true,
          isSubscribed: false,
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
                  <Input placeholder="usuario@ejemplo.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="5512345678" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Calle, número, colonia, ciudad, estado, CP" {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Usuario activo</FormLabel>
                  <FormDescription>El usuario puede iniciar sesión y realizar compras</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isSubscribed"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Suscrito al boletín</FormLabel>
                  <FormDescription>El usuario recibirá correos con ofertas y novedades</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initialData ? "Actualizar usuario" : "Crear usuario"}
        </Button>
      </form>
    </Form>
  )
}

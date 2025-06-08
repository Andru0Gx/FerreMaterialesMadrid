"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { ImageUpload } from "@/components/admin/image-upload"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Product } from "@/lib/types"

const productFormSchema = z.object({
  name: z.string().min(3, {
    message: "El nombre debe tener al menos 3 caracteres.",
  }),
  description: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  price: z.coerce.number().positive({
    message: "El precio debe ser un número positivo.",
  }),
  compareAtPrice: z.coerce
    .number()
    .nonnegative({
      message: "El precio de comparación debe ser un número positivo o cero.",
    })
    .optional(),
  sku: z.string().min(3, {
    message: "El SKU debe tener al menos 3 caracteres.",
  }),
  category: z.string({
    required_error: "Por favor selecciona una categoría.",
  }),
  brand: z.string().min(2, {
    message: "La marca debe tener al menos 2 caracteres.",
  }),
  inStock: z.boolean().default(true),
  onSale: z.boolean().default(false),
  featured: z.boolean().default(false),
})

type ProductFormValues = z.infer<typeof productFormSchema> & {
  images: string[]
}

interface ProductFormProps {
  initialData?: Product
  onSubmit: (data: ProductFormValues) => void
  isSubmitting?: boolean
}

export function ProductForm({ initialData, onSubmit, isSubmitting = false }: ProductFormProps) {
  const [images, setImages] = useState<string[]>(initialData?.images || [])

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          description: initialData.description,
          price: initialData.price,
          compareAtPrice: initialData.compareAtPrice,
          sku: initialData.sku,
          category: initialData.category,
          brand: initialData.brand,
          inStock: initialData.inStock,
          onSale: initialData.onSale,
          featured: initialData.featured,
        }
      : {
          name: "",
          description: "",
          price: 0,
          compareAtPrice: 0,
          sku: "",
          category: "",
          brand: "",
          inStock: true,
          onSale: false,
          featured: false,
        },
  })

  const handleSubmit = (values: z.infer<typeof productFormSchema>) => {
    onSubmit({
      ...values,
      images,
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del producto</FormLabel>
                <FormControl>
                  <Input placeholder="Martillo profesional" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sku"
            render={({ field }) => (
              <FormItem>
                <FormLabel>SKU</FormLabel>
                <FormControl>
                  <Input placeholder="MART-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (MXN)</FormLabel>
                <FormControl>
                  <Input type="number" min="0" step="0.01" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="compareAtPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio de comparación (MXN)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Opcional"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>Establece un precio más alto para mostrar descuento</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoría</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="herramientas">Herramientas</SelectItem>
                    <SelectItem value="materiales">Materiales</SelectItem>
                    <SelectItem value="electricidad">Electricidad</SelectItem>
                    <SelectItem value="plomeria">Plomería</SelectItem>
                    <SelectItem value="jardineria">Jardinería</SelectItem>
                    <SelectItem value="pintura">Pintura</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="brand"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca</FormLabel>
                <FormControl>
                  <Input placeholder="Truper" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe el producto..." className="min-h-32" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-medium">Imágenes del producto</h3>
            <p className="text-sm text-gray-500">Sube hasta 5 imágenes para mostrar tu producto</p>
          </div>

          <ImageUpload onUpload={(urls) => setImages(urls)} initialImages={images} />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <FormField
            control={form.control}
            name="inStock"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>En stock</FormLabel>
                  <FormDescription>Este producto está disponible para compra</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="onSale"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>En oferta</FormLabel>
                  <FormDescription>Este producto está en oferta especial</FormDescription>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="featured"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Destacado</FormLabel>
                  <FormDescription>Este producto aparecerá en la sección destacada</FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : initialData ? "Actualizar producto" : "Crear producto"}
        </Button>
      </form>
    </Form>
  )
}

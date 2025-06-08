"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, User, Mail, Phone, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "El nombre debe tener al menos 2 caracteres.",
    }),
    email: z.string().email({
      message: "Por favor, introduce un correo electrónico válido.",
    }),
    password: z.string().min(8, {
      message: "La contraseña debe tener al menos 8 caracteres.",
    }),
    confirmPassword: z.string(),
    phone: z.string().min(10, {
      message: "El teléfono debe tener al menos 10 caracteres.",
    }),
    address: z.string().min(5, {
      message: "La dirección debe tener al menos 5 caracteres.",
    }),
    zip: z.string().min(4, {
      message: "El código postal debe tener al menos 4 caracteres.",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  })

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      address: "",
      zip: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Simulación de registro
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Registro exitoso",
        description: "Tu cuenta ha sido creada correctamente.",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Error en el registro",
        description: "Ha ocurrido un error al crear tu cuenta. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center mb-6">
        <Logo height="60" />
      </div>

      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Crear una cuenta</CardTitle>
          <CardDescription className="text-lg">
            Completa el formulario para registrarte en Ferre Materiales Madrid
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Información personal</h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre completo</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input className="pl-10" placeholder="Juan Pérez" {...field} />
                          </div>
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
                        <FormLabel>Correo electrónico</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input className="pl-10" type="email" placeholder="ejemplo@correo.com" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showPassword ? "text" : "password"} placeholder="********" {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">
                                {showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-xs">Mínimo 8 caracteres</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar contraseña</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input type={showConfirmPassword ? "text" : "password"} placeholder="********" {...field} />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-full px-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              <span className="sr-only">
                                {showConfirmPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                              </span>
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                          <Input className="pl-10" placeholder="+58 412 345 6789" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4">
                  <h3 className="text-lg font-medium mb-4">Dirección de envío</h3>

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input className="pl-10" placeholder="Calle, número, piso, puerta" {...field} />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2 mt-4">
                    {/* Ciudad field - Wrapped in FormField */}
                    <FormField
                      control={form.control}
                      name="zip" // Using 'zip' as a placeholder, though it's not a form-controlled field for "Ciudad"
                      // This field is purely for display, so `render` is just for structure.
                      render={() => (
                        <FormItem>
                          <FormLabel>Ciudad</FormLabel>
                          <FormControl>
                            <div className="mt-1">
                              <Input value="Maturín" disabled className="bg-gray-50" />
                            </div>
                          </FormControl>
                          <FormDescription className="text-xs text-gray-500 mt-1">Actualmente solo enviamos a Maturín</FormDescription>
                          {/* No FormMessage here as it's not a user-controlled field */}
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="zip"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Código postal</FormLabel>
                          <FormControl>
                            <Input placeholder="6201" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 mt-4">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  required
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  Acepto los{" "}
                  <Link href="/terminos" className="text-[var(--primary-color)] hover:underline">
                    términos y condiciones
                  </Link>{" "}
                  y la{" "}
                  <Link href="/privacidad" className="text-[var(--primary-color)] hover:underline">
                    política de privacidad
                  </Link>
                </label>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Registrando..." : "Crear cuenta"}
              </Button>
            </form>
          </Form>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-6">
          <div className="text-center">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/login" className="font-medium text-[var(--primary-color)] hover:underline">
              Iniciar sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Logo } from "@/components/ui/logo"
import { Separator } from "@/components/ui/separator"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
  password: z.string().min(1, {
    message: "Por favor, introduce tu contraseña.",
  }),
})

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const { login } = useAuth()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const success = await login(values.email, values.password)

      if (success) {
        toast({
          title: "Inicio de sesión exitoso",
          description: "Has iniciado sesión correctamente.",
        })

        // Get the redirect URL from search params or default behavior
        const redirectTo = searchParams.get("redirect")

        if (redirectTo) {
          // Redirect to the page they were trying to access
          router.push(redirectTo)
        } else if (values.email.includes("admin")) {
          // If admin and no specific redirect, go to admin
          router.push("/admin")
        } else {
          // Regular users stay on current page or go to home
          router.push("/")
        }
      } else {
        toast({
          title: "Error de inicio de sesión",
          description: "Correo electrónico o contraseña incorrectos.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error de inicio de sesión",
        description: "Ha ocurrido un error al iniciar sesión. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex justify-center mb-6">
        <Logo height="60" />
      </div>

      <Card className="mx-auto max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold">Iniciar sesión</CardTitle>
          <CardDescription className="text-lg">Accede a tu cuenta de Ferre Materiales Madrid</CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contraseña</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                        <Input
                          className="pl-10"
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          <span className="sr-only">{showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}</span>
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="h-4 w-4 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                  />
                  <label htmlFor="remember" className="text-sm text-gray-500">
                    Recordarme
                  </label>
                </div>

                <Link
                  href="/recuperar-contrasena"
                  className="text-sm font-medium text-[var(--primary-color)] hover:underline"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90 py-6 text-lg"
                disabled={isLoading}
              >
                {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
              </Button>
            </form>
          </Form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">O continúa con</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" type="button" className="w-full">
              Google
            </Button>
            <Button variant="outline" type="button" className="w-full">
              Facebook
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center border-t p-6">
          <div className="text-center">
            ¿No tienes una cuenta?{" "}
            <Link href="/registro" className="font-medium text-[var(--primary-color)] hover:underline">
              Regístrate
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}

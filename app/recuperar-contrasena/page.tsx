"use client"

import { useState } from "react"
import Link from "next/link"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const formSchema = z.object({
  email: z.string().email({
    message: "Por favor, introduce un correo electrónico válido.",
  }),
})

export default function RecuperarContrasenaPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      // Simulación de envío de correo
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setIsSubmitted(true)

      toast({
        title: "Correo enviado",
        description: "Se ha enviado un correo con instrucciones para recuperar tu contraseña.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Ha ocurrido un error al enviar el correo. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Recuperar contraseña</h1>
          <p className="text-gray-500">Ingresa tu correo electrónico para recibir instrucciones</p>
        </div>

        {isSubmitted ? (
          <div className="rounded-lg border border-green-100 bg-green-50 p-6 text-center">
            <h2 className="text-xl font-semibold text-green-800">Correo enviado</h2>
            <p className="mt-2 text-green-700">
              Hemos enviado un correo electrónico a <strong>{form.getValues().email}</strong> con instrucciones para
              recuperar tu contraseña.
            </p>
            <p className="mt-4 text-sm text-green-600">
              Si no recibes el correo en unos minutos, revisa tu carpeta de spam o{" "}
              <button className="font-medium text-green-800 hover:underline" onClick={() => setIsSubmitted(false)}>
                intenta de nuevo
              </button>
              .
            </p>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correo electrónico</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="ejemplo@correo.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full bg-[var(--primary-color)] hover:bg-[var(--primary-color)]/90"
                disabled={isLoading}
              >
                {isLoading ? "Enviando..." : "Enviar instrucciones"}
              </Button>
            </form>
          </Form>
        )}

        <div className="text-center text-sm">
          <Link href="/login" className="font-medium text-[var(--primary-color)] hover:underline">
            Volver a iniciar sesión
          </Link>
        </div>
      </div>
    </div>
  )
}

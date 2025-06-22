"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { MobileSidebar } from "@/components/admin/mobile-sidebar"
import { useAuth } from "@/hooks/use-auth"
import { OrderNotificationListener } from "@/components/admin/order-notification-listener"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, isAdmin, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Solo redirigir si no está cargando
    if (!loading) {
      if (!user) {
        // Redirect to login with the current path as redirect parameter
        const redirectPath = pathname || "/admin"
        router.push(`/login?redirect=${encodeURIComponent(redirectPath)}`)
        return
      }

      if (!isAdmin) {
        // If user is not admin, redirect to home
        router.push("/")
        return
      }
    }
  }, [user, isAdmin, router, pathname, loading])

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Verificando acceso...</h2>
          <p className="text-gray-600">Por favor, espera mientras verificamos tus permisos.</p>
        </div>
      </div>
    )
  }

  // Don't render admin content if user is not authenticated or not admin
  if (!user || !isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso denegado</h2>
          <p className="text-gray-600">No tienes permisos para acceder a esta sección.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <OrderNotificationListener />
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r md:block">
          <AdminSidebar />
        </aside>
        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-4">
            <MobileSidebar />
          </header>
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

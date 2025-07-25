"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Package, Users, ShieldCheck, Home, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"

const sidebarLinks = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    title: "Productos",
    href: "/admin/productos",
    icon: Package,
  },
  {
    title: "Pedidos",
    href: "/admin/pedidos",
    icon: Package,
  },
  {
    title: "Clientes",
    href: "/admin/clientes",
    icon: Users,
  },
  {
    title: "Datos Bancarios",
    href: "/admin/datos-bancarios",
    icon: CreditCard,
    requiresSuperAdmin: true, // Solo superadmin puede ver este módulo
  },
  {
    title: "Usuarios",
    href: "/admin/usuarios",
    icon: ShieldCheck,
    requiresSuperAdmin: true, // Only super admins can see this
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { logout, isSuperAdmin } = useAuth()

  // Filter links based on user permissions
  const visibleLinks = sidebarLinks.filter((link) => {
    if (link.requiresSuperAdmin) {
      return isSuperAdmin
    }
    return true
  })

  return (
    <div className="flex h-full flex-col border-r bg-white">
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {visibleLinks.map((link) => {
            const Icon = link.icon
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-[var(--primary-color)]",
                  pathname === link.href
                    ? "bg-[var(--primary-color)]/10 text-[var(--primary-color)]"
                    : "text-gray-500 hover:bg-[var(--primary-color)]/5",
                )}
              >
                <Icon className="h-4 w-4" />
                {link.title}
              </Link>
            )
          })}
        </nav>
      </div>
      <div className="mt-auto border-t p-4">
        <div className="grid gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition-all hover:text-[var(--primary-color)] hover:bg-[var(--primary-color)]/5"
          >
            <Home className="h-4 w-4" />
            Volver a la tienda
          </Link>
        </div>
      </div>
    </div>
  )
}

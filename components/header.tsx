"use client"

import { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Menu, Search, ShoppingCart, User, X, LogOut, UserCircle, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context"
import { cn } from "@/lib/utils"
import { useMobile } from "@/hooks/use-mobile"
import { LogoExtendido } from "@/components/ui/logo"
import { useAuth } from "@/hooks/use-auth"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function Header() {
  const { cart } = useCart()
  const { user, isAdmin, logout } = useAuth()
  const isMobile = useMobile()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-200",
        isScrolled ? "bg-white shadow-md" : "bg-white/80 backdrop-blur-sm",
      )}
    >
      <div className="flex flex-col mx-auto px-10">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <LogoExtendido height="40" className="mr-2" />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium hover:text-[var(--primary-color)] transition-colors",
                pathname === "/" && "text-[var(--primary-color)] font-semibold",
              )}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className={cn(
                "text-sm font-medium hover:text-[var(--primary-color)] transition-colors",
                pathname === "/productos" && "text-[var(--primary-color)] font-semibold",
              )}
            >
              Productos
            </Link>
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "text-sm font-medium hover:text-[var(--primary-color)] transition-colors",
                  pathname === "/admin" && "text-[var(--primary-color)] font-semibold",
                )}
              >
                Admin
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search - Only visible on desktop */}
            {/* {!isMobile && (
              <>
                {isSearchOpen ? (
                  <div className="relative w-64 animate-in fade-in duration-300">
                    <Input type="search" placeholder="Buscar productos..." className="pr-8" autoFocus />
                    <button
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="text-gray-600 hover:text-[var(--primary-color)] transition-colors"
                    onClick={() => setIsSearchOpen(true)}
                  >
                    <Search className="h-5 w-5" />
                  </button>
                )}
              </>
            )} */}

            {/* User Dropdown - Only visible on desktop */}
            {!isMobile && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="text-gray-600 hover:text-[var(--primary-color)] transition-colors">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  {user ? (
                    <>
                      <div className="px-2 py-1.5 text-sm font-medium">Hola, {user.name || "Usuario"}</div>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/mi-cuenta" className="flex items-center cursor-pointer">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Mi perfil</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/mi-cuenta/pedidos" className="flex items-center cursor-pointer">
                          <Package className="mr-2 h-4 w-4" />
                          <span>Mis pedidos</span>
                        </Link>
                      </DropdownMenuItem>
                      {isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="flex items-center cursor-pointer">
                            <span>Panel de administración</span>
                          </Link>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout} className="flex items-center cursor-pointer text-red-500">
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar sesión</span>
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link href="/login" className="flex items-center cursor-pointer">
                          <span>Iniciar sesión</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/registro" className="flex items-center cursor-pointer">
                          <span>Registrarse</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Cart - Only visible on desktop */}
            {!isMobile && (
              <Link
                href="/carrito"
                className="relative text-gray-600 hover:text-[var(--primary-color)] transition-colors"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-[var(--primary-color)]">
                    {cartItemsCount}
                  </Badge>
                )}
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="py-4">
                    <Link href="/" className="flex items-center mb-6" onClick={() => setIsMobileMenuOpen(false)}>
                      <LogoExtendido height="32" className="mr-2" />
                    </Link>

                    {/* <div className="mb-6">
                      <Input type="search" placeholder="Buscar productos..." />
                    </div> */}

                    <nav className="flex flex-col space-y-4">
                      <Link
                        href="/"
                        className={cn(
                          "text-sm font-medium hover:text-[var(--primary-color)] transition-colors",
                          pathname === "/" && "text-[var(--primary-color)] font-semibold",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Inicio
                      </Link>
                      <Link
                        href="/productos"
                        className={cn(
                          "text-sm font-medium hover:text-[var(--primary-color)] transition-colors",
                          pathname === "/productos" && "text-[var(--primary-color)] font-semibold",
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Productos
                      </Link>
                      {isAdmin && (
                        <Link
                          href="/admin"
                          className={cn(
                            "text-sm font-medium hover:text-[var(--primary-color)] transition-colors",
                            pathname === "/admin" && "text-[var(--primary-color)] font-semibold",
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          Admin
                        </Link>
                      )}
                    </nav>
                  </div>

                  <div className="mt-auto pt-6 border-t">
                    <div className="flex flex-col space-y-4">
                      {user ? (
                        <>
                          <div className="text-sm font-medium mb-2">Hola, {user.name || "Usuario"}</div>
                          <Link
                            href="/mi-cuenta"
                            className="flex items-center text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <UserCircle className="h-5 w-5 mr-2" />
                            Mi perfil
                          </Link>
                          <Link
                            href="/mi-cuenta/pedidos"
                            className="flex items-center text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <Package className="h-5 w-5 mr-2" />
                            Mis pedidos
                          </Link>
                          <Link
                            href="/carrito"
                            className="flex items-center text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <ShoppingCart className="h-5 w-5 mr-2" />
                            Carrito ({cartItemsCount})
                          </Link>
                          <button
                            onClick={() => {
                              logout()
                              setIsMobileMenuOpen(false)
                            }}
                            className="flex items-center text-sm font-medium text-red-500"
                          >
                            <LogOut className="h-5 w-5 mr-2" />
                            Cerrar sesión
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href="/login"
                            className="flex items-center text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="h-5 w-5 mr-2" />
                            Iniciar sesión
                          </Link>
                          <Link
                            href="/registro"
                            className="flex items-center text-sm font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            <User className="h-5 w-5 mr-2" />
                            Registrarse
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

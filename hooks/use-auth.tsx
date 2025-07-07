"use client"

import { createContext, useContext, useState, useEffect, type ReactNode, Suspense } from "react"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  role: "CUSTOMER" | "ADMIN" | "SUPER_ADMIN"
  isActive: boolean
  phone?: string
  isSubscribed: boolean
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  updateUser: (userData: Partial<User>) => void
  isAdmin: boolean
  isSuperAdmin: boolean
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderContent({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing stored user:", error)
        localStorage.removeItem("user")
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.status === "error") {
        throw new Error(data.message)
      }

      if (!data.token) {
        throw new Error("No se recibió el token de autenticación")
      }

      setUser(data.user)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("token", data.token)

      // Redirigir según el rol del usuario
      if (data.user.role === "ADMIN" || data.user.role === "SUPER_ADMIN") {
        router.push("/admin")
      } else {
        const redirectTo = searchParams?.get("redirect")
        if (redirectTo) {
          router.push(redirectTo)
        } else {
          router.push("/")
        }
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    router.push("/")
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const isAdmin = user?.role === "ADMIN" || user?.role === "SUPER_ADMIN"
  const isSuperAdmin = user?.role === "SUPER_ADMIN"

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser, isAdmin, isSuperAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AuthProviderContent>{children}</AuthProviderContent>
    </Suspense>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

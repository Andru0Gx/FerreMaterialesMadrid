"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Verificar si hay un usuario en localStorage al cargar
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
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

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || "Error al iniciar sesión")
      }

      const data = await response.json()
      const userData = data.user

      setUser(userData)
      localStorage.setItem("user", JSON.stringify(userData))
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    if (pathname !== "/") {
      router.push("/")
    }
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

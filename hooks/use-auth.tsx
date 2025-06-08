"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"

export interface User {
  id: string
  name: string
  email: string
  role: "admin" | "super_admin" | "user"
}

interface AuthContextType {
  user: User | null
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
      }
    }
    setLoading(false)
  }, [])

  // Mock login function - in a real app, this would call your API
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock admin users
      if (email === "admin@example.com" && password === "password") {
        const adminUser: User = {
          id: "1",
          name: "Admin User",
          email: "admin@example.com",
          role: "admin",
        }
        setUser(adminUser)
        localStorage.setItem("user", JSON.stringify(adminUser))

        // Stay on current page after login
        return true
      } else if (email === "superadmin@example.com" && password === "password") {
        const superAdminUser: User = {
          id: "2",
          name: "Super Admin",
          email: "superadmin@example.com",
          role: "super_admin",
        }
        setUser(superAdminUser)
        localStorage.setItem("user", JSON.stringify(superAdminUser))

        // Stay on current page after login
        return true
      } else if (email === "cliente@example.com" && password === "password") {
        const clientUser: User = {
          id: "3",
          name: "Cliente User",
          email: "cliente@example.com",
          role: "user",
        }
        setUser(clientUser)
        localStorage.setItem("user", JSON.stringify(clientUser))
        return true
      }

      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    }
  }

  const logout = () => {
    const wasAdmin = user?.role === "admin" || user?.role === "super_admin"

    setUser(null)
    localStorage.removeItem("user")

    // If user was admin, redirect to home page
    // Otherwise, stay on current page
    if (wasAdmin) {
      router.push("/")
    }
    // For regular users, they stay on the current page
  }

  const isAdmin = user?.role === "admin" || user?.role === "super_admin"
  const isSuperAdmin = user?.role === "super_admin"

  return (
    <AuthContext.Provider value={{ user, isAdmin, isSuperAdmin, login, logout }}>
      {!loading && children}
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

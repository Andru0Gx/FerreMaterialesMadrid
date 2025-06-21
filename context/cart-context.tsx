"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAuth } from "@/hooks/use-auth"

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
  discount: number
}

interface DiscountInfo {
  code: string
  type: "percentage" | "fixed"
  value: number
  discountAmount: number
}

interface CartContextType {
  cart: CartItem[]
  discount: DiscountInfo | null
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  applyDiscount: (code: string) => Promise<void>
  removeDiscount: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([])
  const [discount, setDiscount] = useState<DiscountInfo | null>(null)
  const { user } = useAuth()

  // Cargar carrito inicial
  useEffect(() => {
    const loadCart = async () => {
      if (user?.id) {
        // Si hay usuario, intentar cargar desde la base de datos
        try {
          const response = await fetch('/api/cart', {
            headers: {
              'x-user-id': user.id
            }
          })
          const data = await response.json()
          if (data.cart) {
            setCart(data.cart)
            // No cargamos el descuento aquí porque queremos que se reinicie en cada carga
            return
          }
        } catch (error) {
          console.error('Error loading cart from database:', error)
        }
      }

      // Si no hay usuario o falla la carga desde la base de datos, cargar desde localStorage
      const savedCart = localStorage.getItem("cart")
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart))
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
        }
      }
    }

    loadCart()
  }, [user])

  // Guardar carrito cuando cambie
  useEffect(() => {
    // Siempre guardar en localStorage
    localStorage.setItem("cart", JSON.stringify(cart))

    // Si hay usuario, guardar también en la base de datos
    if (user?.id) {
      fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id
        },
        body: JSON.stringify({ cart }),
      }).catch(error => {
        console.error('Error saving cart to database:', error)
      })
    }
  }, [cart, user])

  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id)

      if (existingItem) {
        // Si el producto ya está en el carrito
        if (item.quantity > 1) {
          // Si se especifica una cantidad, la usamos
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: item.quantity }
              : cartItem
          )
        } else {
          // Si no se especifica cantidad, incrementamos en 1
          return prevCart.map((cartItem) =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          )
        }
      }

      // Si el producto no está en el carrito, lo añadimos con su cantidad
      return [...prevCart, item]
    })
  }

  const removeFromCart = (id: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => prevCart.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCart([])
    setDiscount(null)
  }

  const applyDiscount = async (code: string) => {
    if (!user?.id) {
      throw new Error("Debes iniciar sesión para aplicar códigos de descuento")
    }

    const response = await fetch(`/api/cart?discountCode=${encodeURIComponent(code)}`, {
      headers: {
        'x-user-id': user.id
      }
    })

    const data = await response.json()

    if (data.discount) {
      setDiscount(data.discount)
    } else {
      throw new Error("Código de descuento inválido")
    }
  }

  const removeDiscount = () => {
    setDiscount(null)
  }

  return (
    <CartContext.Provider value={{
      cart,
      discount,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      applyDiscount,
      removeDiscount
    }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}

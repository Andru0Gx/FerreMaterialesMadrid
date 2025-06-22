// Tipos básicos para el carrito
export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  category: string
  quantity: number
}

export interface DiscountInfo {
  code: string
  type: "percentage" | "fixed"
  value: number
  discountAmount: number
}

// Enums y tipos de estado
export type Role = "CUSTOMER" | "ADMIN" | "SUPER_ADMIN"
export type AdminRole = "ADMIN" | "SUPER_ADMIN"
export type AdminStatus = "ACTIVE" | "INACTIVE"
export type OrderStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "CANCELLED" | "SHIPPED" | "DELIVERED"
export type PaymentStatus = "PENDING" | "PAID" | "FAILED"
export type DiscountType = "PORCENTAJE" | "FIJO" | "ENVIO_GRATIS"

// Interfaces principales
export interface User {
  id: string
  name: string
  email: string
  password: string
  role: Role
  phone: string | null
  isActive: boolean
  isSubscribed: boolean
  cart: CartItem[] | null
  addresses?: Address[]
  orders?: Order[]
}

export interface Admin {
  id: string
  name: string
  email: string
  password: string
  role: AdminRole
  status: AdminStatus
  phone: string | null
}

export interface Promotion {
  id: string
  couponCode: string | null
  discountType: DiscountType
  discountValue: number
  startDate: Date | null
  endDate: Date | null
  maxUsage: number | null
  active: boolean
}

// Interfaces relacionadas con productos
export interface Product {
  id: number
  name: string
  sku: string
  price: number
  description: string
  shortDescription: string
  discount: number
  stock: number
  slug: string
  category: string
  specifications: any
  images?: ProductImage[]
  orderItems?: OrderItem[]
}

export interface ProductImage {
  id: number
  imageUrl: string
  productId: number
}

// Interfaces relacionadas con órdenes
export interface Order {
  id: string
  orderNumber: string
  userId: string | null
  status: OrderStatus
  total: number
  itemsCount: number
  phone: string | null
  email: string | null
  nombre?: string | null // Nombre del cliente en tienda física
  isInStore?: boolean // True: venta en tienda, False: venta online
  paymentStatus: PaymentStatus
  paymentMethod: string
  paymentBank: string
  paymentReference: string
  paymentReceipt?: string
  shippingAddressId: string | null
  shippingAddress?: Address
  createdAt: Date
  items: OrderItem[]
  user?: {
    id: string
    name: string
    email: string
    phone: string
  }
  discountCode?: string
  discountAmount?: number
  notes?: string
}

export interface OrderItem {
  id: number
  orderId: string
  productId: number
  variantId: string | null
  quantity: number
  price: number
  discount: number
  createdAt: Date
}

export interface Address {
  id: string
  userId: string
  name: string
  address: string
  city: string
  zip: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image?: string
  description?: string
}

export interface Brand {
  id: string
  name: string
  logo?: string
  description?: string
  website?: string
}

export interface Supplier {
  id: string
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  country?: string
  categories?: string[]
  rating?: number
}

export interface Testimonial {
  id: string
  name: string
  avatar: string
  location: string
  rating: number
  text: string
}

export interface SalesData {
  date: string
  amount: number
}

export interface OrderDetail {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface OrderComplete extends Omit<Order, 'items' | 'paymentMethod'> {
  items: OrderDetail[]
  address?: Address
  paymentMethod?: string
  notes?: string
  scheduledDate?: string
}

// Interfaces de pago y envío
export interface PaymentMethod {
  id: string
  name: string
  description: string
  active: boolean
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: number
  active: boolean
}

export interface Review {
  id: string
  productId: string
  userId: string
  rating: number
  title: string
  comment: string
  date: string
  verified: boolean
}

export interface Coupon {
  id: string
  code: string
  discountType: "PORCENTAJE" | "FIJO" | "ENVIO_GRATIS"
  discountValue: number
  minimumPurchase: number
  startDate: string
  endDate: string
  usageLimit: number
  usageCount: number
  active: boolean
  description: string
  applicableCategories?: string[]
  applicableProducts?: string[]
}

export interface Notification {
  id: string
  userId: string
  title: string
  message: string
  date: string
  read: boolean
  type: string
  link?: string
}

export interface ProductTag {
  id: string
  name: string
  slug: string
  color?: string
}

export interface ProductAttribute {
  id: string
  name: string
  values: string[]
}

export interface ProductVariant {
  id: string
  productId: string
  sku: string
  barcode?: string
  attributes: Record<string, string>
  price: number
  discount: number
  inStock: boolean
  images?: string[]
}

export interface Inventory {
  id: string
  productId: string
  variantId: string | null
  quantity: number
  location: string
  lastUpdated: string
  minimumStock: number
  reservedQuantity: number
}

export interface PriceHistory {
  id: string
  productId: string
  variantId: string | null
  price: number
  date: string
}

// Interfaces de filtros y estadísticas
export interface FilterOptions {
  period?: "day" | "week" | "month" | "year"
  startDate?: string
  endDate?: string
}

export interface StatsData {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  pendingOrders: number
}

export interface Filters {
  categories: string[]
  priceRange: [number, number]
  inStock: boolean
  onSale: boolean
}

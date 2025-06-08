export interface Product {
  id: string
  name: string
  category: string
  price: number
  discount: number
  rating?: number
  reviews?: number
  inStock: boolean
  images: string[]
  shortDescription?: string
  description: string
  specifications?: string[]
  questions?: {
    question: string
    answer: string
  }[]
  featured?: boolean
  categoryId?: string
  slug?: string
  brandId?: string
  supplierId?: string
  tags?: string[]
  sku?: string
  barcode?: string
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

export interface Order {
  id: string
  customer: string
  date: string
  status: "pending" | "processing" | "completed" | "cancelled" | "shipped" | "delivered"
  total: number
  items: number
  phone?: string
  email?: string
  paymentStatus?: "pending" | "paid" | "failed"
  createdAt?: string
}

export interface Stats {
  totalSales: number
  totalOrders: number
  totalCustomers: number
  averageOrderValue: number
  growth: {
    sales: number
    orders: number
    customers: number
    average: number
  }
}

export interface User {
  id: string
  name: string
  email: string
  role: "customer" | "admin" | "super_admin"
  avatar?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zip?: string
  isActive?: boolean
  isSubscribed?: boolean
}

export interface Address {
  id: string
  userId: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  isDefault: boolean
}

export interface OrderDetail {
  id: string
  orderId: string
  productId: string
  quantity: number
  price: number
  product?: Product
}

export interface OrderComplete extends Order {
  items: OrderDetail[]
  address?: Address
  paymentMethod?: string
  notes?: string
  scheduledDate?: string
}

export interface Admin {
  id: string
  name: string
  email: string
  role: "admin" | "super_admin"
  permissions: string[]
  lastLogin?: string
  phone?: string
  status?: "active" | "inactive"
}

export interface Promotion {
  id: string
  name: string
  description: string
  discountType: "percentage" | "fixed" | "buyXgetY" | "freeShipping"
  discountValue: number
  startDate: string
  endDate: string
  applicableCategories?: string[]
  applicableProducts?: string[]
  minimumPurchase: number
  couponCode?: string
  active: boolean
}

export interface PaymentMethod {
  id: string
  name: string
  description: string
  active: boolean
  processingFee: number
  icon?: string
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDeliveryDays: number
  active: boolean
  icon?: string
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
  discountType: "percentage" | "fixed" | "freeShipping"
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

export interface OrderStatus {
  id: string
  name: string
  slug: string
  color: string
  description: string
}

export interface PaymentStatus {
  id: string
  name: string
  slug: string
  color: string
  description: string
}

export interface ShippingStatus {
  id: string
  name: string
  slug: string
  color: string
  description: string
}

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

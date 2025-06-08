import { query } from './db-pg'

// Funciones para usuarios
export async function getUsers() {
    return query('SELECT * FROM users ORDER BY created_at DESC')
}

export async function getUserById(id: string) {
    return query('SELECT * FROM users WHERE id = $1', [id])
}

export async function createUser(userData: any) {
    const { name, email, role, phone, address, city, state, zip } = userData
    return query(
        `INSERT INTO users (name, email, role, phone, address, city, state, zip)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
        [name, email, role, phone, address, city, state, zip]
    )
}

// Funciones para productos
export async function getProducts() {
    return query(`
    SELECT p.*, c.name as category_name, b.name as brand_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    ORDER BY p.created_at DESC
  `)
}

export async function getProductById(id: string) {
    return query(`
    SELECT p.*, c.name as category_name, b.name as brand_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.id = $1
  `, [id])
}

export async function getProductsByCategory(categoryId: string) {
    return query(`
    SELECT p.*, c.name as category_name, b.name as brand_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    LEFT JOIN brands b ON p.brand_id = b.id
    WHERE p.category_id = $1
    ORDER BY p.created_at DESC
  `, [categoryId])
}

// Funciones para categorías
export async function getCategories() {
    return query('SELECT * FROM categories ORDER BY name')
}

export async function getCategoryById(id: string) {
    return query('SELECT * FROM categories WHERE id = $1', [id])
}

// Funciones para pedidos
export async function getOrders() {
    return query(`
    SELECT o.*, u.name as customer_name
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `)
}

export async function getOrderById(id: string) {
    return query(`
    SELECT o.*, u.name as customer_name
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    WHERE o.id = $1
  `, [id])
}

export async function getOrderItems(orderId: string) {
    return query(`
    SELECT oi.*, p.name as product_name
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = $1
  `, [orderId])
}

// Funciones para marcas
export async function getBrands() {
    return query('SELECT * FROM brands ORDER BY name')
}

export async function getBrandById(id: string) {
    return query('SELECT * FROM brands WHERE id = $1', [id])
}

// Funciones para proveedores
export async function getSuppliers() {
    return query('SELECT * FROM suppliers ORDER BY name')
}

export async function getSupplierById(id: string) {
    return query('SELECT * FROM suppliers WHERE id = $1', [id])
}

// Funciones para reseñas
export async function getProductReviews(productId: string) {
    return query(`
    SELECT r.*, u.name as user_name
    FROM reviews r
    LEFT JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1
    ORDER BY r.created_at DESC
  `, [productId])
}

// Funciones para promociones
export async function getActivePromotions() {
    return query(`
    SELECT * FROM promotions
    WHERE active = true
    AND start_date <= NOW()
    AND end_date >= NOW()
    ORDER BY start_date DESC
  `)
}

// Funciones para notificaciones
export async function getUserNotifications(userId: string) {
    return query(`
    SELECT * FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
  `, [userId])
}

// Funciones para direcciones
export async function getUserAddresses(userId: string) {
    return query(`
    SELECT * FROM addresses
    WHERE user_id = $1
    ORDER BY is_default DESC, created_at DESC
  `, [userId])
}

export async function createOrder({
    customer_id,
    items,
    total_amount,
    status = 'pending'
}: {
    customer_id: string
    items: Array<{
        product_id: string
        quantity: number
        price: number
    }>
    total_amount: number
    status?: string
}) {
    try {
        await query('BEGIN')

        // Crear el pedido
        const orderResult = await query(
            `INSERT INTO orders (customer_id, total_amount, status)
       VALUES ($1, $2, $3)
       RETURNING *`,
            [customer_id, total_amount, status]
        )

        // Crear los items del pedido
        for (const item of items) {
            await query(
                `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
                [orderResult.rows[0].id, item.product_id, item.quantity, item.price]
            )
        }

        await query('COMMIT')
        return orderResult
    } catch (error) {
        await query('ROLLBACK')
        throw error
    }
} 
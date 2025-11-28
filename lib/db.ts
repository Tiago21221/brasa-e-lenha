import { neon } from "@neondatabase/serverless"

export const sql = neon(process.env.DATABASE_URL || "")

export interface Category {
  id: number
  name: string
  slug: string
  displayOrder: number
  createdAt: Date
}

export interface Product {
  id: number
  categoryId: number
  name: string
  description: string | null
  priceInCents: number
  imageUrl: string | null
  available: boolean
  ingredients: string | null
  createdAt: Date
}

export interface Customer {
  id: number
  name: string
  phone: string
  email?: string | null
  address: string
  createdAt: Date
}

export interface Order {
  id: number
  customerId?: number | null
  customerName: string
  customerPhone: string
  customerAddress: string
  totalCents: number
  status: string
  paymentMethod: string
  paymentStatus: string
  stripeSessionId?: string | null
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface OrderItem {
  id: number
  orderId: number
  productId: number
  productName: string
  productPriceCents: number
  quantity: number
  subtotalCents: number
}

export interface OrderWithItems extends Order {
  items: OrderItem[]
}

export const db = {
  category: {
    findMany: async (options?: { orderBy?: { displayOrder?: "asc" | "desc" } }) => {
      const orderBy = options?.orderBy?.displayOrder || "asc"
      const result = await sql<any[]>`
        SELECT 
          id, 
          name, 
          slug, 
          display_order as "displayOrder",
          created_at as "createdAt"
        FROM categories 
        ORDER BY display_order ${orderBy === "asc" ? sql`ASC` : sql`DESC`}
      `
      return result as Category[]
    },
  },

  product: {
    findMany: async (options?: {
      where?: { available?: boolean }
      orderBy?: Array<{ categoryId?: "asc" | "desc"; name?: "asc" | "desc" }>
    }) => {
      const whereClause =
        options?.where?.available !== undefined ? sql`WHERE available = ${options.where.available}` : sql``

      const result = await sql<any[]>`
        SELECT 
          id,
          category_id as "categoryId",
          name,
          description,
          price_in_cents as "priceInCents",
          image_url as "imageUrl",
          available,
          ingredients,
          created_at as "createdAt"
        FROM products 
        ${whereClause}
        ORDER BY category_id ASC, name ASC
      `
      return result as Product[]
    },
  },

  order: {
    create: async (data: {
      data: {
        customerName: string
        customerPhone: string
        customerAddress: string
        totalCents: number
        paymentMethod: string
        paymentStatus: string
        stripeSessionId: string | null
        notes: string | null
        status: string
        items: {
          create: Array<{
            productId: number
            productName: string
            productPriceCents: number
            quantity: number
            subtotalCents: number
          }>
        }
      }
      include?: { items?: boolean }
    }) => {
      const { data: orderData } = data

      // Create order
      const [order] = await sql<any[]>`
        INSERT INTO orders (
          customer_name,
          customer_phone,
          customer_address,
          total_cents,
          payment_method,
          payment_status,
          stripe_session_id,
          notes,
          status
        ) VALUES (
          ${orderData.customerName},
          ${orderData.customerPhone},
          ${orderData.customerAddress},
          ${orderData.totalCents},
          ${orderData.paymentMethod},
          ${orderData.paymentStatus},
          ${orderData.stripeSessionId},
          ${orderData.notes},
          ${orderData.status}
        )
        RETURNING 
          id,
          customer_id as "customerId",
          customer_name as "customerName",
          customer_phone as "customerPhone",
          customer_address as "customerAddress",
          total_cents as "totalCents",
          status,
          payment_method as "paymentMethod",
          payment_status as "paymentStatus",
          stripe_session_id as "stripeSessionId",
          notes,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `

      // Create items
      const items = []
      for (const item of orderData.items.create) {
        const [createdItem] = await sql<any[]>`
          INSERT INTO order_items (
            order_id,
            product_id,
            product_name,
            product_price_cents,
            quantity,
            subtotal_cents
          ) VALUES (
            ${order.id},
            ${item.productId},
            ${item.productName},
            ${item.productPriceCents},
            ${item.quantity},
            ${item.subtotalCents}
          )
          RETURNING 
            id,
            order_id as "orderId",
            product_id as "productId",
            product_name as "productName",
            product_price_cents as "productPriceCents",
            quantity,
            subtotal_cents as "subtotalCents"
        `
        items.push(createdItem)
      }

      return { ...order, items } as OrderWithItems
    },

    findMany: async (options?: {
      where?: { status?: string }
      orderBy?: { createdAt?: "asc" | "desc" }
      include?: { items?: boolean }
    }) => {
      const whereClause = options?.where?.status ? sql`WHERE status = ${options.where.status}` : sql``

      const orderDir = options?.orderBy?.createdAt === "asc" ? sql`ASC` : sql`DESC`

      const orders = await sql<any[]>`
        SELECT 
          id,
          customer_id as "customerId",
          customer_name as "customerName",
          customer_phone as "customerPhone",
          customer_address as "customerAddress",
          total_cents as "totalCents",
          status,
          payment_method as "paymentMethod",
          payment_status as "paymentStatus",
          stripe_session_id as "stripeSessionId",
          notes,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM orders 
        ${whereClause}
        ORDER BY created_at ${orderDir}
      `

      if (options?.include?.items) {
        const ordersWithItems = await Promise.all(
          orders.map(async (order: any) => {
            const items = await sql<any[]>`
              SELECT 
                id,
                order_id as "orderId",
                product_id as "productId",
                product_name as "productName",
                product_price_cents as "productPriceCents",
                quantity,
                subtotal_cents as "subtotalCents"
              FROM order_items 
              WHERE order_id = ${order.id}
            `
            return { ...order, items }
          }),
        )
        return ordersWithItems as OrderWithItems[]
      }

      return orders as Order[]
    },

    findUnique: async (options: {
      where: { id: number }
      include?: { items?: boolean }
    }) => {
      const [order] = await sql<any[]>`
        SELECT 
          id,
          customer_id as "customerId",
          customer_name as "customerName",
          customer_phone as "customerPhone",
          customer_address as "customerAddress",
          total_cents as "totalCents",
          status,
          payment_method as "paymentMethod",
          payment_status as "paymentStatus",
          stripe_session_id as "stripeSessionId",
          notes,
          created_at as "createdAt",
          updated_at as "updatedAt"
        FROM orders 
        WHERE id = ${options.where.id}
      `

      if (!order) return null

      if (options.include?.items) {
        const items = await sql<any[]>`
          SELECT 
            id,
            order_id as "orderId",
            product_id as "productId",
            product_name as "productName",
            product_price_cents as "productPriceCents",
            quantity,
            subtotal_cents as "subtotalCents"
          FROM order_items 
          WHERE order_id = ${order.id}
        `
        return { ...order, items } as OrderWithItems
      }

      return order as Order
    },

    update: async (options: {
      where: { id: number }
      data: { status?: string; paymentStatus?: string }
    }) => {
      const updates = []
      if (options.data.status) {
        updates.push(sql`status = ${options.data.status}`)
      }
      if (options.data.paymentStatus) {
        updates.push(sql`payment_status = ${options.data.paymentStatus}`)
      }

      if (updates.length === 0) return null

      const [order] = await sql<any[]>`
        UPDATE orders 
        SET ${sql.join(updates, sql`, `)}, updated_at = CURRENT_TIMESTAMP
        WHERE id = ${options.where.id}
        RETURNING 
          id,
          customer_id as "customerId",
          customer_name as "customerName",
          customer_phone as "customerPhone",
          customer_address as "customerAddress",
          total_cents as "totalCents",
          status,
          payment_method as "paymentMethod",
          payment_status as "paymentStatus",
          stripe_session_id as "stripeSessionId",
          notes,
          created_at as "createdAt",
          updated_at as "updatedAt"
      `

      return order as Order
    },
  },
}

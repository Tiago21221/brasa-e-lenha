import type { Order, OrderItem } from "@prisma/client"

export type OrderWithItems = Order & {
  items: OrderItem[]
}

export type { Category, Product, Customer, Order, OrderItem } from "@prisma/client"

import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { customerName, customerPhone, customerAddress, deliveryType, paymentMethod, notes, items, totalCents, stripeSessionId } =
      body

    console.log("[v0] Received order request:", {
      customerName,
      customerPhone,
      itemsCount: items?.length,
      totalCents,
      paymentMethod,
    })

    if (
      !customerName ||
      !customerPhone ||
      !customerAddress ||
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalCents
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const order = await prisma.order.create({
      data: {
        customerName,
        customerPhone,
        customerAddress,
        deliveryType: deliveryType || "delivery",
        totalCents,
        paymentMethod,
        paymentStatus: paymentMethod === "card" ? "paid" : "pending",
        stripeSessionId: stripeSessionId || null,
        notes: notes || null,
        status: "pending",
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            productName: item.name,
            productPriceCents: item.price,
            quantity: item.quantity,
            subtotalCents: item.price * item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    })

    console.log("[v0] Order created with ID:", order.id)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const orders = await prisma.order.findMany({
      where: status ? { status } : undefined,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

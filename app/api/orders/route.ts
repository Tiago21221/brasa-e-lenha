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
      !paymentMethod ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0 ||
      !totalCents
    ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Validar endereço apenas para delivery
    if (deliveryType === "delivery" && !customerAddress) {
      return NextResponse.json({ error: "Address is required for delivery" }, { status: 400 })
    }

    // Usar endereço padrão para retirada se não fornecido
    const finalAddress = deliveryType === "pickup" 
      ? (customerAddress || "Retirada no Restaurante")
      : customerAddress

    // Preparar dados do pedido
    const orderData: any = {
      customerName,
      customerPhone,
      customerAddress: finalAddress,
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
    }

    // Tentar adicionar deliveryType (pode não existir no banco ainda)
    if (deliveryType) {
      orderData.deliveryType = deliveryType
    }

    let order
    try {
      // Tentar criar com deliveryType
      order = await prisma.order.create({
        data: orderData,
        include: {
          items: true,
        },
      })
    } catch (firstError: any) {
      // Se o erro for relacionado ao campo deliveryType não existir, tentar sem ele
      const errorMessage = firstError?.message || ""
      if (errorMessage.includes("delivery_type") || errorMessage.includes("deliveryType") || errorMessage.includes("Unknown column")) {
        console.log("[v0] deliveryType field not found, creating order without it")
        delete orderData.deliveryType
        order = await prisma.order.create({
          data: orderData,
          include: {
            items: true,
          },
        })
      } else {
        throw firstError
      }
    }

    console.log("[v0] Order created with ID:", order.id)

    return NextResponse.json({ success: true, orderId: order.id })
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    
    // Verifica se o erro é relacionado ao campo deliveryType não existir no banco
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    if (errorMessage.includes("delivery_type") || errorMessage.includes("deliveryType")) {
      return NextResponse.json(
        {
          error: "Database migration required",
          details: "O campo deliveryType não existe no banco de dados. Execute a migração: npm run prisma:push ou execute o script scripts/004_add_delivery_type.sql",
        },
        { status: 500 },
      )
    }
    
    return NextResponse.json(
      {
        error: "Failed to create order",
        details: errorMessage,
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

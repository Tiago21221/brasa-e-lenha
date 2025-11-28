import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const phone = searchParams.get("phone")

    if (!phone) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 })
    }

    // Buscar pedidos por telefone do cliente
    const orders = await prisma.order.findMany({
      where: {
        customerPhone: phone,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        items: true,
      },
    })

    return NextResponse.json({ orders })
  } catch (error) {
    console.error("[v0] Error fetching user orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}


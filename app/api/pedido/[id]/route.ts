import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* EDITAR PEDIDO */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()

    const exists = await prisma.order.findUnique({
      where: { id: orderId },
    })

    if (!exists) {
      return NextResponse.json(
        { error: "Pedido não encontrado" },
        { status: 404 },
      )
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        // ajuste os campos conforme seu schema:
        ...(body.status !== undefined && { status: body.status }),
        ...(body.observation !== undefined && { observation: body.observation }),
        ...(body.paymentMethod !== undefined && {
          paymentMethod: body.paymentMethod,
        }),
        // se tiver mais campos editáveis, coloque aqui
      },
    })

    return NextResponse.json({ order: updatedOrder }, { status: 200 })
  } catch (error) {
    console.error("[EDIT ORDER]", error)
    return NextResponse.json(
      { error: "Erro ao editar pedido" },
      { status: 500 },
    )
  }
}

/* REMOVER PEDIDO (se quiser) */
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = Number(params.id)

    if (isNaN(orderId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await prisma.order.delete({
      where: { id: orderId },
    })

    return NextResponse.json(
      { message: "Pedido removido com sucesso" },
      { status: 200 },
    )
  } catch (error) {
    console.error("[DELETE ORDER]", error)
    return NextResponse.json(
      { error: "Erro ao remover pedido" },
      { status: 500 },
    )
  }
}

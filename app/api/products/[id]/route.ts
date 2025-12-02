import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

/* ================================
   EDITAR PRODUTO
================================ */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const productId = Number(id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    const body = await request.json()

    const exists = await prisma.product.findUnique({
      where: { id: productId },
    })

    if (!exists) {
      return NextResponse.json(
        { error: "Produto não encontrado" },
        { status: 404 }
      )
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        ...(body.name !== undefined && { name: body.name.trim() }),
        ...(body.description !== undefined && { description: body.description }),
        ...(body.ingredients !== undefined && { ingredients: body.ingredients }),
        ...(body.imageUrl !== undefined && { imageUrl: body.imageUrl }),
        ...(body.available !== undefined && { available: Boolean(body.available) }),
        ...(body.categoryId !== undefined && {
          categoryId: Number(body.categoryId),
        }),
        ...(body.priceInCents !== undefined && {
          priceInCents: Math.floor(Number(body.priceInCents)),
        }),
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json({ product: updatedProduct }, { status: 200 })
  } catch (error) {
    console.error("[EDIT PRODUCT]", error)
    return NextResponse.json(
      { error: "Erro ao editar produto" },
      { status: 500 }
    )
  }
}

/* ================================
   REMOVER PRODUTO
================================ */
export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const productId = Number(id)

    if (isNaN(productId)) {
      return NextResponse.json({ error: "ID inválido" }, { status: 400 })
    }

    await prisma.product.delete({
      where: { id: productId },
    })

    return NextResponse.json(
      { message: "Produto removido com sucesso" },
      { status: 200 }
    )
  } catch (error) {
    console.error("[DELETE PRODUCT]", error)
    return NextResponse.json(
      { error: "Erro ao remover produto" },
      { status: 500 }
    )
  }
}

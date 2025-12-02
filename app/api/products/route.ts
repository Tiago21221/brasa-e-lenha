import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    console.log("[FIX] API POST /products - Iniciando...")

    const body = await request.json()
    console.log("[FIX] Body recebido:", JSON.stringify(body, null, 2))

    const { 
      name, 
      description, 
      priceInCents, 
      categoryId, 
      ingredients, 
      available, 
      imageUrl 
    } = body

    // Validações mais robustas
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Nome do produto é obrigatório" }, { status: 400 })
    }

    if (typeof priceInCents !== "number" || isNaN(priceInCents) || priceInCents <= 0) {
      console.log("[FIX] Erro preço:", { priceInCents, type: typeof priceInCents })
      return NextResponse.json({ error: "Preço inválido (deve ser número > 0)" }, { status: 400 })
    }

    if (typeof categoryId !== "number" || isNaN(categoryId) || categoryId <= 0) {
      console.log("[FIX] Erro categoria:", { categoryId, type: typeof categoryId })
      return NextResponse.json({ error: "ID da categoria inválido" }, { status: 400 })
    }

    // Verifica se categoria existe
    const category = await prisma.category.findUnique({
      where: { id: categoryId }
    })

    if (!category) {
      return NextResponse.json({ error: "Categoria não encontrada" }, { status: 404 })
    }

    console.log("[FIX] Criando produto...")

    // Cria o produto
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        description: description && typeof description === "string" ? description.trim() : null,
        priceInCents: Math.floor(priceInCents), // Garante inteiro
        categoryId,
        ingredients: ingredients && typeof ingredients === "string" ? ingredients.trim() : null,
        available: Boolean(available),
        imageUrl: imageUrl && typeof imageUrl === "string" ? imageUrl : null,
      },
      include: {
        category: true,
      },
    })

    console.log("[FIX] Produto criado:", product.id)
    return NextResponse.json({ 
      message: "Produto criado com sucesso", 
      product 
    }, { status: 201 })

  } catch (error: any) {
    console.error("[FIX] Erro ao criar produto:", error)
    
    if (error.code === 'P2002') {
      return NextResponse.json({ 
        error: "Produto com este nome já existe" 
      }, { status: 409 })
    }

    if (error.code === 'P2003') {
      return NextResponse.json({ 
        error: "Categoria inválida" 
      }, { status: 400 })
    }

    return NextResponse.json({
      error: "Erro interno do servidor",
      details: error.message || "Erro desconhecido"
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ products }, { status: 200 })
  } catch (error) {
    console.error("[FIX] Error fetching products:", error)
    return NextResponse.json({ error: "Erro ao buscar produtos" }, { status: 500 })
  }
}

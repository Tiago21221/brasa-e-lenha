import { NextRequest, NextResponse } from "next/server"

export async function PATCH(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()
    const { status } = body

    // Aqui conecta com seu banco Neon
    const response = await fetch(`${process.env.NEON_URL}/reservations/${id}`, {
      method: "PATCH",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.NEON_API_KEY}`
      },
      body: JSON.stringify({ status })
    })

    if (!response.ok) {
      throw new Error("Erro ao atualizar reserva")
    }

    return NextResponse.json({ 
      success: true,
      message: "Status atualizado!" 
    })
  } catch (error) {
    console.error("Erro:", error)
    return NextResponse.json(
      { error: "Erro interno do servidor" }, 
      { status: 500 }
    )
  }
}

import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Puxa do Neon
    const response = await fetch(`${process.env.NEON_URL}/reservations`)
    const reservations = await response.json()
    
    return NextResponse.json({ reservations })
  } catch (error) {
    return NextResponse.json({ error: "Erro" }, { status: 500 })
  }
}

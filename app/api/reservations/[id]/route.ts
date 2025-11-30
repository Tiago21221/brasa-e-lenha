import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reservationId = Number(id)

    const reservation = await prisma.reservation.findUnique({
      where: { id: reservationId },
    })

    if (!reservation) {
      return NextResponse.json({ error: "Reservation not found" }, { status: 404 })
    }

    return NextResponse.json({ reservation })
  } catch (error) {
    console.error("[reservations] Error fetching reservation:", error)
    return NextResponse.json({ error: "Failed to fetch reservation" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const reservationId = Number(id)
    const body = await request.json()
    const { status } = body

    if (!status) {
      return NextResponse.json({ error: "Status field required" }, { status: 400 })
    }

    await prisma.reservation.update({
      where: { id: reservationId },
      data: { status },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[reservations] Error updating reservation:", error)
    return NextResponse.json({ error: "Failed to update reservation" }, { status: 500 })
  }
}

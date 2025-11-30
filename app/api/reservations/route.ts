import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, phone, date, people, note, time } = body

    console.log("[reservations] Received reservation request:", {
      name,
      phone,
      date,
      people,
      time
    })

    if (!name || !phone || !date || !people) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const reservation = await prisma.reservation.create({
      data: {
        name,
        phone,
        date: new Date(date),
        people: Number(people),
        note: note || null,
        status: "pending"
      }
    })

    console.log("[reservations] Reservation created with ID:", reservation.id)

    return NextResponse.json({ success: true, reservationId: reservation.id })
  } catch (error) {
    console.error("[reservations] Error creating reservation:", error)
    return NextResponse.json(
      { error: "Failed to create reservation", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")

    const reservations = await prisma.reservation.findMany({
      where: status ? { status } : undefined,
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json({ reservations })
  } catch (error) {
    console.error("[reservations] Error fetching reservations:", error)
    return NextResponse.json({ error: "Failed to fetch reservations" }, { status: 500 })
  }
}

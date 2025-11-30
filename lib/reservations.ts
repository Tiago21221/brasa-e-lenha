// Reservation types and utilities
export interface Reservation {
  id: number
  name: string
  phone: string
  date: string
  time?: string
  people: number
  note?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export const AVAILABLE_TIMES = [
  "11:30", "12:00", "12:30", "13:00", "13:30",
  "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00",
]

export const MAX_PARTY_SIZE = 8
export const MAX_RESERVATIONS_PER_TIME = 5

export async function getReservations(): Promise<Reservation[]> {
  if (typeof window === "undefined") return []
  try {
    const res = await fetch('/api/reservations')
    if (!res.ok) return []
    const { reservations } = await res.json()
    return reservations.map((r: any) => ({
      ...r,
      date: new Date(r.date).toISOString().split('T')[0],
      createdAt: new Date(r.createdAt).toISOString()
    }))
  } catch {
    return []
  }
}

export async function saveReservation(reservation: Omit<Reservation, 'id' | 'createdAt'>): Promise<void> {
  await fetch('/api/reservations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservation)
  })
}

export async function updateReservationStatus(id: number, status: "pending" | "confirmed" | "cancelled"): Promise<void> {
  await fetch(`/api/reservations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  })
}

export async function getReservationsByDate(date: string): Promise<Reservation[]> {
  const reservations = await getReservations()
  return reservations.filter((r) => r.date === date)
}

export async function getAvailableSlots(date: string): Promise<string[]> {
  const dayReservations = await getReservationsByDate(date)
  return AVAILABLE_TIMES.filter((time) => {
    const count = dayReservations.filter((r) => r.time === time && r.status !== "cancelled").length
    return count < MAX_RESERVATIONS_PER_TIME
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

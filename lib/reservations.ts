// Reservation types and utilities
export interface Reservation {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  date: string
  time: string
  partySize: number
  specialRequests?: string
  status: "pending" | "confirmed" | "cancelled"
  createdAt: string
}

export const AVAILABLE_TIMES = [
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "18:00",
  "18:30",
  "19:00",
  "19:30",
  "20:00",
  "20:30",
  "21:00",
]

export const MAX_PARTY_SIZE = 8
export const MAX_RESERVATIONS_PER_TIME = 5

export function getReservations(): Reservation[] {
  if (typeof window === "undefined") return []
  const data = localStorage.getItem("reservations")
  return data ? JSON.parse(data) : []
}

export function saveReservation(reservation: Reservation): void {
  const reservations = getReservations()
  reservations.push(reservation)
  localStorage.setItem("reservations", JSON.stringify(reservations))
}

export function updateReservationStatus(id: string, status: "pending" | "confirmed" | "cancelled"): void {
  const reservations = getReservations()
  const index = reservations.findIndex((r) => r.id === id)
  if (index !== -1) {
    reservations[index].status = status
    localStorage.setItem("reservations", JSON.stringify(reservations))
  }
}

export function getReservationsByDate(date: string): Reservation[] {
  return getReservations().filter((r) => r.date === date)
}

export function getAvailableSlots(date: string): string[] {
  const dayReservations = getReservationsByDate(date)
  return AVAILABLE_TIMES.filter((time) => {
    const count = dayReservations.filter((r) => r.time === time && r.status !== "cancelled").length
    return count < MAX_RESERVATIONS_PER_TIME
  })
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)

  
}

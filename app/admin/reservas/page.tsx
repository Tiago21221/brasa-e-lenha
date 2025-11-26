"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Users, Mail, Phone, Check, X, CalendarIcon } from "lucide-react"
import { toast } from "sonner"
import { getReservations, updateReservationStatus, type Reservation } from "@/lib/reservations"

export default function AdminReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadReservations = () => {
      const data = getReservations()
      setReservations(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
      setLoading(false)
    }

    loadReservations()

    // Refresh every 10 seconds
    const interval = setInterval(loadReservations, 10000)
    return () => clearInterval(interval)
  }, [])

  const handleStatusUpdate = (id: string, status: "confirmed" | "cancelled") => {
    updateReservationStatus(id, status)
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
    toast.success(status === "confirmed" ? "Reserva confirmada" : "Reserva cancelada")
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "confirmed":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Aguardando"
      case "confirmed":
        return "Confirmada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const stats = [
    {
      label: "Aguardando",
      value: reservations.filter((r) => r.status === "pending").length,
      color: "text-yellow-500",
    },
    {
      label: "Confirmadas",
      value: reservations.filter((r) => r.status === "confirmed").length,
      color: "text-green-500",
    },
    {
      label: "Canceladas",
      value: reservations.filter((r) => r.status === "cancelled").length,
      color: "text-red-500",
    },
  ]

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando reservas...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 font-oswald text-3xl font-bold md:text-4xl">Gerenciador de Reservas</h1>
          <p className="text-muted-foreground">Aceite ou rejeite reservas de mesas</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 p-6">
                <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                  <CalendarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="font-oswald text-3xl font-bold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reservations */}
        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList>
            <TabsTrigger value="pending">
              Aguardando ({reservations.filter((r) => r.status === "pending").length})
            </TabsTrigger>
            <TabsTrigger value="confirmed">
              Confirmadas ({reservations.filter((r) => r.status === "confirmed").length})
            </TabsTrigger>
            <TabsTrigger value="all">Todas ({reservations.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {reservations.filter((r) => r.status === "pending").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma reserva aguardando</p>
                </CardContent>
              </Card>
            ) : (
              reservations
                .filter((r) => r.status === "pending")
                .map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} onStatusUpdate={handleStatusUpdate} />
                ))
            )}
          </TabsContent>

          <TabsContent value="confirmed" className="space-y-4">
            {reservations.filter((r) => r.status === "confirmed").length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma reserva confirmada</p>
                </CardContent>
              </Card>
            ) : (
              reservations
                .filter((r) => r.status === "confirmed")
                .map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} onStatusUpdate={handleStatusUpdate} />
                ))
            )}
          </TabsContent>

          <TabsContent value="all" className="space-y-4">
            {reservations.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Nenhuma reserva encontrada</p>
                </CardContent>
              </Card>
            ) : (
              reservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} onStatusUpdate={handleStatusUpdate} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </>
  )
}

function ReservationCard({
  reservation,
  onStatusUpdate,
}: {
  reservation: Reservation
  onStatusUpdate: (id: string, status: "confirmed" | "cancelled") => void
}) {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "yellow"
      case "confirmed":
        return "green"
      case "cancelled":
        return "red"
      default:
        return "gray"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Aguardando"
      case "confirmed":
        return "Confirmada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-oswald text-lg font-bold">{reservation.customerName}</h3>
            <Badge variant={getStatusColor(reservation.status) as any} className="mt-1">
              {getStatusLabel(reservation.status)}
            </Badge>
          </div>
        </div>

        <div className="mb-6 grid gap-4 sm:grid-cols-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{formatDate(reservation.date)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.partySize} pessoas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{reservation.customerEmail}</span>
          </div>
        </div>

        {reservation.customerPhone && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.customerPhone}</span>
          </div>
        )}

        {reservation.specialRequests && (
          <div className="mb-4 rounded-lg bg-muted p-3">
            <p className="text-xs font-semibold text-muted-foreground">Observações Especiais</p>
            <p className="mt-1 text-sm">{reservation.specialRequests}</p>
          </div>
        )}

        {reservation.status === "pending" && (
          <div className="flex gap-2">
            <Button
              onClick={() => onStatusUpdate(reservation.id, "confirmed")}
              variant="default"
              size="sm"
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Confirmar
            </Button>
            <Button
              onClick={() => onStatusUpdate(reservation.id, "cancelled")}
              variant="destructive"
              size="sm"
              className="gap-2"
            >
              <X className="h-4 w-4" />
              Rejeitar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

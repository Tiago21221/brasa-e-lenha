"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Calendar, Clock, Users, Mail, Phone, Check, X, CalendarIcon,
  ArrowLeft, Menu, X as XIcon, Home, Package, ShoppingBag, 
  Bell, Settings, Plus, BarChart, RefreshCw
} from "lucide-react"
import { toast } from "sonner"
import { getReservations, updateReservationStatus, type Reservation } from "@/lib/reservations"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function AdminReservasPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    loadReservations()

    // Refresh every 10 seconds
    const interval = setInterval(loadReservations, 10000)
    return () => clearInterval(interval)
  }, [])

  // Fechar sidebar ao pressionar ESC (apenas em mobile)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  const loadReservations = async () => {
    setLoading(true)
    try {
      const data = await getReservations()
      setReservations(data)
    } catch (error) {
      console.error("Erro ao carregar reservas:", error)
      toast.error("Erro ao carregar reservas")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadReservations()
  }

  const handleStatusUpdate = async (id: number, status: "confirmed" | "cancelled") => {
    try {
      await updateReservationStatus(id, status)
      setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
      toast.success(status === "confirmed" ? "Reserva confirmada" : "Reserva cancelada")
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
      toast.error("Erro ao atualizar status da reserva")
    }
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

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/admin", active: false },
    { icon: Package, label: "Pedidos", href: "/admin/pedidos", active: false },
    { icon: ShoppingBag, label: "Produtos", href: "/admin/produtos", active: false },
    { icon: Calendar, label: "Reservas", href: "/admin/reservas", active: true },
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
      <div className="relative min-h-screen">
        {/* Overlay para fechar sidebar (apenas mobile) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

          <aside 
            className={cn(
              "fixed left-0 z-50 h-screen w-[280px] border-r bg-background shadow-2xl transition-all duration-300",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
              "select-none"
            )}
            style={{
              position: 'fixed',
              top: '74px',      // <-- antes era 0
              left: 0,
              width: '280px',
              height: 'calc(100vh - 64px)', // ajusta a altura para não passar da tela
              userSelect: 'none'
            }}
          >
          <div className="flex h-full flex-col">
            {/* Header da Sidebar */}
           {/* BOTÃO DE FECHAR NO TOPO (apenas mobile) */}
            <div className="lg:hidden border-b bg-muted/50 p-2 shrink-0">
              <div className="flex items-center justify-end"> {/* ← Apenas o botão X, sem título */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            {/* Conteúdo da Sidebar - COM SCROLL INDEPENDENTE */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.label} href={item.href}>
                        <Button
                          variant={item.active ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3 px-4 py-3"
                          onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </nav>

                {/* Estatísticas Rápidas */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground px-2">Status das Reservas</h3>
                  
                  <div className="space-y-3">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Aguardando</span>
                        <span className="font-bold text-yellow-500">
                          {reservations.filter((r) => r.status === "pending").length}
                        </span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Confirmadas</span>
                        <span className="font-bold text-green-500">
                          {reservations.filter((r) => r.status === "confirmed").length}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Canceladas</span>
                        <span className="font-bold text-red-500">
                          {reservations.filter((r) => r.status === "cancelled").length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="mt-6 space-y-3">
                  <Link href="/admin/reservas/novo">
                    <Button
                      variant="default"
                      className="w-full gap-2"
                      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      Nova Reserva
                    </Button>
                  </Link>
                  
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Atualizar Dados
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer da Sidebar FIXO */}
            <div className="border-t bg-muted/30 p-4">
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">Restaurante Admin</p>
                <p className="text-xs mt-1">Gerenciamento de Reservas</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Botão para abrir sidebar */}
        <Button
          variant="default"
          size="icon"
          className={cn(
            "fixed z-50 h-12 w-12 rounded-full shadow-xl transition-all duration-300",
            sidebarOpen ? "left-[300px] opacity-0" : "left-4",
            "top-24 bg-primary hover:bg-primary/90 lg:hidden"
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Conteúdo Principal */}
        <main 
          className={cn(
            "min-h-screen transition-all duration-300",
            sidebarOpen ? "lg:ml-[280px]" : "ml-0"
          )}
        >
          <div className="p-6">
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  </Link>
                  <div>
                    <h1 className="font-oswald text-3xl font-bold md:text-4xl">Gerenciador de Reservas</h1>
                    <p className="text-muted-foreground">Aceite ou rejeite reservas de mesas</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                  
                  <Link href="/admin/reservas/novo">
                  </Link>
                </div>
              </div>
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

            {/* Resumo Rápido */}
            <div className="mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-oswald text-xl font-bold">Resumo Rápido</h3>
                    <Link href="/admin/relatorios">
                      <Button variant="ghost" size="sm" className="gap-2">
                        <BarChart className="h-4 w-4" />
                        Relatórios
                      </Button>
                    </Link>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Total de Reservas Hoje</p>
                      <p className="text-2xl font-bold">{reservations.length}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Aguardando Confirmação</p>
                      <p className="text-2xl font-bold text-yellow-500">
                        {reservations.filter((r) => r.status === "pending").length}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Confirmadas Hoje</p>
                      <p className="text-2xl font-bold text-green-500">
                        {reservations.filter((r) => r.status === "confirmed").length}
                      </p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Taxa de Confirmação</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {reservations.length > 0 
                          ? `${Math.round((reservations.filter((r) => r.status === "confirmed").length / reservations.length) * 100)}%`
                          : "0%"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

function ReservationCard({
  reservation,
  onStatusUpdate,
}: {
  reservation: Reservation
  onStatusUpdate: (id: number, status: "confirmed" | "cancelled") => void
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

  // Extrair hora da nota se existir
  const extractTimeFromNote = (note?: string) => {
    if (!note) return ""
    const timeMatch = note.match(/(\d{2}:\d{2})/)
    return timeMatch ? timeMatch[1] : ""
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="font-oswald text-lg font-bold">{reservation.name}</h3>
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
            <span>{extractTimeFromNote(reservation.note)}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span>{reservation.people} pessoas</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{reservation.phone}</span>
          </div>
        </div>

        {reservation.note && (
          <div className="mb-4 rounded-lg bg-muted p-3">
            <p className="text-xs font-semibold text-muted-foreground">Observações</p>
            <p className="mt-1 text-sm">{reservation.note}</p>
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
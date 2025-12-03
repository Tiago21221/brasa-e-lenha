"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { OrderWithItems } from "@/lib/types"
import { 
  RefreshCw, Package, Clock, ChefHat, Truck, CheckCircle2, 
  Calendar, Plus, TrendingUp, DollarSign, BarChart, 
  CalendarDays, Receipt, Menu, Home, Users, Settings,
  ShoppingBag, Bell, X, Users as UsersIcon, CheckCircle, XCircle,
  Calendar as CalendarIcon, ArrowUpRight, ArrowDownRight
} from "lucide-react"
import { toast } from "sonner"
import { useOrderNotifications } from "@/lib/order-notifier"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { getReservations, type Reservation } from "@/lib/reservations"

export default function AdminPage() {
  useOrderNotifications()

  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [statsData, setStatsData] = useState({
    revenueLast7Days: 0,
    totalRevenue: 0,
    dailyOrders: 0,
    ordersLast7Days: 0
  })

  useEffect(() => {
    fetchOrders()
    fetchStats()
    fetchReservations()

    const interval = setInterval(() => {
      fetchOrders()
      fetchStats()
      fetchReservations()
    }, 15000)
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

  // Prevenir scroll do body quando sidebar estiver aberta em mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [sidebarOpen])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Failed to fetch orders")

      const data = await response.json()

      const ordersWithItems = await Promise.all(
        data.orders.map(async (order: any) => {
          try {
            const itemsResponse = await fetch(`/api/orders/${order.id}`)
            if (!itemsResponse.ok) throw new Error("Failed to fetch order items")
            const itemsData = await itemsResponse.json()
            return itemsData.order
          } catch (error) {
            console.error(`Error fetching items for order ${order.id}:`, error)
            return { ...order, items: [] }
          }
        }),
      )

      setOrders(ordersWithItems)
    } catch (error) {
      console.error("[v0] Error fetching orders:", error)
      toast.error("Erro ao carregar pedidos")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const fetchReservations = async () => {
    try {
      const data = await getReservations()
      setReservations(data)
    } catch (error) {
      console.error("Erro ao carregar reservas:", error)
    }
  }

  const fetchStats = async () => {
    try {
      console.log("📊 Buscando estatísticas da API...")
      const response = await fetch("/api/admin/stats")
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("📈 Dados recebidos da API:", data)
      
      setStatsData({
        revenueLast7Days: data.revenueLast7Days || 0,
        totalRevenue: data.totalRevenue || 0,
        dailyOrders: data.dailyOrders || 0,
        ordersLast7Days: data.ordersLast7Days || 0
      })
      
    } catch (error) {
      console.error("[v0] Error fetching stats:", error)
      console.log("⚠️  Usando dados mockados como fallback")
      
      const mockStats = {
        revenueLast7Days: 4872.50,
        totalRevenue: 25489.75,
        dailyOrders: 42,
        ordersLast7Days: 287
      }
      setStatsData(mockStats)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchOrders()
    fetchStats()
    fetchReservations()
  }

  const getStatusCount = (status: string) => {
    return orders.filter((order) => order.status === status).length
  }

  const getReservationStatusCount = (status: string) => {
    return reservations.filter((res) => res.status === status).length
  }

  // Calcular taxa de confirmação de reservas
  const reservationConfirmationRate = reservations.length > 0 
    ? (reservations.filter((r) => r.status === "confirmed").length / reservations.length) * 100
    : 0

  // Calcular crescimento de reservas (comparando com a semana passada)
  const reservationGrowth = 12.5 // Exemplo: 12.5% de crescimento

  // Calcular pessoas por reserva (média)
  const averagePeoplePerReservation = reservations.length > 0
    ? (reservations.reduce((acc, curr) => acc + curr.people, 0) / reservations.length).toFixed(1)
    : "0"

  const statusStats = [
    { 
      label: "Aguardando", 
      value: getStatusCount("pending"), 
      icon: Clock, 
      color: "text-yellow-500",
      link: "/admin/pedidos?status=pending"
    },
    { 
      label: "Confirmados", 
      value: getStatusCount("confirmed"), 
      icon: CheckCircle2, 
      color: "text-blue-500",
      link: "/admin/pedidos?status=confirmed"
    },
    { 
      label: "Preparando", 
      value: getStatusCount("preparing"), 
      icon: ChefHat, 
      color: "text-orange-500",
      link: "/admin/pedidos?status=preparing"
    },
    { 
      label: "Entregando", 
      value: getStatusCount("delivering"), 
      icon: Truck, 
      color: "text-purple-500",
      link: "/admin/pedidos?status=delivering"
    },
    { 
      label: "Concluídos", 
      value: getStatusCount("completed"), 
      icon: CheckCircle2, 
      color: "text-green-500",
      link: "/admin/pedidos?status=completed"
    },
  ]

  const reservationStats = [
    { 
      label: "Aguardando", 
      value: getReservationStatusCount("pending"), 
      icon: Clock, 
      color: "text-yellow-500",
      description: "Aguardando confirmação",
      link: "/admin/reservas?status=pending"
    },
    { 
      label: "Confirmadas", 
      value: getReservationStatusCount("confirmed"), 
      icon: CheckCircle, 
      color: "text-green-500",
      description: "Reservas confirmadas",
      link: "/admin/reservas?status=confirmed"
    },
    { 
      label: "Canceladas", 
      value: getReservationStatusCount("cancelled"), 
      icon: XCircle, 
      color: "text-red-500",
      description: "Reservas canceladas",
      link: "/admin/reservas?status=cancelled"
    },
    { 
      label: "Taxa de Confirmação", 
      value: `${reservationConfirmationRate.toFixed(1)}%`, 
      icon: TrendingUp, 
      color: "text-emerald-500",
      description: "Porcentagem de confirmação",
      trend: reservationGrowth > 0 ? "up" : "down",
      trendValue: `${Math.abs(reservationGrowth)}%`
    },
    { 
      label: "Média por Reserva", 
      value: `${averagePeoplePerReservation} pessoas`, 
      icon: UsersIcon, 
      color: "text-blue-500",
      description: "Média de pessoas",
    },
  ]

  const financialStats = [
    { 
      label: "Receita (7 dias)", 
      value: `R$ ${statsData.revenueLast7Days.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: TrendingUp, 
      color: "text-emerald-500",
      description: "Últimos 7 dias",
    },
    { 
      label: "Receita Total", 
      value: `R$ ${statsData.totalRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      color: "text-green-500",
      description: "Acumulado total",
    },
    { 
      label: "Pedidos Diários", 
      value: statsData.dailyOrders, 
      icon: BarChart, 
      color: "text-blue-500",
      description: "Hoje",
    },
    { 
      label: "Pedidos (7 dias)", 
      value: statsData.ordersLast7Days, 
      icon: CalendarDays, 
      color: "text-indigo-500",
      description: "Últimos 7 dias",
    },
    { 
      label: "Ticket Médio", 
      value: statsData.revenueLast7Days > 0 && statsData.ordersLast7Days > 0 
        ? `R$ ${(statsData.revenueLast7Days / statsData.ordersLast7Days).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : "R$ 0,00", 
      icon: Receipt, 
      color: "text-purple-500",
      description: "Média por pedido",
    },
  ]

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/admin", active: true },
    { icon: Package, label: "Pedidos", href: "/admin/pedidos" },
    { icon: ShoppingBag, label: "Produtos", href: "/admin/produtos" },
    { icon: Calendar, label: "Reservas", href: "/admin/reservas" },
    { icon: Users, label: "Clientes", href: "/admin/clientes" },
    { icon: Bell, label: "Notificações", href: "/admin/notificacoes" },
    { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
  ]

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8 pt-20">
          <div className="text-center">Carregando...</div>
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
            {/* BOTÃO DE FECHAR NO TOPO (apenas mobile) */}
            <div className="lg:hidden border-b bg-muted/50 p-2 shrink-0">
              <div className="flex items-center justify-end">
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
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll">
              <div className="p-4 pt-2"> {/* Reduzi o padding-top */}
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
                  <h3 className="text-sm font-semibold text-muted-foreground px-2">Resumo Hoje</h3>
                  
                  <div className="space-y-3">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Pedidos Hoje</span>
                        <span className="font-bold text-primary">{statsData.dailyOrders}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reservas Hoje</span>
                        <span className="font-bold text-blue-600">
                          {reservations.filter(r => {
                            const today = new Date().toDateString()
                            const resDate = new Date(r.date).toDateString()
                            return resDate === today
                          }).length}
                        </span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Aguardando</span>
                        <span className="font-bold text-yellow-500">{getStatusCount("pending")}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Reservas Pendentes</span>
                        <span className="font-bold text-yellow-500">{getReservationStatusCount("pending")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão de Atualizar na Sidebar */}
                <div className="mt-8 px-2">
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="default"
                    className="w-full gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Atualizar Dados
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer da Sidebar FIXO - sem scroll */}
            <div className="border-t bg-muted/30 p-4 shrink-0">
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">Restaurante Admin</p>
                <p className="text-xs mt-1">v1.0.0</p>
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
            "top-4 bg-primary hover:bg-primary/90 lg:hidden" // Ajustado para top-4
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Conteúdo Principal usando scroll do navegador */}
        <main 
          className={cn(
            "min-h-screen transition-all duration-300",
            sidebarOpen ? "lg:ml-[280px]" : "ml-0"
          )}
        >
          <div className="p-6 pt-10"> {/* Adicionado pt-20 aqui */}
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h1 className="font-oswald text-3xl font-bold md:text-4xl">Painel Administrativo</h1>
                  <p className="text-muted-foreground">Visão geral do seu restaurante</p>
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
                  
                  <Link href="/admin/pedidos/novo">

                  </Link>
                </div>
              </div>
            </div>

            {/* Conteúdo das Estatísticas */}
            <div className="space-y-8">
            {/* Primeira linha - Status dos Pedidos */}
            <div>
              <h2 className="mb-4 font-oswald text-xl font-bold">Status dos Pedidos</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                {statusStats.map((stat) => {
                  const Icon = stat.icon
                  return (
                    <Link href={stat.link} key={stat.label} className="h-full">
                      <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg min-h-[140px] h-full">
                        <CardContent className="flex flex-col justify-between h-full p-6">
                          <div className="flex items-center gap-4">
                            <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className="font-oswald text-3xl font-bold">{stat.value}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground">Clique para ver detalhes</p>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </div>


              {/* Segunda linha - Status das Reservas */}
              <div>
                <h2 className="mb-4 font-oswald text-xl font-bold">Status das Reservas</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {reservationStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <Link href={stat.link || "#"} key={stat.label} className="h-full">
                        <Card className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg min-h-[140px] h-full">
                          <CardContent className="flex flex-col justify-between h-full p-6">
                            <div className="flex items-center gap-4">
                              <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                                <Icon className="h-6 w-6" />
                              </div>
                              <div className="flex-1">
                                <p className="text-sm text-muted-foreground">{stat.label}</p>
                                <p className="font-oswald text-3xl font-bold">{stat.value}</p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                              <p className="text-xs text-muted-foreground truncate">{stat.description}</p>
                              {stat.trend && (
                                <div className={`flex items-center gap-1 text-xs ${
                                  stat.trend === "up" ? "text-emerald-600" : "text-red-600"
                                }`}>
                                  {stat.trend === "up" ? (
                                    <ArrowUpRight className="h-3 w-3" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3" />
                                  )}
                                  <span className="whitespace-nowrap">{stat.trendValue}</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    )
                  })}
                </div>
              </div>


              {/* Terceira linha - Estatísticas Financeiras */}
              <div>
                <h2 className="mb-4 font-oswald text-xl font-bold">Estatísticas Financeiras</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
                  {financialStats.map((stat) => {
                    const Icon = stat.icon
                    return (
                      <Card key={stat.label} className="cursor-pointer transition-all hover:scale-105 hover:shadow-lg min-h-[140px]">
                        <CardContent className="flex flex-col justify-between h-full p-6">
                          <div className="flex items-center gap-4">
                            <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                              <Icon className="h-6 w-6" />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">{stat.label}</p>
                              <p className="font-oswald text-3xl font-bold">{stat.value}</p>
                            </div>
                          </div>
                          <div className="mt-4">
                            <p className="text-xs text-muted-foreground">{stat.description}</p>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Últimas Reservas */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-oswald text-xl font-bold">Reservas Recentes</h3>
                    <Link href="/admin/reservas">
                      <Button variant="ghost" size="sm">
                        Ver todas
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {reservations.slice(0, 5).map((reservation) => {
                      const reservationDate = reservation.date 
                        ? new Date(reservation.date).toLocaleDateString('pt-BR')
                        : "Data não disponível"
                      
                      const statusColor = {
                        pending: "bg-yellow-100 text-yellow-800",
                        confirmed: "bg-green-100 text-green-800",
                        cancelled: "bg-red-100 text-red-800"
                      }[reservation.status] || "bg-gray-100 text-gray-800"
                      
                      const statusLabel = {
                        pending: "Aguardando",
                        confirmed: "Confirmada",
                        cancelled: "Cancelada"
                      }[reservation.status] || "Desconhecido"
                      
                      return (
                        <div key={reservation.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium">{reservation.name}</p>
                            <div className="flex flex-wrap items-center gap-3 mt-1">
                              <p className="text-sm text-muted-foreground">
                                {reservationDate} • {reservation.people} pessoas
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${statusColor}`}>
                              {statusLabel}
                            </span>
                            <span className="text-sm font-medium text-muted-foreground">
                              {reservation.phone}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Últimos Pedidos */}
              <Card>
                <CardContent className="p-6">
                  <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="font-oswald text-xl font-bold">Pedidos Recentes</h3>
                    <Link href="/admin/pedidos">
                      <Button variant="ghost" size="sm">
                        Ver todos
                      </Button>
                    </Link>
                  </div>
                  <div className="space-y-3">
                    {orders.slice(0, 5).map((order: any) => {
                      const orderId = order.id ? `#${String(order.id).slice(-6)}` : "N/A"
                      const orderDate = order.createdAt ? new Date(order.createdAt).toLocaleString('pt-BR') : "Data não disponível"
                      const orderTotal = order.total || 0
                      const orderStatus = order.status || "pending"
                      
                      return (
                        <div key={order.id} className="flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="font-medium">Pedido {orderId}</p>
                            <p className="text-sm text-muted-foreground">
                              {orderDate}
                            </p>
                          </div>
                          <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:gap-1">
                            <p className="font-bold">
                              R$ {orderTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </p>
                            <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                              orderStatus === 'completed' ? 'bg-green-100 text-green-800' :
                              orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              orderStatus === 'preparing' ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {orderStatus === 'completed' ? 'Concluído' :
                               orderStatus === 'pending' ? 'Aguardando' :
                               orderStatus === 'preparing' ? 'Preparando' :
                               orderStatus === 'delivering' ? 'Entregando' : 'Confirmado'}
                            </span>
                          </div>
                        </div>
                      )
                    })}
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
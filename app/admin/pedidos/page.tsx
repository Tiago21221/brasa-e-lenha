"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { AdminOrderCard } from "@/components/admin-order-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { OrderWithItems } from "@/lib/types"
import { 
  RefreshCw, Package, Clock, ChefHat, Truck, CheckCircle2, 
  ArrowLeft, Menu, X, Home, Users, Calendar, ShoppingBag, 
  Bell, Settings, Plus, BarChart
} from "lucide-react"
import { toast } from "sonner"
import { useOrderNotifications } from "@/lib/order-notifier"
import Link from "next/link"
import { cn } from "@/lib/utils"

export default function PedidosPage() {
  useOrderNotifications()

  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    fetchOrders()

    const interval = setInterval(fetchOrders, 15000)
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

  const handleRefresh = () => {
    setRefreshing(true)
    fetchOrders()
  }

  const filterOrders = (status?: string) => {
    if (!status) return orders
    return orders.filter((order) => order.status === status)
  }

  const getStatusCount = (status: string) => {
    return orders.filter((order) => order.status === status).length
  }

  const stats = [
    { label: "Aguardando", value: getStatusCount("pending"), icon: Clock, color: "text-yellow-500" },
    { label: "Confirmados", value: getStatusCount("confirmed"), icon: CheckCircle2, color: "text-blue-500" },
    { label: "Preparando", value: getStatusCount("preparing"), icon: ChefHat, color: "text-orange-500" },
    { label: "Entregando", value: getStatusCount("delivering"), icon: Truck, color: "text-purple-500" },
    { label: "Concluídos", value: getStatusCount("completed"), icon: CheckCircle2, color: "text-green-500" },
  ]

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/admin", active: false },
    { icon: Package, label: "Pedidos", href: "/admin/pedidos", active: true },
    { icon: ShoppingBag, label: "Produtos", href: "/admin/produtos" },
    { icon: Calendar, label: "Reservas", href: "/admin/reservas" },
  ]

  if (loading) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando pedidos...</div>
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
                  <h3 className="text-sm font-semibold text-muted-foreground px-2">Status dos Pedidos</h3>
                  
                  <div className="space-y-3">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Aguardando</span>
                        <span className="font-bold text-yellow-500">{getStatusCount("pending")}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Preparando</span>
                        <span className="font-bold text-orange-500">{getStatusCount("preparing")}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Entregando</span>
                        <span className="font-bold text-purple-500">{getStatusCount("delivering")}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Concluídos</span>
                        <span className="font-bold text-green-500">{getStatusCount("completed")}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="mt-6 space-y-3">
                  <Link href="/admin/pedidos/novo">
                    <Button
                      variant="default"
                      className="w-full gap-2"
                      onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                    >
                      <Plus className="h-4 w-4" />
                      Novo Pedido
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
                <p className="text-xs mt-1">Gerenciamento de Pedidos</p>
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

        {/* Conteúdo Principal - SEM SCROLL FORÇADO */}
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
                    <h1 className="font-oswald text-3xl font-bold md:text-4xl">Gerenciamento de Pedidos</h1>
                    <p className="text-muted-foreground">Visualize e gerencie todos os pedidos do sistema</p>
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
                  
                  <Link href="/admin/pedidos/novo">

                  </Link>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              {stats.map((stat) => {
                const Icon = stat.icon
                return (
                  <Card key={stat.label}>
                    <CardContent className="flex items-center gap-4 p-6">
                      <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="font-oswald text-3xl font-bold">{stat.value}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            {/* Orders List */}
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList
                className="
                  mb-8 md:mb-6     
                  flex flex-wrap gap-2
                  sm:flex-nowrap sm:gap-2
                  border-t-0 border-b-0
                  bg-transparent
                "
              >
                <TabsTrigger
                  value="all"
                  className="
                    border border-red-700
                    bg-zinc-900
                    data-[state=active]:bg-black
                  "
                >
                  Todos ({orders.length})
                </TabsTrigger>

                <TabsTrigger
                  value="pending"
                  className="
                    border border-red-700
                    bg-zinc-900
                    data-[state=active]:bg-black
                  "
                >
                  Aguardando ({getStatusCount("pending")})
                </TabsTrigger>

                <TabsTrigger
                  value="confirmed"
                  className="
                    border border-red-700
                    bg-zinc-900
                    data-[state=active]:bg-black
                  "
                >
                  Confirmados ({getStatusCount("confirmed")})
                </TabsTrigger>

                <TabsTrigger
                  value="preparing"
                  className="
                    border border-red-700
                    bg-zinc-900
                    data-[state=active]:bg-black
                  "
                >
                  Preparando ({getStatusCount("preparing")})
                </TabsTrigger>

                <TabsTrigger
                  value="delivering"
                  className="
                    border border-red-700
                    bg-zinc-900
                    data-[state=active]:bg-black
                  "
                >
                  Entregando ({getStatusCount("delivering")})
                </TabsTrigger>

                <TabsTrigger
                  value="completed"
                  className="
                    border border-red-700
                    bg-zinc-900
                    data-[state=active]:bg-black
                  "
                >
                  Concluídos ({getStatusCount("completed")})
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="all" className="space-y-4">
                {orders.length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">Nenhum pedido encontrado</p>
                    </CardContent>
                  </Card>
                ) : (
                  orders.map((order) => <AdminOrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} />)
                )}
              </TabsContent>

              {["pending", "confirmed", "preparing", "delivering", "completed"].map((status) => (
                <TabsContent key={status} value={status} className="space-y-4">
                  {filterOrders(status).length === 0 ? (
                    <Card>
                      <CardContent className="flex flex-col items-center justify-center py-12">
                        <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">Nenhum pedido com este status</p>
                      </CardContent>
                    </Card>
                  ) : (
                    filterOrders(status).map((order) => (
                      <AdminOrderCard key={order.id} order={order} onStatusUpdate={fetchOrders} />
                    ))
                  )}
                </TabsContent>
              ))}
            </Tabs>

            {/* Últimos Pedidos Rápidos */}
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
                      <p className="text-sm text-muted-foreground">Total de Pedidos Hoje</p>
                      <p className="text-2xl font-bold">{getStatusCount("pending") + getStatusCount("confirmed") + getStatusCount("preparing") + getStatusCount("delivering")}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Em Preparação</p>
                      <p className="text-2xl font-bold text-orange-500">{getStatusCount("preparing")}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Para Entregar</p>
                      <p className="text-2xl font-bold text-purple-500">{getStatusCount("delivering")}</p>
                    </div>
                    <div className="rounded-lg border p-4">
                      <p className="text-sm text-muted-foreground">Concluídos Hoje</p>
                      <p className="text-2xl font-bold text-green-500">{getStatusCount("completed")}</p>
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
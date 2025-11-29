"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/header"
import { AdminOrderCard } from "@/components/admin-order-card"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import type { OrderWithItems } from "@/lib/types"
import {
  RefreshCw,
  Package,
  Clock,
  ChefHat,
  Truck,
  CheckCircle2,
  Calendar,
} from "lucide-react"
import { toast } from "sonner"
import { useOrderNotifications } from "@/lib/order-notifier"
import Link from "next/link"

export default function AdminPage() {
  useOrderNotifications()

  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    fetchOrders()

    const interval = setInterval(fetchOrders, 15000)
    return () => clearInterval(interval)
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders")
      if (!response.ok) throw new Error("Failed to fetch orders")

      const data = await response.json()

      const ordersWithItems = await Promise.all(
        data.orders.map(async (order: any) => {
          const itemsResponse = await fetch(`/api/orders/${order.id}`)
          const itemsData = await itemsResponse.json()
          return itemsData.order
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
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <div>
            <h1 className="font-oswald text-3xl font-bold md:text-4xl">
              Painel Administrativo
            </h1>
            <p className="text-muted-foreground">
              Gerencie os pedidos e reservas do restaurante
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/reservas">
              <Button variant="outline" className="gap-2 bg-transparent">
                <Calendar className="h-4 w-4" />
                Gerenciar Reservas
              </Button>
            </Link>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw
                className={`mr-2 h-4 w-4 ${
                  refreshing ? "animate-spin" : ""
                }`}
              />
              Atualizar
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label}>
                <CardContent className="flex items-center gap-4 p-6">
                  <div className={`rounded-full bg-muted p-3 ${stat.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                    <p className="font-oswald text-3xl font-bold">
                      {stat.value}
                    </p>
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
              border-t-0 border-b-0    /* remove bordas de cima e baixo do container */
              bg-transparent           /* tira fundo do container */
            "
          >
            <TabsTrigger
              value="all"
              className="
                border border-red-700
                bg-zinc-900              /* quase preto, diferença sutil */
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
              Novos ({getStatusCount('pending')})
            </TabsTrigger>

            <TabsTrigger
              value="confirmed"
              className="
                border border-red-700
                bg-zinc-900
                data-[state=active]:bg-black
              "
            >
              Confirmados ({getStatusCount('confirmed')})
            </TabsTrigger>

            <TabsTrigger
              value="preparing"
              className="
                border border-red-700
                bg-zinc-900
                data-[state=active]:bg-black
              "
            >
              Preparando ({getStatusCount('preparing')})
            </TabsTrigger>

            <TabsTrigger
              value="delivering"
              className="
                border border-red-700
                bg-zinc-900
                data-[state=active]:bg-black
              "
            >
              Entregando ({getStatusCount('delivering')})
            </TabsTrigger>

            <TabsTrigger
              value="completed"
              className="
                border border-red-700
                bg-zinc-900
                data-[state=active]:bg-black
              "
            >
              Concluídos ({getStatusCount('completed')})
            </TabsTrigger>


            </TabsList>
          <TabsContent value="all" className="space-y-4">
            {orders.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    Nenhum pedido encontrado
                  </p>
                </CardContent>
              </Card>
            ) : (
              orders.map((order) => (
                <AdminOrderCard
                  key={order.id}
                  order={order}
                  onStatusUpdate={fetchOrders}
                />
              ))
            )}
          </TabsContent>

          {["pending", "confirmed", "preparing", "delivering", "completed"].map(
            (status) => (
              <TabsContent key={status} value={status} className="space-y-4">
                {filterOrders(status).length === 0 ? (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="mb-4 h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">
                        Nenhum pedido com este status
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  filterOrders(status).map((order) => (
                    <AdminOrderCard
                      key={order.id}
                      order={order}
                      onStatusUpdate={fetchOrders}
                    />
                  ))
                )}
              </TabsContent>
            ),
          )}
        </Tabs>
      </main>
    </>
  )
}

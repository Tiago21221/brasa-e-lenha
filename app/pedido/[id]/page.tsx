import { notFound } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice, formatDate, formatPhone } from "@/lib/format"
import { prisma } from "@/lib/prisma"
import { CheckCircle2, Clock, ChefHat, Truck, Package } from "lucide-react"
import { OrderUpdatesListener } from "@/components/order-updates-listener"

export const dynamic = "force-dynamic"

async function getOrder(id: string) {
  const orderId = Number.parseInt(id)

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
    },
  })

  return order
}

const statusConfig = {
  pending: { label: "Aguardando Confirmação", icon: Clock, color: "bg-yellow-500" },
  confirmed: { label: "Pedido Confirmado", icon: CheckCircle2, color: "bg-blue-500" },
  preparing: { label: "Preparando", icon: ChefHat, color: "bg-orange-500" },
  delivering: { label: "Saiu para Entrega", icon: Truck, color: "bg-purple-500" },
  completed: { label: "Entregue", icon: Package, color: "bg-green-500" },
  cancelled: { label: "Cancelado", icon: Clock, color: "bg-red-500" },
}

export default async function PedidoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const order = await getOrder(id)

  if (!order) {
    notFound()
  }

  const status = statusConfig[order.status as keyof typeof statusConfig]
  const StatusIcon = status.icon

  return (
    <>
      <Header />
      <OrderUpdatesListener orderId={order.id} />
      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <div className={`mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full ${status.color}`}>
              <StatusIcon className="h-8 w-8 text-white" />
            </div>
            <h1 className="mb-2 font-oswald text-3xl font-bold">{status.label}</h1>
            <p className="text-muted-foreground">Pedido #{order.id}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Detalhes do Pedido</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data do Pedido:</span>
                  <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary">{status.label}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Forma de Pagamento:</span>
                  <span className="font-medium">
                    {order.paymentMethod === "pix" && "PIX"}
                    {order.paymentMethod === "card" && "Cartão de Crédito"}
                    {order.paymentMethod === "cash" && "Dinheiro"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pagamento:</span>
                  <Badge variant={order.paymentStatus === "paid" ? "default" : "secondary"}>
                    {order.paymentStatus === "paid" ? "Pago" : "Pendente"}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados de Entrega</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <span className="text-muted-foreground">Nome:</span>
                <p className="font-medium">{order.customerName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Telefone:</span>
                <p className="font-medium">{formatPhone(order.customerPhone)}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Endereço:</span>
                <p className="font-medium">{order.customerAddress}</p>
              </div>
              {order.notes && (
                <div>
                  <span className="text-muted-foreground">Observações:</span>
                  <p className="font-medium">{order.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itens do Pedido</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{item.productName}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.quantity}x {formatPrice(item.productPriceCents)}
                      </p>
                    </div>
                    <p className="font-semibold">{formatPrice(item.subtotalCents)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-4">
                <div className="flex justify-between font-oswald text-xl">
                  <span>Total</span>
                  <span className="text-primary">{formatPrice(order.totalCents)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  )
}

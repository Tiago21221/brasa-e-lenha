"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { OrderStatusBadge } from "./order-status-badge"
import { formatPrice, formatDate, formatPhone } from "@/lib/format"
import type { OrderWithItems } from "@/lib/types"
import { Phone, MapPin, Clock, Store, Truck } from "lucide-react"
import { toast } from "sonner"
import { Separator } from "@radix-ui/react-separator"

interface AdminOrderCardProps {
  order: OrderWithItems
  onStatusUpdate: () => void
}

export function AdminOrderCard({ order, onStatusUpdate }: AdminOrderCardProps) {
  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error()

      toast.success("Status atualizado!")
      onStatusUpdate()
      setStatusModalOpen(false)
    } catch {
      toast.error("Erro ao atualizar status")
    } finally {
      setUpdating(false)
    }
  }

  return (
    <Card className={order.status === "pending" ? "border-primary" : ""}>
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="mb-2 flex items-center gap-2">
              <CardTitle className="text-lg">Pedido #{order.id}</CardTitle>
              <OrderStatusBadge status={order.status} />
            </div>

            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {formatDate(order.createdAt)}
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                {order.customerName} - {formatPhone(order.customerPhone)}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="mb-2 font-oswald text-2xl font-bold text-primary">
              {formatPrice(order.totalCents)}
            </div>

            <div className="flex flex-col gap-1">
              <Badge variant="outline">
                {order.paymentMethod === "pix" && "PIX"}
                {order.paymentMethod === "card" && "Cartão"}
                {order.paymentMethod === "cash" && "Dinheiro"}
              </Badge>

              {order.deliveryType && (
                <Badge className="gap-1 border border-blue-500 text-blue-600" variant="outline">
                  {order.deliveryType === "pickup" ? (
                    <>
                      <Store className="h-3 w-3" /> Retirada
                    </>
                  ) : (
                    <>
                      <Truck className="h-3 w-3" /> Delivery
                    </>
                  )}
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {order.deliveryType === "delivery" && (
          <div className="flex items-start gap-2 text-sm">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
            <span>{order.customerAddress}</span>
          </div>
        )}

        {order.deliveryType === "pickup" && (
          <div className="flex items-center gap-2 rounded-md bg-blue-500/10 p-3 text-sm text-blue-600">
            <Store className="h-4 w-4" />
            <span className="font-semibold">Retirada no Restaurante</span>
          </div>
        )}

        <div className="space-y-2 rounded-md bg-muted/50 p-3">
          <h4 className="text-sm font-semibold">Produtos do Pedido:</h4>
          <div className="space-y-1">
            {order.items?.length ? (
              order.items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.quantity}x {item.productName}
                  </span>
                  <span className="font-medium">
                    {formatPrice(item.subtotalCents)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Nenhum item encontrado
              </p>
            )}
          </div>
        </div>

        {order.notes && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <strong>Observações:</strong> {order.notes}
          </div>
        )}

                {/* MODAL STATUS – CENTRALIZADO PC E MOBILE */}
        <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full border border-wait bg-red-800 text-wait hover:bg-red-600/50">
              Atualizar Status
            </Button>
          </DialogTrigger>

          <DialogContent
            className="
              w-[100vw] max-w-[100vw] max-h-[90vh]  /* mobile: quase tela toda */
              sm:w-full sm:max-w-lg                 /* acima de celular: modal menor */
              overflow-y-auto
            "
          >
            <DialogHeader>
              <DialogTitle>Status do Pedido</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 py-2">
              {[
                { value: "pending", label: "Aguardando Confirmação" },
                { value: "confirmed", label: "Pedido Confirmado" },
                { value: "preparing", label: "Preparando" },
                { value: "delivering", label: "Saiu para Entrega" },
                { value: "completed", label: "Entregue" },
                { value: "cancelled", label: "Cancelado" },
              ].map((item) => (
                <Button
                  key={item.value}
                  variant={order.status === item.value ? "default" : "outline"}
                  className="w-full justify-start"
                  disabled={updating}
                  onClick={() => handleStatusChange(item.value)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}

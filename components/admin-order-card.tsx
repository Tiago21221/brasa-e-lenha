"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderStatusBadge } from "./order-status-badge"
import { formatPrice, formatDate, formatPhone } from "@/lib/format"
import type { OrderWithItems } from "@/lib/types"
import { ChevronDown, ChevronUp, Phone, MapPin, Clock } from "lucide-react"
import { toast } from "sonner"

interface AdminOrderCardProps {
  order: OrderWithItems
  onStatusUpdate: () => void
}

export function AdminOrderCard({ order, onStatusUpdate }: AdminOrderCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [updating, setUpdating] = useState(false)

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true)
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      toast.success("Status atualizado!")
      onStatusUpdate()
    } catch (error) {
      console.error("[v0] Error updating order status:", error)
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
            <div className="mb-2 font-oswald text-2xl font-bold text-primary">{formatPrice(order.totalCents)}</div>
            <Badge variant="outline">
              {order.paymentMethod === "pix" && "PIX"}
              {order.paymentMethod === "card" && "Cartão"}
              {order.paymentMethod === "cash" && "Dinheiro"}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
          <span>{order.customerAddress}</span>
        </div>

        {order.notes && (
          <div className="rounded-md bg-muted p-3 text-sm">
            <strong>Observações:</strong> {order.notes}
          </div>
        )}

        <div className="flex items-center gap-2">
          <Select value={order.status} onValueChange={handleStatusChange} disabled={updating}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pending">Aguardando Confirmação</SelectItem>
              <SelectItem value="confirmed">Pedido Confirmado</SelectItem>
              <SelectItem value="preparing">Preparando</SelectItem>
              <SelectItem value="delivering">Saiu para Entrega</SelectItem>
              <SelectItem value="completed">Entregue</SelectItem>
              <SelectItem value="cancelled">Cancelado</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
            {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
        </div>

        {expanded && (
          <div className="space-y-2 border-t pt-4">
            <h4 className="font-semibold">Itens do Pedido:</h4>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span>
                  {item.quantity}x {item.productName}
                </span>
                <span className="font-medium">{formatPrice(item.subtotalCents)}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

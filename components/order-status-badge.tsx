import { Badge } from "@/components/ui/badge"

interface OrderStatusBadgeProps {
  status: string
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<
    string,
    {
      label: string
      variant: "default" | "secondary" | "destructive"
    }
  > = {
    pending: {
      label: "Aguardando",
      variant: "secondary",
    },
    confirmed: {
      label: "Confirmado",
      variant: "default",
    },
    preparing: {
      label: "Preparando",
      variant: "default",
    },
    delivering: {
      label: "Saiu p/ Entrega",
      variant: "default",
    },
    completed: {
      label: "Entregue",
      variant: "default",
    },
    cancelled: {
      label: "Cancelado",
      variant: "destructive",
    },
  }

  const config = variants[status] ?? variants.pending

  return (
    <Badge
      variant={config.variant}
      className="whitespace-nowrap text-xs sm:text-sm"
    >
      {config.label}
    </Badge>
  )
}

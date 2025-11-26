"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"

interface StripeCheckoutProps {
  orderData: any
  onSuccess: (sessionId: string) => void
}

export function StripeCheckout({ orderData, onSuccess }: StripeCheckoutProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modo Demonstração</CardTitle>
      </CardHeader>
      <CardContent>
        <Alert>
          <InfoIcon className="h-4 w-4" />
          <AlertDescription>
            Este sistema está em modo demonstração. Os pagamentos são simulados e os pedidos são criados diretamente no
            banco de dados para fins de teste do painel administrativo.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

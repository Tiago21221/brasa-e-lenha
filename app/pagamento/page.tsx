"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function PagamentoPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to cart - payment is now handled in demo mode
    router.push("/carrinho")
  }, [router])

  return (
    <>
      <Header />
      <main className="container mx-auto flex min-h-[50vh] items-center justify-center px-4">
        <Card>
          <CardHeader>
            <CardTitle>Redirecionando...</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center py-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Redirecionando para o carrinho</p>
          </CardContent>
        </Card>
      </main>
    </>
  )
}

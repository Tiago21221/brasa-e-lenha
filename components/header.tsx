"use client"

import Image from "next/image"
import Link from "next/link"
import { ShoppingCart, Calendar } from "lucide-react"
import { useCart } from "@/lib/cart"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function Header() {
  const { getTotalItems } = useCart()
  const totalItems = getTotalItems()
  const [pendingReservations, setPendingReservations] = useState(0)

  useEffect(() => {
    const loadPendingCount = () => {
      try {
        const data = localStorage.getItem("reservations")
        if (data) {
          const reservations = JSON.parse(data)
          const pending = reservations.filter((r: any) => r.status === "pending").length
          setPendingReservations(pending)
        }
      } catch (error) {
        console.error("[v0] Error loading pending reservations:", error)
      }
    }

    loadPendingCount()
    const interval = setInterval(loadPendingCount, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/Logo.png" alt="Brasa e Lenha" width={50} height={50} className="h-12 w-auto" />
          <div className="flex flex-col">
            <span className="font-oswald text-xl font-bold tracking-wide text-primary">BRASA E LENHA</span>
            <span className="text-xs text-muted-foreground">Churrascaria Delivery</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          <Link href="/cardapio">
            <Button variant="ghost">Cardápio</Button>
          </Link>
          <Link href="/reservas">
            <Button variant="ghost" className="gap-2">
              <Calendar className="h-4 w-4" />
              Reservas
            </Button>
          </Link>
          <Link href="/carrinho">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-5 rounded-full px-1 text-xs" variant="destructive">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </Link>
          <Link href="/admin">
            <Button variant="outline" size="sm" className="relative bg-transparent">
              Admin
              {pendingReservations > 0 && (
                <Badge className="absolute -right-2 -top-2 h-5 min-w-5 rounded-full px-1 text-xs" variant="destructive">
                  {pendingReservations}
                </Badge>
              )}
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}

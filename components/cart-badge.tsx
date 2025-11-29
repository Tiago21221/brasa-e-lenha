"use client"

import { useCart } from "@/lib/cart"
import { ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function CartBadge({ 
  className = "", 
  fullWidth = false,
  mobileMenu = false 
}: { 
  className?: string 
  fullWidth?: boolean 
  mobileMenu?: boolean 
}) {
  const { getTotalItems } = useCart()
  const cartCount = getTotalItems()

  const baseClasses = "font-semibold gap-2"
  const badgePosition = mobileMenu 
    ? "absolute right-3 top-1/2 -translate-y-1/2 flex h-5 min-w-[18px] items-center justify-center rounded-full bg-red-600 px-1.5 text-[11px] font-bold text-white"
    : "absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white"

  return (
    <Link href="/carrinho">
      <Button
        variant="outline"
        size="sm"
        className={`
          relative ${baseClasses} ${className}
          ${fullWidth ? 'w-full justify-start' : ''}
        `}
        aria-label="Carrinho"
      >
        <ShoppingCart className="h-5 w-5" />
        Carrinho
        {cartCount > 0 && (
          <span className={badgePosition}>
            {cartCount}
          </span>
        )}
      </Button>
    </Link>
  )
}

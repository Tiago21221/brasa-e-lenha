"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function useOrderNotifications() {
  const previousOrderCountRef = useRef<number | null>(null)

  const checkNewOrders = async () => {
    try {
      const response = await fetch("/api/orders?status=pending")
      if (!response.ok) return

      const data = await response.json()
      const currentCount = data.orders.length

      if (previousOrderCountRef.current !== null && currentCount > previousOrderCountRef.current) {
        // New order detected
        const audio = new Audio(
          "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUKrk77RgGwU7k9n0yXkpBSd6yu/glEMKElyx6OylUw8KSKLi8bllHAU4jdXwy3ksBS5+zfDbiTcIF2W18+mjTgwOUKvo8LRgGgU+lNn0yHgrBSl8zO3fk0EKElyw5+ylUw0KSKPj8bhlHAU5jtbwy3gr",
        )
        audio.play().catch(() => {}) // Silent fail if no audio permission

        toast.success("Novo pedido recebido!", {
          duration: 5000,
        })
      }

      previousOrderCountRef.current = currentCount
    } catch (error) {
      console.error("[v0] Error checking for new orders:", error)
    }
  }

  useEffect(() => {
    // Initial check
    checkNewOrders()

    // Check every 10 seconds
    const interval = setInterval(checkNewOrders, 10000)

    return () => clearInterval(interval)
  }, [])
}

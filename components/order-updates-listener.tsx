"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export function OrderUpdatesListener({ orderId }: { orderId: number }) {
  const router = useRouter()

  useEffect(() => {
    // Poll for order updates every 5 seconds
    const interval = setInterval(() => {
      router.refresh()
    }, 5000)

    return () => clearInterval(interval)
  }, [orderId, router])

  return null
}

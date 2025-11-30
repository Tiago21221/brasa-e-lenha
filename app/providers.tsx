"use client"

import type React from "react"
import { Toaster } from "sonner"
import { useEffect, useState } from "react"

export function Providers({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener("resize", check)
    return () => window.removeEventListener("resize", check)
  }, [])

  return (
    <>
      {children}
      <Toaster
        position={isMobile ? "bottom-center" : "top-center"}
        richColors
        closeButton
      />
    </>
  )
}

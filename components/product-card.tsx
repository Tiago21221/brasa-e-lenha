"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatPrice } from "@/lib/format"
import { useCart } from "@/lib/cart"
import { toast } from "sonner"

interface ProductCardProps {
  id: number
  name: string
  description: string
  price: number
  image: string
}

export function ProductCard({ id, name, description, price, image }: ProductCardProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      image,
    })
    toast.success("Item adicionado ao carrinho!")
  }

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20">
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <Image
          src={image || "/placeholder.svg"}
          alt={name}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1 text-lg">{name}</CardTitle>
        <CardDescription className="line-clamp-2">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="font-oswald text-2xl font-bold text-primary">{formatPrice(price)}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={handleAddToCart} className="w-full gap-2" size="lg">
          <Plus className="h-4 w-4" />
          Adicionar
        </Button>
      </CardFooter>
    </Card>
  )
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/lib/cart";
import { toast } from "sonner";
import { ProductDetailsModal } from "@/components/ui/product-details-modal";

interface ProductCardProps {
  id: number;
  name: string;
  description: string;
  price: number;      // mantém exatamente como antes
  image: string;
  ingredients?: string; // novo campo opcional
}

export function ProductCard({
  id,
  name,
  description,
  price,
  image,
  ingredients,
}: ProductCardProps) {
  const { addItem } = useCart();
  const [open, setOpen] = useState(false);

  const handleAddToCart = () => {
    addItem({
      productId: id,
      name,
      price,
      image,
    });
    toast.success("Item adicionado ao carrinho!");
  };

  return (
    <>
      <Card
        className="group overflow-hidden transition-all hover:shadow-lg hover:shadow-primary/20 cursor-pointer"
        onClick={() => setOpen(true)} // clicar no card abre o modal
      >
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
          <CardDescription className="line-clamp-2">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="font-oswald text-2xl font-bold text-primary">
            {formatPrice(price)}   {/* exatamente como antes */}
          </p>
        </CardContent>
        <CardFooter>
          <Button
            onClick={(e) => {
              e.stopPropagation(); // não abrir modal ao clicar só no botão
              handleAddToCart();
            }}
            className="w-full gap-2 transition-all duration-200 hover:scale-[1.02] hover:brightness-110 hover:shadow-xl active:scale-[0.98] active:brightness-95"
            size="lg"
          >
            <Plus className="h-4 w-4" />
            Adicionar ao Carrinho
          </Button>
        </CardFooter>
      </Card>

      {/* Modal de detalhes */}
      <ProductDetailsModal
        product={{
          id,
          name,
          description,
          price,              // usa o mesmo price
          imageUrl: image,
          ingredients: ingredients ?? "",
        } as any}
        isOpen={open}
        onClose={() => setOpen(false)}
        onAddToCart={handleAddToCart}
      />
    </>
  );
}

"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/format";

type Props = {
  product: {
    id: number;
    name: string;
    description: string;
    price: number;        // mudou de priceInCents para price
    imageUrl: string;
    ingredients?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: () => void;
};

export function ProductDetailsModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="w-full max-w-md rounded-lg bg-zinc-900 p-4 shadow-lg">
        <div className="relative mb-3 h-48 w-full overflow-hidden rounded-md">
          <Image
            src={product.imageUrl ?? "/placeholder.png"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>

        <h2 className="mb-1 text-lg font-bold">{product.name}</h2>

        {product.description && (
          <p className="mb-2 text-sm text-zinc-300">{product.description}</p>
        )}

        {product.ingredients && (
          <div className="mb-2 text-sm">
            <p className="font-semibold">Ingredientes:</p>
            <p className="text-zinc-300">{product.ingredients}</p>
          </div>
        )}

        <p className="mb-4 text-lg font-bold text-red-500">
          {formatPrice(product.price)}  {/* mudou de priceInCents para price */}
        </p>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
          <Button
            onClick={() => {
              onAddToCart();
              onClose();
            }}
            className="gap-2 transition-all duration-200 hover:scale-[1.02] hover:brightness-110 hover:shadow-xl active:scale-[0.98] active:brightness-95"
          >
            <Plus className="h-4 w-4" />
            Adicionar ao Carrinho
          </Button>
        </div>
      </div>
    </div>
  );
}

"use client";

import Image from "next/image";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice } from "@/lib/format";
import { useCart, type CartItem as CartItemType } from "@/lib/cart";

interface CartItemProps {
  item: CartItemType;
}

export function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <Card>
      <CardContent className="flex gap-4 p-4">
        <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
          <Image
            src={item.image || "/placeholder.svg"}
            alt={item.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex flex-1 flex-col justify-between">
          <div>
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-primary">{formatPrice(item.price)}</p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button" // NÃO faz submit
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() =>
                updateQuantity(item.productId, item.quantity - 1)
              }
            >
              <Minus className="h-4 w-4" />
            </Button>

            <span className="w-8 text-center font-semibold">
              {item.quantity}
            </span>

            <Button
              type="button" // NÃO faz submit
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              onClick={() =>
                updateQuantity(item.productId, item.quantity + 1)
              }
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-destructive"
            onClick={() => removeItem(item.productId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          <p className="font-bold">
            {formatPrice(item.price * item.quantity)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

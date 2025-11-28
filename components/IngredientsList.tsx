// src/components/IngredientsList.tsx
"use client"

interface Ingredient {
  name: string
  quantity?: string
}

interface Props {
  ingredients: any[]
}

export function IngredientsList({ ingredients }: Props) {
  if (!ingredients?.length) {
    return <p className="text-muted-foreground text-sm">Ingredientes não disponíveis</p>
  }

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-lg mb-3">Ingredientes:</h4>
      <div className="grid gap-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-sm font-medium">{ingredient.name || ingredient}</span>
            {ingredient.quantity && (
              <span className="text-xs text-muted-foreground ml-auto">
                {ingredient.quantity}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

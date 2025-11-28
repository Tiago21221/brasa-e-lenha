// src/components/ProductModal.tsx
"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { IngredientsList } from "@/components/IngredientsList"
import { X } from "lucide-react"

interface Product {
  id: number
  name: string
  description?: string
  ingredients?: any[]
  price: string
}

export function ProductModal({ 
  product, 
  onClose 
}: { 
  product: Product 
  onClose: () => void 
}) {
  const [activeTab, setActiveTab] = useState("description")

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 sticky top-0 bg-white border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold font-oswald">{product.name}</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-3xl font-bold text-green-600 mt-2">{product.price}</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="p-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="ingredients">Ingredientes</TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="mt-6">
            <p className="text-gray-700 leading-relaxed">
              {product.description || "Produto delicioso preparado com os melhores ingredientes."}
            </p>
          </TabsContent>

          <TabsContent value="ingredients" className="mt-6">
            <IngredientsList ingredients={product.ingredients || []} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

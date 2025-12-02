"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import Link from "next/link"

interface Category {
  id: number
  name: string
  slug: string
}

interface Product {
  id: number
  name: string
  description: string | null
  priceInCents: number
  categoryId: number
  ingredients: string | null
  available: boolean
  imageUrl: string | null
}

export default function ProdutosPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [editingProductId, setEditingProductId] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priceInCents: "",
    categoryId: "",
    ingredients: "",
    available: true,
    imageUrl: "",
  })

  /* ======================
     FETCH INITIAL DATA
  ====================== */
  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories")
      const data = await res.json()
      setCategories(data.categories || [])
    } catch {
      toast.error("Erro ao carregar categorias")
    }
  }

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products")
      const data = await res.json()
      setProducts(data.products || [])
    } catch {
      toast.error("Erro ao carregar produtos")
    }
  }

  /* ======================
     CREATE / UPDATE
  ====================== */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const price = parseInt(formData.priceInCents, 10)
      const categoryId = parseInt(formData.categoryId, 10)

      if (!formData.name.trim()) {
        toast.error("Nome obrigatório")
        return
      }

      if (isNaN(price) || price <= 0) {
        toast.error("Preço inválido")
        return
      }

      if (isNaN(categoryId)) {
        toast.error("Categoria inválida")
        return
      }

      const payload = {
        name: formData.name.trim(),
        description: formData.description || null,
        priceInCents: price,
        categoryId,
        ingredients: formData.ingredients || null,
        available: formData.available,
        imageUrl: formData.imageUrl || null,
      }

      const res = await fetch(
        editingProductId
          ? `/api/products/${editingProductId}`
          : "/api/products",
        {
          method: editingProductId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      )

      if (!res.ok) {
        toast.error("Erro ao salvar produto")
        return
      }

      toast.success(
        editingProductId
          ? "Produto atualizado com sucesso!"
          : "Produto adicionado com sucesso!"
      )

      setFormData({
        name: "",
        description: "",
        priceInCents: "",
        categoryId: "",
        ingredients: "",
        available: true,
        imageUrl: "",
      })

      setEditingProductId(null)
      fetchProducts()
    } finally {
      setLoading(false)
    }
  }

  /* ======================
     EDIT
  ====================== */
  const handleEdit = (product: Product) => {
    setEditingProductId(product.id)
    setFormData({
      name: product.name,
      description: product.description || "",
      priceInCents: product.priceInCents.toString(),
      categoryId: product.categoryId.toString(),
      ingredients: product.ingredients || "",
      available: product.available,
      imageUrl: product.imageUrl || "",
    })

    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  /* ======================
     DELETE
  ====================== */
  const handleDelete = async (id: number) => {
    if (!confirm("Deseja realmente excluir este produto?")) return

    const res = await fetch(`/api/products/${id}`, {
      method: "DELETE",
    })

    if (!res.ok) {
      toast.error("Erro ao excluir produto")
      return
    }

    toast.success("Produto excluído")
    fetchProducts()
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Link href="/admin">
          <Button variant="outline" className="mb-4 gap-2">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Painel
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>
              {editingProductId ? "Editar Produto" : "Adicionar Produto"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nome"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />

              <Textarea
                placeholder="Descrição"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />

              <Input
                type="number"
                placeholder="Preço em centavos"
                value={formData.priceInCents}
                onChange={(e) =>
                  setFormData({ ...formData, priceInCents: e.target.value })
                }
              />

              <Select
                value={formData.categoryId}
                onValueChange={(v) =>
                  setFormData({ ...formData, categoryId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Ingredientes"
                value={formData.ingredients}
                onChange={(e) =>
                  setFormData({ ...formData, ingredients: e.target.value })
                }
              />

              <Input
                placeholder="Link da imagem"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />

              <div className="flex items-center justify-between">
                <Label>Disponível</Label>
                <Switch
                  checked={formData.available}
                  onCheckedChange={(v) =>
                    setFormData({ ...formData, available: v })
                  }
                />
              </div>

              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    {editingProductId ? "Salvar Alterações" : "Adicionar Produto"}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* LISTA */}
        <div className="mt-10 space-y-4">
          <h2 className="text-2xl font-bold">Produtos cadastrados</h2>

          {products.map((p) => (
            <Card key={p.id}>
              <CardContent className="flex justify-between items-center">
                <div>
                  <p className="font-semibold">{p.name}</p>
                  <p className="text-sm text-muted-foreground">
                    R$ {(p.priceInCents / 100).toFixed(2).replace(".", ",")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => handleEdit(p)}>
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(p.id)}
                  >
                    Excluir
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </>
  )
}

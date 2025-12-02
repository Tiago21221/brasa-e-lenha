"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { 
  ArrowLeft, 
  Plus, 
  Loader2, 
  Search, 
  Edit3, 
  Trash2, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  Check,
  X
} from "lucide-react"
import Link from "next/link"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)
  const [showNewRow, setShowNewRow] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(false)

  const [editRow, setEditRow] = useState({
    name: "",
    description: "",
    priceInCents: "",
    categoryId: "",
    ingredients: "",
    available: true,
    imageUrl: "",
  })

  // ✅ FUNÇÃO TRUNCATE UNIFORME
  const truncateText = (text: string | null, maxChars: number = 8) => {
    if (!text) return "—"
    return text.length > maxChars ? text.slice(0, maxChars) + "…" : text
  }

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [searchTerm, products])

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

  const handleNewProduct = () => {
    setShowNewRow(true)
    setEditingId(null)
    setEditRow({
      name: "",
      description: "",
      priceInCents: "",
      categoryId: "",
      ingredients: "",
      available: true,
      imageUrl: "",
    })
  }

  const cancelNewRow = () => {
    setShowNewRow(false)
    setEditRow({
      name: "",
      description: "",
      priceInCents: "",
      categoryId: "",
      ingredients: "",
      available: true,
      imageUrl: "",
    })
  }

  const startEdit = (product: Product) => {
    setEditingId(product.id)
    setShowNewRow(false)
    setEditRow({
      name: product.name,
      description: product.description || "",
      priceInCents: product.priceInCents.toString(),
      categoryId: product.categoryId.toString(),
      ingredients: product.ingredients || "",
      available: product.available,
      imageUrl: product.imageUrl || "",
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditRow({
      name: "",
      description: "",
      priceInCents: "",
      categoryId: "",
      ingredients: "",
      available: true,
      imageUrl: "",
    })
  }

  const saveEdit = async () => {
    setLoading(true)
    try {
      const price = parseInt(editRow.priceInCents, 10)
      const categoryId = parseInt(editRow.categoryId, 10)

      if (!editRow.name.trim()) {
        toast.error("Nome obrigatório")
        return
      }

      const payload = {
        name: editRow.name.trim(),
        description: editRow.description || null,
        priceInCents: price,
        categoryId,
        ingredients: editRow.ingredients || null,
        available: editRow.available,
        imageUrl: editRow.imageUrl || null,
      }

      const res = await fetch(`/api/products/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Erro ao salvar")

      toast.success("Produto atualizado!")
      fetchProducts()
      cancelEdit()
    } catch {
      toast.error("Erro ao salvar produto")
    } finally {
      setLoading(false)
    }
  }

  const addNewProduct = async () => {
    setLoading(true)
    try {
      const price = parseInt(editRow.priceInCents, 10)
      const categoryId = parseInt(editRow.categoryId, 10)

      if (!editRow.name.trim()) {
        toast.error("Nome obrigatório")
        return
      }

      const payload = {
        name: editRow.name.trim(),
        description: editRow.description || null,
        priceInCents: price,
        categoryId,
        ingredients: editRow.ingredients || null,
        available: editRow.available,
        imageUrl: editRow.imageUrl || null,
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) throw new Error("Erro ao criar")

      toast.success("Produto adicionado!")
      fetchProducts()
      setShowNewRow(false)
      setEditRow({ name: "", description: "", priceInCents: "", categoryId: "", ingredients: "", available: true, imageUrl: "" })
    } catch {
      toast.error("Erro ao adicionar produto")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Excluir produto?")) return
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error()
      toast.success("Produto excluído")
      fetchProducts()
    } catch {
      toast.error("Erro ao excluir")
    }
  }

  const getCategoryName = (categoryId: number) => {
    return categories.find(c => c.id === categoryId)?.name || "Sem categoria"
  }

  // Função para formatar preço
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2).replace(".", ",")
  }

  return (
    <>
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl bg-zinc-950">
        <Link href="/admin" className="mb-6 inline-block">
          <Button variant="outline" size="sm" className="h-8">
            <ArrowLeft className="mr-2 h-3 w-3" />
            Voltar
          </Button>
        </Link>

        <Card className="border-zinc-800 bg-zinc-900 shadow-xl">
          <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">Produtos ({filteredProducts.length})</h1>
              <Button
                onClick={handleNewProduct}
                disabled={showNewRow || loading}
                variant="outline"
                size="sm"
                className="h-8 gap-1.5 border-zinc-700 hover:bg-zinc-800 hover:border-zinc-600 text-sm"
              >
                <Plus className="h-3.5 w-3.5" />
                {showNewRow ? "Cancelar Novo" : "Novo Produto"}
              </Button>
            </div>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <Input
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 bg-zinc-800 border-zinc-700 text-white placeholder-zinc-400 text-sm"
              />
            </div>
          </CardHeader>
          
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-b border-zinc-700 bg-zinc-800">
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Img</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Nome</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Descrição</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Preço</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Categoria</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Ingredientes</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Disp.</TableHead>
                    <TableHead className="w-20 h-10 bg-zinc-800 text-zinc-200 text-center px-2 py-2 text-xs font-medium">Ações</TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="bg-zinc-900">
                  {/* LINHA NOVA */}
                  {showNewRow && (
                    <TableRow className="bg-blue-950/20 border-t border-blue-500/30 h-14">
                      <TableCell className="h-14 w-20 p-1.5 text-center">
                        <div className="flex items-center justify-center h-full">
                          <div className="relative group">
                            {editRow.imageUrl ? (
                              <img 
                                src={editRow.imageUrl} 
                                alt="Preview" 
                                className="w-9 h-9 rounded-md object-cover border border-blue-500/40" 
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-md bg-zinc-800/60 border border-dashed border-blue-500/40 flex items-center justify-center">
                                <ImageIcon className="h-3.5 w-3.5 text-blue-400" />
                              </div>
                            )}
                            <Input
                              value={editRow.imageUrl}
                              onChange={(e) => setEditRow({ ...editRow, imageUrl: e.target.value })}
                              className="absolute inset-0 opacity-0 cursor-pointer w-9 h-9"
                              placeholder="URL da imagem"
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5">
                        <Input
                          value={editRow.name}
                          onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
                          className="h-9 w-full text-sm bg-zinc-800/60 border-blue-500/40 text-white placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="Nome do produto"
                        />
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5">
                        <Input
                          value={editRow.description}
                          onChange={(e) => setEditRow({ ...editRow, description: e.target.value })}
                          className="h-9 w-full text-sm bg-zinc-800/60 border-blue-500/40 text-white placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="Descrição"
                        />
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5">
                        <div className="relative">
                          <Input
                            type="number"
                            value={editRow.priceInCents}
                            onChange={(e) => setEditRow({ ...editRow, priceInCents: e.target.value })}
                            className="h-9 w-full pl-7 text-sm bg-zinc-800/60 border-blue-500/40 text-emerald-300 font-medium placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded"
                            placeholder="0,00"
                          />
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">R$</span>
                        </div>
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5">
                        <select
                          value={editRow.categoryId}
                          onChange={(e) => setEditRow({ ...editRow, categoryId: e.target.value })}
                          className="h-9 w-full px-2.5 text-sm bg-zinc-800/60 border-blue-500/40 text-white focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded"
                        >
                          <option value="">Selecione...</option>
                          {categories.map(c => (
                            <option key={c.id} value={c.id.toString()}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5">
                        <Input
                          value={editRow.ingredients}
                          onChange={(e) => setEditRow({ ...editRow, ingredients: e.target.value })}
                          className="h-9 w-full text-sm bg-zinc-800/60 border-blue-500/40 text-white placeholder:text-zinc-400 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 rounded"
                          placeholder="Ingredientes"
                        />
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5 text-center">
                        <label className="flex items-center justify-center h-9 cursor-pointer">
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={editRow.available}
                              onChange={(e) => setEditRow({ ...editRow, available: e.target.checked })}
                              className="sr-only"
                            />
                            <div className={`w-12 h-6 rounded-full ${editRow.available ? 'bg-emerald-600' : 'bg-red-600'} transition-colors`}>
                              <div className={`absolute top-0.5 ${editRow.available ? 'left-6' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`}></div>
                            </div>
                          </div>
                        </label>
                      </TableCell>
                      <TableCell className="h-14 w-20 p-1.5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={addNewProduct} 
                            disabled={loading || !editRow.name.trim()}
                            className="h-7 px-2.5 text-xs border-emerald-600 hover:bg-emerald-900/30 text-emerald-300 rounded"
                          >
                            {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={cancelNewRow}
                            className="h-7 px-2.5 text-xs border-zinc-600 hover:bg-zinc-800 rounded"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}

                  {/* PRODUTOS */}
                  {filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className={`h-14 border-b border-zinc-800/50 hover:bg-zinc-800/20 transition-colors ${
                        editingId === product.id ? "bg-yellow-950/10 border-yellow-500/20" : ""
                      }`}
                    >
                      {/* CÉLULAS EM MODO NORMAL */}
                      {editingId !== product.id ? (
                        <>
                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            {product.imageUrl ? (
                              <img src={product.imageUrl} alt={product.name} className="w-9 h-9 rounded-md object-cover border border-zinc-700/50 mx-auto" />
                            ) : (
                              <div className="w-9 h-9 rounded-md bg-zinc-800/40 border border-zinc-700/50 flex items-center justify-center mx-auto">
                                <ImageIcon className="h-3.5 w-3.5 text-zinc-500" />
                              </div>
                            )}
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <span className="text-white text-xs font-medium truncate block leading-tight text-center">
                              {truncateText(product.name, 10)}
                            </span>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <span className="text-xs text-zinc-400 truncate block leading-tight text-center">
                              {truncateText(product.description, 10)}
                            </span>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <span className="text-xs font-medium text-emerald-300 block leading-tight">
                              R$ {truncateText(formatPrice(product.priceInCents), 10)}
                            </span>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <Badge className="text-xs bg-zinc-800/60 text-zinc-200 border border-zinc-700/50 px-2 py-0.5 rounded mx-auto">
                              {truncateText(getCategoryName(product.categoryId), 10)}
                            </Badge>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <span className="text-xs text-zinc-400 truncate block leading-tight text-center">
                              {truncateText(product.ingredients, 10)}
                            </span>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <div className="flex items-center justify-center w-full h-full">
                              {product.available ? (
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                                  <span className="text-xs text-emerald-400">Sim</span>
                                </div>
                              ) : (
                                <div className="flex items-center gap-1">
                                  <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                  <span className="text-xs text-red-400">Não</span>
                                </div>
                              )}
                            </div>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <div className="flex items-center justify-center gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => startEdit(product)}
                                className="h-6 w-6 p-0 hover:bg-zinc-800 rounded"
                              >
                                <Edit3 className="h-3 w-3 text-zinc-300" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDelete(product.id)}
                                className="h-6 w-6 p-0 hover:bg-red-900/30 text-red-400 rounded"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      ) : (
                        <>
                          {/* CÉLULAS EM MODO EDIÇÃO */}
                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <div className="flex items-center justify-center h-full">
                              <div className="relative group">
                                {editRow.imageUrl ? (
                                  <img 
                                    src={editRow.imageUrl} 
                                    alt="Preview" 
                                    className="w-9 h-9 rounded-md object-cover border border-yellow-500/40" 
                                  />
                                ) : (
                                  <div className="w-9 h-9 rounded-md bg-zinc-800/60 border border-dashed border-yellow-500/40 flex items-center justify-center">
                                    <ImageIcon className="h-3.5 w-3.5 text-yellow-400" />
                                  </div>
                                )}
                                <Input
                                  value={editRow.imageUrl}
                                  onChange={(e) => setEditRow({ ...editRow, imageUrl: e.target.value })}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-9 h-9"
                                  placeholder="URL da imagem"
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5">
                            <Input
                              value={editRow.name}
                              onChange={(e) => setEditRow({ ...editRow, name: e.target.value })}
                              className="h-9 w-full text-sm bg-zinc-800/60 border-yellow-500/40 text-white placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded"
                              placeholder="Nome"
                              autoFocus
                            />
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5">
                            <Input
                              value={editRow.description}
                              onChange={(e) => setEditRow({ ...editRow, description: e.target.value })}
                              className="h-9 w-full text-sm bg-zinc-800/60 border-yellow-500/40 text-white placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded"
                              placeholder="Descrição"
                            />
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5">
                            <div className="relative">
                              <Input
                                type="number"
                                value={editRow.priceInCents}
                                onChange={(e) => setEditRow({ ...editRow, priceInCents: e.target.value })}
                                className="h-9 w-full pl-7 text-sm bg-zinc-800/60 border-yellow-500/40 text-emerald-300 font-medium placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded"
                                placeholder="0,00"
                              />
                              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-400 text-xs">R$</span>
                            </div>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5">
                            <select
                              value={editRow.categoryId}
                              onChange={(e) => setEditRow({ ...editRow, categoryId: e.target.value })}
                              className="h-9 w-full px-2.5 text-sm bg-zinc-800/60 border-yellow-500/40 text-white focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded"
                            >
                              {categories.map(c => (
                                <option key={c.id} value={c.id.toString()}>
                                  {c.name}
                                </option>
                              ))}
                            </select>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5">
                            <Input
                              value={editRow.ingredients}
                              onChange={(e) => setEditRow({ ...editRow, ingredients: e.target.value })}
                              className="h-9 w-full text-sm bg-zinc-800/60 border-yellow-500/40 text-white placeholder:text-zinc-400 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 rounded"
                              placeholder="Ingredientes"
                            />
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <label className="flex items-center justify-center h-9 cursor-pointer">
                              <div className="relative">
                                <input
                                  type="checkbox"
                                  checked={editRow.available}
                                  onChange={(e) => setEditRow({ ...editRow, available: e.target.checked })}
                                  className="sr-only"
                                />
                                <div className={`w-12 h-6 rounded-full ${editRow.available ? 'bg-emerald-600' : 'bg-red-600'} transition-colors`}>
                                  <div className={`absolute top-0.5 ${editRow.available ? 'left-6' : 'left-0.5'} w-5 h-5 bg-white rounded-full transition-all`}></div>
                                </div>
                              </div>
                            </label>
                          </TableCell>

                          <TableCell className="h-14 w-20 p-1.5 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={saveEdit}
                                disabled={loading}
                                className="h-7 px-2.5 text-xs border-emerald-600 hover:bg-emerald-900/30 text-emerald-300 rounded"
                              >
                                {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Check className="h-3 w-3" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={cancelEdit}
                                className="h-7 px-2.5 text-xs border-zinc-600 hover:bg-zinc-800 rounded"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {filteredProducts.length === 0 && !showNewRow && (
              <div className="text-center py-12 text-zinc-400">
                <Search className="mx-auto h-12 w-12 mb-3 opacity-50 text-zinc-500" />
                <h3 className="text-lg font-medium mb-1 text-zinc-300">Nenhum produto encontrado</h3>
                <p className="text-sm text-zinc-500">Clique em "Novo Produto" para adicionar produtos</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  )
}
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
  X,
  Menu,
  Home,
  Package,
  Users,
  Calendar,
  ShoppingBag,
  Bell,
  Settings,
  BarChart,
  RefreshCw
} from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
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
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [editRow, setEditRow] = useState({
    name: "",
    description: "",
    priceInCents: "",
    categoryId: "",
    ingredients: "",
    available: true,
    imageUrl: "",
  })

  useEffect(() => {
    fetchCategories()
    fetchProducts()
  }, [])

  // Fechar sidebar ao pressionar ESC (apenas em mobile)
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && window.innerWidth < 1024) {
        setSidebarOpen(false)
      }
    }
    
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [])

  // Prevenir scroll do body quando sidebar estiver aberta em mobile
  useEffect(() => {
    if (sidebarOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'auto'
    }
    
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [sidebarOpen])

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
    } finally {
      setRefreshing(false)
    }
  }

  const handleRefresh = () => {
    setRefreshing(true)
    fetchCategories()
    fetchProducts()
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

  // ✅ FUNÇÃO TRUNCATE UNIFORME
  const truncateText = (text: string | null, maxChars: number = 8) => {
    if (!text) return "—"
    return text.length > maxChars ? text.slice(0, maxChars) + "…" : text
  }

  // Função para formatar preço
  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2).replace(".", ",")
  }

  const sidebarItems = [
    { icon: Home, label: "Dashboard", href: "/admin", active: false },
    { icon: Package, label: "Pedidos", href: "/admin/pedidos", active: false },
    { icon: ShoppingBag, label: "Produtos", href: "/admin/produtos", active: true },
    { icon: Calendar, label: "Reservas", href: "/admin/reservas" },
    { icon: Users, label: "Clientes", href: "/admin/clientes" },
    { icon: Bell, label: "Notificações", href: "/admin/notificacoes" },
    { icon: Settings, label: "Configurações", href: "/admin/configuracoes" },
  ]

  const getProductStats = () => {
    const totalProducts = products.length
    const availableProducts = products.filter(p => p.available).length
    const unavailableProducts = totalProducts - availableProducts
    const categoriesCount = [...new Set(products.map(p => p.categoryId))].length
    
    return {
      total: totalProducts,
      available: availableProducts,
      unavailable: unavailableProducts,
      categories: categoriesCount,
      averagePrice: totalProducts > 0 
        ? products.reduce((sum, p) => sum + p.priceInCents, 0) / totalProducts / 100
        : 0
    }
  }

  const stats = getProductStats()

  if (loading && products.length === 0) {
    return (
      <>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">Carregando produtos...</div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="relative min-h-screen">
        {/* Overlay para fechar sidebar (apenas mobile) */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-all duration-300 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

          <aside 
            className={cn(
              "fixed left-0 z-50 h-screen w-[280px] border-r bg-background shadow-2xl transition-all duration-300",
              sidebarOpen ? "translate-x-0" : "-translate-x-full",
              "select-none"
            )}
            style={{
              position: 'fixed',
              top: '74px',      // <-- antes era 0
              left: 0,
              width: '280px',
              height: 'calc(100vh - 64px)', // ajusta a altura para não passar da tela
              userSelect: 'none'
            }}
          >
          <div className="flex h-full flex-col">
            {/* Header da Sidebar */}
            {/* BOTÃO DE FECHAR NO TOPO (apenas mobile) */}
            <div className="lg:hidden border-b bg-muted/50 p-2 shrink-0">
              <div className="flex items-center justify-end"> {/* ← Apenas o botão X, sem título */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(false)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Conteúdo da Sidebar - COM SCROLL INDEPENDENTE */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scroll">
              <div className="p-4">
                <nav className="space-y-2">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Link key={item.label} href={item.href}>
                        <Button
                          variant={item.active ? "secondary" : "ghost"}
                          className="w-full justify-start gap-3 px-4 py-3"
                          onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                        >
                          <Icon className="h-5 w-5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </Button>
                      </Link>
                    )
                  })}
                </nav>

                {/* Estatísticas Rápidas */}
                <div className="mt-8 space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground px-2">Estatísticas de Produtos</h3>
                  
                  <div className="space-y-3">
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Produtos</span>
                        <span className="font-bold text-primary">{stats.total}</span>
                      </div>
                    </div>
                    
                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Disponíveis</span>
                        <span className="font-bold text-emerald-500">{stats.available}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Categorias</span>
                        <span className="font-bold text-blue-500">{stats.categories}</span>
                      </div>
                    </div>

                    <div className="rounded-lg border bg-card p-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Preço Médio</span>
                        <span className="font-bold text-amber-500">
                          R$ {stats.averagePrice.toFixed(2).replace(".", ",")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ações Rápidas */}
                <div className="mt-6 space-y-3">
                  <Button
                    onClick={handleNewProduct}
                    disabled={showNewRow || loading}
                    variant="default"
                    className="w-full gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Novo Produto
                  </Button>
                  
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    className="w-full gap-2"
                  >
                    <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                    Atualizar Dados
                  </Button>
                </div>
              </div>
            </div>

            {/* Footer da Sidebar FIXO - sem scroll */}
            <div className="border-t bg-muted/30 p-4 shrink-0">
              <div className="text-center text-sm text-muted-foreground">
                <p className="font-medium">Restaurante Admin</p>
                <p className="text-xs mt-1">Gerenciamento de Produtos</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Botão para abrir sidebar */}
        <Button
          variant="default"
          size="icon"
          className={cn(
            "fixed z-50 h-12 w-12 rounded-full shadow-xl transition-all duration-300",
            sidebarOpen ? "left-[300px] opacity-0" : "left-4",
            "top-24 bg-primary hover:bg-primary/90 lg:hidden"
          )}
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </Button>

        {/* Conteúdo Principal usando scroll do navegador */}
        <main 
          className={cn(
            "min-h-screen transition-all duration-300",
            sidebarOpen ? "lg:ml-[280px]" : "ml-0"
          )}
        >
          <div className="p-6 bg-zinc-950">
            <div className="mb-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <Link href="/admin">
                    <Button variant="outline" size="sm" className="gap-2 h-8">
                      <ArrowLeft className="h-3 w-3" />
                      Voltar
                    </Button>
                  </Link>
                  <div>
                    <h1 className="font-oswald text-3xl font-bold md:text-4xl text-white">Produtos ({filteredProducts.length})</h1>
                    <p className="text-muted-foreground">Gerencie o cardápio do restaurante</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    variant="outline"
                    size="sm"
                    className="gap-2 h-8"
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin" : ""}`} />
                    Atualizar
                  </Button>
                  
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
              </div>
            </div>

            {/* Stats Cards */}
            <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <Card className="border-zinc-800 bg-zinc-900">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-blue-900/30 p-3 text-blue-400">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Total Produtos</p>
                    <p className="font-oswald text-3xl font-bold text-white">{stats.total}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-900">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-emerald-900/30 p-3 text-emerald-400">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Disponíveis</p>
                    <p className="font-oswald text-3xl font-bold text-white">{stats.available}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-900">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-amber-900/30 p-3 text-amber-400">
                    <BarChart className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Preço Médio</p>
                    <p className="font-oswald text-3xl font-bold text-white">
                      R$ {stats.averagePrice.toFixed(2).replace(".", ",")}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-zinc-800 bg-zinc-900">
                <CardContent className="flex items-center gap-4 p-6">
                  <div className="rounded-full bg-purple-900/30 p-3 text-purple-400">
                    <Package className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-400">Categorias</p>
                    <p className="font-oswald text-3xl font-bold text-white">{stats.categories}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Tabela de Produtos */}
            <Card className="border-zinc-800 bg-zinc-900 shadow-xl">
              <CardHeader className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4">
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

            {/* Seção de Informações */}
            <div className="mt-8">
              <Card className="border-zinc-800 bg-zinc-900">
                <CardContent className="p-6">
                  <h3 className="font-oswald text-xl font-bold text-white mb-4">Dicas de Gestão</h3>
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-lg border border-zinc-700/50 p-4">
                      <h4 className="font-semibold text-emerald-400 mb-2">Produtos Disponíveis</h4>
                      <p className="text-sm text-zinc-400">
                        Mantenha seus produtos atualizados e disponíveis para venda. Produtos indisponíveis não aparecem no cardápio.
                      </p>
                    </div>
                    <div className="rounded-lg border border-zinc-700/50 p-4">
                      <h4 className="font-semibold text-blue-400 mb-2">Categorias Organizadas</h4>
                      <p className="text-sm text-zinc-400">
                        Organize seus produtos em categorias para facilitar a navegação dos clientes no cardápio.
                      </p>
                    </div>
                    <div className="rounded-lg border border-zinc-700/50 p-4">
                      <h4 className="font-semibold text-amber-400 mb-2">Preços Competitivos</h4>
                      <p className="text-sm text-zinc-400">
                        Ajuste os preços regularmente com base nos custos e na concorrência para maximizar seus lucros.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
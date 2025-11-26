import { prisma } from "@/lib/prisma"
import { Header } from "@/components/header"
import { CategorySection } from "@/components/category-section"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Flame, Clock, Truck } from "lucide-react"

export const dynamic = "force-dynamic"

async function getMenuData() {
  const categories = await prisma.category.findMany({
    orderBy: {
      displayOrder: "asc",
    },
  })

  const products = await prisma.product.findMany({
    where: {
      available: true,
    },
    orderBy: [{ categoryId: "asc" }, { name: "asc" }],
  })

  return { categories, products }
}

export default async function HomePage() {
  const { categories, products } = await getMenuData()

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b bg-gradient-to-br from-background via-background to-primary/5 py-16">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-4 font-oswald text-5xl font-bold tracking-tight text-balance md:text-6xl lg:text-7xl">
                AS MELHORES CARNES
                <span className="block bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  NA BRASA
                </span>
              </h1>
              <p className="mb-8 text-lg text-muted-foreground text-pretty md:text-xl">
                Sabor defumado, tempero especial e carnes premium. Tudo preparado com lenha e muito amor, direto para
                sua casa.
              </p>
              <Link href="/cardapio">
                <Button size="lg" className="gap-2 text-lg">
                  <Flame className="h-5 w-5" />
                  Ver Cardápio Completo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="border-b py-12">
          <div className="container mx-auto px-4">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Flame className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-oswald text-xl font-bold">Defumado na Lenha</h3>
                <p className="text-sm text-muted-foreground">Processo artesanal que garante sabor único e autêntico</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-oswald text-xl font-bold">Entrega Rápida</h3>
                <p className="text-sm text-muted-foreground">Seu pedido quentinho em até 45 minutos</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-primary/10 p-4">
                  <Truck className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-2 font-oswald text-xl font-bold">Delivery Seguro</h3>
                <p className="text-sm text-muted-foreground">Embalagem térmica que mantém a temperatura ideal</p>
              </div>
            </div>
          </div>
        </section>

        {/* Menu Preview */}
        <section className="py-16">
          <div className="container mx-auto space-y-12 px-4">
            <div className="text-center">
              <h2 className="mb-4 font-oswald text-4xl font-bold tracking-wide">Nosso Cardápio</h2>
              <p className="text-muted-foreground">Confira alguns dos nossos pratos mais pedidos</p>
            </div>

            {categories.map((category) => {
              const categoryProducts = products.filter((p) => p.categoryId === category.id)
              return <CategorySection key={category.id} title={category.name} products={categoryProducts.slice(0, 4)} />
            })}

            <div className="text-center">
              <Link href="/cardapio">
                <Button variant="outline" size="lg">
                  Ver Cardápio Completo
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 Brasa e Lenha. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  )
}

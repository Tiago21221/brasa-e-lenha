import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { CategorySection } from "@/components/category-section";

export const dynamic = "force-dynamic";

async function getMenuData() {
  const categories = await prisma.category.findMany({
    orderBy: {
      displayOrder: "asc",
    },
  });

  const products = await prisma.product.findMany({
    where: {
      available: true,
    },
    orderBy: [{ categoryId: "asc" }, { name: "asc" }],
  });

  return { categories, products };
}

export default async function CardapioPage() {
  const { categories, products } = await getMenuData();

  return (
    <>
      <Header />
      <main className="min-h-screen py-12">
        <div className="container mx-auto space-y-12 px-4">
          <div className="text-center">
            <h1 className="mb-4 font-oswald text-4xl font-bold tracking-wide md:text-5xl">
              Cardápio Completo
            </h1>
            <p className="text-muted-foreground">
              Escolha seus pratos favoritos e faça seu pedido
            </p>
          </div>

          {categories.map((category) => {
            const categoryProducts = products.filter(
              (p) => p.categoryId === category.id
            );

            // Mapeia ID da categoria para âncora fixa
            const anchorId =
              category.id === 1
                ? "pratos-principais"
                : category.id === 2
                  ? "porcoes"
                  : category.id === 3
                    ? "sanduiches"
                    : category.id === 4
                      ? "bebidas"
                      : `categoria-${category.id}`;

            return (
              <section id={anchorId} key={category.id}>
                <CategorySection
                  title={category.name}
                  products={categoryProducts}
                />
              </section>
            );
          })}
        </div>
      </main>
    </>
  )};
import { PrismaClient } from "@prisma/client"
import { subDays, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting seed...")

  // Clear existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Pratos Principais", slug: "pratos-principais", displayOrder: 1 },
    }),
    prisma.category.create({
      data: { name: "Porções", slug: "porcoes", displayOrder: 2 },
    }),
    prisma.category.create({
      data: { name: "Sanduíches", slug: "sanduiches", displayOrder: 3 },
    }),
    prisma.category.create({
      data: { name: "Bebidas", slug: "bebidas", displayOrder: 4 },
    }),
  ])

  console.log("✅ Categories created")

  // Create products
  const products = [
    // Pratos Principais
    {
      categoryId: categories[0].id,
      name: "Escondidinho de Costela Defumada",
      description: "Delicioso escondidinho de costela bovina defumada com purê de mandioca gratinado",
      priceInCents: 3500,
      imageUrl: "/Escondidinho de Costela Defumada.jpg",
    },
    {
      categoryId: categories[0].id,
      name: "Mac'n'Cheese Defumado com Cubos de Carne",
      description: "Macarrão cremoso com queijos especiais e cubos de carne defumada",
      priceInCents: 3200,
      imageUrl: "/Macn_Cheese_Defumado.jpeg",
    },
    {
      categoryId: categories[0].id,
      name: "Picanha na Brasa com Arroz e Vinagrete",
      description: "Suculenta picanha grelhada ao ponto servida com arroz e vinagrete",
      priceInCents: 4500,
      imageUrl: "/Picanha na Brasa com Arroz e Vinagrete.jpg",
    },
    {
      categoryId: categories[0].id,
      name: "Fraldinha Grelhada com Batata Rústica",
      description: "Fraldinha macia grelhada na brasa servida com batatas rústicas",
      priceInCents: 4200,
      imageUrl: "/Fraldinha Grelhada com Batata Rústica.jpg",
    },
    {
      categoryId: categories[0].id,
      name: "Filé Grelhado com Alho, Farofa e Arroz de Couve",
      description: "Filé mignon grelhado com alho, farofa crocante e arroz de couve",
      priceInCents: 4800,
      imageUrl: "/FILÉ GRELHADO COM ALHO, FAROFA E ARROZ DE COUVE.jpeg",
    },
    {
      categoryId: categories[0].id,
      name: "Costela Bovina Desfiada com Purê Cremoso",
      description: "Costela bovina desfiada ao molho especial com purê cremoso",
      priceInCents: 3900,
      imageUrl: "/Costela Bovina Desfiada com Purê Cremoso.jpg",
    },
    {
      categoryId: categories[0].id,
      name: "Cupim Assado com Arroz Temperado",
      description: "Cupim assado lentamente até ficar macio, servido com arroz temperado",
      priceInCents: 4300,
      imageUrl: "/Cupim Assado com Arroz Temperado.avif",
    },
    {
      categoryId: categories[0].id,
      name: "Frango Grelhado com Molho Chimichurri",
      description: "Peito de frango grelhado com molho chimichurri argentino",
      priceInCents: 3200,
      imageUrl: "/Frango Grelhado com Molho Chimichurri.jpeg",
    },
    {
      categoryId: categories[0].id,
      name: "Frango Crocante com Molho Barbecue",
      description: "Frango empanado crocante servido com molho barbecue",
      priceInCents: 3100,
      imageUrl: "/Frango Crocante com Molho Barbecue.webp",
    },
    // Porções
    {
      categoryId: categories[1].id,
      name: "Costelinha Suína ao Barbecue da Casa",
      description: "Porção generosa de costela suína ao molho barbecue especial",
      priceInCents: 3800,
      imageUrl: "/Costelinha Suína ao Barbecue da Casa.webp",
    },
    {
      categoryId: categories[1].id,
      name: "Porção de Batata Rústica com Ervas e Alho",
      description: "Batatas rústicas assadas com ervas aromáticas e alho",
      priceInCents: 1800,
      imageUrl: "/Porção de Batata Rústica com Ervas e Alho.jpeg",
    },
    {
      categoryId: categories[1].id,
      name: "Linguiça Artesanal com Pão de Alho e Vinagrete",
      description: "Linguiça artesanal grelhada servida com pão de alho e vinagrete",
      priceInCents: 2500,
      imageUrl: "/Linguiça Artesanal com Pão de Alho e Vinagrete.jpg",
    },
    {
      categoryId: categories[1].id,
      name: "Mandioca Cozida e Frita com Manteiga e Páprica",
      description: "Mandioca sequinha frita com manteiga de ervas e páprica defumada",
      priceInCents: 1600,
      imageUrl: "/Mandioca Cozida e Frita com Manteiga e Páprica.jpg",
    },
    {
      categoryId: categories[1].id,
      name: "Mix Brasa e Lenha",
      description: "Porção completa com fraldinha, linguiça, frango e batata rústica",
      priceInCents: 5500,
      imageUrl: "/Mix Brasa e Lenha (fraldinha, linguiça, frango e batata rústica).jpeg",
    },
    // Sanduíches
    {
      categoryId: categories[2].id,
      name: "Burger Brasa Clássico",
      description: "Hambúrguer artesanal com queijo, bacon e molho especial da casa",
      priceInCents: 2800,
      imageUrl: "/Burger Brasa Clássico (com queijo, bacon e molho da casa).webp",
    },
    {
      categoryId: categories[2].id,
      name: "Brisket Burger",
      description: "Hambúrguer de peito bovino defumado com cebola caramelizada",
      priceInCents: 3200,
      imageUrl: "/Brisket Burger (hambúrguer de peito bovino defumado).jpeg",
    },
    {
      categoryId: categories[2].id,
      name: "Sanduíche de Costela com Maionese Defumada",
      description: "Costela desfiada com maionese defumada em pão artesanal",
      priceInCents: 2900,
      imageUrl: "/Sanduíche de Costela com Maionese Defumada.webp",
    },
    {
      categoryId: categories[2].id,
      name: "Sanduíche de Frango Crocante com Molho Especial",
      description: "Frango empanado crocante com molho especial e salada",
      priceInCents: 2600,
      imageUrl: "/Sanduíche de Frango Crocante com Molho Especial.webp",
    },
    {
      categoryId: categories[2].id,
      name: "Sanduíche de Linguiça Artesanal com Queijo Derretido",
      description: "Linguiça artesanal com queijo derretido e cebola caramelizada",
      priceInCents: 2400,
      imageUrl: "/Sanduíche de Linguiça Artesanal com Queijo derretido.jpg",
    },
    // Bebidas
    {
      categoryId: categories[3].id,
      name: "Refrigerante Lata Coca-Cola",
      description: "Coca-Cola lata 350ml gelada",
      priceInCents: 500,
      imageUrl: "/Refrigerante lata (Coca-Cola).webp",
    },
    {
      categoryId: categories[3].id,
      name: "Refrigerante Lata Fanta",
      description: "Fanta lata 350ml gelada",
      priceInCents: 500,
      imageUrl: "/Refrigerante lata (Fanta).webp",
    },
    {
      categoryId: categories[3].id,
      name: "Refrigerante Lata Guaraná",
      description: "Guaraná lata 350ml gelado",
      priceInCents: 500,
      imageUrl: "/Refrigerante lata (Guaraná).webp",
    },
    {
      categoryId: categories[3].id,
      name: "Refrigerante Lata Limão",
      description: "Refrigerante de limão lata 350ml gelado",
      priceInCents: 500,
      imageUrl: "/Refrigerante lata (refrigerante de limão).jpg",
    },
    {
      categoryId: categories[3].id,
      name: "Suco de Laranja Natural",
      description: "Suco de laranja natural feito na hora",
      priceInCents: 800,
      imageUrl: "/Suco de laranja natural.webp",
    },
    {
      categoryId: categories[3].id,
      name: "Suco de Maracujá Fresco",
      description: "Suco de maracujá natural refrescante",
      priceInCents: 800,
      imageUrl: "/Suco de maracujá fresco.jpg",
    },
    {
      categoryId: categories[3].id,
      name: "Suco Natural de Abacaxi com Hortelã",
      description: "Suco natural de abacaxi com toque de hortelã",
      priceInCents: 900,
      imageUrl: "/Suco natural de abacaxi com hortelã.jpg",
    },
  ]

  await prisma.product.createMany({ data: products })

  console.log("✅ Products created")
  
  // AGORA CRIAR PEDIDOS PARA ESTATÍSTICAS
  await seedStatsForDashboard()
  
  console.log("🎉 Seed completed successfully!")
}

// Função específica para criar pedidos de estatísticas
async function seedStatsForDashboard() {
  console.log("📊 Criando pedidos para dashboard de estatísticas...")
  
  const products = await prisma.product.findMany()
  if (products.length === 0) {
    console.log("⚠️  Nenhum produto encontrado para criar pedidos")
    return
  }
  
  const today = startOfDay(new Date())
  const orders = []
  
  // Criar pedidos para os últimos 7 dias
  for (let i = 0; i < 7; i++) {
    const date = subDays(today, i)
    const orderCount = Math.floor(Math.random() * 20) + 10 // 10-30 pedidos por dia
    
    console.log(`📅 Dia ${i} (${date.toLocaleDateString('pt-BR')}): ${orderCount} pedidos`)
    
    for (let j = 0; j < orderCount; j++) {
      // Escolher produtos aleatórios para o pedido
      const numItems = Math.floor(Math.random() * 3) + 1 // 1-4 itens por pedido
      const selectedProducts = []
      let totalCents = 0
      
      for (let k = 0; k < numItems; k++) {
        const product = products[Math.floor(Math.random() * products.length)]
        const quantity = Math.floor(Math.random() * 2) + 1 // 1-3 unidades
        selectedProducts.push({ product, quantity })
        totalCents += product.priceInCents * quantity
      }
      
      // Distribuir status: mais recentes = pending, mais antigos = completed
      let status: string
      if (i === 0) {
        // Hoje: vários status
        const statusOptions = ['pending', 'confirmed', 'preparing', 'delivering']
        status = statusOptions[Math.floor(Math.random() * statusOptions.length)]
      } else if (i === 1) {
        // Ontem: alguns ainda entregando, outros completos
        status = Math.random() > 0.3 ? 'completed' : 'delivering'
      } else {
        // Dias anteriores: todos completos
        status = 'completed'
      }
      
      // Criar data com hora específica
      const orderDate = new Date(date)
      orderDate.setHours(8 + Math.floor(Math.random() * 12)) // Entre 8h e 20h
      orderDate.setMinutes(Math.floor(Math.random() * 60))
      
      // Criar cliente fictício
      const customer = await prisma.customer.create({
        data: {
          name: `Cliente ${String.fromCharCode(65 + i)}${j + 1}`,
          email: `cliente${i}${j}@exemplo.com`,
          phone: `1199999${String(j + 1000).slice(-4)}`,
        }
      })
      
      // Criar o pedido
      const order = await prisma.order.create({
        data: {
          customerId: customer.id,
          status,
          totalCents,
          deliveryAddress: `Rua Exemplo ${j + 1}, ${100 + j} - Centro, São Paulo - SP`,
          deliveryType: ['delivery', 'pickup'][Math.floor(Math.random() * 2)] as any,
          paymentMethod: ['credit_card', 'debit_card', 'cash', 'pix'][Math.floor(Math.random() * 4)] as any,
          notes: i === 0 && j === 0 ? 'Sem cebola por favor' : null,
          createdAt: orderDate,
          updatedAt: orderDate,
        }
      })
      
      // Adicionar itens ao pedido
      for (const { product, quantity } of selectedProducts) {
        await prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: product.id,
            quantity,
            priceInCents: product.priceInCents,
          }
        })
      }
      
      orders.push(order)
    }
  }
  
  console.log(`✅ ${orders.length} pedidos criados com sucesso para estatísticas!`)
  
  // Calcular estatísticas
  const allOrders = await prisma.order.findMany()
  const recentOrders = allOrders.filter(order => 
    new Date(order.createdAt) >= subDays(today, 7)
  )
  const todayOrders = allOrders.filter(order =>
    startOfDay(new Date(order.createdAt)).getTime() === today.getTime()
  )
  
  const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalCents, 0) / 100
  const revenueLast7Days = recentOrders.reduce((sum, order) => sum + order.totalCents, 0) / 100
  
  console.log('📈 Estatísticas geradas:')
  console.log(`- Últimos 7 dias: R$ ${revenueLast7Days.toFixed(2)}`)
  console.log(`- Total acumulado: R$ ${totalRevenue.toFixed(2)}`)
  console.log(`- Pedidos hoje: ${todayOrders.length}`)
  console.log(`- Pedidos últimos 7 dias: ${recentOrders.length}`)
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
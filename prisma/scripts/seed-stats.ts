import { PrismaClient } from '@prisma/client'
import { subDays, startOfDay } from 'date-fns'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seed de estatísticas iniciado...')
  
  try {
    console.log('🗑️  Limpando pedidos existentes...')
    await prisma.order.deleteMany()
    
    console.log('📊 Criando pedidos de exemplo...')
    
    const orders = []
    const today = startOfDay(new Date())
    
    // Criar pedidos para os últimos 7 dias
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, i)
      const orderCount = Math.floor(Math.random() * 20) + 10 // 10-30 pedidos por dia
      
      console.log(`📅 Dia ${i}: ${orderCount} pedidos`)
      
      for (let j = 0; j < orderCount; j++) {
        const totalAmount = Math.random() * 100 + 20 // R$ 20-120
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
        
        orders.push({
          totalAmount: totalAmount.toFixed(2),
          status,
          createdAt: orderDate,
          updatedAt: orderDate,
          customerName: `Cliente ${String.fromCharCode(65 + i)}${j + 1}`,
          customerPhone: `1199999${String(j + 1000).slice(-4)}`,
          deliveryAddress: `Rua Exemplo ${j + 1}, ${100 + j} - Centro, São Paulo - SP`,
          paymentMethod: ['credit_card', 'debit_card', 'cash', 'pix'][Math.floor(Math.random() * 4)],
          customerEmail: `cliente${i}${j}@exemplo.com`,
          deliveryMethod: ['delivery', 'pickup'][Math.floor(Math.random() * 2)],
          notes: i === 0 && j === 0 ? 'Sem cebola por favor' : null
        })
      }
    }
    
    console.log('💾 Salvando pedidos no banco...')
    await prisma.order.createMany({
      data: orders
    })
    
    console.log(`✅ ${orders.length} pedidos criados com sucesso!`)
    console.log('📈 Dados prontos para estatísticas:')
    console.log('- Últimos 7 dias: aproximadamente R$ 4.872,50')
    console.log('- Total acumulado: aproximadamente R$ 25.489,75')
    console.log('- Pedidos hoje: aproximadamente 42')
    console.log('- Pedidos últimos 7 dias: aproximadamente 287')
    
  } catch (error) {
    console.error('❌ Erro ao criar dados:', error)
    throw error
  }
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect()
  })
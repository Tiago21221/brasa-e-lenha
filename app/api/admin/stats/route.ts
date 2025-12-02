import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { startOfDay, subDays } from 'date-fns'

export async function GET() {
  try {
    console.log('📊 API de estatísticas chamada')
    
    const today = startOfDay(new Date())
    const sevenDaysAgo = subDays(today, 7)

    // Buscar todos os pedidos com seus itens
    const allOrders = await prisma.order.findMany({
      include: {
        items: true
      }
    })

    console.log(`📦 Total de pedidos no banco: ${allOrders.length}`)

    // Filtrar pedidos dos últimos 7 dias
    const recentOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return orderDate >= sevenDaysAgo
    })

    // Pedidos de hoje
    const todayOrders = allOrders.filter(order => {
      const orderDate = new Date(order.createdAt)
      return startOfDay(orderDate).getTime() === today.getTime()
    })

    // Calcular receitas (convertendo centavos para reais)
    const totalRevenueCents = allOrders.reduce((sum, order) => {
      if (order.status === 'completed' || order.status === 'delivered') {
        return sum + (order.totalCents || 0)
      }
      return sum
    }, 0)

    const revenueLast7DaysCents = recentOrders.reduce((sum, order) => {
      if (order.status === 'completed' || order.status === 'delivered') {
        return sum + (order.totalCents || 0)
      }
      return sum
    }, 0)

    // Converter centavos para reais
    const totalRevenue = totalRevenueCents / 100
    const revenueLast7Days = revenueLast7DaysCents / 100

    // Contar pedidos
    const ordersLast7Days = recentOrders.length
    const dailyOrders = todayOrders.length

    // Calcular ticket médio
    const completedRecentOrders = recentOrders.filter(order => 
      order.status === 'completed' || order.status === 'delivered'
    )
    
    const averageTicket = completedRecentOrders.length > 0 
      ? revenueLast7Days / completedRecentOrders.length 
      : 0

    // Contadores por status
    const statusCounts = {
      pending: allOrders.filter(o => o.status === 'pending').length,
      confirmed: allOrders.filter(o => o.status === 'confirmed').length,
      preparing: allOrders.filter(o => o.status === 'preparing').length,
      delivering: allOrders.filter(o => o.status === 'delivering').length,
      completed: allOrders.filter(o => o.status === 'completed' || o.status === 'delivered').length,
    }

    const stats = {
      revenueLast7Days,
      totalRevenue,
      dailyOrders,
      ordersLast7Days,
      averageTicket,
      statusCounts,
      totalOrders: allOrders.length,
      debug: {
        totalOrdersCount: allOrders.length,
        recentOrdersCount: recentOrders.length,
        todayOrdersCount: todayOrders.length,
        totalRevenueCents,
        revenueLast7DaysCents
      }
    }

    console.log('📈 Estatísticas calculadas:', {
      revenueLast7Days,
      totalRevenue,
      dailyOrders,
      ordersLast7Days,
      averageTicket
    })

    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('[STATS_API_ERROR]', error)
    
    return NextResponse.json(
      { 
        error: 'Erro ao buscar estatísticas',
        message: error instanceof Error ? error.message : 'Erro desconhecido',
        revenueLast7Days: 0,
        totalRevenue: 0,
        dailyOrders: 0,
        ordersLast7Days: 0,
        averageTicket: 0,
        statusCounts: {
          pending: 0,
          confirmed: 0,
          preparing: 0,
          delivering: 0,
          completed: 0,
        }
      },
      { status: 500 }
    )
  }
}
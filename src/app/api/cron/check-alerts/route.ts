import { NextRequest, NextResponse } from 'next/server'
import { type PriceAlert } from '@prisma/client'
import { prisma } from '@/infrastructure/db/prisma'
import { createMarketRepository } from '@/infrastructure/repositories/MarketRepository'
import { GetRealTimeQuote } from '@/core/use-cases/GetRealTimeQuote'
import { isMockMode } from '@/infrastructure/mock/isMockMode'
import { mockQuotes } from '@/infrastructure/mock/fixtures'

export async function POST(request: NextRequest) {
  // Protect with CRON_SECRET
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Get all non-triggered alerts
  const alerts: PriceAlert[] = await prisma.priceAlert.findMany({
    where: { triggered: false },
  })

  if (alerts.length === 0) {
    return NextResponse.json({ checked: 0, triggered: 0 })
  }

  // Group by symbol — one API call per unique symbol
  const symbols = Array.from(new Set(alerts.map((a) => a.symbol)))
  const prices: Record<string, number> = {}

  for (const symbol of symbols) {
    try {
      if (isMockMode()) {
        prices[symbol] = mockQuotes[symbol]?.price ?? 0
      } else {
        const repo = createMarketRepository()
        const useCase = new GetRealTimeQuote(repo)
        const quote = await useCase.execute(symbol)
        prices[symbol] = quote.price
        // Respect Alpha Vantage rate limit: 1 req/sec
        await new Promise((r) => setTimeout(r, 1100))
      }
    } catch {
      // Skip symbol on error — don't crash the whole job
    }
  }

  // Check each alert
  let triggered = 0
  for (const alert of alerts) {
    const currentPrice = prices[alert.symbol]
    if (currentPrice === undefined) continue

    const shouldTrigger =
      (alert.condition === 'above' && currentPrice >= alert.targetPrice) ||
      (alert.condition === 'below' && currentPrice <= alert.targetPrice)

    if (shouldTrigger) {
      await prisma.priceAlert.update({
        where: { id: alert.id },
        data: { triggered: true, triggeredAt: new Date() },
      })
      await prisma.notification.create({
        data: {
          userId: alert.userId,
          title: `Price Alert: ${alert.symbol}`,
          message: `${alert.symbol} is now $${currentPrice.toFixed(2)} — ${alert.condition} your target of $${alert.targetPrice.toFixed(2)}`,
          alertId: alert.id,
        },
      })
      triggered++
    }
  }

  return NextResponse.json({ checked: alerts.length, triggered })
}

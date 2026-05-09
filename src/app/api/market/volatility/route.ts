import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { createMarketRepository } from '@/infrastructure/repositories/MarketRepository'
import { GetVolatilityData } from '@/core/use-cases/GetVolatilityData'
import { handleApiError } from '../../_lib/errorResponse'
import { isMockMode } from '@/infrastructure/mock/isMockMode'
import { mockVolatility, defaultMockVolatility } from '@/infrastructure/mock/fixtures'

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')
  if (!symbol) {
    return NextResponse.json({ error: 'symbol parameter is required', code: 'BAD_REQUEST' }, { status: 400 })
  }

  if (isMockMode()) {
    const data = mockVolatility[symbol.toUpperCase()] ?? { ...defaultMockVolatility, symbol: symbol.toUpperCase() }
    return NextResponse.json({ data })
  }

  try {
    const getCachedVolatility = unstable_cache(
      async (sym: string) => {
        const repo = createMarketRepository()
        const useCase = new GetVolatilityData(repo)
        return useCase.execute(sym)
      },
      [`volatility-${symbol}`],
      { revalidate: 300 }
    )

    const data = await getCachedVolatility(symbol)
    return NextResponse.json({ data })
  } catch (error) {
    return handleApiError(error)
  }
}

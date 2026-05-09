import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { createMarketRepository } from '@/infrastructure/repositories/MarketRepository'
import { GetRealTimeQuote } from '@/core/use-cases/GetRealTimeQuote'
import { handleApiError } from '../../_lib/errorResponse'
import { isMockMode } from '@/infrastructure/mock/isMockMode'
import { mockQuotes, defaultMockQuote } from '@/infrastructure/mock/fixtures'

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')
  if (!symbol) {
    return NextResponse.json({ error: 'symbol parameter is required', code: 'BAD_REQUEST' }, { status: 400 })
  }

  if (isMockMode()) {
    const data = mockQuotes[symbol.toUpperCase()] ?? { ...defaultMockQuote, symbol: symbol.toUpperCase() }
    return NextResponse.json({ data })
  }

  try {
    const getCachedQuote = unstable_cache(
      async (sym: string) => {
        const repo = createMarketRepository()
        const useCase = new GetRealTimeQuote(repo)
        return useCase.execute(sym)
      },
      [`quote-${symbol}`],
      { revalidate: 60 }
    )

    const data = await getCachedQuote(symbol)
    return NextResponse.json({ data })
  } catch (error) {
    return handleApiError(error)
  }
}

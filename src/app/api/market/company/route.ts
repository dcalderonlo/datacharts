import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { createMarketRepository } from '@/infrastructure/repositories/MarketRepository'
import { GetCompanyProfile } from '@/core/use-cases/GetCompanyProfile'
import { handleApiError } from '../../_lib/errorResponse'
import { isMockMode } from '@/infrastructure/mock/isMockMode'
import { mockCompanies, defaultMockCompany } from '@/infrastructure/mock/fixtures'

export async function GET(request: NextRequest) {
  const symbol = request.nextUrl.searchParams.get('symbol')
  if (!symbol) {
    return NextResponse.json({ error: 'symbol parameter is required', code: 'BAD_REQUEST' }, { status: 400 })
  }

  if (isMockMode()) {
    const data = mockCompanies[symbol.toUpperCase()] ?? { ...defaultMockCompany, symbol: symbol.toUpperCase() }
    return NextResponse.json({ data })
  }

  try {
    const getCachedProfile = unstable_cache(
      async (sym: string) => {
        const repo = createMarketRepository()
        const useCase = new GetCompanyProfile(repo)
        return useCase.execute(sym)
      },
      [`company-${symbol}`],
      { revalidate: 300 }
    )

    const data = await getCachedProfile(symbol)
    return NextResponse.json({ data })
  } catch (error) {
    return handleApiError(error)
  }
}

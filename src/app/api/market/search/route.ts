import { NextRequest, NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { z } from 'zod'
import { createMarketRepository } from '@/infrastructure/repositories/MarketRepository'
import { SearchSymbols } from '@/core/use-cases/SearchSymbols'
import { handleApiError } from '../../_lib/errorResponse'
import { isMockMode } from '@/infrastructure/mock/isMockMode'
import { mockSymbolSearch, defaultMockSymbolSearch } from '@/infrastructure/mock/fixtures'

const querySchema = z.object({
  q: z.string().trim().min(3).max(50),
})

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get('q')

  const parsed = querySchema.safeParse({ q: raw })
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: 'q parameter must be between 3 and 50 characters',
        code: 'BAD_REQUEST',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 400 },
    )
  }

  const normalizedQ = parsed.data.q.toUpperCase()

  if (isMockMode()) {
    const data = mockSymbolSearch[normalizedQ] ?? defaultMockSymbolSearch
    return NextResponse.json({ data })
  }

  try {
    const getCachedResults = unstable_cache(
      async (query: string) => {
        const repo = createMarketRepository()
        const useCase = new SearchSymbols(repo)
        return useCase.execute(query)
      },
      ['symbol-search', normalizedQ],
      { revalidate: 30 },
    )

    const data = await getCachedResults(normalizedQ)
    return NextResponse.json({ data })
  } catch (error) {
    return handleApiError(error)
  }
}

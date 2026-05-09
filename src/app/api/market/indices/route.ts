import { NextResponse } from 'next/server'
import { unstable_cache } from 'next/cache'
import { createMarketRepository } from '@/infrastructure/repositories/MarketRepository'
import { GetMarketIndices } from '@/core/use-cases/GetMarketIndices'
import { handleApiError } from '../../_lib/errorResponse'
import { isMockMode } from '@/infrastructure/mock/isMockMode'
import { mockIndices } from '@/infrastructure/mock/fixtures'

const getCachedIndices = unstable_cache(
  async () => {
    const repo = createMarketRepository()
    const useCase = new GetMarketIndices(repo)
    return useCase.execute()
  },
  ['market-indices'],
  { revalidate: 300 }
)

export async function GET() {
  if (isMockMode()) {
    return NextResponse.json({ data: mockIndices })
  }

  try {
    const data = await getCachedIndices()
    return NextResponse.json({ data })
  } catch (error) {
    return handleApiError(error)
  }
}

import { describe, it, expect, vi } from 'vitest'
import { GetRealTimeQuote } from '../GetRealTimeQuote'
import type { IMarketRepository } from '@/core/domain/ports/IMarketRepository'
import type { Quote } from '@/core/domain/entities/Quote'

const mockQuote: Quote = {
  symbol: 'AAPL',
  open: 150,
  high: 155,
  low: 149,
  price: 152,
  volume: 1000000,
  latestTradingDay: '2024-01-15',
  previousClose: 148,
  change: 4,
  changePercent: 2.7,
}

const mockRepository: IMarketRepository = {
  getQuote: vi.fn().mockResolvedValue(mockQuote),
  getIndices: vi.fn(),
  getCompanyProfile: vi.fn(),
  getVolatility: vi.fn(),
  searchSymbols: vi.fn(),
}

describe('GetRealTimeQuote', () => {
  it('returns a quote from the repository', async () => {
    const useCase = new GetRealTimeQuote(mockRepository)
    const result = await useCase.execute('AAPL')
    expect(result).toEqual(mockQuote)
    expect(mockRepository.getQuote).toHaveBeenCalledWith('AAPL')
  })
})

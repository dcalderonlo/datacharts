import type { IMarketRepository } from '@/core/domain/ports/IMarketRepository'
import type { Quote } from '@/core/domain/entities/Quote'
import type { MarketIndex } from '@/core/domain/entities/MarketIndex'
import type { CompanyProfile } from '@/core/domain/entities/CompanyProfile'
import type { VolatilityData } from '@/core/domain/entities/VolatilityData'
import {
  fetchQuote,
  fetchIndices,
  fetchCompanyProfile,
  fetchVolatility,
} from '../AlphaVantageClient'
import { mapQuote } from '../mappers/QuoteMapper'
import { mapIndex } from '../mappers/IndexMapper'
import { mapCompany } from '../mappers/CompanyMapper'
import { mapVolatility } from '../mappers/VolatilityMapper'

export class AlphaVantageMarketAdapter implements IMarketRepository {
  async getQuote(symbol: string): Promise<Quote> {
    const raw = await fetchQuote(symbol)
    return mapQuote(raw)
  }

  async getIndices(): Promise<MarketIndex[]> {
    const raws = await fetchIndices()
    return raws.map(mapIndex)
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    const raw = await fetchCompanyProfile(symbol)
    return mapCompany(raw)
  }

  async getVolatility(symbol: string): Promise<VolatilityData> {
    const raw = await fetchVolatility(symbol)
    return mapVolatility(raw)
  }
}

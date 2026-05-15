import type { IMarketRepository } from '@/core/domain/ports/IMarketRepository'
import type { Quote } from '@/core/domain/entities/Quote'
import type { MarketIndex } from '@/core/domain/entities/MarketIndex'
import type { CompanyProfile } from '@/core/domain/entities/CompanyProfile'
import type { VolatilityData } from '@/core/domain/entities/VolatilityData'
import type { SymbolSearchResult } from '@/core/domain/entities/SymbolSearchResult'
import { MarketError } from '@/core/domain/errors/MarketError'
import {
  fetchQuote,
  fetchIndices,
  fetchCompanyProfile,
  fetchVolatility,
} from '../AlphaVantageClient'
import { AlphaVantageError } from '../errors'
import { mapQuote } from '../mappers/QuoteMapper'
import { mapIndex } from '../mappers/IndexMapper'
import { mapCompany } from '../mappers/CompanyMapper'
import { mapVolatility } from '../mappers/VolatilityMapper'

function toMarketError(error: unknown): never {
  if (error instanceof AlphaVantageError) {
    throw new MarketError(error.code, error.message)
  }
  throw error
}

export class AlphaVantageMarketAdapter implements IMarketRepository {
  async getQuote(symbol: string): Promise<Quote> {
    try {
      const raw = await fetchQuote(symbol)
      return mapQuote(raw)
    } catch (error) {
      toMarketError(error)
    }
  }

  async getIndices(): Promise<MarketIndex[]> {
    try {
      const raws = await fetchIndices()
      return raws.map(mapIndex)
    } catch (error) {
      toMarketError(error)
    }
  }

  async getCompanyProfile(symbol: string): Promise<CompanyProfile> {
    try {
      const raw = await fetchCompanyProfile(symbol)
      return mapCompany(raw)
    } catch (error) {
      toMarketError(error)
    }
  }

  async getVolatility(symbol: string): Promise<VolatilityData> {
    try {
      const raw = await fetchVolatility(symbol)
      return mapVolatility(raw)
    } catch (error) {
      toMarketError(error)
    }
  }

  async searchSymbols(_query: string): Promise<SymbolSearchResult[]> {
    throw new MarketError('UPSTREAM_ERROR', 'Symbol search not supported by this provider')
  }
}

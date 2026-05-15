import type { IMarketRepository } from '../domain/ports/IMarketRepository'
import type { SymbolSearchResult } from '../domain/entities/SymbolSearchResult'
import { MarketError } from '../domain/errors/MarketError'

const MIN_QUERY_LENGTH = 3

export class SearchSymbols {
  constructor(private readonly repository: IMarketRepository) {}

  async execute(query: string): Promise<SymbolSearchResult[]> {
    const normalized = query.trim().toUpperCase()

    if (normalized.length < MIN_QUERY_LENGTH) {
      throw new MarketError(
        'UPSTREAM_ERROR',
        `Query must be at least ${MIN_QUERY_LENGTH} characters`,
      )
    }

    const results = await this.repository.searchSymbols(normalized)

    return results.filter((r) => r.type === 'Common Stock')
  }
}

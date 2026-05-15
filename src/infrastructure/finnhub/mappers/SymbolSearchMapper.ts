import type { SymbolSearchResult } from '@/core/domain/entities/SymbolSearchResult'
import type { RawFinnhubSymbolSearchResponse } from '../FinnhubClient'

export function mapSymbolSearchResults(raw: RawFinnhubSymbolSearchResponse): SymbolSearchResult[] {
  const items = raw.result ?? []

  return items.flatMap((item) => {
    if (!item.symbol || !item.description) return []

    const result: SymbolSearchResult = {
      symbol: item.symbol,
      description: item.description,
      type: item.type ?? '',
    }

    return [result]
  })
}

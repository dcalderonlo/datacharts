import type { StateCreator } from 'zustand'
import type { Quote } from '@/core/domain/entities/Quote'
import type { MarketIndex } from '@/core/domain/entities/MarketIndex'
import type { SymbolSearchResult } from '@/core/domain/entities/SymbolSearchResult'

export interface MarketSlice {
  quotes: Record<string, Quote>
  indices: MarketIndex[]
  isLoadingQuote: boolean
  isLoadingIndices: boolean
  error: string | null
  searchResults: SymbolSearchResult[]
  isLoadingSearch: boolean
  searchError: string | null
  searchCache: Map<string, SymbolSearchResult[]>
  searchAbortController: AbortController | null
  fetchQuote: (symbol: string) => Promise<void>
  fetchIndices: () => Promise<void>
  searchSymbols: (query: string) => Promise<void>
  clearSearchResults: () => void
}

export const createMarketSlice: StateCreator<MarketSlice> = (set, get) => ({
  quotes: {},
  indices: [],
  isLoadingQuote: false,
  isLoadingIndices: false,
  error: null,
  searchResults: [],
  isLoadingSearch: false,
  searchError: null,
  searchCache: new Map(),
  searchAbortController: null,
  fetchQuote: async (symbol) => {
    set({ isLoadingQuote: true, error: null })
    try {
      const res = await fetch(`/api/market/quotes?symbol=${symbol}`)
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      set((state) => ({ quotes: { ...state.quotes, [symbol]: json.data }, isLoadingQuote: false }))
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Unknown error', isLoadingQuote: false })
    }
  },
  fetchIndices: async () => {
    set({ isLoadingIndices: true, error: null })
    try {
      const res = await fetch('/api/market/indices')
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      set({ indices: json.data, isLoadingIndices: false })
    } catch (e) {
      set({ error: e instanceof Error ? e.message : 'Unknown error', isLoadingIndices: false })
    }
  },
  searchSymbols: async (query) => {
    const normalizedQuery = query.trim().toUpperCase()
    const { searchAbortController, searchCache } = get()
    // Abort previous request
    if (searchAbortController) {
      searchAbortController.abort()
    }
    // Check cache
    const cached = searchCache.get(normalizedQuery)
    if (cached) {
      set({ searchResults: cached, searchError: null, isLoadingSearch: false, searchAbortController: null })
      return
    }
    const controller = new AbortController()
    set({ isLoadingSearch: true, searchError: null, searchAbortController: controller })
    try {
      const res = await fetch(`/api/market/search?q=${encodeURIComponent(normalizedQuery)}`, {
        signal: controller.signal,
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error)
      const results: SymbolSearchResult[] = json.data
      // Update cache with FIFO eviction (max 20; hits do not refresh recency)
      const cache = get().searchCache
      if (cache.size >= 20) {
        const firstKey = cache.keys().next().value
        if (firstKey !== undefined) cache.delete(firstKey)
      }
      cache.set(normalizedQuery, results)
      set({ searchResults: results, isLoadingSearch: false, searchAbortController: null })
    } catch (e) {
      if (e instanceof DOMException && e.name === 'AbortError') return
      set({
        searchError: e instanceof Error ? e.message : 'Unknown error',
        isLoadingSearch: false,
        searchAbortController: null,
      })
    }
  },
  clearSearchResults: () => {
    const { searchAbortController } = get()
    if (searchAbortController) {
      searchAbortController.abort()
    }
    set({ searchResults: [], searchError: null, isLoadingSearch: false, searchAbortController: null })
  },
})

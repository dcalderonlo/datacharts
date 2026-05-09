import type { StateCreator } from 'zustand'
import type { Quote } from '@/core/domain/entities/Quote'
import type { MarketIndex } from '@/core/domain/entities/MarketIndex'

export interface MarketSlice {
  quotes: Record<string, Quote>
  indices: MarketIndex[]
  isLoadingQuote: boolean
  isLoadingIndices: boolean
  error: string | null
  fetchQuote: (symbol: string) => Promise<void>
  fetchIndices: () => Promise<void>
}

export const createMarketSlice: StateCreator<MarketSlice> = (set) => ({
  quotes: {},
  indices: [],
  isLoadingQuote: false,
  isLoadingIndices: false,
  error: null,
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
})

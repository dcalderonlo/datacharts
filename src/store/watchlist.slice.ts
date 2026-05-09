import type { StateCreator } from 'zustand'

export interface WatchlistItem {
  id: string
  symbol: string
  addedAt: string
}

export interface WatchlistSlice {
  watchlist: WatchlistItem[]
  isLoadingWatchlist: boolean
  fetchWatchlist: () => Promise<void>
  addToWatchlist: (symbol: string) => Promise<void>
  removeFromWatchlist: (symbol: string) => Promise<void>
}

export const createWatchlistSlice: StateCreator<WatchlistSlice> = (set) => ({
  watchlist: [],
  isLoadingWatchlist: false,
  fetchWatchlist: async () => {
    set({ isLoadingWatchlist: true })
    const res = await fetch('/api/watchlist')
    const json = await res.json()
    set({ watchlist: json.data ?? [], isLoadingWatchlist: false })
  },
  addToWatchlist: async (symbol) => {
    await fetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({ symbol }),
      headers: { 'Content-Type': 'application/json' },
    })
    set((state) => ({
      watchlist: [...state.watchlist, { id: '', symbol, addedAt: new Date().toISOString() }],
    }))
  },
  removeFromWatchlist: async (symbol) => {
    await fetch(`/api/watchlist?symbol=${symbol}`, { method: 'DELETE' })
    set((state) => ({
      watchlist: state.watchlist.filter((w) => w.symbol !== symbol),
    }))
  },
})

'use client'
import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '@/ui/providers/StoreProvider'
import { Card } from '@/ui/atoms/Card'
import { Spinner } from '@/ui/atoms/Spinner'

export function WatchlistPanel() {
  const watchlist = useAppStore((s) => s.watchlist)
  const isLoading = useAppStore((s) => s.isLoadingWatchlist)
  const fetchWatchlist = useAppStore((s) => s.fetchWatchlist)
  const addToWatchlist = useAppStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useAppStore((s) => s.removeFromWatchlist)

  const [input, setInput] = useState('')
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const symbol = input.trim().toUpperCase()
    if (!symbol) return
    setAdding(true)
    setError('')
    try {
      await addToWatchlist(symbol)
      setInput('')
    } catch {
      setError('Could not add symbol.')
    } finally {
      setAdding(false)
    }
  }

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white uppercase tracking-wide">Watchlist</h3>
        {isLoading && <Spinner size="sm" />}
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add symbol (e.g. AAPL)"
          className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={adding || !input.trim()}
          className="px-3 py-1.5 text-sm rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white transition-colors"
        >
          {adding ? '...' : 'Add'}
        </button>
      </form>
      {error && <p className="text-xs text-red-400">{error}</p>}

      {/* List */}
      <ul className="flex flex-col gap-1 min-h-[40px]">
        <AnimatePresence initial={false}>
          {watchlist.length === 0 && !isLoading && (
            <p className="text-xs text-gray-500 text-center py-4">No symbols yet.</p>
          )}
          {watchlist.map((item) => (
            <motion.li
              key={item.symbol}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800/60 hover:bg-gray-800 transition-colors"
            >
              <span className="text-sm font-mono font-semibold text-white">{item.symbol}</span>
              <button
                onClick={() => removeFromWatchlist(item.symbol)}
                className="text-xs text-gray-500 hover:text-red-400 transition-colors ml-2"
                aria-label={`Remove ${item.symbol}`}
              >
                ✕
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </Card>
  )
}

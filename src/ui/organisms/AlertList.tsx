'use client'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Spinner } from '@/ui/atoms/Spinner'

interface PriceAlert {
  id: string
  symbol: string
  targetPrice: number
  condition: 'above' | 'below'
  triggered: boolean
  triggeredAt: string | null
  createdAt: string
}

interface AlertListProps {
  refreshKey: number
}

export function AlertList({ refreshKey }: AlertListProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAlerts = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/alerts')
      const json = await res.json()
      setAlerts(json.data ?? [])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetchAlerts is async; setState calls happen in async callbacks, not synchronously in the effect body
    fetchAlerts()
  }, [fetchAlerts, refreshKey])

  async function handleDelete(id: string) {
    await fetch(`/api/alerts/${id}`, { method: 'DELETE' })
    setAlerts((prev) => prev.filter((a) => a.id !== id))
  }

  if (loading) {
    return <div className="flex justify-center py-8"><Spinner size="lg" /></div>
  }

  if (alerts.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 text-sm">
        No price alerts yet. Create one above.
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-3">
      <AnimatePresence initial={false}>
        {alerts.map((alert) => (
          <motion.li
            key={alert.id}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.2 }}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
              alert.triggered
                ? 'bg-green-950/40 border-green-800/40'
                : 'bg-gray-900 border-gray-800'
            }`}
          >
            <div className="flex items-center gap-4">
              <span className="font-mono font-semibold text-white">{alert.symbol}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                alert.condition === 'above'
                  ? 'bg-green-900/60 text-green-400'
                  : 'bg-red-900/60 text-red-400'
              }`}>
                {alert.condition}
              </span>
              <span className="text-sm text-gray-300 font-mono">
                ${alert.targetPrice.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              {alert.triggered ? (
                <span className="text-xs text-green-400 font-medium">✓ Triggered</span>
              ) : (
                <span className="text-xs text-gray-500">Pending</span>
              )}
              {!alert.triggered && (
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="text-xs text-gray-600 hover:text-red-400 transition-colors"
                  aria-label="Delete alert"
                >
                  ✕
                </button>
              )}
            </div>
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  )
}

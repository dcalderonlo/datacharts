'use client'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/ui/providers/StoreProvider'
import { TrendArrow } from '@/ui/atoms/TrendArrow'
import { StatNumber } from '@/ui/atoms/StatNumber'
import { Spinner } from '@/ui/atoms/Spinner'
import { AlertBanner } from '@/ui/molecules/AlertBanner'

export function IndexTable() {
  const fetchIndices = useAppStore((s) => s.fetchIndices)
  const indices = useAppStore((s) => s.indices)
  const isLoadingIndices = useAppStore((s) => s.isLoadingIndices)
  const error = useAppStore((s) => s.error)

  useEffect(() => { fetchIndices() }, [fetchIndices])

  if (isLoadingIndices) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error) return <AlertBanner message={error} type="error" />

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-gray-400 text-left">
            <th className="px-4 py-3 font-medium">Index</th>
            <th className="px-4 py-3 font-medium">Region</th>
            <th className="px-4 py-3 font-medium text-right">Value</th>
            <th className="px-4 py-3 font-medium text-right">Change</th>
            <th className="px-4 py-3 font-medium text-right">Change %</th>
          </tr>
        </thead>
        <tbody>
          {indices.map((index, i) => (
            <motion.tr
              key={index.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.25 }}
              className="border-t border-gray-800 hover:bg-gray-800/50 transition-colors"
            >
              <td className="px-4 py-3 text-gray-100 font-medium">{index.name}</td>
              <td className="px-4 py-3 text-gray-400">{index.region}</td>
              <td className="px-4 py-3 text-right">
                <StatNumber value={index.value} format="number" className="text-gray-100" />
              </td>
              <td className="px-4 py-3 text-right">
                <span className="flex items-center justify-end gap-1.5">
                  <TrendArrow value={index.change} />
                  <StatNumber value={Math.abs(index.change)} format="number"
                    className={index.change >= 0 ? 'text-green-400' : 'text-red-400'} />
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                <span className={`font-medium ${index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {index.changePercent >= 0 ? '+' : ''}{index.changePercent.toFixed(2)}%
                </span>
              </td>
            </motion.tr>
          ))}
          {!indices.length && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-gray-500">No market index data available.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

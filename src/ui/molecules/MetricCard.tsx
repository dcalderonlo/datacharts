'use client'
import { motion } from 'framer-motion'
import { Card } from '@/ui/atoms/Card'
import { StatNumber } from '@/ui/atoms/StatNumber'
import { TrendArrow } from '@/ui/atoms/TrendArrow'
import { Badge } from '@/ui/atoms/Badge'
import { Spinner } from '@/ui/atoms/Spinner'

type Format = 'currency' | 'percent' | 'number' | 'volume'

interface MetricCardProps {
  title: string
  value: number
  change: number
  changePercent: number
  format?: Format
  isLoading?: boolean
}

export function MetricCard({
  title,
  value,
  change,
  changePercent,
  format = 'currency',
  isLoading = false,
}: MetricCardProps) {
  const isPositive = change >= 0
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="flex flex-col gap-3 min-w-[180px]">
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        {isLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spinner size="md" />
          </div>
        ) : (
          <>
            <StatNumber value={value} format={format} className="text-2xl text-gray-100" />
            <div className="flex items-center gap-2">
              <TrendArrow value={change} />
              <StatNumber value={Math.abs(change)} format="number" className="text-sm text-gray-300" />
              <Badge variant={isPositive ? 'success' : 'danger'}>
                {isPositive ? '+' : ''}{changePercent.toFixed(2)}%
              </Badge>
            </div>
          </>
        )}
      </Card>
    </motion.div>
  )
}

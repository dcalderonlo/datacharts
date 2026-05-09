'use client'
import { motion } from 'framer-motion'

interface TrendArrowProps {
  value: number
  className?: string
}

export function TrendArrow({ value, className = '' }: TrendArrowProps) {
  const isPositive = value >= 0
  return (
    <motion.span
      initial={{ opacity: 0, y: isPositive ? 4 : -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`
        inline-flex items-center font-medium text-sm
        ${isPositive ? 'text-green-400' : 'text-red-400'}
        ${className}
      `}
    >
      {isPositive ? '▲' : '▼'}
    </motion.span>
  )
}

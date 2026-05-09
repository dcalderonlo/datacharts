'use client'
import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

type AlertType = 'error' | 'warning' | 'info'

const typeClasses: Record<AlertType, string> = {
  error: 'bg-red-900/50 border-red-700 text-red-300',
  warning: 'bg-yellow-900/50 border-yellow-700 text-yellow-300',
  info: 'bg-blue-900/50 border-blue-700 text-blue-300',
}

const icons: Record<AlertType, string> = {
  error: '✕',
  warning: '⚠',
  info: 'ℹ',
}

interface AlertBannerProps {
  message: string
  type?: AlertType
}

export function AlertBanner({ message, type = 'info' }: AlertBannerProps) {
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${typeClasses[type]}`}
        >
          <span className="text-base leading-none mt-0.5">{icons[type]}</span>
          <p className="flex-1 text-sm">{message}</p>
          <button
            onClick={() => setVisible(false)}
            className="text-current opacity-60 hover:opacity-100 transition-opacity ml-auto"
            aria-label="Dismiss"
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

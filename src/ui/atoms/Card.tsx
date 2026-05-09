import type { ReactNode } from 'react'

type PaddingVariant = 'sm' | 'md' | 'lg' | 'none'

const paddingClasses: Record<PaddingVariant, string> = {
  none: '',
  sm: 'p-3',
  md: 'p-5',
  lg: 'p-8',
}

interface CardProps {
  children: ReactNode
  padding?: PaddingVariant
  className?: string
}

export function Card({ children, padding = 'md', className = '' }: CardProps) {
  return (
    <div
      className={`
        rounded-xl bg-gray-900 border border-gray-800
        ${paddingClasses[padding]} ${className}
      `}
    >
      {children}
    </div>
  )
}

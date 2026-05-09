type BadgeVariant = 'success' | 'warning' | 'danger' | 'neutral' | 'info'

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-green-900/50 text-green-400 border border-green-700',
  warning: 'bg-yellow-900/50 text-yellow-400 border border-yellow-700',
  danger: 'bg-red-900/50 text-red-400 border border-red-700',
  neutral: 'bg-gray-800 text-gray-400 border border-gray-700',
  info: 'bg-blue-900/50 text-blue-400 border border-blue-700',
}

interface BadgeProps {
  variant?: BadgeVariant
  children: React.ReactNode
  className?: string
}

export function Badge({ variant = 'neutral', children, className = '' }: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        ${variantClasses[variant]} ${className}
      `}
    >
      {children}
    </span>
  )
}

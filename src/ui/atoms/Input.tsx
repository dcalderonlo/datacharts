import type { InputHTMLAttributes } from 'react'

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  label?: string
  error?: string
  onChange?: (value: string) => void
}

export function Input({ label, error, onChange, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-300">{label}</label>
      )}
      <input
        className={`
          w-full rounded-lg bg-gray-800 border px-3 py-2 text-gray-100 placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors
          ${error ? 'border-red-500' : 'border-gray-700'}
          ${className}
        `}
        onChange={(e) => onChange?.(e.target.value)}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
}

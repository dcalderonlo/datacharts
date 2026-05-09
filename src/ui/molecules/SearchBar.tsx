'use client'
import { useRef, useEffect } from 'react'
import { Input } from '@/ui/atoms/Input'
import { Spinner } from '@/ui/atoms/Spinner'

interface SearchBarProps {
  onSearch: (symbol: string) => void
  placeholder?: string
  isLoading?: boolean
}

export function SearchBar({ onSearch, placeholder = 'Search symbol…', isLoading = false }: SearchBarProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(value: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      const trimmed = value.trim().toUpperCase()
      if (trimmed) onSearch(trimmed)
    }, 500)
  }

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current) }, [])

  return (
    <div className="relative flex items-center">
      <span className="absolute left-3 text-gray-500 pointer-events-none">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
        </svg>
      </span>
      <Input
        placeholder={placeholder}
        onChange={handleChange}
        className="pl-9 pr-9"
      />
      {isLoading && (
        <span className="absolute right-3 text-gray-400">
          <Spinner size="sm" />
        </span>
      )}
    </div>
  )
}

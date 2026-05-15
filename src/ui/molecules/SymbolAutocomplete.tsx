'use client'
import { useRef, useEffect, useState, useCallback, type KeyboardEvent } from 'react'
import { useAppStore } from '@/ui/providers/StoreProvider'
import { Spinner } from '@/ui/atoms/Spinner'

interface SymbolAutocompleteProps {
  onSelect: (symbol: string) => void
  placeholder?: string
  isLoading?: boolean
}

export function SymbolAutocomplete({
  onSelect,
  placeholder = 'Search symbol…',
  isLoading = false,
}: SymbolAutocompleteProps) {
  const searchSymbols = useAppStore((s) => s.searchSymbols)
  const clearSearchResults = useAppStore((s) => s.clearSearchResults)
  const searchResults = useAppStore((s) => s.searchResults)
  const isLoadingSearch = useAppStore((s) => s.isLoadingSearch)
  const searchError = useAppStore((s) => s.searchError)

  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value)
      setActiveIndex(-1)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => {
        const trimmed = value.trim().toUpperCase()
        if (trimmed.length >= 3) {
          searchSymbols(trimmed)
          setIsOpen(true)
        } else {
          clearSearchResults()
          setIsOpen(false)
        }
      }, 400)
    },
    [searchSymbols, clearSearchResults],
  )

  function handleSelect(symbol: string) {
    if (timerRef.current) clearTimeout(timerRef.current)
    onSelect(symbol)
    clearSearchResults()
    setInputValue('')
    setIsOpen(false)
    setActiveIndex(-1)
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (timerRef.current) clearTimeout(timerRef.current)
      if (isOpen && activeIndex >= 0 && searchResults[activeIndex]) {
        handleSelect(searchResults[activeIndex].symbol)
      } else {
        const trimmed = inputValue.trim().toUpperCase()
        if (trimmed.length > 0) {
          onSelect(trimmed)
          clearSearchResults()
          setInputValue('')
          setIsOpen(false)
          setActiveIndex(-1)
        }
      }
      return
    }
    if (!isOpen) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => searchResults.length === 0 ? -1 : Math.min(i + 1, searchResults.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => searchResults.length === 0 ? -1 : Math.max(i - 1, 0))
    } else if (e.key === 'Escape') {
      setIsOpen(false)
      setActiveIndex(-1)
    }
  }

  // Outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      clearSearchResults()
    }
  }, [clearSearchResults])

  const showDropdown =
    isOpen && inputValue.trim().length >= 3

  return (
    <div ref={containerRef} className="relative">
      <div className="relative flex items-center">
        <span className="absolute left-3 text-gray-500 pointer-events-none">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </span>
        <input
          value={inputValue}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (inputValue.trim().length >= 3) setIsOpen(true) }}
          placeholder={placeholder}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 pl-9 pr-9 py-2 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        />
        {(isLoadingSearch || isLoading) && (
          <span className="absolute right-3 text-gray-400">
            <Spinner size="sm" />
          </span>
        )}
      </div>

      {showDropdown && (
        <div className="absolute z-50 mt-1 w-full rounded-lg bg-gray-900 border border-gray-700 shadow-xl overflow-hidden">
          {isLoadingSearch && (
            <div className="px-4 py-3 text-gray-400 text-sm flex items-center gap-2">
              <Spinner size="sm" /> Searching…
            </div>
          )}

          {searchError && !isLoadingSearch && (
            <div className="px-4 py-3 text-red-400 text-sm">{searchError}</div>
          )}

          {!isLoadingSearch && !searchError && searchResults.length === 0 && (
            <div className="px-4 py-3 text-gray-500 text-sm">No results found</div>
          )}

          {!isLoadingSearch && !searchError && searchResults.length > 0 && (
            <ul role="listbox">
              {searchResults.map((result, idx) => (
                <li
                  key={result.symbol}
                  role="option"
                  aria-selected={idx === activeIndex}
                  className={`px-4 py-3 cursor-pointer flex flex-col gap-0.5 transition-colors ${
                    idx === activeIndex ? 'bg-gray-700' : 'hover:bg-gray-800'
                  }`}
                  onMouseDown={() => handleSelect(result.symbol)}
                  onMouseEnter={() => setActiveIndex(idx)}
                >
                  <span className="font-bold text-gray-100 text-sm">{result.symbol}</span>
                  <span className="text-gray-400 text-xs truncate">{result.description}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

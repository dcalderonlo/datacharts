'use client'
import { useState, useEffect } from 'react'
import { SymbolAutocomplete } from '@/ui/molecules/SymbolAutocomplete'
import { AlertBanner } from '@/ui/molecules/AlertBanner'

const MAX_ANON_SEARCHES = 3
const COOKIE_COUNT = 'anon_search_count'
const COOKIE_DATE = 'anon_search_date'

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'))
  return match?.[1] != null ? decodeURIComponent(match[1]) : null
}

function writeCookie(name: string, value: string) {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=86400`
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

interface QuoteResult {
  symbol: string
  price: number
  change: number
  changePercent: number
}

export function LandingSearch() {
  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<QuoteResult | null>(null)
  const [fetchError, setFetchError] = useState<string | null>(null)

  useEffect(() => {
    const date = readCookie(COOKIE_DATE)
    if (date !== todayStr()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time DOM-read init from cookie; no external subscription involved
      setCount(0)
    } else {
      setCount(Number(readCookie(COOKIE_COUNT) ?? '0'))
    }
  }, [])

  async function handleSearch(symbol: string) {
    if (count >= MAX_ANON_SEARCHES) return
    setLoading(true)
    setFetchError(null)
    setResult(null)

    const res = await fetch(`/api/market/quotes?symbol=${symbol}`)
    setLoading(false)

    if (res.status === 429) {
      setFetchError('Search limit reached. Create a free account for unlimited searches.')
      return
    }
    if (!res.ok) {
      setFetchError('Could not fetch quote. Try again.')
      return
    }

    const json = await res.json()
    setResult(json.data as QuoteResult)

    // Update cookie count
    const newCount = count + 1
    setCount(newCount)
    writeCookie(COOKIE_COUNT, String(newCount))
    writeCookie(COOKIE_DATE, todayStr())
  }

  const limitReached = count >= MAX_ANON_SEARCHES

  return (
    <div className="max-w-md mx-auto space-y-3">
      <SymbolAutocomplete onSelect={handleSearch} isLoading={loading} placeholder="Search a symbol (e.g. AAPL)…" />

      {!limitReached && count > 0 && (
        <p className="text-xs text-gray-500 text-center">{count} of {MAX_ANON_SEARCHES} free searches used</p>
      )}

      {limitReached && (
        <AlertBanner
          message="Create a free account for unlimited searches."
          type="warning"
        />
      )}

      {fetchError && !limitReached && (
        <AlertBanner message={fetchError} type="error" />
      )}

      {result && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-left">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{result.symbol}</p>
          <p className="text-2xl font-bold text-white">${result.price.toFixed(2)}</p>
          <p className={`text-sm mt-1 font-medium ${result.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {result.change >= 0 ? '+' : ''}{result.change.toFixed(2)} ({result.changePercent.toFixed(2)}%)
          </p>
        </div>
      )}
    </div>
  )
}

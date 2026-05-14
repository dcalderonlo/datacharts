import { NextResponse } from 'next/server'
import { MarketError } from '@/core/domain/errors/MarketError'

export function handleApiError(error: unknown): NextResponse {
  if (error instanceof MarketError) {
    if (error.code === 'RATE_LIMIT') {
      return NextResponse.json({ error: error.message, code: 'RATE_LIMIT', retryAfter: 60 }, { status: 429 })
    }
    if (error.code === 'NOT_FOUND') {
      return NextResponse.json({ error: error.message, code: 'NOT_FOUND' }, { status: 404 })
    }
  }
  return NextResponse.json({ error: 'Internal server error', code: 'UPSTREAM_ERROR' }, { status: 500 })
}

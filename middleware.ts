import NextAuth from 'next-auth'
import type { NextAuthRequest } from 'next-auth'
import { authConfig } from './src/auth.config'
import { NextResponse, type NextRequest } from 'next/server'

const { auth } = NextAuth(authConfig)

const PROTECTED_PREFIXES = ['/overview', '/analytics', '/reports', '/alerts']

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function parseCookieInt(req: NextRequest, name: string): number {
  const raw = req.cookies.get(name)?.value
  const n = parseInt(raw ?? '0', 10)
  return isNaN(n) ? 0 : n
}

export default auth((req: NextAuthRequest) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth

  // Protect dashboard routes — redirect unauthenticated users to /login
  const isProtected = PROTECTED_PREFIXES.some((p: string) => pathname.startsWith(p))
  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    const callbackUrl = `${pathname}${req.nextUrl.search}`
    loginUrl.searchParams.set('callbackUrl', callbackUrl)
    return NextResponse.redirect(loginUrl)
  }

  // Anonymous search rate limiting on GET /api/market/quotes
  if (pathname === '/api/market/quotes' && req.method === 'GET' && !isLoggedIn) {
    const today = todayStr()
    const cookieDate = req.cookies.get('anon_search_date')?.value ?? ''
    const searchCount = cookieDate === today ? parseCookieInt(req, 'anon_search_count') : 0

    if (searchCount >= 3) {
      return NextResponse.json(
        { error: 'Search limit reached', code: 'ANON_LIMIT' },
        { status: 429 }
      )
    }

    const res = NextResponse.next()
    const newCount = searchCount + 1
    res.cookies.set('anon_search_count', String(newCount), { httpOnly: true, path: '/', maxAge: 86400 })
    res.cookies.set('anon_search_date', today, { httpOnly: true, path: '/', maxAge: 86400 })
    return res
  }
})

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

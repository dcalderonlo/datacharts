import { jwtVerify } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/overview', '/analytics', '/reports', '/alerts']

const SESSION_COOKIE =
  process.env.NODE_ENV === 'production'
    ? '__Secure-authjs.session-token'
    : 'authjs.session-token'

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return new TextEncoder().encode(secret)
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get(SESSION_COOKIE)?.value
  if (!token) return false
  try {
    await jwtVerify(token, getSecret())
    return true
  } catch {
    return false
  }
}

function todayStr() {
  return new Date().toISOString().slice(0, 10)
}

function parseCookieInt(req: NextRequest, name: string): number {
  const raw = req.cookies.get(name)?.value
  const n = parseInt(raw ?? '0', 10)
  return isNaN(n) ? 0 : n
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Protect dashboard routes — redirect unauthenticated users to /login
  const isProtected = PROTECTED_PREFIXES.some((p) => pathname.startsWith(p))
  if (isProtected) {
    const loggedIn = await isAuthenticated(req)
    if (!loggedIn) {
      const loginUrl = new URL('/login', req.nextUrl.origin)
      const callbackUrl = `${pathname}${req.nextUrl.search}`
      loginUrl.searchParams.set('callbackUrl', callbackUrl)
      return NextResponse.redirect(loginUrl)
    }
  }

  // Anonymous search rate limiting on GET /api/market/quotes
  if (pathname === '/api/market/quotes' && req.method === 'GET') {
    const loggedIn = await isAuthenticated(req)
    if (!loggedIn) {
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
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

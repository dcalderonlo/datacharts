import { hkdf } from '@panva/hkdf'
import { jwtDecrypt } from 'jose'
import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PREFIXES = ['/overview', '/analytics', '/reports', '/alerts']

// Auth.js derives the encryption key using HKDF with the cookie name as salt.
// We must replicate the same derivation to decrypt the JWE token.
async function getDerivedEncryptionKey(secret: string, salt: string): Promise<Uint8Array> {
  return hkdf(
    'sha256',
    secret,
    salt,
    `Auth.js Generated Encryption Key (${salt})`,
    64
  )
}

// Auth.js uses __Secure- prefix when the request URL is https (not based on NODE_ENV).
function getSessionCookieName(req: NextRequest): string {
  const isSecure = req.nextUrl.protocol === 'https:'
  return isSecure ? '__Secure-authjs.session-token' : 'authjs.session-token'
}

async function isAuthenticated(req: NextRequest): Promise<boolean> {
  const secret = process.env.AUTH_SECRET
  if (!secret) return false

  const cookieName = getSessionCookieName(req)

  // Auth.js may chunk large tokens as cookieName.0, cookieName.1, etc.
  const chunks: string[] = []
  let i = 0
  while (true) {
    const chunk = req.cookies.get(`${cookieName}.${i}`)?.value
    if (!chunk) break
    chunks.push(chunk)
    i++
  }
  const token = chunks.length > 0 ? chunks.join('') : req.cookies.get(cookieName)?.value

  if (!token) return false

  try {
    const encryptionKey = await getDerivedEncryptionKey(secret, cookieName)
    await jwtDecrypt(token, encryptionKey, {
      clockTolerance: 15,
      keyManagementAlgorithms: ['dir'],
      contentEncryptionAlgorithms: ['A256CBC-HS512', 'A256GCM'],
    })
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
  const isSecure = req.nextUrl.protocol === 'https:'

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

      const cookieOpts = {
        httpOnly: true,
        secure: isSecure,
        sameSite: 'lax' as const,
        path: '/',
        maxAge: 86400,
      }
      const res = NextResponse.next()
      const newCount = searchCount + 1
      res.cookies.set('anon_search_count', String(newCount), cookieOpts)
      res.cookies.set('anon_search_date', today, cookieOpts)
      return res
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

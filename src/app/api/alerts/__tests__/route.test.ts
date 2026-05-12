import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'

const mockSession = { user: { id: 'user-1', email: 'test@test.com' } }

vi.mock('@/auth', () => ({ auth: vi.fn() }))
vi.mock('@/infrastructure/db/prisma', () => ({
  prisma: {
    priceAlert: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}))

describe('GET /api/alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(null as never)

    const { GET } = await import('../route')
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns alerts for authenticated user', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(mockSession as never)

    const { prisma } = await import('@/infrastructure/db/prisma')
    vi.mocked(prisma.priceAlert.findMany).mockResolvedValue([
      {
        id: 'alert-1',
        userId: 'user-1',
        symbol: 'AAPL',
        targetPrice: 160,
        condition: 'above',
        triggered: false,
        triggeredAt: null,
        createdAt: new Date(),
      },
    ] as never)

    const { GET } = await import('../route')
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].symbol).toBe('AAPL')
  })
})

describe('POST /api/alerts', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(null as never)

    const { POST } = await import('../route')
    const req = new NextRequest('http://localhost/api/alerts', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AAPL', targetPrice: 160, condition: 'above' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(401)
  })

  it('returns 400 when required fields are missing', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(mockSession as never)

    const { POST } = await import('../route')
    const req = new NextRequest('http://localhost/api/alerts', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AAPL' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('returns 400 for invalid condition', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(mockSession as never)

    const { POST } = await import('../route')
    const req = new NextRequest('http://localhost/api/alerts', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AAPL', targetPrice: 160, condition: 'invalid' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(400)
  })

  it('creates alert for authenticated user with valid data', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(mockSession as never)

    const { prisma } = await import('@/infrastructure/db/prisma')
    vi.mocked(prisma.priceAlert.create).mockResolvedValue({
      id: 'alert-new',
      userId: 'user-1',
      symbol: 'AAPL',
      targetPrice: 160,
      condition: 'above',
      triggered: false,
      triggeredAt: null,
      createdAt: new Date(),
    } as never)

    const { POST } = await import('../route')
    const req = new NextRequest('http://localhost/api/alerts', {
      method: 'POST',
      body: JSON.stringify({ symbol: 'AAPL', targetPrice: 160, condition: 'above' }),
    })
    const res = await POST(req)
    expect(res.status).toBe(201)
    const body = await res.json()
    expect(body.data.id).toBe('alert-new')
  })
})

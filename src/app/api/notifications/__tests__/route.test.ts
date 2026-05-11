import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockSession = { user: { id: 'user-1', email: 'test@test.com' } }

vi.mock('@/auth', () => ({ auth: vi.fn() }))
vi.mock('@/infrastructure/db/prisma', () => ({
  prisma: {
    notification: {
      findMany: vi.fn(),
    },
  },
}))

describe('GET /api/notifications', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when unauthenticated', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(null)

    const { GET } = await import('../route')
    const res = await GET()
    expect(res.status).toBe(401)
  })

  it('returns notifications for authenticated user', async () => {
    const { auth } = await import('@/auth')
    vi.mocked(auth).mockResolvedValue(mockSession as never)

    const { prisma } = await import('@/infrastructure/db/prisma')
    vi.mocked(prisma.notification.findMany).mockResolvedValue([
      {
        id: 'notif-1',
        userId: 'user-1',
        title: 'Alert triggered',
        body: 'AAPL crossed $160',
        read: false,
        createdAt: new Date(),
      },
    ] as never)

    const { GET } = await import('../route')
    const res = await GET()
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.data).toHaveLength(1)
    expect(body.data[0].title).toBe('Alert triggered')
  })
})

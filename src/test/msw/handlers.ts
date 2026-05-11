import { http, HttpResponse } from 'msw'

export const handlers = [
  http.get('/api/market/quotes', ({ request }) => {
    const url = new URL(request.url)
    const symbol = url.searchParams.get('symbol') ?? 'AAPL'
    return HttpResponse.json({
      data: {
        symbol,
        price: 152.0,
        change: 4.0,
        changePercent: 2.7,
      },
    })
  }),

  http.get('/api/alerts', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'alert-1',
          symbol: 'AAPL',
          targetPrice: 160,
          condition: 'above',
          triggered: false,
          triggeredAt: null,
          createdAt: '2024-01-15T00:00:00Z',
        },
      ],
    })
  }),

  http.post('/api/alerts', () => {
    return HttpResponse.json({ data: { id: 'alert-new' } }, { status: 201 })
  }),

  http.delete('/api/alerts/:id', () => {
    return HttpResponse.json({ success: true })
  }),

  http.get('/api/notifications', () => {
    return HttpResponse.json({
      data: [
        {
          id: 'notif-1',
          title: 'Alert triggered',
          body: 'AAPL crossed $160',
          read: false,
          createdAt: '2024-01-15T00:00:00Z',
        },
      ],
    })
  }),

  http.patch('/api/notifications/:id', () => {
    return HttpResponse.json({ success: true })
  }),
]

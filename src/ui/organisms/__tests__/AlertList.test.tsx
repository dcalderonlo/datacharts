import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AlertList } from '../AlertList'

describe('AlertList', () => {
  it('shows spinner while loading', () => {
    render(<AlertList refreshKey={0} />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('renders alerts from API', async () => {
    render(<AlertList refreshKey={0} />)
    await waitFor(() => expect(screen.getByText('AAPL')).toBeInTheDocument())
    expect(screen.getByText('above')).toBeInTheDocument()
  })

  it('shows empty state when no alerts', async () => {
    const { server } = await import('@/test/msw/server')
    const { http, HttpResponse } = await import('msw')
    server.use(http.get('/api/alerts', () => HttpResponse.json({ data: [] })))
    render(<AlertList refreshKey={0} />)
    await waitFor(() => expect(screen.getByText(/no price alerts yet/i)).toBeInTheDocument())
  })
})

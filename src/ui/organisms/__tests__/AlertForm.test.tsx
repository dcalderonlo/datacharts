import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { AlertForm } from '../AlertForm'

describe('AlertForm', () => {
  it('renders all form fields', () => {
    render(<AlertForm onCreated={vi.fn()} />)
    expect(screen.getByPlaceholderText('Symbol (e.g. AAPL)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Target price')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /above/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /below/i })).toBeInTheDocument()
  })

  it('submit button is disabled when fields are empty', () => {
    render(<AlertForm onCreated={vi.fn()} />)
    expect(screen.getByRole('button', { name: /create alert/i })).toBeDisabled()
  })

  it('submit button enables when both fields are filled', async () => {
    const user = userEvent.setup()
    render(<AlertForm onCreated={vi.fn()} />)
    await user.type(screen.getByPlaceholderText('Symbol (e.g. AAPL)'), 'AAPL')
    await user.type(screen.getByPlaceholderText('Target price'), '160')
    expect(screen.getByRole('button', { name: /create alert/i })).not.toBeDisabled()
  })

  it('calls onCreated after successful submission', async () => {
    const user = userEvent.setup()
    const onCreated = vi.fn()
    render(<AlertForm onCreated={onCreated} />)
    await user.type(screen.getByPlaceholderText('Symbol (e.g. AAPL)'), 'AAPL')
    await user.type(screen.getByPlaceholderText('Target price'), '160')
    await user.click(screen.getByRole('button', { name: /create alert/i }))
    await waitFor(() => expect(onCreated).toHaveBeenCalledOnce())
  })

  it('shows error message when API call fails', async () => {
    const user = userEvent.setup()
    const { server } = await import('@/test/msw/server')
    const { http, HttpResponse } = await import('msw')
    server.use(http.post('/api/alerts', () => HttpResponse.json({}, { status: 500 })))

    render(<AlertForm onCreated={vi.fn()} />)
    await user.type(screen.getByPlaceholderText('Symbol (e.g. AAPL)'), 'AAPL')
    await user.type(screen.getByPlaceholderText('Target price'), '160')
    await user.click(screen.getByRole('button', { name: /create alert/i }))
    await waitFor(() => expect(screen.getByText('Could not create alert.')).toBeInTheDocument())
  })

  it('toggles condition between above and below', async () => {
    const user = userEvent.setup()
    render(<AlertForm onCreated={vi.fn()} />)
    const belowBtn = screen.getByRole('button', { name: /below/i })
    await user.click(belowBtn)
    expect(belowBtn).toHaveClass('bg-blue-600')
    expect(screen.getByRole('button', { name: /above/i })).not.toHaveClass('bg-blue-600')
  })
})

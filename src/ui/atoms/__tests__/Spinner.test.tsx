import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { Spinner } from '../Spinner'

describe('Spinner', () => {
  it('renders with default md size', () => {
    render(<Spinner />)
    const svg = screen.getByLabelText('Loading')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('w-6', 'h-6')
  })

  it('renders sm size', () => {
    render(<Spinner size="sm" />)
    expect(screen.getByLabelText('Loading')).toHaveClass('w-4', 'h-4')
  })

  it('renders lg size', () => {
    render(<Spinner size="lg" />)
    expect(screen.getByLabelText('Loading')).toHaveClass('w-8', 'h-8')
  })

  it('applies additional className', () => {
    render(<Spinner className="text-blue-500" />)
    expect(screen.getByLabelText('Loading')).toHaveClass('text-blue-500')
  })

  it('always has animate-spin class', () => {
    render(<Spinner />)
    expect(screen.getByLabelText('Loading')).toHaveClass('animate-spin')
  })
})

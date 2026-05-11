import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import { SearchBar } from '../SearchBar'

describe('SearchBar', () => {
  it('renders the search input', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByPlaceholderText('Search symbol…')).toBeInTheDocument()
  })

  it('renders custom placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Search a ticker…" />)
    expect(screen.getByPlaceholderText('Search a ticker…')).toBeInTheDocument()
  })

  it('shows spinner when isLoading is true', () => {
    render(<SearchBar onSearch={vi.fn()} isLoading />)
    expect(screen.getByLabelText('Loading')).toBeInTheDocument()
  })

  it('does not show spinner by default', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument()
  })

  it('calls onSearch with uppercased trimmed value after debounce', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    await user.type(screen.getByRole('textbox'), 'aapl')
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith('AAPL'), { timeout: 800 })
  })

  it('does not call onSearch for empty input', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)
    await user.type(screen.getByRole('textbox'), '   ')
    await waitFor(() => {}, { timeout: 800 })
    expect(onSearch).not.toHaveBeenCalled()
  })
})

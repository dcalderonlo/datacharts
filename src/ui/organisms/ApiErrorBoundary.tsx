'use client'
import { Component, type ReactNode } from 'react'
import { AlertBanner } from '@/ui/molecules/AlertBanner'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ApiErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <AlertBanner
          message={this.state.error?.message ?? 'An error occurred loading this data'}
          type="error"
        />
      )
    }
    return this.props.children
  }
}

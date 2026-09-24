import React, { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: {
    componentStack?: string
    [key: string]: unknown
  } | null
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null,
    }
  }

  componentDidCatch(
    error: Error,
    errorInfo: { componentStack?: string; [key: string]: unknown }
  ) {
    this.setState({
      error,
      errorInfo,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-100 border border-red-400 rounded text-red-700">
            <h2 className="text-lg font-heading-bold mb-2">
              Something went wrong
            </h2>
            <details className="text-sm">
              <summary>Error details (click to expand)</summary>
              <pre className="mt-2 overflow-auto">
                {this.state.error && this.state.error.toString()}
                <br />
                {this.state.errorInfo?.componentStack}
              </pre>
            </details>
          </div>
        )
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary

// Error Boundary HOC for React Best Practices
"use client";

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert } from '@/components/ui';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  resetOnPropsChange?: boolean;
  resetKeys?: Array<string | number>;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetKeys: Array<string | number>;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      resetKeys: props.resetKeys || [],
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
    };
  }

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> | null {
    const { resetKeys = [] } = props;
    const { resetKeys: prevResetKeys, hasError } = state;
    
    // Reset error state if reset keys have changed
    if (hasError && resetKeys.length > 0 && 
        (resetKeys.length !== prevResetKeys.length || 
         resetKeys.some((key, idx) => key !== prevResetKeys[idx]))) {
      return {
        hasError: false,
        error: null,
        errorInfo: null,
        resetKeys,
      };
    }
    
    return { resetKeys };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    });

    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="p-6">
          <Alert
            variant="error" 
            title="Something went wrong"
            description={
              process.env.NODE_ENV === 'development' 
                ? this.state.error?.message || 'An unexpected error occurred'
                : 'An unexpected error occurred. Please try refreshing the page.'
            }
          />
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={this.handleReset}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              Reload Page
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && this.state.errorInfo && (
            <details className="mt-4 p-4 bg-gray-100 rounded-md">
              <summary className="cursor-pointer font-medium text-gray-700">
                Error Details (Development Only)
              </summary>
              <pre className="mt-2 text-sm text-gray-600 overflow-auto">
                {this.state.error?.stack}
                {'\n\nComponent Stack:'}
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<Props, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
}

// Hook for throwing errors that will be caught by error boundaries
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return React.useCallback((error: Error) => {
    setError(error);
  }, []);
}
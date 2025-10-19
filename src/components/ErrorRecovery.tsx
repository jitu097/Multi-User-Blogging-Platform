// Error Recovery Components with graceful error handling
"use client";

import React, { useState, useCallback } from "react";
import { AlertTriangle, RefreshCw, Home, ArrowLeft, Bug, Copy } from "lucide-react";
import { Button, Alert } from "@/components/ui";
import { useErrorHandler, type AppError } from "@/lib/error-handling";

// Generic Error Fallback Component
interface ErrorFallbackProps {
  error: AppError;
  resetError?: () => void;
  showDetails?: boolean;
  showRetry?: boolean;
  showNavigationOptions?: boolean;
}

export const ErrorFallback: React.FC<ErrorFallbackProps> = ({
  error,
  resetError,
  showDetails = false,
  showRetry = true,
  showNavigationOptions = true,
}) => {
  const [detailsVisible, setDetailsVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyError = useCallback(async () => {
    const errorText = JSON.stringify({
      code: error.code,
      message: error.message,
      timestamp: error.timestamp,
      details: error.details,
    }, null, 2);

    try {
      await navigator.clipboard.writeText(errorText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  }, [error]);

  const handleGoHome = useCallback(() => {
    window.location.href = '/';
  }, []);

  const handleGoBack = useCallback(() => {
    window.history.back();
  }, []);

  const getSeverityColor = (severity: AppError['severity']) => {
    switch (severity) {
      case 'low':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'medium':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'high':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'critical':
        return 'text-red-800 bg-red-100 border-red-300';
      default:
  return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-[400px] flex items-center justify-center p-6">
      <div className="max-w-md w-full space-y-4">
        <div className="text-center">
          <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4 ${getSeverityColor(error.severity)}`}>
            <AlertTriangle className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Something went wrong
          </h2>
          
          <p className="text-gray-700 mb-6">
            {error.userMessage}
          </p>
        </div>

        <div className="space-y-3">
          {showRetry && resetError && (
            <Button
              onClick={resetError}
              className="w-full flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </Button>
          )}

          {showNavigationOptions && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleGoBack}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Go Back
              </Button>
              
              <Button
                variant="outline"
                onClick={handleGoHome}
                className="flex-1 flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" />
                Home
              </Button>
            </div>
          )}
        </div>

        {showDetails && (
          <div className="mt-6">
            <button
              onClick={() => setDetailsVisible(!detailsVisible)}
              className="text-sm text-gray-700 hover:text-gray-900 flex items-center gap-2"
            >
              <Bug className="w-4 h-4" />
              {detailsVisible ? 'Hide' : 'Show'} Error Details
            </button>

            {detailsVisible && (
              <div className="mt-3 p-4 bg-gray-50 rounded-lg border text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="font-medium text-gray-700">Error Code:</span>
                    <span className="ml-2 text-gray-700 font-mono">{error.code}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Timestamp:</span>
                    <span className="ml-2 text-gray-700">{error.timestamp.toLocaleString()}</span>
                  </div>
                  
                  <div>
                    <span className="font-medium text-gray-700">Severity:</span>
                    <span className={`ml-2 px-2 py-1 rounded text-xs ${getSeverityColor(error.severity)}`}>
                      {error.severity.toUpperCase()}
                    </span>
                  </div>

                  {error.details && (
                    <div>
                      <span className="font-medium text-gray-700">Details:</span>
                      <pre className="mt-1 text-xs text-gray-700 bg-white p-2 rounded border overflow-auto">
                        {JSON.stringify(error.details, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyError}
                    className="flex items-center gap-2"
                  >
                    <Copy className="w-3 h-3" />
                    {copied ? 'Copied!' : 'Copy Error Details'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Async Error Boundary for handling async operations
interface AsyncErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: AppError; retry: () => void }>;
}

export const AsyncErrorBoundary: React.FC<AsyncErrorBoundaryProps> = ({
  children,
  fallback: Fallback,
}) => {
  const [error, setError] = useState<AppError | null>(null);
  const { handleError } = useErrorHandler();

  const handleAsyncError = useCallback((error: unknown) => {
    const appError = handleError(error);
    setError(appError);
  }, [handleError]);

  const retry = useCallback(() => {
    setError(null);
  }, []);

  // Provide error handler to children through context or props
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      handleAsyncError(event.reason);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [handleAsyncError]);

  if (error) {
    if (Fallback) {
      return <Fallback error={error} retry={retry} />;
    }
    return <ErrorFallback error={error} resetError={retry} showDetails={true} />;
  }

  return <>{children}</>;
};

// Form Error Display Component
interface FormErrorDisplayProps {
  errors: Record<string, string>;
  className?: string;
}

export const FormErrorDisplay: React.FC<FormErrorDisplayProps> = ({
  errors,
  className = "",
}) => {
  const errorEntries = Object.entries(errors);

  if (errorEntries.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {errorEntries.map(([field, message]) => (
        <Alert
          key={field}
          variant="error"
          title={`${field.charAt(0).toUpperCase() + field.slice(1)} Error`}
          description={message}
        />
      ))}
    </div>
  );
};

// Retry Button Component with exponential backoff
interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
  maxRetries?: number;
  className?: string;
  children?: React.ReactNode;
}

export const RetryButton: React.FC<RetryButtonProps> = ({
  onRetry,
  maxRetries = 3,
  className = "",
  children = "Retry",
}) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleRetry = useCallback(async () => {
    if (retryCount >= maxRetries) {
      setError(`Maximum retry attempts (${maxRetries}) exceeded`);
      return;
    }

    setIsRetrying(true);
    setError(null);

    try {
      // Exponential backoff: 1s, 2s, 4s, etc.
      const delay = Math.pow(2, retryCount) * 1000;
      
      if (retryCount > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }

      await Promise.resolve(onRetry());
      setRetryCount(0); // Reset on success
    } catch (err) {
      setRetryCount(prev => prev + 1);
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setIsRetrying(false);
    }
  }, [onRetry, retryCount, maxRetries]);

  const isMaxRetriesReached = retryCount >= maxRetries;

  return (
    <div className="space-y-2">
      <Button
        onClick={handleRetry}
        disabled={isRetrying || isMaxRetriesReached}
        className={`flex items-center gap-2 ${className}`}
      >
        <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />
        {isRetrying ? 'Retrying...' : children}
        {retryCount > 0 && !isMaxRetriesReached && ` (${retryCount}/${maxRetries})`}
      </Button>

      {error && (
        <Alert variant="error" description={error} />
      )}

      {isMaxRetriesReached && (
        <Alert
          variant="error"
          title="Maximum retries exceeded"
          description="Please refresh the page or contact support if the problem persists."
        />
      )}
    </div>
  );
};

// Network Error Component
interface NetworkErrorProps {
  onRetry?: () => void;
  isOffline?: boolean;
}

export const NetworkError: React.FC<NetworkErrorProps> = ({
  onRetry,
  isOffline = false,
}) => {
  return (
    <div className="text-center py-8">
      <div className="w-16 h-16 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-600" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {isOffline ? 'You\'re offline' : 'Connection Error'}
      </h3>
      
  <p className="text-gray-700 mb-4">
        {isOffline
          ? 'Please check your internet connection and try again.'
          : 'Unable to connect to the server. Please try again.'}
      </p>

      {onRetry && (
        <RetryButton onRetry={onRetry} className="mx-auto">
          Try Again
        </RetryButton>
      )}
    </div>
  );
};

// Loading Error Component (for when loading fails)
interface LoadingErrorProps {
  message?: string;
  onRetry?: () => void;
}

export const LoadingError: React.FC<LoadingErrorProps> = ({
  message = "Failed to load content",
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
  <AlertTriangle className="w-12 h-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
  <p className="text-gray-700 mb-4">Something went wrong while loading this content.</p>
      
      {onRetry && (
        <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4" />
          Try Again
        </Button>
      )}
    </div>
  );
};
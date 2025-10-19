// Comprehensive Error Handling System
import { TRPCError } from "@trpc/server";
import { ZodError } from "zod";

// Error types and interfaces
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  userMessage: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  context?: Record<string, any>;
}

export interface ErrorHandlerOptions {
  logToConsole?: boolean;
  logToService?: boolean;
  showNotification?: boolean;
  retryable?: boolean;
  fallbackValue?: any;
}

// Error codes enum
export const ErrorCodes = {
  // Validation errors
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  REQUIRED_FIELD_MISSING: 'REQUIRED_FIELD_MISSING',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Authentication errors
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  
  // Database errors
  DATABASE_ERROR: 'DATABASE_ERROR',
  RECORD_NOT_FOUND: 'RECORD_NOT_FOUND',
  DUPLICATE_ENTRY: 'DUPLICATE_ENTRY',
  CONSTRAINT_VIOLATION: 'CONSTRAINT_VIOLATION',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Server errors
  INTERNAL_SERVER_ERROR: 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
  
  // Client errors
  CLIENT_ERROR: 'CLIENT_ERROR',
  INVALID_INPUT: 'INVALID_INPUT',
  OPERATION_FAILED: 'OPERATION_FAILED',
  
  // Business logic errors
  BUSINESS_RULE_VIOLATION: 'BUSINESS_RULE_VIOLATION',
  INSUFFICIENT_PERMISSIONS: 'INSUFFICIENT_PERMISSIONS',
  RESOURCE_CONFLICT: 'RESOURCE_CONFLICT',
} as const;

// User-friendly error messages
const ERROR_MESSAGES: Record<string, string> = {
  [ErrorCodes.VALIDATION_ERROR]: 'Please check your input and try again.',
  [ErrorCodes.REQUIRED_FIELD_MISSING]: 'Please fill in all required fields.',
  [ErrorCodes.INVALID_FORMAT]: 'Please check the format of your input.',
  
  [ErrorCodes.UNAUTHORIZED]: 'Please sign in to continue.',
  [ErrorCodes.FORBIDDEN]: 'You don\'t have permission to perform this action.',
  [ErrorCodes.SESSION_EXPIRED]: 'Your session has expired. Please sign in again.',
  
  [ErrorCodes.DATABASE_ERROR]: 'We\'re experiencing technical difficulties. Please try again.',
  [ErrorCodes.RECORD_NOT_FOUND]: 'The requested item could not be found.',
  [ErrorCodes.DUPLICATE_ENTRY]: 'This item already exists.',
  [ErrorCodes.CONSTRAINT_VIOLATION]: 'This action violates data constraints.',
  
  [ErrorCodes.NETWORK_ERROR]: 'Network connection error. Please check your internet connection.',
  [ErrorCodes.TIMEOUT_ERROR]: 'The request timed out. Please try again.',
  [ErrorCodes.CONNECTION_ERROR]: 'Unable to connect to the server. Please try again.',
  
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'An unexpected error occurred. Please try again.',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'The service is temporarily unavailable. Please try again later.',
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'Too many requests. Please wait a moment and try again.',
  
  [ErrorCodes.CLIENT_ERROR]: 'An error occurred in the application. Please refresh and try again.',
  [ErrorCodes.INVALID_INPUT]: 'The provided input is invalid.',
  [ErrorCodes.OPERATION_FAILED]: 'The operation could not be completed.',
  
  [ErrorCodes.BUSINESS_RULE_VIOLATION]: 'This action violates business rules.',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'You don\'t have sufficient permissions.',
  [ErrorCodes.RESOURCE_CONFLICT]: 'This resource is currently being used by another process.',
};

// Error severity mapping
const ERROR_SEVERITY: Record<string, AppError['severity']> = {
  [ErrorCodes.VALIDATION_ERROR]: 'low',
  [ErrorCodes.REQUIRED_FIELD_MISSING]: 'low',
  [ErrorCodes.INVALID_FORMAT]: 'low',
  
  [ErrorCodes.UNAUTHORIZED]: 'medium',
  [ErrorCodes.FORBIDDEN]: 'medium',
  [ErrorCodes.SESSION_EXPIRED]: 'medium',
  
  [ErrorCodes.DATABASE_ERROR]: 'high',
  [ErrorCodes.RECORD_NOT_FOUND]: 'low',
  [ErrorCodes.DUPLICATE_ENTRY]: 'medium',
  [ErrorCodes.CONSTRAINT_VIOLATION]: 'medium',
  
  [ErrorCodes.NETWORK_ERROR]: 'medium',
  [ErrorCodes.TIMEOUT_ERROR]: 'medium',
  [ErrorCodes.CONNECTION_ERROR]: 'high',
  
  [ErrorCodes.INTERNAL_SERVER_ERROR]: 'critical',
  [ErrorCodes.SERVICE_UNAVAILABLE]: 'high',
  [ErrorCodes.RATE_LIMIT_EXCEEDED]: 'medium',
  
  [ErrorCodes.CLIENT_ERROR]: 'medium',
  [ErrorCodes.INVALID_INPUT]: 'low',
  [ErrorCodes.OPERATION_FAILED]: 'medium',
  
  [ErrorCodes.BUSINESS_RULE_VIOLATION]: 'medium',
  [ErrorCodes.INSUFFICIENT_PERMISSIONS]: 'medium',
  [ErrorCodes.RESOURCE_CONFLICT]: 'medium',
};

// Error factory functions
export class AppErrorFactory {
  static createError(
    code: keyof typeof ErrorCodes,
    message?: string,
    details?: any,
    context?: Record<string, any>
  ): AppError {
    return {
      code: ErrorCodes[code],
      message: message || ERROR_MESSAGES[ErrorCodes[code]] || 'An error occurred',
      details,
      timestamp: new Date(),
      userMessage: ERROR_MESSAGES[ErrorCodes[code]] || 'An error occurred',
      severity: ERROR_SEVERITY[ErrorCodes[code]] || 'medium',
      context,
    };
  }

  static fromZodError(error: ZodError, context?: Record<string, any>): AppError {
    const fieldErrors = error.flatten();
    const firstError = Object.values(fieldErrors.fieldErrors)[0]?.[0];
    
    return this.createError(
      'VALIDATION_ERROR',
      firstError || 'Validation failed',
      fieldErrors,
      context
    );
  }

  static fromTRPCError(error: TRPCError, context?: Record<string, any>): AppError {
    let code: keyof typeof ErrorCodes = 'INTERNAL_SERVER_ERROR';
    
    switch (error.code) {
      case 'BAD_REQUEST':
        code = 'INVALID_INPUT';
        break;
      case 'UNAUTHORIZED':
        code = 'UNAUTHORIZED';
        break;
      case 'FORBIDDEN':
        code = 'FORBIDDEN';
        break;
      case 'NOT_FOUND':
        code = 'RECORD_NOT_FOUND';
        break;
      case 'TIMEOUT':
        code = 'TIMEOUT_ERROR';
        break;
      case 'CONFLICT':
        code = 'RESOURCE_CONFLICT';
        break;
      case 'PRECONDITION_FAILED':
        code = 'BUSINESS_RULE_VIOLATION';
        break;
      case 'TOO_MANY_REQUESTS':
        code = 'RATE_LIMIT_EXCEEDED';
        break;
      case 'INTERNAL_SERVER_ERROR':
      default:
        code = 'INTERNAL_SERVER_ERROR';
        break;
    }
    
    return this.createError(code, error.message, error.cause, context);
  }

  static fromNetworkError(error: Error, context?: Record<string, any>): AppError {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      return this.createError('NETWORK_ERROR', error.message, error, context);
    }
    
    if (error.name === 'AbortError') {
      return this.createError('TIMEOUT_ERROR', error.message, error, context);
    }
    
    return this.createError('CLIENT_ERROR', error.message, error, context);
  }
}

// Error handler class
export class ErrorHandler {
  private static errorLog: AppError[] = [];
  private static maxLogSize = 100;

  static handle(
    error: unknown,
    options: ErrorHandlerOptions = {},
    context?: Record<string, any>
  ): AppError {
    const appError = this.normalizeError(error, context);
    
    // Log error
    this.logError(appError, options);
    
    // Show notification if requested
    if (options.showNotification) {
      this.showErrorNotification(appError);
    }
    
    return appError;
  }

  private static normalizeError(error: unknown, context?: Record<string, any>): AppError {
    if (error instanceof ZodError) {
      return AppErrorFactory.fromZodError(error, context);
    }
    
    if (error instanceof TRPCError) {
      return AppErrorFactory.fromTRPCError(error, context);
    }
    
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes('fetch') || error.message.includes('network')) {
        return AppErrorFactory.fromNetworkError(error, context);
      }
      
      return AppErrorFactory.createError(
        'CLIENT_ERROR',
        error.message,
        error,
        context
      );
    }
    
    // Handle string errors
    if (typeof error === 'string') {
      return AppErrorFactory.createError('CLIENT_ERROR', error, null, context);
    }
    
    // Handle unknown errors
    return AppErrorFactory.createError(
      'INTERNAL_SERVER_ERROR',
      'An unexpected error occurred',
      error,
      context
    );
  }

  private static logError(error: AppError, options: ErrorHandlerOptions) {
    // Add to error log
    this.errorLog.unshift(error);
    
    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(0, this.maxLogSize);
    }
    
    // Console logging
    if (options.logToConsole !== false) {
      const logLevel = this.getLogLevel(error.severity);
      console[logLevel](`[${error.code}] ${error.message}`, {
        details: error.details,
        context: error.context,
        timestamp: error.timestamp.toISOString(),
      });
    }
    
    // External logging service (placeholder)
    if (options.logToService) {
      this.logToExternalService(error);
    }
  }

  private static getLogLevel(severity: AppError['severity']): 'log' | 'warn' | 'error' {
    switch (severity) {
      case 'low':
        return 'log';
      case 'medium':
        return 'warn';
      case 'high':
      case 'critical':
        return 'error';
      default:
        return 'warn';
    }
  }

  private static showErrorNotification(error: AppError) {
    // This would integrate with your notification system
    if (typeof window !== 'undefined') {
      // You could integrate this with your Zustand store's notification system
      console.warn('Error notification:', error.userMessage);
    }
  }

  private static async logToExternalService(error: AppError) {
    // Placeholder for external logging service (e.g., Sentry, LogRocket)
    try {
      // await logToService(error);
      console.log('Would log to external service:', error);
    } catch (loggingError) {
      console.error('Failed to log to external service:', loggingError);
    }
  }

  // Public methods for accessing error logs and stats
  static getErrorLog(): AppError[] {
    return [...this.errorLog];
  }

  static getErrorStats(): {
    total: number;
    bySeverity: Record<AppError['severity'], number>;
    byCode: Record<string, number>;
  } {
    const stats = {
      total: this.errorLog.length,
      bySeverity: { low: 0, medium: 0, high: 0, critical: 0 },
      byCode: {} as Record<string, number>,
    };

    this.errorLog.forEach(error => {
      stats.bySeverity[error.severity]++;
      stats.byCode[error.code] = (stats.byCode[error.code] || 0) + 1;
    });

    return stats;
  }

  static clearErrorLog() {
    this.errorLog = [];
  }
}

// React hook for error handling
export function useErrorHandler() {
  const handleError = (
    error: unknown,
    options: ErrorHandlerOptions = {},
    context?: Record<string, any>
  ) => {
    return ErrorHandler.handle(error, {
      logToConsole: true,
      showNotification: true,
      ...options,
    }, context);
  };

  const createErrorBoundary = (fallback?: (props: { error: AppError }) => JSX.Element) => {
    return (error: Error, errorInfo: React.ErrorInfo) => {
      const appError = handleError(error, {}, { errorInfo });
      return fallback ? fallback({ error: appError }) : null;
    };
  };

  return {
    handleError,
    createErrorBoundary,
    getErrorLog: ErrorHandler.getErrorLog,
    getErrorStats: ErrorHandler.getErrorStats,
    clearErrorLog: ErrorHandler.clearErrorLog,
  };
}

// Utility functions for common error scenarios
export const withErrorHandling = <T extends (...args: any[]) => any>(
  fn: T,
  options?: ErrorHandlerOptions
): T => {
  return ((...args: Parameters<T>) => {
    try {
      const result = fn(...args);
      
      // Handle async functions
      if (result instanceof Promise) {
        return result.catch(error => {
          ErrorHandler.handle(error, options);
          throw error;
        });
      }
      
      return result;
    } catch (error) {
      ErrorHandler.handle(error, options);
      throw error;
    }
  }) as T;
};

export const safeAsync = async <T>(
  fn: () => Promise<T>,
  fallbackValue?: T,
  options?: ErrorHandlerOptions
): Promise<T | undefined> => {
  try {
    return await fn();
  } catch (error) {
    ErrorHandler.handle(error, options);
    return fallbackValue;
  }
};

export const safeSync = <T>(
  fn: () => T,
  fallbackValue?: T,
  options?: ErrorHandlerOptions
): T | undefined => {
  try {
    return fn();
  } catch (error) {
    ErrorHandler.handle(error, options);
    return fallbackValue;
  }
};
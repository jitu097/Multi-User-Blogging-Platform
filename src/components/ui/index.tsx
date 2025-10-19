// Reusable UI components for better code organization

import React from 'react';
import { Loader2, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps, ColorVariant, SizeVariant } from '@/types';

// Loading Spinner Component
interface LoadingSpinnerProps extends BaseComponentProps {
  size?: SizeVariant;
  text?: string;
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  const sizeClasses = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
}

// Alert Component
interface AlertProps extends BaseComponentProps {
  variant?: ColorVariant;
  title?: string;
  description?: string;
}

export function Alert({ variant = 'info', title, description, children, className }: AlertProps) {
  const variantClasses = {
    primary: 'bg-blue-50 border-blue-200 text-blue-800',
    secondary: 'bg-gray-50 border-gray-200 text-gray-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  };

  const icons = {
    primary: Info,
    secondary: Info,
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertCircle,
    info: Info
  };

  const Icon = icons[variant];

  return (
    <div className={cn(
      'border rounded-lg p-4 flex gap-3',
      variantClasses[variant],
      className
    )}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        {title && (
          <h4 className="font-semibold mb-1">{title}</h4>
        )}
        {description && (
          <p className="text-sm opacity-90">{description}</p>
        )}
        {children}
      </div>
    </div>
  );
}

// Empty State Component
interface EmptyStateProps extends BaseComponentProps {
  icon?: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('text-center py-12', className)}>
      {Icon && (
        <Icon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}

// Card Component
interface CardProps extends BaseComponentProps {
  header?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: boolean;
}

export function Card({ header, footer, children, padding = true, className }: CardProps) {
  return (
    <div className={cn('bg-white rounded-lg shadow-sm border', className)}>
      {header && (
        <div className="p-6 border-b border-gray-200">
          {header}
        </div>
      )}
      <div className={cn(padding && 'p-6')}>
        {children}
      </div>
      {footer && (
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          {footer}
        </div>
      )}
    </div>
  );
}

// Button Component
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ColorVariant | 'ghost' | 'outline';
  size?: SizeVariant;
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export function Button({ 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  disabled, 
  asChild = false,
  children, 
  className,
  ...props 
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500',
    success: 'bg-green-600 hover:bg-green-700 text-white focus:ring-green-500',
    warning: 'bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500',
    error: 'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
    info: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500',
    ghost: 'hover:bg-gray-100 text-gray-700 focus:ring-gray-500',
    outline: 'border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500'
  };

  const sizeClasses = {
    xs: 'px-2 py-1 text-xs',
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const classes = cn(
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className
  );

  if (asChild) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn((children as React.ReactElement).props.className, classes),
    });
  }

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

// Input Component
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, ...props }: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-300 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}

// Textarea Component
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Textarea({ label, error, helperText, className, ...props }: TextareaProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {props.required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        className={cn(
          'w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          error && 'border-red-300 focus:ring-red-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helperText}</p>
      )}
    </div>
  );
}
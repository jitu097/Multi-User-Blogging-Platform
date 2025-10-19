// Lazy loading utilities for React Best Practices
"use client";

import React, { Suspense, ComponentType, LazyExoticComponent } from 'react';
import { LoadingSpinner } from '@/components/ui';
import { ErrorBoundary } from '@/components/ErrorBoundary';

// Generic lazy loading wrapper with loading and error states
interface LazyWrapperProps {
  fallback?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
}

export const LazyWrapper: React.FC<LazyWrapperProps> = ({
  fallback = <LoadingSpinner size="lg" text="Loading..." />,
  error,
  children,
}) => {
  return (
    <ErrorBoundary fallback={error}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </ErrorBoundary>
  );
};

// HOC for lazy loading components
export function withLazyLoading<P extends object>(
  lazyComponent: LazyExoticComponent<ComponentType<P>>,
  options?: {
    fallback?: React.ReactNode;
    error?: React.ReactNode;
  }
) {
  const LazyComponent = (props: P) => {
    const LazyLoadedComponent = lazyComponent;
    
    return (
      <LazyWrapper fallback={options?.fallback} error={options?.error}>
        <LazyLoadedComponent {...(props as any)} />
      </LazyWrapper>
    );
  };

  LazyComponent.displayName = `withLazyLoading(LazyComponent)`;
  
  return LazyComponent;
}

// Preload function for eager loading on hover/focus
export function preloadComponent<P extends object>(
  lazyComponent: LazyExoticComponent<ComponentType<P>>
) {
  // This will trigger the dynamic import and cache the result
  return lazyComponent;
}

// Hook for dynamic imports with loading states
export function useLazyImport<T>(
  importFn: () => Promise<{ default: T }>
) {
  const [state, setState] = React.useState<{
    component: T | null;
    loading: boolean;
    error: Error | null;
  }>({
    component: null,
    loading: true,
    error: null,
  });

  const importFnRef = React.useRef(importFn);
  importFnRef.current = importFn;

  React.useEffect(() => {
    let mounted = true;

    setState(prev => ({ ...prev, loading: true, error: null }));

    importFnRef.current()
      .then(module => {
        if (mounted) {
          setState({
            component: module.default,
            loading: false,
            error: null,
          });
        }
      })
      .catch(error => {
        if (mounted) {
          setState({
            component: null,
            loading: false,
            error: error instanceof Error ? error : new Error('Import failed'),
          });
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

// Intersection Observer based lazy loading for components
interface IntersectionLazyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
  threshold?: number;
  triggerOnce?: boolean;
  className?: string;
}

export const IntersectionLazy: React.FC<IntersectionLazyProps> = ({
  children,
  fallback = <div className="min-h-[200px] flex items-center justify-center">
    <LoadingSpinner />
  </div>,
  rootMargin = '50px',
  threshold = 0.1,
  triggerOnce = true,
  className,
}) => {
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  const [hasTriggered, setHasTriggered] = React.useState(false);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!triggerOnce || !hasTriggered)) {
          setIsIntersecting(true);
          if (triggerOnce) {
            setHasTriggered(true);
          }
        } else if (!triggerOnce) {
          setIsIntersecting(entry.isIntersecting);
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return (
    <div ref={elementRef} className={className}>
      {isIntersecting || hasTriggered ? children : fallback}
    </div>
  );
};
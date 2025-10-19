"use client";

import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps, SizeVariant } from '@/types';

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
  } as const;

  return (
    <div className={cn('flex items-center justify-center gap-2', className)}>
      <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />
      {text && <span className="text-gray-600">{text}</span>}
    </div>
  );
}

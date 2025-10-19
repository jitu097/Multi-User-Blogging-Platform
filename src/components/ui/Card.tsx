"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps } from '@/types';

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

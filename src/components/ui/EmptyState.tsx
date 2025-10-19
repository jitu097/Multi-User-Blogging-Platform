"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import type { BaseComponentProps } from '@/types';

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
        <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      )}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-700 mb-6 max-w-md mx-auto">{description}</p>
      )}
      {action}
    </div>
  );
}

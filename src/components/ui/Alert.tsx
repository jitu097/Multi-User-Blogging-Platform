"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface AlertProps {
  variant?: "default" | "error" | "warning" | "success";
  title?: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  variant = "default",
  title,
  description,
  children,
  className,
}) => {
  const variants = {
    default: "bg-gray-50 text-gray-900 border-gray-200",
    error: "bg-red-50 text-red-900 border-red-200",
    warning: "bg-yellow-50 text-yellow-900 border-yellow-200",
    success: "bg-green-50 text-green-900 border-green-200",
  };

  return (
    <div className={cn("relative w-full rounded-lg border p-4", variants[variant], className)}>
      {title && (
        <h5 className="mb-1 font-medium leading-none tracking-tight">
          {title}
        </h5>
      )}
      {description && (
        <div className="text-sm opacity-90">
          {description}
        </div>
      )}
      {children}
    </div>
  );
};
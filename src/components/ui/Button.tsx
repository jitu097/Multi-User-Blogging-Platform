"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive" | string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  asChild?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "default",
  size = "md",
  loading = false,
  asChild = false,
  className,
  children,
  ...props
}) => {
  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClasses: Record<string, string> = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    outline: "border border-gray-300 hover:bg-gray-50 hover:text-gray-900",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizeClasses: Record<string, string> = {
    sm: "h-9 px-3 text-sm",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8 text-lg",
  };

  const classes = cn(baseClasses, variantClasses[variant] ?? variantClasses.default, sizeClasses[size] ?? sizeClasses.md, className);

  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children as React.ReactElement, {
      className: cn((children as React.ReactElement).props.className, classes),
      ...props,
    });
  }

  return (
    <button className={classes} disabled={props.disabled || loading} {...props}>
      {loading && <span className="animate-spin inline-block w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full" />}
      {children}
    </button>
  );
};
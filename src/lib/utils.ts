/**
 * General-purpose utilities used across the app.
 * Goal: small, well-typed helpers with clear semantics and JSDoc.
 */

import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Tailwind CSS helper -----------------------------------------------------
/** Merge class names and Tailwind utility classes safely. */
export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs));

// Text utilities ---------------------------------------------------------
/** Generate a URL-friendly slug from a string. */
export const generateSlug = (text: string): string =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

/** Truncate text to `maxLength` and append ellipsis when necessary. */
export const truncateText = (text: string, maxLength = 150): string =>
  text.length <= maxLength ? text : `${text.slice(0, maxLength).trim()}...`;

/** Capitalize the first letter and lowercase the rest. */
export const capitalizeFirst = (text: string): string =>
  (text || "").charAt(0).toUpperCase() + (text || "").slice(1).toLowerCase();

/** Return singular or plural form based on `count`. */
export const pluralize = (count: number, singular: string, plural?: string): string =>
  (count === 1 ? singular : plural ?? `${singular}s`);

// Date utilities ---------------------------------------------------------
type DateInput = Date | string | number;

function toDate(d: DateInput): Date {
  const date = d instanceof Date ? d : new Date(d);
  if (Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
  return date;
}

export const formatDate = (date: DateInput): string =>
  toDate(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

export const formatDateTime = (date: DateInput): string =>
  toDate(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

export const formatRelativeTime = (date: DateInput): string => {
  const d = toDate(date);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;

  return formatDate(d);
};

export interface PostStats {
  wordCount: number;
  readingTime: number; // minutes
  characterCount: number;
}

/** Compute basic statistics for article content (strips HTML). */
export const calculatePostStats = (content: string): PostStats => {
  const plainText = (content || "").replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ");
  const words = plainText.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 225));

  return { wordCount, readingTime, characterCount: plainText.length };
};

// Content utilities ------------------------------------------------------
export const extractPreview = (content: string, maxLength = 300): string => {
  const withoutTags = (content || "").replace(/<[^>]*>/g, "").replace(/&[^;]+;/g, " ");
  const cleaned = withoutTags.replace(/\s+/g, " ").trim();
  if (cleaned.length <= maxLength) return cleaned;

  const truncated = cleaned.slice(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  const lastSpace = truncated.lastIndexOf(' ');

  if (lastSentence > Math.floor(maxLength * 0.7)) return truncated.slice(0, lastSentence + 1);
  if (lastSpace > Math.floor(maxLength * 0.8)) return `${truncated.slice(0, lastSpace)}...`;
  return `${truncated}...`;
};

export const highlightSearchTerm = (text: string, searchTerm?: string): string => {
  if (!searchTerm) return text;
  // Escape RegExp special chars in searchTerm
  const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
};

// Validation utilities --------------------------------------------------
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(String(email || ""));
};

export const isValidUrl = (url: string): boolean => {
  try {
    // allow relative urls? this treats only absolute urls as valid
    new URL(String(url));
    return true;
  } catch {
    return false;
  }
};

export const isValidSlug = (slug: string): boolean => {
  const s = String(slug || "");
  const slugRegex = /^[a-z0-9-]+$/;
  return slugRegex.test(s) && !s.startsWith("-") && !s.endsWith("-");
};

// Array utilities -------------------------------------------------------
export const groupBy = <T, K extends keyof T>(array: T[], key: K): Record<string, T[]> =>
  array.reduce((groups, item) => {
    const group = String(item[key]);
    (groups[group] ??= []).push(item);
    return groups;
  }, {} as Record<string, T[]>);

export const sortBy = <T, K extends keyof T>(array: T[], key: K, direction: 'asc' | 'desc' = 'asc'): T[] =>
  [...array].sort((a, b) => {
    const aVal = a[key] as unknown as string | number;
    const bVal = b[key] as unknown as string | number;
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });

export const unique = <T>(array: T[]): T[] => Array.from(new Set(array));

// Error utilities -------------------------------------------------------
export const getErrorMessage = (error: unknown): string => {
  if (error instanceof Error) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};

export const isApiError = (error: unknown): error is { message: string; code?: string } =>
  typeof error === 'object' && error !== null && 'message' in error;

// Performance utilities -------------------------------------------------
export const debounce = <T extends (...args: any[]) => any>(fn: T, wait = 200) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>): void => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), wait);
  };
};

export const throttle = <T extends (...args: any[]) => any>(fn: T, wait = 200) => {
  let inThrottle = false;
  return (...args: Parameters<T>): void => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), wait);
    }
  };
};
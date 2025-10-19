// Types for better code organization and type safety
import type { 
  User as SchemaUser, 
  Post as SchemaPost, 
  Category as SchemaCategory,
  PostCategory as SchemaPostCategory 
} from "@/lib/schema";

// Enhanced Post types with relationships
export interface PostWithCategories extends Omit<SchemaPost, 'authorId'> {
  // authorId may be nullable in some query shapes (when joined data is missing)
  authorId?: number | null;
  categories: SchemaCategory[];
  author?: SchemaUser;
  _count?: {
    categories: number;
  };
}

export interface PostWithStats extends PostWithCategories {
  stats: {
    wordCount: number;
    readingTime: number;
    characterCount: number;
  };
}

// Category types with post counts
export interface CategoryWithCounts extends SchemaCategory {
  _count?: {
    posts: number;
  };
  posts?: SchemaPost[];
}

// API Input/Output types
export interface CreatePostInput {
  title: string;
  content: string;
  published?: boolean;
  categoryIds?: number[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: number;
}

export interface CreateCategoryInput {
  name: string;
  description?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {
  id: number;
}

// Filter and search types
export interface PostFilters {
  search?: string;
  categoryId?: number;
  published?: boolean;
  authorId?: number;
  limit?: number;
  offset?: number;
}

export interface CategoryFilters {
  search?: string;
  limit?: number;
  offset?: number;
}

// UI State types
export interface LoadingState {
  isLoading: boolean;
  error?: string | null;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

// Component prop types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface PostCardProps extends BaseComponentProps {
  post: PostWithCategories;
  showActions?: boolean;
  variant?: 'default' | 'compact' | 'featured';
}

export interface CategoryCardProps extends BaseComponentProps {
  category: CategoryWithCounts;
  showActions?: boolean;
}

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
}

// Form types
export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> extends ApiResponse<T[]> {
  pagination: PaginationState;
}

// Theme and styling types
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Utility types
export type WithRequired<T, K extends keyof T> = T & Required<Pick<T, K>>;
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
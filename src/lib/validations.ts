/**
 * Input validation schemas using Zod
 * These validate data coming from the frontend before it hits the database
 */

import { z } from "zod";

// Reusable base schemas for common fields
export const idSchema = z.number().int().positive();
export const slugSchema = z.string().min(1).max(255).regex(/^[a-z0-9-]+$/, 'Invalid slug format');
export const titleSchema = z.string().min(1, 'Title is required').max(255, 'Title too long');
export const contentSchema = z.string().min(1, 'Content is required');
export const descriptionSchema = z.string().max(500, 'Description too long').optional();

/**
 * Post validation schemas
 */

// Creating a new post
export const createPostSchema = z.object({
  title: titleSchema,
  content: contentSchema,
  published: z.boolean().default(false),
  authorId: idSchema.optional(), // Will eventually come from auth
  categoryIds: z.array(idSchema).optional().default([]),
});

// Updating an existing post
export const updatePostSchema = z.object({
  id: idSchema,
  title: titleSchema.optional(),
  content: contentSchema.optional(),
  published: z.boolean().optional(),
  categoryIds: z.array(idSchema).optional(),
});

// Getting a post by its URL slug
export const getPostBySlugSchema = z.string().min(1);

// Filtering/searching posts
export const postFiltersSchema = z.object({
  search: z.string().optional(),
  categoryId: idSchema.optional(),
  published: z.boolean().optional(),
  authorId: idSchema.optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// Category schemas
export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100, 'Name too long'),
  description: descriptionSchema,
});

export const updateCategorySchema = z.object({
  id: idSchema,
  name: z.string().min(1).max(100).optional(),
  description: descriptionSchema,
});

export const getCategoryBySlugSchema = z.string().min(1);

export const categoryFiltersSchema = z.object({
  search: z.string().optional(),
  limit: z.number().int().min(1).max(100).default(10),
  offset: z.number().int().min(0).default(0),
});

// User schemas (for future user management)
export const createUserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50),
  email: z.string().email('Invalid email format'),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

export const updateUserSchema = z.object({
  id: idSchema,
  username: z.string().min(3).max(50).optional(),
  email: z.string().email().optional(),
  firstName: z.string().min(1).max(50).optional(),
  lastName: z.string().min(1).max(50).optional(),
});

// Common response schemas
export const successResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
});

export const paginationSchema = z.object({
  page: z.number().int().min(1),
  limit: z.number().int().min(1).max(100),
  total: z.number().int().min(0),
  totalPages: z.number().int().min(0),
});

// Tag validation schemas
export const createTagSchema = z.object({
  name: z.string()
    .min(2, 'Tag name must be at least 2 characters')
    .max(50, 'Tag name must be less than 50 characters')
    .trim(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .nullable(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .nullable(),
});

export const updateTagSchema = z.object({
  id: z.number().positive(),
  name: z.string()
    .min(2, 'Tag name must be at least 2 characters')
    .max(50, 'Tag name must be less than 50 characters')
    .trim()
    .optional(),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional()
    .nullable(),
  color: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .nullable(),
}).refine(data => {
  // At least one field besides id must be provided
  const { id, ...rest } = data;
  return Object.values(rest).some(value => value !== undefined);
}, {
  message: 'At least one field must be provided for update'
});

// Export types for use in components
export type CreatePostInput = z.infer<typeof createPostSchema>;
export type UpdatePostInput = z.infer<typeof updatePostSchema>;
export type PostFilters = z.infer<typeof postFiltersSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
export type CategoryFilters = z.infer<typeof categoryFiltersSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type PaginationInfo = z.infer<typeof paginationSchema>;
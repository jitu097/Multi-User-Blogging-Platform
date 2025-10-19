// Enhanced Tag Router with comprehensive CRUD operations
import { z } from "zod";
import { eq, desc, asc, count, ilike, and, inArray } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { tags, postTags, posts } from "@/lib/schema";
import { TRPCError } from "@trpc/server";
import { createTagSchema, updateTagSchema } from "@/lib/validations";

export const tagRouter = createTRPCRouter({
  // Get all tags with usage statistics
  getAll: publicProcedure
    .input(z.object({
      search: z.string().optional(),
      sortBy: z.enum(['name', 'usageCount', 'createdAt']).default('name'),
      sortOrder: z.enum(['asc', 'desc']).default('asc'),
      limit: z.number().min(1).max(100).default(50),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const { search, sortBy, sortOrder, limit, offset } = input;
      
      const conditions = [];
      if (search) {
        conditions.push(ilike(tags.name, `%${search}%`));
      }

      const orderColumn = tags[sortBy];
      const orderDirection = sortOrder === 'desc' ? desc(orderColumn) : asc(orderColumn);

      try {
        const results = await db
          .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            description: tags.description,
            color: tags.color,
            usageCount: tags.usageCount,
            createdAt: tags.createdAt,
            updatedAt: tags.updatedAt,
          })
          .from(tags)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(orderDirection)
          .limit(limit)
          .offset(offset);

        return results;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tags',
          cause: error,
        });
      }
    }),

  // Get popular tags (most used)
  getPopular: publicProcedure
    .input(z.object({
      limit: z.number().min(1).max(50).default(10),
    }))
    .query(async ({ input }) => {
      try {
        return await db
          .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            color: tags.color,
            usageCount: tags.usageCount,
          })
          .from(tags)
          .where(eq(tags.usageCount, 0))
          .orderBy(desc(tags.usageCount))
          .limit(input.limit);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch popular tags',
          cause: error,
        });
      }
    }),

  // Get tag by slug with posts
  getBySlug: publicProcedure
    .input(z.object({
      slug: z.string().min(1),
      includePostCount: z.boolean().default(false),
    }))
    .query(async ({ input }) => {
      try {
        const tag = await db
          .select()
          .from(tags)
          .where(eq(tags.slug, input.slug))
          .limit(1);

        if (!tag.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Tag not found',
          });
        }

        const result = tag[0];

        if (input.includePostCount) {
          const [postCount] = await db
            .select({ count: count() })
            .from(postTags)
            .leftJoin(posts, and(eq(postTags.postId, posts.id), eq(posts.published, true)))
            .where(eq(postTags.tagId, result.id));

          return {
            ...result,
            postCount: postCount?.count || 0,
          };
        }

        return result;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tag',
          cause: error,
        });
      }
    }),

  // Create new tag (protected)
  create: protectedProcedure
    .input(createTagSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if tag name already exists
        const existing = await db
          .select()
          .from(tags)
          .where(eq(tags.name, input.name))
          .limit(1);

        if (existing.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A tag with this name already exists',
          });
        }

        // Generate slug from name
        const slug = input.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');

        // Check if slug already exists
        const existingSlug = await db
          .select()
          .from(tags)
          .where(eq(tags.slug, slug))
          .limit(1);

        if (existingSlug.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'A tag with this slug already exists',
          });
        }

        const [newTag] = await db
          .insert(tags)
          .values({
            name: input.name,
            slug,
            description: input.description,
            color: input.color,
            usageCount: 0,
          })
          .returning();

        return newTag;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create tag',
          cause: error,
        });
      }
    }),

  /**
   * Update an existing tag with new values.
   * Validates uniqueness of name and generates slug if name changes.
   * @throws {TRPCError} NOT_FOUND if tag doesn't exist
   * @throws {TRPCError} CONFLICT if new name already exists
   */
  update: protectedProcedure
    .input(updateTagSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;
      
      try {
        // Check if tag exists
        const existing = await db
          .select()
          .from(tags)
          .where(eq(tags.id, id))
          .limit(1);

        if (!existing.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Tag not found',
          });
        }

        // Build update payload with explicit typing
        const payloadToUpdate: {
          name?: string;
          slug?: string;
          description?: string | null;
          color?: string | null;
          updatedAt: Date;
        } = {
          ...updateData,
          updatedAt: new Date(),
        };

        // If name is being updated, regenerate slug and check for conflicts
        if (updateData.name && updateData.name !== existing[0].name) {
          const nameConflict = await db
            .select()
            .from(tags)
            .where(and(eq(tags.name, updateData.name), eq(tags.id, id)))
            .limit(1);

          if (nameConflict.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'A tag with this name already exists',
            });
          }

          // Generate new slug from updated name
          payloadToUpdate.slug = updateData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        }

        const [updatedTag] = await db
          .update(tags)
          .set(payloadToUpdate)
          .where(eq(tags.id, id))
          .returning();

        if (!updatedTag) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to update tag',
          });
        }

        return updatedTag;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update tag',
          cause: error,
        });
      }
    }),

  // Delete tag (protected)
  delete: protectedProcedure
    .input(z.object({
      id: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      try {
        // Check if tag exists
        const existing = await db
          .select()
          .from(tags)
          .where(eq(tags.id, input.id))
          .limit(1);

        if (!existing.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Tag not found',
          });
        }

        // Check if tag is in use
        const [usage] = await db
          .select({ count: count() })
          .from(postTags)
          .where(eq(postTags.tagId, input.id));

        if (usage && usage.count > 0) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Cannot delete tag that is currently in use by posts',
          });
        }

        await db
          .delete(tags)
          .where(eq(tags.id, input.id));

        return { success: true, message: 'Tag deleted successfully' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete tag',
          cause: error,
        });
      }
    }),

  // Bulk operations
  bulkDelete: protectedProcedure
    .input(z.object({
      ids: z.array(z.number().positive()).min(1).max(50),
    }))
    .mutation(async ({ input }) => {
      try {
        // Check for tags in use
        const [usage] = await db
          .select({ count: count() })
          .from(postTags)
          .where(inArray(postTags.tagId, input.ids));

        if (usage && usage.count > 0) {
          throw new TRPCError({
            code: 'PRECONDITION_FAILED',
            message: 'Cannot delete tags that are currently in use by posts',
          });
        }

        const deletedCount = await db
          .delete(tags)
          .where(inArray(tags.id, input.ids));

        return { 
          success: true, 
          message: `Successfully deleted ${input.ids.length} tags`,
          deletedCount 
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to bulk delete tags',
          cause: error,
        });
      }
    }),

  // Get tag suggestions for autocomplete
  getSuggestions: publicProcedure
    .input(z.object({
      query: z.string().min(1).max(50),
      limit: z.number().min(1).max(20).default(10),
    }))
    .query(async ({ input }) => {
      try {
        return await db
          .select({
            id: tags.id,
            name: tags.name,
            slug: tags.slug,
            color: tags.color,
          })
          .from(tags)
          .where(ilike(tags.name, `${input.query}%`))
          .orderBy(desc(tags.usageCount), asc(tags.name))
          .limit(input.limit);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch tag suggestions',
          cause: error,
        });
      }
    }),
});
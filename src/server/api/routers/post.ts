import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { eq, like, desc, and, sql } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { posts, categories, postCategories, users, type Post, type Category } from "@/lib/schema";
import { 
  createPostSchema, 
  updatePostSchema, 
  getPostBySlugSchema, 
  postFiltersSchema,
  idSchema
} from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import type { PostWithCategories } from "@/types";

/**
 * Raw database query result type for posts with optional category join
 */
interface RawPostQueryResult {
  id: number;
  title: string;
  content: string | null;
  excerpt: string | null;
  slug: string;
  published: boolean;
  featured: boolean;
  viewCount: number;
  readingTime: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  authorId?: number | null;
  categories: Category | null;
}

/**
 * Transforms raw query results into PostWithCategories format
 * Groups posts and aggregates their categories into arrays
 * @param results - Raw query results from database
 * @returns Array of posts with their associated categories
 */
function transformPostQueryResults(results: RawPostQueryResult[]): PostWithCategories[] {
  const postsMap = new Map<number, PostWithCategories>();

  results.forEach((result) => {
    const { categories, ...postData } = result;
    
    if (!postsMap.has(postData.id)) {
      // Include all required fields from the SchemaPost type
      postsMap.set(postData.id, {
        id: postData.id,
        title: postData.title,
        content: postData.content,
        excerpt: postData.excerpt,
        slug: postData.slug,
        published: postData.published,
        featured: postData.featured,
        viewCount: postData.viewCount,
        readingTime: postData.readingTime,
        seoTitle: postData.seoTitle,
        seoDescription: postData.seoDescription,
        publishedAt: postData.publishedAt,
        createdAt: postData.createdAt,
        updatedAt: postData.updatedAt,
        authorId: postData.authorId ?? null,
        categories: [],
      });
    }

    if (categories) {
      const post = postsMap.get(postData.id);
      if (post) {
        post.categories.push(categories);
      }
    }
  });

  return Array.from(postsMap.values());
}

export const postRouter = createTRPCRouter({
  // Get all posts with categories
  getAll: publicProcedure
    .input(postFiltersSchema)
    .query(async ({ input }): Promise<PostWithCategories[]> => {
      try {
        const conditions = [];
        
        if (input.published !== undefined) {
          conditions.push(eq(posts.published, input.published));
        }
        
        if (input.search) {
          conditions.push(
            like(posts.title, `%${input.search}%`)
          );
        }

        if (input.categoryId) {
          conditions.push(eq(postCategories.categoryId, input.categoryId));
        }

        const results = await db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            excerpt: posts.excerpt,
            slug: posts.slug,
            published: posts.published,
            featured: posts.featured,
            viewCount: posts.viewCount,
            readingTime: posts.readingTime,
            seoTitle: posts.seoTitle,
            seoDescription: posts.seoDescription,
            publishedAt: posts.publishedAt,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            authorId: posts.authorId,
            categories: categories,
          })
          .from(posts)
          .leftJoin(postCategories, eq(posts.id, postCategories.postId))
          .leftJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(posts.createdAt))
          .limit(input.limit)
          .offset(input.offset);

        return transformPostQueryResults(results);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch posts',
          cause: error,
        });
      }
    }),

  // Get single post by slug
  getBySlug: publicProcedure
    .input(getPostBySlugSchema)
    .query(async ({ input }): Promise<PostWithCategories> => {
      try {
        const results = await db
          .select({
            id: posts.id,
            title: posts.title,
            content: posts.content,
            excerpt: posts.excerpt,
            slug: posts.slug,
            published: posts.published,
            featured: posts.featured,
            viewCount: posts.viewCount,
            readingTime: posts.readingTime,
            seoTitle: posts.seoTitle,
            seoDescription: posts.seoDescription,
            publishedAt: posts.publishedAt,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
            authorId: posts.authorId,
            categories: categories,
          })
          .from(posts)
          .leftJoin(postCategories, eq(posts.id, postCategories.postId))
          .leftJoin(categories, eq(postCategories.categoryId, categories.id))
          .where(eq(posts.slug, input));

        if (results.length === 0) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        const transformedPosts = transformPostQueryResults(results);
        return transformedPosts[0]!;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch post',
          cause: error,
        });
      }
    }),

  /**
   * Create a new blog post (requires authentication)
   * Generates slug automatically from title
   * Optionally associates post with categories
   * Uses authenticated user's ID as author
   */
  create: protectedProcedure
    .input(createPostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const slug = generateSlug(input.title);
        
        // Note: ctx.userId is a Clerk ID (string), but our DB expects integer
        // In a real app, you'd have a users table that maps Clerk IDs to DB user IDs
        // For now, try to use a placeholder user (id=1). If it doesn't exist, create
        // a minimal database user tied to the Clerk ID so FK constraints do not fail.
        let dbUserId = 1; // default placeholder user id

        // Ensure the placeholder user exists; if not, create a minimal one using the Clerk user id
        const clerkId = ctx.userId as string | null;
        const existingUser = await db.select().from(users).where(eq(users.id, dbUserId)).limit(1);
        if (!existingUser || existingUser.length === 0) {
          if (clerkId) {
            // Create a minimal user record so the FK constraint is satisfied.
            // Use a synthetic email derived from Clerk id to satisfy DB NOT NULL and email format.
            const username = `clerk_${clerkId.slice(0, 8)}`;
            const email = `${clerkId}@clerk.local`;
            const [created] = await db.insert(users).values({
              username,
              email,
            }).returning();
            dbUserId = created.id;
          } else {
            // No clerk context and no placeholder user -> fail early with helpful message
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message: 'No local database user available. Please seed a user or sign in so a database user can be created.',
            });
          }
        }
        
        const [newPost] = await db
          .insert(posts)
          .values({
            title: input.title,
            content: input.content,
            slug,
            published: input.published,
            authorId: dbUserId,
          })
          .returning();

        if (!newPost) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create post',
          });
        }

        // Add categories if provided
        if (input.categoryIds && input.categoryIds.length > 0) {
          await db.insert(postCategories).values(
            input.categoryIds.map((categoryId: number) => ({
              postId: newPost.id,
              categoryId,
            })),
          );
        }

          return newPost;
        } catch (error: any) {
          // Log full error server-side for easier debugging in dev
          console.error('post.create error:', error);
          // Handle common Postgres/DB errors with clearer messages in dev/user-facing flows
          // e.g., foreign key violations (author missing) or unique constraint failures (slug)
          const code = error?.code || (error?.cause && error.cause.code) || null;

          if (code === '23503') {
            // foreign key violation - likely missing author or category
            throw new TRPCError({
              code: 'BAD_REQUEST',
              message:
                'Failed to create post: related record not found (author or category). Ensure your local DB has a matching user and categories.',
              cause: error,
            });
          }

          if (code === '23505') {
            // unique violation (e.g. slug already exists)
            throw new TRPCError({
              code: 'CONFLICT',
              message:
                'Failed to create post: a post with the same slug already exists. Try changing the title.',
              cause: error,
            });
          }

          // Fallback - surface underlying message in development for easier debugging
          const message = process.env.NODE_ENV === 'development' && error?.message
            ? `Failed to create post: ${error.message}`
            : 'Failed to create post';

          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message,
            cause: error,
          });
        }
    }),

  // Update post (requires authentication)
  update: protectedProcedure
    .input(updatePostSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const { id, categoryIds, ...updateData } = input;
        
        // Update slug if title is being updated
        const updatePayload: Partial<Post> = { ...updateData };
        if (updateData.title) {
          updatePayload.slug = generateSlug(updateData.title);
        }

        // Update post
        const [updatedPost] = await db
          .update(posts)
          .set({
            ...updatePayload,
            updatedAt: new Date(),
          })
          .where(eq(posts.id, id))
          .returning();

        if (!updatedPost) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        // Update categories if provided
        if (categoryIds !== undefined) {
          // Remove existing categories
          await db.delete(postCategories).where(eq(postCategories.postId, id));
          
          // Add new categories
          if (categoryIds.length > 0) {
            await db.insert(postCategories).values(
              categoryIds.map((categoryId: number) => ({
                postId: id,
                categoryId,
              })),
            );
          }
        }

        return updatedPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update post',
          cause: error,
        });
      }
    }),

  // Delete post (requires authentication)
  delete: protectedProcedure
    .input(idSchema)
    .mutation(async ({ input, ctx }) => {
      try {
        const [deletedPost] = await db
          .delete(posts)
          .where(eq(posts.id, input))
          .returning();

        if (!deletedPost) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Post not found',
          });
        }

        return deletedPost;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete post',
          cause: error,
        });
      }
    }),
});
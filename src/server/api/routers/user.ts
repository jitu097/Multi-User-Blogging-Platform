// User Router with comprehensive user management
import { z } from "zod";
import { eq, desc, asc, count, ilike, and, or } from "drizzle-orm";
import { createTRPCRouter, publicProcedure, protectedProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { users, posts, comments } from "@/lib/schema";
import { TRPCError } from "@trpc/server";
import { createUserSchema, updateUserSchema } from "@/lib/validations";

export const userRouter = createTRPCRouter({
  // Get user profile with statistics
  getProfile: publicProcedure
    .input(z.object({
      id: z.number().positive().optional(),
      username: z.string().min(1).optional(),
    }))
    .query(async ({ input }) => {
      if (!input.id && !input.username) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Either id or username must be provided',
        });
      }

      try {
        const condition = input.id 
          ? eq(users.id, input.id)
          : eq(users.username, input.username!);

        const user = await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            bio: users.bio,
            avatar: users.avatar,
            isActive: users.isActive,
            emailVerified: users.emailVerified,
            createdAt: users.createdAt,
            updatedAt: users.updatedAt,
          })
          .from(users)
          .where(condition)
          .limit(1);

        if (!user.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Get user statistics
        const [postStats] = await db
          .select({
            totalPosts: count(posts.id),
            publishedPosts: count(posts.id),
          })
          .from(posts)
          .where(and(eq(posts.authorId, user[0].id), eq(posts.published, true)));

        const [commentStats] = await db
          .select({
            totalComments: count(comments.id),
          })
          .from(comments)
          .where(and(eq(comments.authorId, user[0].id), eq(comments.isApproved, true)));

        return {
          ...user[0],
          stats: {
            totalPosts: postStats?.totalPosts || 0,
            publishedPosts: postStats?.publishedPosts || 0,
            totalComments: commentStats?.totalComments || 0,
          },
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user profile',
          cause: error,
        });
      }
    }),

  // Get all users with filtering and pagination
  getAll: protectedProcedure
    .input(z.object({
      search: z.string().optional(),
      isActive: z.boolean().optional(),
      emailVerified: z.boolean().optional(),
      sortBy: z.enum(['username', 'email', 'createdAt']).default('createdAt'),
      sortOrder: z.enum(['asc', 'desc']).default('desc'),
      limit: z.number().min(1).max(100).default(20),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const { search, isActive, emailVerified, sortBy, sortOrder, limit, offset } = input;
      
      const conditions = [];
      if (search) {
        conditions.push(
          or(
            ilike(users.username, `%${search}%`),
            ilike(users.email, `%${search}%`),
            ilike(users.firstName, `%${search}%`),
            ilike(users.lastName, `%${search}%`)
          )
        );
      }
      if (isActive !== undefined) conditions.push(eq(users.isActive, isActive));
      if (emailVerified !== undefined) conditions.push(eq(users.emailVerified, emailVerified));

      try {
        const orderColumn = users[sortBy];
        const orderDirection = sortOrder === 'desc' ? desc(orderColumn) : asc(orderColumn);

        const results = await db
          .select({
            id: users.id,
            username: users.username,
            email: users.email,
            firstName: users.firstName,
            lastName: users.lastName,
            avatar: users.avatar,
            isActive: users.isActive,
            emailVerified: users.emailVerified,
            createdAt: users.createdAt,
          })
          .from(users)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(orderDirection)
          .limit(limit)
          .offset(offset);

        return results;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch users',
          cause: error,
        });
      }
    }),

  // Create new user
  create: protectedProcedure
    .input(createUserSchema)
    .mutation(async ({ input }) => {
      try {
        // Check if username already exists
        const existingUsername = await db
          .select()
          .from(users)
          .where(eq(users.username, input.username))
          .limit(1);

        if (existingUsername.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Username already exists',
          });
        }

        // Check if email already exists
        const existingEmail = await db
          .select()
          .from(users)
          .where(eq(users.email, input.email))
          .limit(1);

        if (existingEmail.length > 0) {
          throw new TRPCError({
            code: 'CONFLICT',
            message: 'Email already exists',
          });
        }

        const [newUser] = await db
          .insert(users)
          .values({
            username: input.username,
            email: input.email,
            firstName: input.firstName,
            lastName: input.lastName,
            isActive: true,
            emailVerified: false,
          })
          .returning();

        return newUser;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create user',
          cause: error,
        });
      }
    }),

  // Update user
  update: protectedProcedure
    .input(updateUserSchema)
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input;

      try {
        // Check if user exists
        const existing = await db
          .select()
          .from(users)
          .where(eq(users.id, id))
          .limit(1);

        if (!existing.length) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        // Check for username conflicts
        if (updateData.username && updateData.username !== existing[0].username) {
          const usernameConflict = await db
            .select()
            .from(users)
            .where(and(eq(users.username, updateData.username), eq(users.id, id)))
            .limit(1);

          if (usernameConflict.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Username already exists',
            });
          }
        }

        // Check for email conflicts
        if (updateData.email && updateData.email !== existing[0].email) {
          const emailConflict = await db
            .select()
            .from(users)
            .where(and(eq(users.email, updateData.email), eq(users.id, id)))
            .limit(1);

          if (emailConflict.length > 0) {
            throw new TRPCError({
              code: 'CONFLICT',
              message: 'Email already exists',
            });
          }
        }

        const [updatedUser] = await db
          .update(users)
          .set({
            ...updateData,
            updatedAt: new Date(),
          })
          .where(eq(users.id, id))
          .returning();

        return updatedUser;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update user',
          cause: error,
        });
      }
    }),

  // Deactivate user (soft delete)
  deactivate: protectedProcedure
    .input(z.object({
      id: z.number().positive(),
    }))
    .mutation(async ({ input }) => {
      try {
        const [updatedUser] = await db
          .update(users)
          .set({
            isActive: false,
            updatedAt: new Date(),
          })
          .where(eq(users.id, input.id))
          .returning();

        if (!updatedUser) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'User not found',
          });
        }

        return { success: true, message: 'User deactivated successfully' };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to deactivate user',
          cause: error,
        });
      }
    }),

  // Get user's posts
  getUserPosts: publicProcedure
    .input(z.object({
      userId: z.number().positive(),
      published: z.boolean().default(true),
      limit: z.number().min(1).max(100).default(10),
      offset: z.number().min(0).default(0),
    }))
    .query(async ({ input }) => {
      const { userId, published, limit, offset } = input;

      try {
        const conditions = [eq(posts.authorId, userId)];
        if (published !== undefined) {
          conditions.push(eq(posts.published, published));
        }

        return await db
          .select({
            id: posts.id,
            title: posts.title,
            slug: posts.slug,
            excerpt: posts.excerpt,
            published: posts.published,
            featured: posts.featured,
            viewCount: posts.viewCount,
            createdAt: posts.createdAt,
            updatedAt: posts.updatedAt,
          })
          .from(posts)
          .where(and(...conditions))
          .orderBy(desc(posts.createdAt))
          .limit(limit)
          .offset(offset);
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch user posts',
          cause: error,
        });
      }
    }),
});
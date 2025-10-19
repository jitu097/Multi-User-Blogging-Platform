import { TRPCError } from "@trpc/server";
import { eq, like, desc } from "drizzle-orm";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { db } from "@/server/db";
import { categories, type Category } from "@/lib/schema";
import { 
  createCategorySchema, 
  updateCategorySchema, 
  getCategoryBySlugSchema, 
  categoryFiltersSchema,
  idSchema
} from "@/lib/validations";
import { generateSlug } from "@/lib/utils";
import type { CategoryWithCounts } from "@/types";

export const categoryRouter = createTRPCRouter({
  // Get all categories
  getAll: publicProcedure
    .query(async (): Promise<Category[]> => {
      try {
        return await db
          .select()
          .from(categories)
          .orderBy(desc(categories.createdAt));
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch categories',
          cause: error,
        });
      }
    }),

  // Get category by slug
  getBySlug: publicProcedure
    .input(getCategoryBySlugSchema)
    .query(async ({ input }): Promise<Category> => {
      try {
        const [category] = await db
          .select()
          .from(categories)
          .where(eq(categories.slug, input));

        if (!category) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        return category;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to fetch category',
          cause: error,
        });
      }
    }),

  // Create new category
  create: publicProcedure
    .input(createCategorySchema)
    .mutation(async ({ input }): Promise<Category> => {
      try {
        const slug = generateSlug(input.name);
        
        const [newCategory] = await db
          .insert(categories)
          .values({
            name: input.name,
            description: input.description,
            slug,
          })
          .returning();

        if (!newCategory) {
          throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'Failed to create category',
          });
        }

        return newCategory;
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create category',
          cause: error,
        });
      }
    }),

  // Update category
  update: publicProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input }): Promise<Category> => {
      try {
        const { id, ...updateData } = input;
        
        // Update slug if name is being updated
        const updatePayload: Partial<Category> = { ...updateData };
        if (updateData.name) {
          updatePayload.slug = generateSlug(updateData.name);
        }

        const [updatedCategory] = await db
          .update(categories)
          .set({
            ...updatePayload,
            updatedAt: new Date(),
          })
          .where(eq(categories.id, id))
          .returning();

        if (!updatedCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        return updatedCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update category',
          cause: error,
        });
      }
    }),

  // Delete category
  delete: publicProcedure
    .input(idSchema)
    .mutation(async ({ input }): Promise<Category> => {
      try {
        const [deletedCategory] = await db
          .delete(categories)
          .where(eq(categories.id, input))
          .returning();

        if (!deletedCategory) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Category not found',
          });
        }

        return deletedCategory;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to delete category',
          cause: error,
        });
      }
    }),
});
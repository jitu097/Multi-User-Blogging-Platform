// Database utilities and optimized query helpers
import { eq, and, or, desc, asc, count, sql, like, ilike, inArray, isNull } from "drizzle-orm";
import { db } from "@/server/db";
import { 
  posts, 
  users, 
  categories, 
  postCategories, 
  tags, 
  postTags, 
  comments,
  type Post,
  type PostWithDetails,
  type CategoryWithHierarchy,
  type CommentWithAuthor
} from "@/lib/schema";

// Optimized post queries with proper joins and pagination
export class PostQueries {
  // Get posts with all related data
  static async getPostsWithDetails({
    limit = 10,
    offset = 0,
    authorId,
    categoryId,
    published,
    search,
  }: {
    limit?: number;
    offset?: number;
    authorId?: number;
    categoryId?: number;
    published?: boolean;
    search?: string;
  } = {}) {
    const conditions = [];
    
    if (authorId) conditions.push(eq(posts.authorId, authorId));
    if (published !== undefined) conditions.push(eq(posts.published, published));
    if (search) {
      conditions.push(
        or(
          ilike(posts.title, `%${search}%`),
          ilike(posts.content, `%${search}%`)
        )
      );
    }
    if (categoryId) {
      conditions.push(eq(postCategories.categoryId, categoryId));
    }

    const results = await db
      .select({
        post: posts,
        author: users,
        categoryId: postCategories.categoryId,
        categoryName: categories.name,
        categorySlug: categories.slug,
      })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .leftJoin(postCategories, eq(posts.id, postCategories.postId))
      .leftJoin(categories, eq(postCategories.categoryId, categories.id))
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(posts.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Group results by post
    const postsMap = new Map<number, PostWithDetails>();
    
    for (const row of results) {
      const postId = row.post.id;
      
      if (!postsMap.has(postId)) {
        postsMap.set(postId, {
          ...row.post,
          author: row.author!,
          postCategories: [],
          postTags: [],
        });
      }
      
      const post = postsMap.get(postId)!;
      
      // Add category if exists and not already added
      if (row.categoryId && row.categoryName && 
          !post.postCategories.some(c => c.categoryId === row.categoryId)) {
        post.postCategories.push({
          id: 0, // Junction table ID not important here
          postId: postId,
          categoryId: row.categoryId,
          createdAt: new Date(),
          category: {
            id: row.categoryId,
            name: row.categoryName,
            slug: row.categorySlug!,
            description: null,
            parentId: null,
            color: null,
            icon: null,
            isActive: true,
            sortOrder: 0,
            postCount: 0,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        });
      }
    }
    
    return Array.from(postsMap.values());
  }

  // Get single post with all details
  static async getPostBySlug(slug: string): Promise<PostWithDetails | null> {
    const results = await this.getPostsWithDetails({ limit: 1 });
    const post = results.find(p => p.slug === slug);
    
    if (post) {
      // Increment view count
      await db
        .update(posts)
        .set({ 
          viewCount: sql`${posts.viewCount} + 1`,
          updatedAt: new Date()
        })
        .where(eq(posts.id, post.id));
    }
    
    return post || null;
  }

  // Get post statistics
  static async getPostStats(postId: number) {
    const [postStats] = await db
      .select({
        viewCount: posts.viewCount,
        commentCount: count(comments.id),
        categoryCount: count(postCategories.categoryId),
        tagCount: count(postTags.tagId),
      })
      .from(posts)
      .leftJoin(comments, and(eq(comments.postId, posts.id), eq(comments.isApproved, true)))
      .leftJoin(postCategories, eq(postCategories.postId, posts.id))
      .leftJoin(postTags, eq(postTags.postId, posts.id))
      .where(eq(posts.id, postId))
      .groupBy(posts.id);

    return postStats;
  }
}

// Category queries with hierarchy support
export class CategoryQueries {
  // Get categories with hierarchy and post counts
  static async getCategoriesWithHierarchy(): Promise<CategoryWithHierarchy[]> {
    const allCategories = await db
      .select({
        category: categories,
        postCount: count(postCategories.postId),
      })
      .from(categories)
      .leftJoin(postCategories, eq(categories.id, postCategories.categoryId))
      .groupBy(categories.id)
      .orderBy(asc(categories.sortOrder), asc(categories.name));

    // Build hierarchy
    const categoryMap = new Map<number, CategoryWithHierarchy>();
    const rootCategories: CategoryWithHierarchy[] = [];

    // First pass: create all categories
    for (const row of allCategories) {
      const cat: CategoryWithHierarchy = {
        ...row.category,
        children: [],
        postCount: row.postCount || 0,
      };
      categoryMap.set(cat.id, cat);
    }

    // Second pass: build hierarchy
    for (const cat of categoryMap.values()) {
      if (cat.parentId) {
        const parent = categoryMap.get(cat.parentId);
        if (parent) {
          parent.children.push(cat);
          cat.parent = parent;
        }
      } else {
        rootCategories.push(cat);
      }
    }

    return rootCategories;
  }

  // Get category with posts
  static async getCategoryWithPosts(categorySlug: string, limit = 10, offset = 0) {
    const category = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, categorySlug))
      .limit(1);

    if (!category.length) return null;

    const posts = await PostQueries.getPostsWithDetails({
      categoryId: category[0].id,
      published: true,
      limit,
      offset,
    });

    return {
      category: category[0],
      posts,
    };
  }
}

// Comment queries with threading support
export class CommentQueries {
  // Get comments for a post with threading
  static async getPostComments(postId: number): Promise<CommentWithAuthor[]> {
    const allComments = await db
      .select({
        comment: comments,
        author: users,
      })
      .from(comments)
      .leftJoin(users, eq(comments.authorId, users.id))
      .where(and(eq(comments.postId, postId), eq(comments.isApproved, true)))
      .orderBy(asc(comments.createdAt));

    // Build comment threads
    const commentMap = new Map<number, CommentWithAuthor>();
    const rootComments: CommentWithAuthor[] = [];

    // First pass: create all comments
    for (const row of allComments) {
      const comment: CommentWithAuthor = {
        ...row.comment,
        author: row.author!,
        replies: [],
      };
      commentMap.set(comment.id, comment);
    }

    // Second pass: build threads
    for (const comment of commentMap.values()) {
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies!.push(comment);
        }
      } else {
        rootComments.push(comment);
      }
    }

    return rootComments;
  }
}

// Analytics and reporting queries
export class AnalyticsQueries {
  // Get popular posts by view count
  static async getPopularPosts(limit = 10, timeframe?: 'week' | 'month' | 'year') {
    const conditions = [eq(posts.published, true)];

    if (timeframe) {
      const date = new Date();
      switch (timeframe) {
        case 'week':
          date.setDate(date.getDate() - 7);
          break;
        case 'month':
          date.setMonth(date.getMonth() - 1);
          break;
        case 'year':
          date.setFullYear(date.getFullYear() - 1);
          break;
      }
      conditions.push(sql`${posts.createdAt} >= ${date}`);
    }

    return await db
      .select()
      .from(posts)
      .where(and(...conditions))
      .orderBy(desc(posts.viewCount))
      .limit(limit);
  }

  // Get content statistics
  static async getContentStats() {
    const [stats] = await db
      .select({
        totalPosts: count(posts.id),
        publishedPosts: sql<number>`COUNT(CASE WHEN ${posts.published} = true THEN 1 END)`,
        totalCategories: sql<number>`(SELECT COUNT(*) FROM ${categories})`,
        totalTags: sql<number>`(SELECT COUNT(*) FROM ${tags})`,
        totalComments: sql<number>`(SELECT COUNT(*) FROM ${comments} WHERE ${comments.isApproved} = true)`,
        totalUsers: sql<number>`(SELECT COUNT(*) FROM ${users})`,
      })
      .from(posts);

    return stats;
  }
}

// Database maintenance utilities
export class MaintenanceQueries {
  // Update category post counts
  static async updateCategoryPostCounts() {
    const categoryStats = await db
      .select({
        categoryId: postCategories.categoryId,
        postCount: count(postCategories.postId),
      })
      .from(postCategories)
      .leftJoin(posts, and(eq(postCategories.postId, posts.id), eq(posts.published, true)))
      .groupBy(postCategories.categoryId);

    for (const stat of categoryStats) {
      await db
        .update(categories)
        .set({ 
          postCount: stat.postCount,
          updatedAt: new Date()
        })
        .where(eq(categories.id, stat.categoryId));
    }
  }

  // Update tag usage counts
  static async updateTagUsageCounts() {
    const tagStats = await db
      .select({
        tagId: postTags.tagId,
        usageCount: count(postTags.postId),
      })
      .from(postTags)
      .leftJoin(posts, and(eq(postTags.postId, posts.id), eq(posts.published, true)))
      .groupBy(postTags.tagId);

    for (const stat of tagStats) {
      await db
        .update(tags)
        .set({ 
          usageCount: stat.usageCount,
          updatedAt: new Date()
        })
        .where(eq(tags.id, stat.tagId));
    }
  }

  // Clean up soft-deleted data
  static async cleanupDeletedComments() {
    return await db
      .delete(comments)
      .where(
        and(
          eq(comments.isDeleted, true),
          sql`${comments.updatedAt} < NOW() - INTERVAL '30 days'`
        )
      );
  }
}
/**
 * Database schema for the blog platform
 * Uses Drizzle ORM with PostgreSQL
 */

import { 
  pgTable, 
  serial, 
  text, 
  varchar, 
  integer, 
  timestamp, 
  boolean, 
  index,
  uniqueIndex,
  foreignKey,
  check,
  numeric
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// User accounts table - stores all registered users
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  firstName: varchar("first_name", { length: 50 }),
  lastName: varchar("last_name", { length: 50 }),
  bio: text("bio"),
  avatar: text("avatar_url"),
  isActive: boolean("is_active").default(true).notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Make sure usernames and emails are unique
  usernameIdx: uniqueIndex("users_username_idx").on(table.username),
  emailIdx: uniqueIndex("users_email_idx").on(table.email),
  
  // Indexes to speed up common queries
  activeUsersIdx: index("users_active_idx").on(table.isActive),
  createdAtIdx: index("users_created_at_idx").on(table.createdAt),
  
  // Validation at database level
  usernameLength: check("username_min_length", sql`length(${table.username}) >= 3`),
  emailFormat: check("email_format", sql`${table.email} ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'`),
}));

// Blog posts table - the main content
export const posts = pgTable("posts", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  content: text("content"),
  excerpt: varchar("excerpt", { length: 500 }), // Short preview
  authorId: integer("author_id").notNull(),
  slug: varchar("slug", { length: 250 }).notNull(), // URL-friendly version of title
  published: boolean("published").default(false).notNull(), // Draft vs published
  featured: boolean("featured").default(false).notNull(), // Highlight important posts
  viewCount: integer("view_count").default(0).notNull(),
  readingTime: integer("reading_time_minutes").default(1),
  seoTitle: varchar("seo_title", { length: 60 }), // For better Google results
  seoDescription: varchar("seo_description", { length: 160 }),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Link posts to their authors, delete posts if user is deleted
  authorFk: foreignKey({
    columns: [table.authorId],
    foreignColumns: [users.id],
    name: "posts_author_fk"
  }).onDelete("cascade"),
  
  // Slugs must be unique for routing
  slugIdx: uniqueIndex("posts_slug_idx").on(table.slug),
  
  // Speed up queries by author, publication status, etc.
  authorIdx: index("posts_author_idx").on(table.authorId),
  publishedIdx: index("posts_published_idx").on(table.published),
  featuredIdx: index("posts_featured_idx").on(table.featured),
  publishedAtIdx: index("posts_published_at_idx").on(table.publishedAt),
  createdAtIdx: index("posts_created_at_idx").on(table.createdAt),
  
  // Combo index for "show recent published posts" queries
  publishedCreatedIdx: index("posts_published_created_idx").on(table.published, table.createdAt),
  authorPublishedIdx: index("posts_author_published_idx").on(table.authorId, table.published),
  
  // Check constraints
  titleLength: check("title_min_length", sql`length(${table.title}) >= 5`),
  slugLength: check("slug_min_length", sql`length(${table.slug}) >= 3`),
  viewCountNonNegative: check("view_count_non_negative", sql`${table.viewCount} >= 0`),
  readingTimePositive: check("reading_time_positive", sql`${table.readingTime} > 0`),
}));

// Categories table with enhanced fields and hierarchy support
export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  description: text("description"),
  slug: varchar("slug", { length: 120 }).notNull(),
  parentId: integer("parent_id"),
  color: varchar("color", { length: 7 }), // Hex color code
  icon: varchar("icon", { length: 50 }), // Icon name or emoji
  isActive: boolean("is_active").default(true).notNull(),
  sortOrder: integer("sort_order").default(0).notNull(),
  postCount: integer("post_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  // Self-referencing foreign key for hierarchy
  parentFk: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: "categories_parent_fk"
  }).onDelete("set null"),
  
  // Unique constraints
  nameIdx: uniqueIndex("categories_name_idx").on(table.name),
  slugIdx: uniqueIndex("categories_slug_idx").on(table.slug),
  
  // Performance indexes
  parentIdx: index("categories_parent_idx").on(table.parentId),
  activeIdx: index("categories_active_idx").on(table.isActive),
  sortOrderIdx: index("categories_sort_order_idx").on(table.sortOrder),
  
  // Check constraints
  nameLength: check("category_name_min_length", sql`length(${table.name}) >= 2`),
  slugLength: check("category_slug_min_length", sql`length(${table.slug}) >= 2`),
  colorFormat: check("color_hex_format", sql`${table.color} ~* '^#[0-9A-Fa-f]{6}$' OR ${table.color} IS NULL`),
  postCountNonNegative: check("post_count_non_negative", sql`${table.postCount} >= 0`),
}));

// Post-Category junction table with enhanced constraints
export const postCategories = pgTable("post_categories", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  categoryId: integer("category_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  // Foreign keys with proper constraints
  postFk: foreignKey({
    columns: [table.postId],
    foreignColumns: [posts.id],
    name: "post_categories_post_fk"
  }).onDelete("cascade"),
  
  categoryFk: foreignKey({
    columns: [table.categoryId],
    foreignColumns: [categories.id],
    name: "post_categories_category_fk"
  }).onDelete("cascade"),
  
  // Unique constraint to prevent duplicate relationships
  postCategoryIdx: uniqueIndex("post_categories_unique_idx").on(table.postId, table.categoryId),
  
  // Performance indexes
  postIdx: index("post_categories_post_idx").on(table.postId),
  categoryIdx: index("post_categories_category_idx").on(table.categoryId),
}));

// Tags table for more flexible tagging system
export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 50 }).notNull(),
  slug: varchar("slug", { length: 60 }).notNull(),
  description: text("description"),
  color: varchar("color", { length: 7 }), // Hex color code
  usageCount: integer("usage_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  nameIdx: uniqueIndex("tags_name_idx").on(table.name),
  slugIdx: uniqueIndex("tags_slug_idx").on(table.slug),
  usageCountIdx: index("tags_usage_count_idx").on(table.usageCount),
  
  nameLength: check("tag_name_min_length", sql`length(${table.name}) >= 2`),
  colorFormat: check("tag_color_hex_format", sql`${table.color} ~* '^#[0-9A-Fa-f]{6}$' OR ${table.color} IS NULL`),
  usageCountNonNegative: check("tag_usage_count_non_negative", sql`${table.usageCount} >= 0`),
}));

// Post-Tags junction table
export const postTags = pgTable("post_tags", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  tagId: integer("tag_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  postFk: foreignKey({
    columns: [table.postId],
    foreignColumns: [posts.id],
    name: "post_tags_post_fk"
  }).onDelete("cascade"),
  
  tagFk: foreignKey({
    columns: [table.tagId],
    foreignColumns: [tags.id],
    name: "post_tags_tag_fk"
  }).onDelete("cascade"),
  
  postTagIdx: uniqueIndex("post_tags_unique_idx").on(table.postId, table.tagId),
  postIdx: index("post_tags_post_idx").on(table.postId),
  tagIdx: index("post_tags_tag_idx").on(table.tagId),
}));

// Comments table for engagement
export const comments = pgTable("comments", {
  id: serial("id").primaryKey(),
  postId: integer("post_id").notNull(),
  authorId: integer("author_id").notNull(),
  parentId: integer("parent_id"), // For nested comments
  content: text("content").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  isDeleted: boolean("is_deleted").default(false).notNull(),
  likeCount: integer("like_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  postFk: foreignKey({
    columns: [table.postId],
    foreignColumns: [posts.id],
    name: "comments_post_fk"
  }).onDelete("cascade"),
  
  authorFk: foreignKey({
    columns: [table.authorId],
    foreignColumns: [users.id],
    name: "comments_author_fk"
  }).onDelete("cascade"),
  
  parentFk: foreignKey({
    columns: [table.parentId],
    foreignColumns: [table.id],
    name: "comments_parent_fk"
  }).onDelete("cascade"),
  
  postIdx: index("comments_post_idx").on(table.postId),
  authorIdx: index("comments_author_idx").on(table.authorId),
  parentIdx: index("comments_parent_idx").on(table.parentId),
  approvedIdx: index("comments_approved_idx").on(table.isApproved),
  createdAtIdx: index("comments_created_at_idx").on(table.createdAt),
  
  contentLength: check("comment_content_min_length", sql`length(${table.content}) >= 1`),
  likeCountNonNegative: check("comment_like_count_non_negative", sql`${table.likeCount} >= 0`),
}));

// Relations with enhanced relationships
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  postCategories: many(postCategories),
  postTags: many(postTags),
  comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ one, many }) => ({
  parent: one(categories, {
    fields: [categories.parentId],
    references: [categories.id],
  }),
  children: many(categories),
  postCategories: many(postCategories),
}));

export const postCategoriesRelations = relations(postCategories, ({ one }) => ({
  post: one(posts, {
    fields: [postCategories.postId],
    references: [posts.id],
  }),
  category: one(categories, {
    fields: [postCategories.categoryId],
    references: [categories.id],
  }),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  postTags: many(postTags),
}));

export const postTagsRelations = relations(postTags, ({ one }) => ({
  post: one(posts, {
    fields: [postTags.postId],
    references: [posts.id],
  }),
  tag: one(tags, {
    fields: [postTags.tagId],
    references: [tags.id],
  }),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  parent: one(comments, {
    fields: [comments.parentId],
    references: [comments.id],
  }),
  replies: many(comments),
}));

// Type exports with comprehensive type safety
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;
export type Category = typeof categories.$inferSelect;
export type NewCategory = typeof categories.$inferInsert;
export type PostCategory = typeof postCategories.$inferSelect;
export type NewPostCategory = typeof postCategories.$inferInsert;
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type PostTag = typeof postTags.$inferSelect;
export type NewPostTag = typeof postTags.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;

// Composite types for complex queries
export type PostWithDetails = Post & {
  author: User;
  postCategories: (PostCategory & { category: Category })[];
  postTags: (PostTag & { tag: Tag })[];
  comments?: Comment[];
};

export type CategoryWithHierarchy = Category & {
  parent?: Category;
  children: Category[];
  postCount: number;
};

export type CommentWithAuthor = Comment & {
  author: User;
  replies?: CommentWithAuthor[];
};
"use client";

import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { useFilterStore } from "@/stores/filterStore";
import { api } from "@/trpc/react";
import { Loader2, PlusCircle, BookOpen, Users, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { searchQuery, selectedCategoryId, showPublishedOnly } = useFilterStore();
  
  // Fetch posts with filters
  const { data: posts, isLoading: postsLoading } = api.post.getAll.useQuery({
    search: searchQuery || undefined,
    categoryId: selectedCategoryId || undefined,
    published: showPublishedOnly || undefined,
    limit: 20,
    offset: 0,
  });

  // Fetch categories for filter
  const { data: categories = [] } = api.category.getAll.useQuery();

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Welcome to your Dashboard!</h1>
                    <p className="text-blue-100 text-lg">
                      Manage your blog posts, explore content, and connect with the community.
                    </p>
                  </div>
                  <Link
                    href="/posts/create"
                    className="mt-4 md:mt-0 bg-white text-blue-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Create New Post
                  </Link>
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {posts ? posts.length : '-'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <Users className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {categories.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <TrendingUp className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-700">Published</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {posts ? posts.filter(post => post.published).length : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="mb-8">
              <FilterBar categories={categories} />
            </div>

            {/* Posts Section */}
            <div className="bg-white rounded-xl shadow-sm border">
              <div className="p-6 border-b">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
                  <Link
                    href="/posts"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All Posts
                  </Link>
                </div>
              </div>

              <div className="p-6">
                {postsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                    <span className="ml-2 text-gray-700">Loading posts...</span>
                  </div>
                ) : posts && posts.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {posts.slice(0, 6).map((post) => (
                      <PostCard key={post.id} post={post as any} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No posts found</h3>
                    <p className="text-gray-700 mb-6">
                      {searchQuery || selectedCategoryId || showPublishedOnly
                        ? "No posts match your current filters."
                        : "Get started by creating your first post!"}
                    </p>
                    <Link
                      href="/posts/create"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors inline-flex items-center gap-2"
                    >
                      <PlusCircle className="w-5 h-5" />
                      Create Your First Post
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Link
                    href="/posts/create"
                    className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <PlusCircle className="w-5 h-5 text-gray-900 mr-3" />
                      <span className="font-medium text-gray-900">Create New Post</span>
                    </div>
                  </Link>
                  <Link
                    href="/categories"
                    className="block w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-gray-900 mr-3" />
                      <span className="font-medium text-gray-900">Manage Categories</span>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                <div className="text-gray-700">
                  <p>Activity tracking coming soon...</p>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
}
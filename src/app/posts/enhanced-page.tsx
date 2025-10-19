// Enhanced posts page with React best practices and performance optimizations
"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { LoadingSpinner, EmptyState, Alert } from "@/components/ui";
import { useFilterStore } from "@/stores/filterStore";
import { api } from "@/trpc/react";
import { Loader2, ChevronLeft, ChevronRight, FileText, Plus } from "lucide-react";
import Link from "next/link";
import { useDebounce, useDocumentTitle } from "@/hooks";
import type { PostWithCategories } from "@/types";

// Memoized components for better performance
const MemoizedPostCard = memo(PostCard);
const MemoizedFilterBar = memo(FilterBar);

// Pagination component
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = memo(({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePrevious = useCallback(() => {
    onPageChange(Math.max(1, currentPage - 1));
  }, [currentPage, onPageChange]);

  const handleNext = useCallback(() => {
    onPageChange(Math.min(totalPages, currentPage + 1));
  }, [currentPage, totalPages, onPageChange]);

  const pages = useMemo(() => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  }, [currentPage, totalPages]);
  
  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-8">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
  className="p-2 rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <div className="flex items-center gap-1">
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              currentPage === page
                ? "bg-blue-600 text-white"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
            }`}
            aria-label={`Go to page ${page}`}
            aria-current={currentPage === page ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
  className="p-2 rounded-md border border-gray-300 text-gray-700 hover:text-gray-900 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Next page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
});

Pagination.displayName = 'Pagination';

// Posts grid component
interface PostsGridProps {
  posts: PostWithCategories[];
  loading: boolean;
  error: any;
}

const PostsGrid = memo(({ posts, loading, error }: PostsGridProps) => {
  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="space-y-2 mb-4">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              <div className="flex gap-2">
                <div className="h-6 bg-gray-200 rounded w-16"></div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        variant="error"
        title="Error loading posts"
        description={error.message}
      />
    );
  }

  if (posts.length === 0) {
    return (
      <EmptyState
        icon={FileText}
        title="No posts found"
        description="No posts match your current filters. Try adjusting your search or clear filters."
        action={
          <Link
            href="/posts/create"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create your first post
          </Link>
        }
      />
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <MemoizedPostCard 
          key={post.id} 
          post={post}
          showActions={true}
        />
      ))}
    </div>
  );
});

PostsGrid.displayName = 'PostsGrid';

export default function PostsPage() {
  const { searchQuery, selectedCategoryId, showPublishedOnly, setSearchQuery } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  
  // Debounce search query for better performance
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  
  // Set document title
  useDocumentTitle('All Posts - BlogPlatform');
  
  // Fetch posts with filters and pagination
  const { 
    data: posts, 
    isLoading: postsLoading,
    error: postsError,
    refetch: refetchPosts
  } = api.post.getAll.useQuery({
    search: debouncedSearchQuery || undefined,
    categoryId: selectedCategoryId || undefined,
    published: showPublishedOnly || undefined,
    limit: postsPerPage,
    offset: (currentPage - 1) * postsPerPage,
  }, {
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch categories for filter
  const { data: categories = [], isLoading: categoriesLoading } = api.category.getAll.useQuery(
    undefined,
    {
      staleTime: 10 * 60 * 1000, // 10 minutes
    }
  );

  // Reset to first page when filters change
  const handleFiltersChange = useCallback(() => {
    setCurrentPage(1);
  }, []);

  // Memoized pagination calculations
  const paginationInfo = useMemo(() => {
    const totalPosts = posts?.length || 0;
    const totalPages = Math.max(1, Math.ceil(totalPosts / postsPerPage));
    
    return {
      totalPosts,
      totalPages,
      hasNextPage: currentPage < totalPages,
      hasPreviousPage: currentPage > 1,
    };
  }, [posts?.length, currentPage, postsPerPage]);

  // Handle page changes
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Retry function for error handling
  const handleRetry = useCallback(() => {
    refetchPosts();
  }, [refetchPosts]);

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <MemoizedFilterBar 
            categories={categories}
          />
          
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
                  <p className="text-gray-700 mt-2">
                    Discover amazing stories and insights from our community
                    {paginationInfo.totalPosts > 0 && (
                      <span className="ml-2 text-sm">
                        ({paginationInfo.totalPosts} {paginationInfo.totalPosts === 1 ? 'post' : 'posts'})
                      </span>
                    )}
                  </p>
                </div>
                
                <Link
                  href="/posts/create"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  New Post
                </Link>
              </div>
              
              {/* Enhanced Search */}
              <div className="mt-6 max-w-md">
                <SearchBar 
                  onSearch={setSearchQuery}
                  initialValue={searchQuery || ""}
                  placeholder="Search posts by title or content..."
                />
              </div>
            </div>

            {/* Loading State for Categories */}
            {categoriesLoading && (
              <div className="mb-4">
                <LoadingSpinner size="sm" text="Loading filters..." />
              </div>
            )}

            {/* Posts Grid */}
            <PostsGrid 
              posts={posts || []}
              loading={postsLoading}
              error={postsError}
            />

            {/* Retry Button for Errors */}
            {postsError && (
              <div className="text-center mt-8">
                <button
                  onClick={handleRetry}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            )}

            {/* Pagination */}
            {posts && posts.length > 0 && (
              <Pagination
                currentPage={currentPage}
                totalPages={paginationInfo.totalPages}
                onPageChange={handlePageChange}
              />
            )}

            {/* Clear Filters Suggestion */}
            {posts?.length === 0 && !postsLoading && (debouncedSearchQuery || selectedCategoryId || showPublishedOnly) && (
              <div className="text-center mt-8">
                <p className="text-gray-500 mb-4">
                  No posts found matching your filters.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    // Reset other filters through store actions
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </main>
        </div>
      </SignedIn>
    </>
  );
}
"use client";

import { useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { FilterBar } from "@/components/FilterBar";
import { PostCard } from "@/components/PostCard";
import { SearchBar } from "@/components/SearchBar";
import { useFilterStore } from "@/stores/filterStore";
import { api } from "@/trpc/react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

export default function PostsPage() {
  const { searchQuery, selectedCategoryId, showPublishedOnly, setSearchQuery } = useFilterStore();
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 12;
  
  // Fetch posts with filters and pagination
  const { data: posts, isLoading: postsLoading } = api.post.getAll.useQuery({
    search: searchQuery || undefined,
    categoryId: selectedCategoryId || undefined,
    published: showPublishedOnly || undefined,
    limit: postsPerPage,
    offset: (currentPage - 1) * postsPerPage,
  });

  // Reset to first page when filters change
  useState(() => {
    setCurrentPage(1);
  });

  const totalPages = posts ? Math.ceil(posts.length / postsPerPage) : 0;

  // Fetch categories for filter
  const { data: categories = [] } = api.category.getAll.useQuery();

  if (postsLoading) {
    return (
      <>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <SignedIn>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          </div>
        </SignedIn>
      </>
    );
  }

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <FilterBar categories={categories} />
          
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">All Posts</h1>
          <p className="text-gray-600 mt-2">
            Discover amazing stories and insights from our community
          </p>
          
          {/* Enhanced Search */}
          <div className="mt-6 max-w-md">
            <SearchBar 
              onSearch={setSearchQuery}
              initialValue={searchQuery || ""}
              placeholder="Search posts by title or content..."
            />
          </div>
        </div>

        {posts && posts.length > 0 ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.id} post={post as any} />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-md border border-gray-300 text-gray-500 hover:text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery || selectedCategoryId || showPublishedOnly
                ? "No posts found matching your filters."
                : "No posts available yet."}
            </p>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </main>
        </div>
      </SignedIn>
    </>
  );
}
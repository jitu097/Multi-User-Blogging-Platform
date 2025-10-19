"use client";

import { use } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { api } from "@/trpc/react";
import { Loader2, Calendar, Tag, ArrowLeft, Edit, Trash2, Clock, FileText, User } from "lucide-react";
import { calculatePostStats, formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

export default function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter();
  const { slug } = use(params);

  // Fetch the post by slug
  const { data: post, isLoading, error } = api.post.getBySlug.useQuery(slug);

  // Delete post mutation
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      router.push("/posts");
    },
  });

  const handleDelete = async () => {
    if (!post || !confirm("Are you sure you want to delete this post?")) return;
    await deletePost.mutateAsync(post.id);
  };

  if (isLoading) {
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

  if (error || !post) {
    return (
      <>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
        <SignedIn>
          <div className="min-h-screen bg-gray-50">
            <Navbar />
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
                <p className="text-gray-700 mb-6">The post you&apos;re looking for doesn&apos;t exist.</p>
                <Link
                  href="/posts"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
                >
                  Back to Posts
                </Link>
              </div>
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
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Button */}
            <div className="mb-6">
              <Link
                href="/posts"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Link>
            </div>

            {/* Post Content */}
            <article className="bg-white rounded-lg shadow-sm border">
              {/* Header */}
              <div className="p-6 border-b">
                <div className="flex justify-between items-start mb-4">
                  <h1 className="text-3xl font-bold text-gray-900 leading-tight">{post.title}</h1>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/posts/${post.slug}/edit`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      title="Edit post"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={handleDelete}
                      disabled={deletePost.isPending}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
                      title="Delete post"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Post Statistics */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Published {formatRelativeTime(post.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>{calculatePostStats(post.content || '').readingTime} min read</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      <span>{calculatePostStats(post.content || '').wordCount} words</span>
                    </div>

                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      post.published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {post.published ? "Published" : "Draft"}
                    </div>
                  </div>
                </div>

                {/* Categories */}
                {post.categories && post.categories.length > 0 && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Tag className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600 mr-2">Categories:</span>
                    {post.categories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/categories/${category.slug}`}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition-colors"
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: post.content || '' }}
                />
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div>
                    Created: {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  {post.updatedAt && post.updatedAt !== post.createdAt && (
                    <div>
                      Updated: {new Date(post.updatedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </article>
          </main>
        </div>
      </SignedIn>
    </>
  );
}
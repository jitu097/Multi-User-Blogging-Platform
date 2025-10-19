"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { RichTextEditor } from "@/components/RichTextEditor";
import { api } from "@/trpc/react";
import { Save, Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

export default function EditPostPage({ params }: { params: { slug: string } }) {
  const router = useRouter();
  const { slug } = params;
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Fetch the post to edit
  const { data: post, isLoading: postLoading } = api.post.getBySlug.useQuery(slug);
  
  // Fetch categories
  const { data: categories = [] } = api.category.getAll.useQuery();

  // Update post mutation
  const updatePost = api.post.update.useMutation({
    onSuccess: (data) => {
      router.push(`/posts/${data?.slug}`);
    },
  });

  // Populate form when post loads
  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setPublished(post.published || false);
      setSelectedCategories(post.categories?.map(cat => cat.id) || []);
    }
  }, [post]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !post) return;

    await updatePost.mutateAsync({
      id: post.id,
      title: title.trim(),
      content: content.trim(),
      published,
      categoryIds: selectedCategories,
    });
  };

  const handleCategoryToggle = (categoryId: number) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (postLoading) {
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

  if (!post) {
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
                <p className="text-gray-600 mb-6">The post you&apos;re trying to edit doesn&apos;t exist.</p>
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
                href={`/posts/${slug}`}
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Post
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h1 className="text-2xl font-bold text-gray-900">Edit Post</h1>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter post title..."
                    required
                  />
                </div>

                  {/* Content */}
                  <div>
                    <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                      Content *
                    </label>
                    <RichTextEditor
                      content={content}
                      onChange={setContent}
                      placeholder="Write your post content here..."
                    />
                  </div>                {/* Categories */}
                {categories.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Categories
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          type="button"
                          onClick={() => handleCategoryToggle(category.id)}
                          className={`px-3 py-1 rounded-full text-sm transition-colors ${
                            selectedCategories.includes(category.id)
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Published Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setPublished(!published)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md transition-colors ${
                      published
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {published ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    {published ? "Published" : "Draft"}
                  </button>
                </div>

                {/* Submit Button */}
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={updatePost.isPending || !title.trim() || !content.trim()}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    {updatePost.isPending ? "Saving..." : "Update Post"}
                  </button>
                  
                  <Link
                    href={`/posts/${slug}`}
                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </Link>
                </div>
              </form>
            </div>
          </main>
        </div>
      </SignedIn>
    </>
  );
}
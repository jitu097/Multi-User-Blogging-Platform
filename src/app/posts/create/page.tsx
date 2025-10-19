"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { RichTextEditor } from "@/components/RichTextEditor";
import { api } from "@/trpc/react";
import { Save, Eye, EyeOff, FileText, Clock } from "lucide-react";
import { calculatePostStats, extractPreview, formatDate } from "@/lib/utils";

export default function CreatePostPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [published, setPublished] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [isPreview, setIsPreview] = useState(false);

  // Fetch categories
  const { data: categories = [] } = api.category.getAll.useQuery();

  // Create post mutation
  const createPost = api.post.create.useMutation({
    onSuccess: (data) => {
      router.push(`/posts/${data?.slug}`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    await createPost.mutateAsync({
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

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold text-gray-900">Create New Post</h1>
              
              {/* Preview Toggle */}
              <div className="flex items-center gap-4">
                {title && content && (
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>{calculatePostStats(content).wordCount} words</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{calculatePostStats(content).readingTime} min read</span>
                    </div>
                  </div>
                )}
                
                <button
                  type="button"
                  onClick={() => setIsPreview(!isPreview)}
                  disabled={!title || !content}
                  className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Eye className="w-4 h-4" />
                  {isPreview ? "Edit" : "Preview"}
                </button>
              </div>
            </div>
          </div>
          
          {isPreview ? (
            /* Preview Mode */
            <div className="p-6">
              <div className="max-w-none">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                    <span>Preview • {formatDate(new Date())}</span>
                    <span>{calculatePostStats(content).readingTime} min read</span>
                    <span>{calculatePostStats(content).wordCount} words</span>
                    
                    {selectedCategories.length > 0 && (
                      <div className="flex items-center gap-2">
                        <span>Categories:</span>
                        {categories.filter(cat => selectedCategories.includes(cat.id)).map((category) => (
                          <span
                            key={category.id}
                            className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs"
                          >
                            {category.name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          ) : (
            /* Edit Mode */
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
                </div>            {/* Categories */}
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
                disabled={createPost.isPending || !title.trim() || !content.trim()}
                className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-2 rounded-md transition-colors"
              >
                <Save className="w-4 h-4" />
                {createPost.isPending ? "Saving..." : "Save Post"}
              </button>
              
              <button
                type="button"
                onClick={() => router.push("/posts")}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
          )}
        </div>
      </main>
        </div>
      </SignedIn>
    </>
  );
}
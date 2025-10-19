"use client";

import { useState } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from "@/components/Navbar";
import { api } from "@/trpc/react";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");

  // Queries
  const { data: categories = [], refetch } = api.category.getAll.useQuery();

  // Mutations
  const createCategory = api.category.create.useMutation({
    onSuccess: () => {
      refetch();
      setIsCreating(false);
      setNewCategoryName("");
      setNewCategoryDescription("");
    },
  });

  const deleteCategory = api.category.delete.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    await createCategory.mutateAsync({
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || undefined,
    });
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      await deleteCategory.mutateAsync(id);
    }
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Categories</h1>
            <p className="text-gray-600 mt-2">
              Organize your blog posts with categories
            </p>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Category
          </button>
        </div>

        {/* Create Category Form */}
        {isCreating && (
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Create New Category</h2>
            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  id="name"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Category name..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={newCategoryDescription}
                  onChange={(e) => setNewCategoryDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Optional description..."
                />
              </div>
              
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={createCategory.isPending || !newCategoryName.trim()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md transition-colors"
                >
                  {createCategory.isPending ? "Creating..." : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategoryName("");
                    setNewCategoryDescription("");
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Categories List */}
        <div className="bg-white rounded-lg shadow-sm border">
          {categories.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {categories.map((category) => (
                <div key={category.id} className="p-6 flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-gray-600 mt-1">{category.description}</p>
                    )}
                    <p className="text-sm text-gray-400 mt-2">
                      Slug: {category.slug}
                    </p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setEditingId(category.id)}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      title="Edit category"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      disabled={deleteCategory.isPending}
                      className="p-2 text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      title="Delete category"
                    >
                      {deleteCategory.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <p className="text-gray-500 text-lg">
                No categories created yet.
              </p>
              <button
                onClick={() => setIsCreating(true)}
                className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
              >
                Create your first category
              </button>
            </div>
          )}
        </div>
      </main>
        </div>
      </SignedIn>
    </>
  );
}
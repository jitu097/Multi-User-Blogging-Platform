"use client";

import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { useFilterStore } from "@/stores/filterStore";

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface FilterBarProps {
  categories: Category[];
}

export function FilterBar({ categories }: FilterBarProps) {
  const {
    searchQuery,
    selectedCategoryId,
    showPublishedOnly,
    setSearchQuery,
    setSelectedCategoryId,
    setShowPublishedOnly,
    clearFilters,
  } = useFilterStore();

  const [showFilters, setShowFilters] = useState(false);

  const hasActiveFilters = searchQuery || selectedCategoryId || showPublishedOnly;

  return (
    <div className="bg-white border-b">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-700 w-4 h-4" />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Filter Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-900 transition-colors"
          >
            <Filter className="w-4 h-4 text-white" />
            Filters
            {hasActiveFilters && (
              <span className="bg-white text-black rounded-full w-2 h-2"></span>
            )}
          </button>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-gray-700 hover:text-gray-900 p-2"
              title="Clear all filters"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Extended Filters */}
        {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-md text-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategoryId || ""}
                  onChange={(e) =>
                    setSelectedCategoryId(e.target.value ? Number(e.target.value) : null)
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All categories</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showPublishedOnly}
                      onChange={(e) => setShowPublishedOnly(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      Published only
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
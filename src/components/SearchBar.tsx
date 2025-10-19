"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  initialValue?: string;
}

export function SearchBar({ onSearch, placeholder = "Search posts...", initialValue = "" }: SearchBarProps) {
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const debounced = setTimeout(() => {
      onSearch(query);
    }, 300);

    return () => clearTimeout(debounced);
  }, [query, onSearch]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
      
      {query && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <button
            onClick={clearSearch}
            className="text-gray-400 hover:text-gray-600 focus:outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
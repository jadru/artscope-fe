"use client";

import { Search, SlidersHorizontal } from "lucide-react";
import { useState } from "react";

interface SearchHeaderProps {
  onSearch?: (query: string) => void;
  onFilterClick?: () => void;
}

export default function SearchHeader({
  onSearch,
  onFilterClick,
}: SearchHeaderProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(query);
  };

  return (
    <div className="sticky top-0 z-40 bg-white px-4 py-4">
      <div className="mx-auto flex max-w-7xl items-center gap-3">
        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search artworks, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-12 w-full rounded-full border border-gray-200 bg-white pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 outline-none transition-shadow focus:border-gray-300 focus:ring-2 focus:ring-gray-100"
          />
        </form>

        {/* Filters Button */}
        <button
          type="button"
          onClick={onFilterClick}
          className="flex h-12 items-center gap-2 rounded-full border border-gray-200 bg-white px-5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          <SlidersHorizontal className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>
    </div>
  );
}

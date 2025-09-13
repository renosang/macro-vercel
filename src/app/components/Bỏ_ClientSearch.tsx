// src/app/components/SearchBar.tsx
"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
  initialQuery = "",
}: {
  onSearch: (q: string) => void;
  initialQuery?: string;
}) {
  const [query, setQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <div className="flex justify-center w-full max-w-2xl relative mx-auto my-6">
      <form onSubmit={handleSearch} className="w-full">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm kiếm tiêu aâđề hoặc nội dung..."
          className="w-full h-14 pl-6 pr-12 text-lg rounded-full border border-gray-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none shadow-sm transition-all duration-300"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Search"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </button>
      </form>
    </div>
  );
}
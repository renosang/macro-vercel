// src/components/SearchBarWithFilter.tsx
"use client";
import React, { useState, useEffect } from "react";

type Props = {
  onQueryChange?: (q: string) => void;
  placeholder?: string;
};

export default function SearchBarWithFilter({ onQueryChange, placeholder }: Props) {
  const [q, setQ] = useState("");

  useEffect(() => {
    if (onQueryChange) onQueryChange(q);
  }, [q, onQueryChange]);

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-2xl">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={placeholder ?? "Tìm kiếm..."}
            className="w-full p-4 rounded-full shadow-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#c33] focus:border-transparent"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
    </div>
  );
}
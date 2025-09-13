// src/app/components/HeroSearch.tsx
"use client";
import React from "react";

export default function HeroSearch({ query, setQuery }: { query: string; setQuery: (v: string) => void }) {
  return (
    <div className="py-6">
      <div className="text-center">
        <div className="hero-title">Tra cứu Macro tư vấn</div>
        <div className="hero-sub">Tìm macro nhanh theo tên hoặc nội dung — bấm vào card để xem chi tiết</div>
      </div>

      <div className="mt-6 flex justify-center">
        <div className="w-full max-w-2xl relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm kiếm tiêu đề hoặc nội dung..."
            className="search-input pr-12"
            aria-label="Tìm kiếm"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
        </div>
      </div>
    </div>
  );
}
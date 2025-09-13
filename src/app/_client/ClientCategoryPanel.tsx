// src/app/_client/ClientCategoryPanel.tsx
"use client";
import React, { useMemo, useState, useEffect } from "react";
import CategoryCard from "../components/CategoryCard";
import HeroSearch from "../components/HeroSearch";

type Category = { id: string; name: string; description?: string };
type Macro = { id: string; categoryId?: string; title?: string; content?: string };

export default function ClientCategoryPanel({ serverCategories }: { serverCategories: Category[] }) {
  const [q, setQ] = useState("");
  const [macros, setMacros] = useState<Macro[]>([]);

  useEffect(() => {
    fetch("/api/macros").then(r => r.json()).then(setMacros).catch(()=>setMacros([]));
  }, []);

  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const m of macros) {
      const k = m.categoryId ?? "__uncat";
      map[k] = (map[k] || 0) + 1;
    }
    return map;
  }, [macros]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return serverCategories;
    return serverCategories.filter(c => c.name.toLowerCase().includes(term));
  }, [q, serverCategories]);

  return (
    <div>
      <HeroSearch query={q} setQuery={setQ} />

      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold">Nhãn hàng <span className="text-sm text-gray-500">({filtered.length})</span></h3>
      </div>

      <div className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map(c => (
            <div key={c.id} className="cat-card bg-gradient-to-br from-white to-white">
              <CategoryCard id={c.id} name={c.name} count={counts[c.id] ?? 0} highlight={q} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
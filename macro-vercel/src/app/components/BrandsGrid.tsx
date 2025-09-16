import React from "react";
import BrandCard from "./BrandCard";

type Item = { name: string; count: number };

const palette = [
  "linear-gradient(135deg,#ffd6d6,#fff1f1)",
  "linear-gradient(135deg,#dff7ea,#eefcf3)",
  "linear-gradient(135deg,#dcecff,#f3f9ff)",
  "linear-gradient(135deg,#fff4d6,#fffaef)",
  "linear-gradient(135deg,#fff0e0,#fff9f4)"
];

export default function BrandsGrid({ items }: { items: Item[] }) {
  return (
    <div className="max-w-6xl mx-auto px-4 pb-12">
      <h2 className="text-center font-semibold mb-6">
        Danh mục <span className="text-red-500">({items.length})</span>
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((it, idx) => (
          <BrandCard key={it.name} name={it.name} count={it.count} gradient={palette[idx % palette.length]} />
        ))}
      </div>
    </div>
  );
}
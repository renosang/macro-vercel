import Link from "next/link";
import React from "react";

type Props = {
  id: string;
  name: string;
  count?: number;
  highlight?: string;
};

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[$\\\/]/g, "\\$&");
}

function highlightText(name: string, query?: string) {
  if (!query) return name;
  const q = escapeRegExp(query);
  try {
    const re = new RegExp(`(${q})`, "ig");
    const parts = name.split(re);
    return (
      <>
        {parts.map((p, i) =>
          re.test(p) ? (
            <mark key={i} className="text-sm">{p}</mark>
          ) : (
            <span key={i} className="text-sm">{p}</span>
          )
        )}
      </>
    );
  } catch {
    return name;
  }
}

export default function CategoryCard({ id, name, count = 0, highlight }: Props) {
  const colors = [
    "from-[#FFD4DA] to-[#FFDDEE]",
    "from-[#DFF7E2] to-[#E8FFF0]",
    "from-[#DDE8FF] to-[#EAF2FF]",
    "from-[#FFF5D6] to-[#FFF8E6]",
    "from-[#FFE6F0] to-[#FFF0F7]",
    "from-[#FDEFE2] to-[#FFF7EF]"
  ];
  const idx = Math.abs(id.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0)) % colors.length;
  const gradient = colors[idx];

  return (
    <Link href={`/category/${id}`} className="block">
      <div className={`p-4 rounded-2xl card-ui border-0 bg-gradient-to-br ${gradient} hover:shadow-lg transition-transform transform hover:-translate-y-0.5`}>
        <div className="text-center font-semibold text-sm text-[#111827]">{highlight ? highlightText(name, highlight) : <span className="text-sm">{name}</span>}</div>
        <div className="text-center text-xs text-gray-600 mt-2">{count} macro</div>
      </div>
    </Link>
  );
}
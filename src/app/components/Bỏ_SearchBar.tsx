"use client";
import { useState } from "react";

export default function SearchBar({ onSearch, placeholder = "Tìm theo tiêsđấu đề hoặc nội dung..." }: { onSearch: (q: string) => void; placeholder?: string; }) {
  const [q, setQ] = useState("");
  return (
    <div className="searchbar">
      <input
        className="input"
        placeholder={placeholder}
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onSearch(q)}
      />
      <button className="button" onClick={() => onSearch(q)}>Tìm</button>
      {q && (
        <button className="button secondary" onClick={() => { setQ(""); onSearch(""); }}>Xoá</button>
      )}
    </div>
  );
}
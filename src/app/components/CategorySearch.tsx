"use client";

import SearchBar from "./SearchBar";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategorySearch({ categoryId }: { categoryId: string }) {
  const router = useRouter();
  const sp = useSearchParams();
  const qParam = sp.get("q") ?? "";
  const [key, setKey] = useState(0);

  useEffect(() => {
    // re-render SearchBar when URL q changes (back/forward)
    setKey(k => k + 1);
  }, [qParam]);

  const onSearch = (q: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    // preserve category path, push with query
    const url = params.toString() ? `/category/${categoryId}?${params.toString()}` : `/category/${categoryId}`;
    router.push(url);
  };

  return (
    <div key={key}>
      <SearchBar onSearch={onSearch} placeholder="Tìm trong danh mục này theo tiêu đề hoặc nội dung..." />
    </div>
  );
}

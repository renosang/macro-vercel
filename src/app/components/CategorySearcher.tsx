"use client";

import { useEffect, useMemo, useState } from "react";
import { searchMacros as serverSearch } from "@lib/utils/search";
import type { Macro } from "@lib/storage/types";
import MacroListItem from "./MacroListItem";

function debounce<T extends (...args: any[]) => void>(fn: T, wait = 200) {
  let t: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (t) clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

export default function CategorySearcher({ categoryId }: { categoryId: string }) {
  const [all, setAll] = useState<Macro[]>([]);
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Macro[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetch(`/api/macros?categoryId=${encodeURIComponent(categoryId)}`)
      .then(r => r.json())
      .then((data: Macro[]) => {
        if (!mounted) return;
        setAll(data || []);
        setResults(data || []);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [categoryId]);

  const doSearch = useMemo(() => debounce((val: string) => {
    const q = val.trim();
    if (!q) {
      setResults(all);
      return;
    }
    // Use server search logic ported to client: returns ranked list of macros
    const ranked = serverSearch(all, q).map(r => r.macro);
    setResults(ranked);
  }, 180), [all]);

  useEffect(() => {
    doSearch(q);
  }, [q, doSearch]);

  const isTyping = q.length > 0;

  return (
    <div>
      <div style={styles.searchWrap}>
        <div style={styles.searchContainer}>
          <input
            aria-label="Tìm kiếm trong danh mục"
            placeholder="Tìm theo tiêu đề hoặc nội dung..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Escape") setQ("");
            }}
            style={styles.searchInput}
          />
          <span style={{
            ...styles.searchIcon,
            ...(isTyping ? styles.searchIconTyping : styles.searchIconNormal)
          }}>
            🔍
          </span>
        </div>
      </div>

      <div style={{ height: 12 }} />

      <div>
        {loading && <div style={styles.hint}>Đang tải...</div>}
        {!loading && results.length === 0 && <div style={styles.hint}>Không có macro phù hợp.</div>}
        <div style={styles.list}>
          {results.map(m => <MacroListItem key={m.id} macro={m} query={q} />)}
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  searchWrap: {
    display: "flex",
    justifyContent: "center",
  },
  searchContainer: {
    position: "relative",
    width: "70%",
    maxWidth: 720,
  },
  searchInput: {
    width: "100%",
    padding: "12px 40px 12px 16px",
    borderRadius: 999,
    border: "1px solid rgba(15,23,42,0.08)",
    boxShadow: "0 6px 20px rgba(2,6,23,0.06)",
    outline: "none",
    fontSize: 15,
    background: "white",
    color: "#0f172a",
    transition: "all 0.3s ease",
  },
  searchIcon: {
    position: "absolute",
    right: 16,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#94a3b8",
    pointerEvents: "none",
    transition: "all 0.3s ease",
  },
  searchIconNormal: {
    opacity: 1,
    transform: "translateY(-50%) scale(1)",
  },
  searchIconTyping: {
    opacity: 0,
    transform: "translateY(-50%) scale(0.8)",
  },
  hint: {
    color: "#6b7280",
    fontSize: 14,
    padding: "8px 0"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
    marginTop: 8
  }
};
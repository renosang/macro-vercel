"use client";

import { useState, useMemo } from "react";
import type { Macro } from "@lib/storage/types";
import { replaceHonorific } from "@lib/utils/text";
import { copyToClipboard } from "@lib/utils/copy";

// Component con để hiển thị animation "Đã sao chép"
const CopiedAnimation = () => (
  <div style={copiedAnimationStyles}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ marginRight: 6 }}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
    Đã sao chép
  </div>
);

export default function MacroListItem({ macro, query }: { macro: Macro; query: string; }) {
  const [copied, setCopied] = useState(false);
  const [displayMode, setDisplayMode] = useState<"both" | "anh" | "chi">("both");

  const handleCopy = async (mode: "both" | "anh" | "chi") => {
    const text = replaceHonorific(macro.content, mode);
    const ok = await copyToClipboard(text);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } else {
      alert("Không thể sao chép. Vui lòng copy thủ công.");
    }
  };

  const currentContent = useMemo(() => replaceHonorific(macro.content, displayMode), [macro.content, displayMode]);
  const highlightedTitleHtml = highlightHtml(macro.title, query);
  const highlightedContentHtml = highlightHtml(currentContent, query);

  return (
    <div style={itemStyles.card}>
      <div style={itemStyles.left}>
        <div style={{  alignItems: "center", gap: 10 }}>
          <strong style={{ fontSize: 15 }} dangerouslySetInnerHTML={{ __html: highlightedTitleHtml }} />
          <span style={itemStyles.badge}>{macro.categoryId}</span>
          {copied && <CopiedAnimation />}
        </div>
        <div style={itemStyles.content} dangerouslySetInnerHTML={{ __html: highlightedContentHtml }} />
      </div>

      <div style={itemStyles.actions}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              type="button"
              style={{ ...itemStyles.copyBtn, ...(displayMode === "both" ? itemStyles.selected : {}) }}
              title="Giữ nguyên 'anh/chị'"
              onClick={() => {
                setDisplayMode("both");
                handleCopy("both");
              }}
            >
              Anh/chị
            </button>

            <button
              type="button"
              style={{ ...itemStyles.copyBtn, ...(displayMode === "anh" ? itemStyles.selected : {}) }}
              onClick={() => {
                setDisplayMode("anh");
                handleCopy("anh");
              }}
            >
              Anh
            </button>

            <button
              type="button"
              style={{ ...itemStyles.copyBtn, ...(displayMode === "chi" ? itemStyles.selected : {}) }}
              onClick={() => {
                setDisplayMode("chi");
                handleCopy("chi");
              }}
            >
              Chị
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Utility functions */
function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(unsafe: string) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function highlightHtml(text: string, q: string) {
  if (!q) return escapeHtml(text).replace(/\n/g, "<br/>");
  const trimmed = q.trim();
  if (trimmed === "") return escapeHtml(text).replace(/\n/g, "<br/>");
  const qEsc = escapeRegExp(trimmed);
  const re = new RegExp(`(${qEsc})`, "ig");
  const escaped = escapeHtml(text);
  return escaped
    .replace(re, '<mark style="background:linear-gradient(90deg,#fff59d,#ffd294);padding:0 4px;border-radius:6px;">$1</mark>')
    .replace(/\n/g, "<br/>");
}

/* Styles (inline for simplicity) */
const itemStyles: Record<string, React.CSSProperties> = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    gap: 16,
    alignItems: "flex-start",
    padding: 14,
    borderRadius: 12,
    background: "white",
    border: "1px solid rgba(2,6,23,0.06)",
    boxShadow: "0 8px 30px rgba(2,6,23,0.04)"
  },
  left: { flex: 1, minWidth: 0 },
  badge: {
    display: "inline-block",
    fontSize: 12,
    padding: "4px 8px",
    borderRadius: 999,
    background: "#eef2ff",
    color: "#3730a3",
    border: "1px solid rgba(99,102,241,0.12)"
  },
  content: {
    marginTop: 8,
    color: "#334155",
    fontSize: 14,
    lineHeight: 1.45,
    whiteSpace: "pre-wrap"
  },
  actions: {
    width: 180,
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  copyBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(2,6,23,0.06)",
    background: "#f8fafc",
    cursor: "pointer",
    fontSize: 13,
    userSelect: "none"
  },
  selected: {
    background: "#10b981",
    color: "white",
    border: "1px solid rgba(16,185,129,0.2)"
  }
};

const copiedAnimationStyles: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 4,
  fontSize: 12,
  color: "#16a34a",
  fontWeight: 500,
  padding: "4px 8px",
  background: "#f0fdf4",
  borderRadius: 999,
  animation: "fadeIn 0.5s ease-in-out"
};

const searchHeaderStyles: React.CSSProperties = {
  textAlign: "center",
  marginBottom: 40,
};

const searchHeadingStyles: React.CSSProperties = {
  fontSize: 36,
  fontWeight: 800,
  color: "#1e293b",
  marginBottom: 10,
};

const searchDescriptionStyles: React.CSSProperties = {
  fontSize: 18,
  color: "#64748b",
  maxWidth: 600,
  margin: "0 auto",
  lineHeight: 1.5,
};

const searchContainerStyles: React.CSSProperties = {
  position: "relative",
  maxWidth: 600,
  margin: "40px auto",
};

const searchInputStyles: React.CSSProperties = {
  width: "100%",
  padding: "16px 24px",
  fontSize: 16,
  borderRadius: 999,
  border: "1px solid #e2e8f0",
  outline: "none",
  transition: "all 0.3s ease",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
};

const searchIconStyles: React.CSSProperties = {
  position: "absolute",
  right: 20,
  top: "50%",
  transform: "translateY(-50%)",
  color: "#94a3b8",
  transition: "all 0.3s ease",
};

const searchIconTypingStyles: React.CSSProperties = {
  opacity: 0,
};

const searchIconNormalStyles: React.CSSProperties = {
  opacity: 1,
};
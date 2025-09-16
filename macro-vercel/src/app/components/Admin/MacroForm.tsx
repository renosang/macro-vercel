"use client";
import { useState } from "react";
import { Category, Macro } from "@lib/storage/types";

export default function MacroForm({
  categories,
  onSubmit,
  initial
}: {
  categories: Category[];
  onSubmit: (data: { id?: string; categoryId: string; title: string; content: string }) => Promise<void>;
  initial?: Partial<Macro>;
}) {
  const [id] = useState(initial?.id);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? (categories[0]?.id ?? ""));
  const [title, setTitle] = useState(initial?.title ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ id, categoryId, title, content });
      if (!id) {
        setTitle("");
        setContent("");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid" style={{ gap: 8 }}>
      <select className="select" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input className="input" placeholder="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea className="textarea" rows={4} placeholder="Nội dung (dùng 'anh/chị' để tuỳ chọn danh xưng)" value={content} onChange={e => setContent(e.target.value)} required />
      <button className="button" disabled={loading}>{id ? "Cập nhật" : "Tạo macro"}</button>
    </form>
  );
}
// src/app/admin/MacroForm.tsx
"use client";
import { useState } from "react";
import { Category } from "@lib/storage/types";
import TextareaAutosize from 'react-textarea-autosize';

export default function MacroForm({
  categories,
  onSubmit,
}: {
  categories: Category[];
  onSubmit: (data: { categoryId: string; title: string; content: string }) => Promise<void>;
}) {
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ categoryId, title, content });
      // Reset form sau khi tạo mới thành công
      setTitle("");
      setContent("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid w-full" style={{ gap: 8 }}>
      <select className="input" value={categoryId} onChange={e => setCategoryId(e.target.value)} required>
        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
      </select>
      <input className="input" placeholder="Tiêu đề" value={title} onChange={e => setTitle(e.target.value)} required />
      <TextareaAutosize
        className="input min-h-[100px] resize-y"
        placeholder="Nội dung (dùng 'anh/chị' để tuỳ chọn danh xưng)"
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      />
      <button className="button" disabled={loading}>Tạo macro</button>
    </form>
  );
}
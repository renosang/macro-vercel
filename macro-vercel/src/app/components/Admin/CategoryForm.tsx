"use client";
import { useState } from "react";
import { Category } from "@lib/storage/types";

export default function CategoryForm({
  onSubmit,
  initial
}: {
  onSubmit: (data: { id?: string; name: string; description?: string }) => Promise<void>;
  initial?: Partial<Category>;
}) {
  const [id] = useState(initial?.id);
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit({ id, name, description });
      setName("");
      setDescription("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="grid" style={{ gap: 8 }}>
      <input className="input" placeholder="Tên danh mục" value={name} onChange={e => setName(e.target.value)} required />
      <input className="input" placeholder="Mô tả" value={description} onChange={e => setDescription(e.target.value)} />
      <button className="button" disabled={loading}>{id ? "Cập nhật" : "Tạo danh mục"}</button>
    </form>
  );
}
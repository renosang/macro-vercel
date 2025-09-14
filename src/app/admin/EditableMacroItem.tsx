// src/app/admin/EditableMacroItem.tsx
"use client";

import { useState } from "react";
import { Macro, Category } from "@lib/storage/types";
import TextareaAutosize from 'react-textarea-autosize';

export default function EditableMacroItem({
  macro,
  categories,
  onUpdate,
  onDelete
}: {
  macro: Macro;
  categories: Category[];
  onUpdate: (data: { id: string; categoryId: string; title: string; content: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [categoryId, setCategoryId] = useState(macro.categoryId);
  const [title, setTitle] = useState(macro.title);
  const [content, setContent] = useState(macro.content);
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await onUpdate({ id: macro.id, categoryId, title, content });
      setIsEditing(false); // Thoát chế độ chỉnh sửa sau khi cập nhật
    } finally {
      setLoading(false);
    }
  };
  
  // Hàm xử lý xóa
  const handleDelete = async () => {
    if (window.confirm("Bạn có chắc chắn muốn xóa macro này không?")) {
      setLoading(true);
      try {
        await onDelete(macro.id);
      } finally {
        setLoading(false);
      }
    }
  };

  // Hiển thị ở chế độ chỉnh sửa
  if (isEditing) {
    return (
      <div className="p-4 border rounded shadow grid" style={{ gap: 8 }}>
        <select className="input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
        <TextareaAutosize
          className="input min-h-[100px] resize-y"
          value={content}
          onChange={e => setContent(e.target.value)}
        />
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <button className="button" onClick={handleUpdate} disabled={loading}>
              {loading ? "Đang cập nhật..." : "Lưu"}
            </button>
            <button className="button secondary" onClick={() => setIsEditing(false)}>Hủy</button>
          </div>
          <button className="button delete" onClick={handleDelete} disabled={loading}>Xóa</button>
        </div>
      </div>
    );
  }

  // Hiển thị ở chế độ xem
  return (
    <div className="p-4 border rounded shadow grid" style={{ gap: 8 }}>
      <h3 className="font-bold">{macro.title}</h3>
      <p>{macro.content}</p>
      <div className="text-sm text-gray-500">
        Danh mục: {categories.find(c => c.id === macro.categoryId)?.name}
      </div>
      <button className="button" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
    </div>
  );
}
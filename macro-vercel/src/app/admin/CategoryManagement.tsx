// src/app/admin/CategoryManagement.tsx
"use client";

import { useState, useEffect } from "react";
import { Category } from "@lib/storage/types";
import { createCategoryAction, updateCategoryAction, deleteCategoryAction } from "./categoryActions";

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, [refreshKey]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName) return;
    await createCategoryAction({ name: newCategoryName });
    setNewCategoryName("");
    setRefreshKey(k => k + 1);
  };

  const handleUpdate = async (id: string) => {
    if (!editingName) return;
    await updateCategoryAction({ id, name: editingName });
    setEditingId(null);
    setRefreshKey(k => k + 1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xóa danh mục này?")) {
      await deleteCategoryAction(id);
      setRefreshKey(k => k + 1);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category.id);
    setEditingName(category.name);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="card-title">Tạo danh mục mới</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            className="input"
            type="text"
            placeholder="Tên danh mục"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Tạo danh mục
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">Danh sách danh mục</h3>
        <div className="space-y-4">
          {categories.map(c => (
            <div key={c.id} className="card-item flex justify-between items-center gap-4">
              {editingId === c.id ? (
                <>
                  <input
                    className="input flex-1"
                    type="text"
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <button className="button-secondary" onClick={() => handleUpdate(c.id)}>
                      Lưu
                    </button>
                    <button className="button-secondary" onClick={() => setEditingId(null)}>
                      Hủy
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="flex-1 font-semibold">{c.name}</p>
                  <div className="flex gap-2">
                    <button className="button-secondary" onClick={() => startEdit(c)}>
                      Sửa
                    </button>
                    <button className="button-danger" onClick={() => handleDelete(c.id)}>
                      Xoá
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && <div className="text-center text-gray-500">Chưa có danh mục nào.</div>}
        </div>
      </div>
    </div>
  );
}
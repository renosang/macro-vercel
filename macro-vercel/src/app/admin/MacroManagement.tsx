// src/app/admin/MacroManagement.tsx
"use client";

import { useEffect, useState } from "react";
import MacroForm from "./MacroForm";
import EditableMacroItem from "./EditableMacroItem";
import { Macro, Category } from "@lib/storage/types";
import { createMacroAction, updateMacroAction, deleteMacroAction } from "./macroActions";

export default function MacroManagement() {
  const [macros, setMacros] = useState<Macro[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Vì là Client Component, chúng ta sẽ gọi API thay vì trực tiếp truy cập fileStorage
      const macrosRes = await fetch("/api/macros");
      const macrosData = await macrosRes.json();
      setMacros(macrosData);

      const categoriesRes = await fetch("/api/categories");
      const categoriesData = await categoriesRes.json();
      setCategories(categoriesData);
    };
    fetchData();
  }, [refreshKey]);

  const handleCreate = async (data: { categoryId: string; title: string; content: string }) => {
    await createMacroAction(data);
    setRefreshKey(k => k + 1);
  };

  const handleUpdate = async (data: { id: string; categoryId: string; title: string; content: string }) => {
    await updateMacroAction(data);
    setRefreshKey(k => k + 1);
  };

  const handleDelete = async (id: string) => {
    await deleteMacroAction(id);
    setRefreshKey(k => k + 1);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Thêm Macro mới</h1>
      <MacroForm categories={categories} onSubmit={handleCreate} />

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Danh sách các Macro</h2>
      <div className="grid gap-4">
        {macros.map(macro => (
          <EditableMacroItem
            key={macro.id}
            macro={macro}
            categories={categories}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
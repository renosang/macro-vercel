"use client";
import { useEffect, useMemo, useState } from "react";
import { Category, Macro } from "@lib/storage/types";

type Tab = "categories" | "macros";

export default function AdminDashboard() {
  const [tab, setTab] = useState<Tab>("categories");
  const [categories, setCategories] = useState<Category[]>([]);
  const [macros, setMacros] = useState<Macro[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchAll = async () => {
    const [cs, ms] = await Promise.all([
      fetch("/api/categories").then(r => r.json()),
      fetch("/api/macros").then(r => r.json())
    ]);
    setCategories(cs);
    setMacros(ms);
  };

  useEffect(() => { fetchAll(); }, [refreshKey]);

  const byCategory = useMemo(() => {
    const m = new Map<string, Macro[]>();
    macros.forEach(x => {
      const arr = m.get(x.categoryId) ?? [];
      arr.push(x);
      m.set(x.categoryId, arr);
    });
    return m;
  }, [macros]);

  const createCategory = async (payload: Partial<Category>) => {
    await fetch("/api/categories", { method: "POST", body: JSON.stringify(payload) });
    setRefreshKey(k => k + 1);
  };
  const updateCategory = async (id: string, payload: Partial<Category>) => {
    await fetch(`/api/categories?id=${id}`, { method: "PUT", body: JSON.stringify(payload) });
    setRefreshKey(k => k + 1);
  };
  const deleteCategory = async (id: string) => {
    if (!confirm("Xoá danh mục này? Macro thuộc danh mục cũng sẽ bị xoá.")) return;
    await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
    setRefreshKey(k => k + 1);
  };

  const createMacro = async (payload: Partial<Macro>) => {
    await fetch("/api/macros", { method: "POST", body: JSON.stringify(payload) });
    setRefreshKey(k => k + 1);
  };
  const updateMacro = async (id: string, payload: Partial<Macro>) => {
    await fetch(`/api/macros?id=${id}`, { method: "PUT", body: JSON.stringify(payload) });
    setRefreshKey(k => k + 1);
  };
  const deleteMacro = async (id: string) => {
    if (!confirm("Xoá macro này?")) return;
    await fetch(`/api/macros?id=${id}`, { method: "DELETE" });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      <div className="card" style={{ display: "flex", gap: 8 }}>
        <button className={`button ${tab === "categories" ? "" : "secondary"}`} onClick={() => setTab("categories")}>Danh mục</button>
        <button className={`button ${tab === "macros" ? "" : "secondary"}`} onClick={() => setTab("macros")}>Macro</button>
      </div>

      {tab === "categories" && (
        <section className="grid" style={{ gap: 16 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Thêm danh mục</h3>
            <CategoryForm onSubmit={createCategory as any} />
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Danh sách danh mục</h3>
            <div className="grid" style={{ gap: 12 }}>
              {categories.map(c => (
                <div className="card" key={c.id}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <strong>{c.name}</strong>
                      <div className="hint">{c.description}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="button secondary" onClick={() => {
                        const name = prompt("Tên danh mục:", c.name) ?? c.name;
                        const description = prompt("Mô tả:", c.description ?? "") ?? c.description;
                        updateCategory(c.id, { name, description });
                      }}>Sửa</button>
                      <button className="button danger" onClick={() => deleteCategory(c.id)}>Xoá</button>
                    </div>
                  </div>
                  <div className="hint" style={{ marginTop: 8 }}>
                    {byCategory.get(c.id)?.length ?? 0} macro
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {tab === "macros" && (
        <section className="grid" style={{ gap: 16 }}>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Thêm macro</h3>
            <MacroForm categories={categories} onSubmit={createMacro as any} />
          </div>
          <div className="card">
            <h3 style={{ marginTop: 0 }}>Danh sách macro</h3>
            <div className="grid" style={{ gap: 12 }}>
              {macros.map(m => (
                <div key={m.id} className="card">
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <div>
                      <strong>{m.title}</strong>
                      <div className="hint">{m.content}</div>
                      <div className="hint">Danh mục: {m.categoryId}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <button className="button secondary" onClick={() => {
                        const title = prompt("Tiêu đề:", m.title) ?? m.title;
                        const content = prompt("Nội dung:", m.content) ?? m.content;
                        const categoryId = prompt("Danh mục:", m.categoryId) ?? m.categoryId;
                        updateMacro(m.id, { title, content, categoryId });
                      }}>Sửa</button>
                      <button className="button danger" onClick={() => deleteMacro(m.id)}>Xoá</button>
                    </div>
                  </div>
                </div>
              ))}
              {macros.length === 0 && <div className="hint">Chưa có macro.</div>}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

import CategoryForm from "./CategoryForm";
import MacroForm from "./MacroForm";
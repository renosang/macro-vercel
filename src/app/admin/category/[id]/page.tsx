// app/admin/category/[id]/page.tsx
"use client";
import React, { useEffect, useState } from "react";

type Macro = { id: string; title: string; content: string; categoryId: string };

export default function AdminCategoryPage({ params }: { params: { id: string } }) {
  const catId = params.id;
  const [macros, setMacros] = useState<Macro[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("/api/macros").then(r => r.json()).then((all: Macro[]) => setMacros(all.filter(m => m.categoryId === catId)));
  }, [catId]);

  const add = async () => {
    const res = await fetch("/api/macros", {
      method: "POST",
      body: JSON.stringify({ title, content, categoryId: catId }),
      headers: { "Content-Type": "application/json" }
    });
    const json = await res.json();
    setMacros((s) => [json, ...s]);
    setTitle(""); setContent("");
  };

  const del = async (id: string) => {
    await fetch(`/api/macros?id=${id}`, { method: "DELETE" });
    setMacros((s) => s.filter(m => m.id !== id));
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Quản lý macro</h1>
      <div className="mb-6 bg-white p-4 rounded shadow">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Tiêu đề" className="border p-2 w-full mb-2" />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Nội dung" className="border p-2 w-full mb-2" />
        <button onClick={add} className="bg-green-600 text-white px-4 py-2 rounded">Thêm</button>
      </div>

      <div className="space-y-3">
        {macros.map(m => (
          <div key={m.id} className="p-3 bg-white rounded shadow flex justify-between">
            <div>
              <div className="font-semibold">{m.title}</div>
              <div className="text-sm text-gray-700">{m.content}</div>
            </div>
            <div className="flex gap-2">
              {/* For brevity, no edit modal in this sample; you can add update similarly */}
              <button onClick={() => del(m.id)} className="text-red-600">Xóa</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
// src/app/admin/MacroForm.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Category } from "@lib/storage/types";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css"; // Tệp CSS mới để tuỳ chỉnh

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then((mod) => mod.Editor),
  { ssr: false }
);

export default function MacroForm({
  categories,
  onSubmit,
}: {
  categories: Category[];
  onSubmit: (data: {
    categoryId: string;
    title: string;
    content: string;
  }) => Promise<void>;
}) {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id || "");
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      console.log(contentHtml)
      await onSubmit({ categoryId, title, content: contentHtml });
      setTitle("");
      setEditorState(EditorState.createEmpty());
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <select
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {mounted && (
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor-main"
          toolbarClassName="editor-toolbar"
          placeholder="Nội dung (dùng 'anh/chị' để tuỳ chọn danh xưng)"
        />
      )}

      <button className="w-full button" type="submit" disabled={loading}>
        {loading ? "Đang lưu..." : "Lưu Macro mới"}
      </button>
    </form>
  );
}
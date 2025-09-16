// src/app/admin/EditableMacroItem.tsx
"use client";
import { useState, useEffect } from "react";
import { Macro, Category } from "@lib/storage/types";
import dynamic from 'next/dynamic';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./editor.css";

const Editor = dynamic(
  () => import("react-draft-wysiwyg").then(mod => mod.Editor),
  { ssr: false }
);

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
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEditing && macro.content) {
      const blocksFromHtml = htmlToDraft(macro.content);
      if (blocksFromHtml) {
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        setEditorState(EditorState.createWithContent(contentState));
      }
    }
  }, [isEditing, macro.content]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      await onUpdate({ id: macro.id, categoryId, title, content: contentHtml });
      setIsEditing(false);
    } catch (error: any) {
      if (error.message.includes("Macro not found")) {
        alert("Macro này có thể đã bị xóa. Vui lòng làm mới trang.");
        await onUpdate({ id: "non-existent-id", categoryId, title, content: "" });
      } else {
        alert(`Cập nhật thất bại: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa Macro này?")) {
      await onDelete(macro.id);
    }
  };

  if (isEditing) {
    return (
      <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white space-y-4">
        <select
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={categoryId}
          onChange={e => setCategoryId(e.target.value)}
        >
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="editor-wrapper"
          editorClassName="editor-main"
          toolbarClassName="editor-toolbar"
          placeholder="Nội dung (dùng 'anh/chị' để tuỳ chọn danh xưng)"
        />
        <div className="flex gap-2 justify-between">
          <div className="flex gap-2">
            <button className="button" onClick={handleUpdate} disabled={loading}>
              {loading ? "Đang cập nhật..." : "Lưu"}
            </button>
            <button className="button-secondary" onClick={() => setIsEditing(false)}>Hủy</button>
          </div>
          <button className="button-danger" onClick={handleDelete} disabled={loading}>Xóa</button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border border-gray-200 rounded-lg shadow-sm bg-white space-y-2">
      <h3 className="font-bold text-lg">{macro.title}</h3>
      <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={{ __html: macro.content }} />
      <div className="text-sm text-gray-500">
        Danh mục: {categories.find(c => c.id === macro.categoryId)?.name || 'Không xác định'}
      </div>
      <div className="flex gap-2 mt-4">
        <button className="button-secondary" onClick={() => setIsEditing(true)}>Sửa</button>
        <button className="button-danger" onClick={handleDelete}>Xóa</button>
      </div>
    </div>
  );
}
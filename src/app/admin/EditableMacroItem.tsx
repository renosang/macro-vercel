// src/app/admin/EditableMacroItem.tsx
"use client";
import { useState, useEffect } from "react";
import { Macro, Category } from "@lib/storage/types";
import dynamic from 'next/dynamic';
import { EditorState, convertFromHTML, ContentState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';

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
  // Sử dụng EditorState
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const [loading, setLoading] = useState(false);

  // Chuyển đổi HTML từ macro.content sang EditorState khi component được render lần đầu
  useEffect(() => {
    const blocksFromHtml = htmlToDraft(macro.content || '');
    if (blocksFromHtml) {
      const { contentBlocks, entityMap } = blocksFromHtml;
      const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
      setEditorState(EditorState.createWithContent(contentState));
    }
  }, [macro.content]);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      // Chuyển đổi EditorState sang HTML
      const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      await onUpdate({ id: macro.id, categoryId, title, content: contentHtml });
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };
  
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

  if (isEditing) {
    return (
      <div className="p-4 border rounded shadow grid" style={{ gap: 8 }}>
        <select className="input" value={categoryId} onChange={e => setCategoryId(e.target.value)}>
          {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)} />
        <Editor 
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
          placeholder="Nội dung (dùng 'anh/chị' để tuỳ chọn danh xưng)"
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

  return (
    <div className="p-4 border rounded shadow grid" style={{ gap: 8 }}>
      <h3 className="font-bold">{macro.title}</h3>
      <div dangerouslySetInnerHTML={{ __html: macro.content }} />
      <div className="text-sm text-gray-500">
        Danh mục: {categories.find(c => c.id === macro.categoryId)?.name}
      </div>
      <button className="button" onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
    </div>
  );
}
// src/app/admin/MacroForm.tsx
"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
// Import EditorState từ draft-js
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

// Dynamic import và tắt SSR cho Editor từ react-draft-wysiwyg
const Editor = dynamic(
  () => import("react-draft-wysiwyg").then(mod => mod.Editor),
  { ssr: false }
);

export default function MacroForm() {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState("");
  // Sử dụng EditorState thay vì string
  const [editorState, setEditorState] = useState(EditorState.createEmpty());

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hàm xử lý khi form được submit
  const handleSubmit = (e) => {
    e.preventDefault();
    // Chuyển đổi EditorState sang HTML
    const contentHtml = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    console.log("Tiêu đề:", title);
    console.log("Nội dung HTML:", contentHtml);
    // TODO: Gửi dữ liệu này đến API của bạn
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        className="input"
        placeholder="Tiêu đề"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {mounted && (
        <Editor
          editorState={editorState}
          onEditorStateChange={setEditorState}
          wrapperClassName="wrapper-class"
          editorClassName="editor-class"
          toolbarClassName="toolbar-class"
        />
      )}
      
      <button className="button" type="submit">Lưu</button>
    </form>
  );
}
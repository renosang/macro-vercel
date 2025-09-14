// src/app/admin/MacroForm.tsx
"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import "react-quill/dist/quill.snow.css";

export default function MacroForm() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <form>
      <select>{/* ... */}</select>
      <input className="input" placeholder="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} required />
      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
      />
    </form>
  );
}
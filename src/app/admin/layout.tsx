// app/admin/layout.tsx
import React from "react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <header className="bg-gray-800 text-white py-3">
        <div className="container mx-auto px-4 flex justify-between">
          <div>Admin Panel</div>
          <div><a href="/" className="underline">Back to site</a></div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
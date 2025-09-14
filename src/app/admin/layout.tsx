// src/app/admin/layout.tsx
import React from "react";
import AuthChecker from "./AuthChecker";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthChecker>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <header className="bg-gradient-to-r from-[#6b0f16] to-[#8b1f2a] text-white py-4 shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-xl font-bold">Admin Panel</h1>
            <a href="/" className="text-sm opacity-80 hover:opacity-100 transition-opacity underline">
              Back to site
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">{children}</main>
      </div>
    </AuthChecker>
  );
}
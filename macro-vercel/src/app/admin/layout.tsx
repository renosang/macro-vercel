// src/app/admin/layout.tsx
import React from "react";
import AuthChecker from "./AuthChecker";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthChecker>
      <div className="min-h-screen bg-gray-100 text-gray-900">
        <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 shadow-lg">
          <div className="container mx-auto px-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold tracking-wide">Admin Panel</h1>
            <a 
              href="/" 
              className="text-sm bg-blue-500 hover:bg-blue-700 transition-colors duration-200 text-white font-semibold py-2 px-4 rounded-full"
            >
              Back to site
            </a>
          </div>
        </header>
        <main className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            {children}
          </div>
        </main>
      </div>
    </AuthChecker>
  );
}
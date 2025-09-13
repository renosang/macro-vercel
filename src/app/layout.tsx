// src/app/layout.tsx
import "./globals.css";
import Link from "next/link";
import React from "react";

export const metadata = {
  title: "Macro Search",
  description: "Tra cứu macro nhanh theo keyword"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body className="bg-gray-50">
        <header className="bg-gradient-to-r from-[#6b0f16] to-[#8b1f2a] text-white">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <div className="bg-white/10 rounded-md px-3 py-1 text-sm font-semibold cursor-pointer">
                  Thiên Tú
                </div>
              </Link>
              <div className="hidden sm:block text-sm opacity-80">Hệ thống tra cứu Macro</div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm opacity-90">Hello, người đẹp!</div>
              <button className="bg-white text-[#7a0f1b] px-3 py-1 rounded text-sm font-medium">Đăng xuất</button>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-6 py-10">
          {children}
        </main>
      </body>
    </html>
  );
}
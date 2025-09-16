// src/app/components/Header.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { logout } from "@lib/auth";
import logo from "../logo.png";

export default function Header({ userName = "người đẹp" }: { userName?: string }) {
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="bg-white text-black border-b border-solid border-[#e5e7eb] py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Link href="/">
            <Image 
              src={logo} 
              alt="ThienTu Logo" 
            
              height={60}
            />
          </Link>
        </div>

        <div className="flex items-center space-x-4 text-base">
          <div className="hidden sm:block font-medium">Hello, {userName}!</div>
          <button 
            onClick={handleLogout} 
            className="bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded-lg font-semibold transition-colors duration-200"
          >
            Đăng xuất
          </button>
        </div>
      </div>
    </header>
  );
}
// src/app/_client/AuthenticatedContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@lib/auth";
import ClientCategoryPanel from "./ClientCategoryPanel";

export default function AuthenticatedContent({ categories }: { categories: any }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (checkAuth()) {
      setIsLoggedIn(true);
    } else {
      router.push("/login");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-gray-700">Đang tải...</p>
      </div>
    );
  }

  return isLoggedIn ? <ClientCategoryPanel serverCategories={categories} /> : null;
}
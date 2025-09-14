// src/app/admin/AuthChecker.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAuth, checkAdmin } from "@lib/auth";

export default function AuthChecker({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!checkAuth() || !checkAdmin()) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <p className="text-xl font-semibold text-gray-700">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  return <>{children}</>;
}
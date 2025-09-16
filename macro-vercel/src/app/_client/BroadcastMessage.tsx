// src/app/_client/BroadcastMessage.tsx
"use client";

import { useState, useEffect } from "react";

export default function BroadcastMessage({ message }: { message: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Chỉ hiển thị thông báo nếu người dùng chưa ẩn nó trong session này
    if (sessionStorage.getItem('broadcast-read') !== 'true') {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Lưu trạng thái đã đọc vào sessionStorage
    sessionStorage.setItem('broadcast-read', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="bg-yellow-500 text-white p-3 text-center text-sm font-medium">
      <div className="container mx-auto flex items-center justify-between">
        <span className="animate-pulse">{message}</span>
        <button onClick={handleClose} className="ml-4 text-white/80 hover:text-white transition-colors font-bold">
          Xác nhận đã đọc
        </button>
      </div>
    </div>
  );
}
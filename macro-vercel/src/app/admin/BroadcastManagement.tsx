// src/app/admin/BroadcastManagement.tsx
"use client";

import { useEffect, useState } from "react";
import { Broadcast } from "@lib/storage/broadcastStorage";

export default function BroadcastManagement() {
  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [message, setMessage] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const fetchBroadcasts = async () => {
      const res = await fetch("/api/broadcast");
      const data = await res.json();
      setBroadcasts(data);
    };
    fetchBroadcasts();
  }, [refreshKey]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message) return;
    await fetch("/api/broadcast", {
      method: "POST",
      body: JSON.stringify({ message }),
      headers: { "Content-Type": "application/json" }
    });
    setMessage("");
    setRefreshKey(k => k + 1);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc muốn xóa thông báo này?")) {
      await fetch(`/api/broadcast?id=${id}`, { method: "DELETE" });
      setRefreshKey(k => k + 1);
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    await fetch(`/api/broadcast?id=${id}`, {
      method: "PUT",
      body: JSON.stringify({ isActive: !isActive }),
      headers: { "Content-Type": "application/json" }
    });
    setRefreshKey(k => k + 1);
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="card-title">Tạo thông báo mới</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <textarea
            className="textarea"
            rows={3}
            placeholder="Nội dung thông báo"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <button type="submit" className="button">
            Kích hoạt thông báo
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">Danh sách thông báo</h3>
        <div className="space-y-4">
          {broadcasts.map(b => (
            <div key={b.id} className="card-item flex justify-between items-center gap-4">
              <div className="flex-1">
                <p className="text-sm">{b.message}</p>
                {b.isActive && (
                  <span className="text-xs text-green-500 font-semibold">Đang hoạt động</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  className={`button-secondary ${b.isActive ? 'text-red-500' : 'text-green-500'}`}
                  onClick={() => handleToggleActive(b.id, b.isActive)}
                >
                  {b.isActive ? "Dừng" : "Kích hoạt"}
                </button>
                <button className="button-danger" onClick={() => handleDelete(b.id)}>
                  Xoá
                </button>
              </div>
            </div>
          ))}
          {broadcasts.length === 0 && <div className="text-center text-gray-500">Chưa có thông báo nào.</div>}
        </div>
      </div>
    </div>
  );
}
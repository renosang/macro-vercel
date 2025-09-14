// src/app/admin/UserManagement.tsx
"use client";

import { useEffect, useState } from "react";
import { User, Role } from "@lib/storage/userStorage";

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<Role>("guest");

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [refreshKey]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify({ username, password, role }),
      headers: { "Content-Type": "application/json" }
    });
    setUsername("");
    setPassword("");
    setRole("guest");
    setRefreshKey(k => k + 1);
  };

  const handleDelete = async (userId: string) => {
    if (confirm("Bạn có chắc muốn xoá thành viên này?")) {
      await fetch(`/api/users?id=${userId}`, { method: "DELETE" });
      setRefreshKey(k => k + 1);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: Role) => {
    await fetch(`/api/users?id=${userId}`, {
      method: "PUT",
      body: JSON.stringify({ role: newRole }),
      headers: { "Content-Type": "application/json" }
    });
    setRefreshKey(k => k + 1);
  };
  
  const handleUpdatePassword = async (userId: string) => {
    const newPassword = prompt("Nhập mật khẩu mới:");
    if (newPassword) {
      await fetch(`/api/users?id=${userId}`, {
        method: "PUT",
        body: JSON.stringify({ password: newPassword }),
        headers: { "Content-Type": "application/json" }
      });
      setRefreshKey(k => k + 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="card">
        <h3 className="card-title">Tạo thành viên mới</h3>
        <form onSubmit={handleCreate} className="space-y-4">
          <input
            className="input"
            type="text"
            placeholder="ID người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input"
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <div className="flex items-center gap-2">
            <label htmlFor="role-select">Vai trò:</label>
            <select
              id="role-select"
              className="select flex-grow"
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
            >
              <option value="guest">Guest</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <button type="submit" className="button">
            Tạo thành viên
          </button>
        </form>
      </div>

      <div className="card">
        <h3 className="card-title">Danh sách thành viên</h3>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="card-item flex justify-between items-center gap-4">
              <div>
                <strong>{user.username}</strong>
                <span className="ml-2 text-sm text-gray-500">({user.role})</span>
              </div>
              <div className="flex gap-2">
                <button
                  className="button-secondary"
                  onClick={() => handleUpdatePassword(user.id)}
                >
                  Đổi MK
                </button>
                <button
                  className="button-secondary"
                  onClick={() => handleUpdateRole(user.id, user.role === "admin" ? "guest" : "admin")}
                >
                  {user.role === "admin" ? "Hạ quyền" : "Phân quyền"}
                </button>
                <button className="button-danger" onClick={() => handleDelete(user.id)}>
                  Xoá
                </button>
              </div>
            </div>
          ))}
          {users.length === 0 && <div className="text-center text-gray-500">Chưa có thành viên nào.</div>}
        </div>
      </div>
    </div>
  );
}
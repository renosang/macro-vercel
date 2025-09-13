import AdminDashboard from "@components/Admin/AdminDashboard";

export const dynamic = "force-dynamic"; // admin dùng fetch client -> không cache

export default function AdminPage() {
  return (
    <main className="grid" style={{ gap: 16 }}>
      <h2 style={{ margin: 0 }}>Admin</h2>
      <p className="hint">Lưu ý: Với Vercel production bạn nên chuyển storage sang KV/DB. Mã hiện tại ghi file JSON để chạy local.</p>
      <AdminDashboard />
    </main>
  );
}
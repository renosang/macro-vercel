import Link from "next/link";
import { db } from "@lib/storage/db";
import { Category } from "@lib/storage/types";

export default async function CategoryList() {
  const categories: Category[] = db.getCategories();
  return (
    <div className="grid grid-3">
      {categories.map((c) => (
        <Link key={c.id} href={`/category/${c.id}`} className="card">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong>{c.name}</strong>
            <span className="badge">{c.id}</span>
          </div>
          <div className="hint" style={{ marginTop: 8 }}>{c.description}</div>
        </Link>
      ))}
    </div>
  );
}
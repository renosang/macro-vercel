import CategorySearcher from "@components/CategorySearcher";
import { db } from "@lib/storage/db";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = db.getCategory(params.id);
  if (!category) return notFound();

  return (
    <main style={{ padding: 24 }}>
      <section style={{ marginBottom: 18 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ margin: 0 }}>{category.name}</h2>
            <div style={{ color: "#6b7280", marginTop: 6 }}>{category.description}</div>
          </div>
        </div>
      </section>

      <section>
        <CategorySearcher categoryId={category.id} />
      </section>
    </main>
  );
}

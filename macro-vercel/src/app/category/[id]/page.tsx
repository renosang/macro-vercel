import CategorySearcher from "@components/CategorySearcher";
import { db } from "@lib/storage/db";
import { notFound } from "next/navigation";

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = db.getCategory(params.id);
  if (!category) return notFound();

  return (
    <main style={{ padding: 2 }}>
      <section style={{ marginBottom: 2 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ width: "100%" }}>
            {/* Thay đổi nằm ở dòng dưới đây */}
            <h2 style={{
              margin: 0,
              textAlign: "center",
              fontWeight: "bold",
              fontSize: "1.6rem" // <-- Font size đã được thêm vào
            }}>
              {category.name}
            </h2>
            <div style={{ color: "#6b7280", marginTop: 6, textAlign: "center" }}>
              {category.description}
            </div>
          </div>
        </div>
      </section>

      <section>
        <CategorySearcher categoryId={category.id} />
      </section>
    </main>
  );
}
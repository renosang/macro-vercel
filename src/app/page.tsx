// src/app/page.tsx
import React from "react";
import ClientCategoryPanel from "./_client/ClientCategoryPanel";
import { fileStorage } from "./lib/storage/fileStorage";

export default async function HomePage() {
  const categories = fileStorage.getCategories();
  return (
    <div>
      <ClientCategoryPanel serverCategories={categories} />
    </div>
  );
}
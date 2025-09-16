// src/app/admin/categoryActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { fileStorage } from "@lib/storage/fileStorage";

export async function createCategoryAction(data: { name: string }) {
  await fileStorage.createCategory(data);
  revalidatePath("/admin");
}

export async function updateCategoryAction(data: { id: string; name: string }) {
  await fileStorage.updateCategory(data);
  revalidatePath("/admin");
}

export async function deleteCategoryAction(id: string) {
  await fileStorage.deleteCategory(id);
  revalidatePath("/admin");
}
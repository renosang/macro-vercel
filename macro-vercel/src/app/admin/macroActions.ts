// src/app/admin/macroActions.ts
"use server";

import { revalidatePath } from "next/cache";
import { fileStorage } from "@lib/storage/fileStorage";

export async function createMacroAction(data: { categoryId: string; title: string; content: string }) {
  await fileStorage.createMacro(data);
  revalidatePath("/admin");
}

export async function updateMacroAction(data: { id: string; categoryId: string; title: string; content: string }) {
  const { id, ...patch } = data; // Tách id ra khỏi đối tượng data
  await fileStorage.updateMacro(id, patch); // Truyền id trước, sau đó là patch
  revalidatePath("/admin");
}

export async function deleteMacroAction(id: string) {
  await fileStorage.deleteMacro(id);
  revalidatePath("/admin");
}
// src/app/lib/storage/fileStorage.ts
// Simple JSON file storage for local dev.
// For production on Vercel: replace with KV/DB adapter.

import fs from "fs";
import path from "path";
import { Category, CreateCategoryDto, CreateMacroDto, Macro } from "./types";

const dataDir = path.join(process.cwd(), "data"); // sử dụng root/data
const categoriesPath = path.join(dataDir, "categories.json");
const macrosPath = path.join(dataDir, "macros.json");

function ensureDataDirAndFiles() {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
      console.log("[fileStorage] Created data dir:", dataDir);
    }
    if (!fs.existsSync(categoriesPath)) {
      fs.writeFileSync(categoriesPath, JSON.stringify([], null, 2), "utf8");
      console.log("[fileStorage] Created categories.json");
    }
    if (!fs.existsSync(macrosPath)) {
      fs.writeFileSync(macrosPath, JSON.stringify([], null, 2), "utf8");
      console.log("[fileStorage] Created macros.json");
    }
  } catch (err) {
    console.error("[fileStorage] ensureDataDirAndFiles error:", err);
    throw err;
  }
}

function readJson<T>(filePath: string): T {
  // đảm bảo file tồn tại trước khi đọc
  ensureDataDirAndFiles();
  const raw = fs.readFileSync(filePath, "utf8");
  try {
    return JSON.parse(raw) as T;
  } catch (err) {
    console.error("[fileStorage] JSON parse error for", filePath, err);
    // nếu parse lỗi, trả về giá trị mặc định an toàn
    return ([] as unknown) as T;
  }
}

function writeJson<T>(filePath: string, data: T) {
  ensureDataDirAndFiles();
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

export const fileStorage = {
  getCategories(): Category[] {
    return readJson<Category[]>(categoriesPath);
  },
  getCategory(id: string): Category | undefined {
    return this.getCategories().find(c => c.id === id);
  },
  createCategory(input: CreateCategoryDto): Category {
    const all = this.getCategories();
    const id = input.id ?? `cat_${Date.now()}`;
    const item: Category = { id, name: input.name, description: input.description };
    all.push(item);
    writeJson(categoriesPath, all);
    return item;
  },
  updateCategory(id: string, patch: Partial<CreateCategoryDto>): Category {
    const all = this.getCategories();
    const idx = all.findIndex(c => c.id === id);
    if (idx === -1) throw new Error("Category not found");
    all[idx] = { ...all[idx], ...patch, id };
    writeJson(categoriesPath, all);
    return all[idx];
  },
  deleteCategory(id: string) {
    const cats = this.getCategories();
    const macros = this.getMacros();
    const remainingCats = cats.filter(c => c.id !== id);
    const remainingMacros = macros.filter(m => m.categoryId !== id);
    writeJson(categoriesPath, remainingCats);
    writeJson(macrosPath, remainingMacros);
  },

  getMacros(): Macro[] {
    return readJson<Macro[]>(macrosPath);
  },
  getMacro(id: string): Macro | undefined {
    return this.getMacros().find(m => m.id === id);
  },
  listMacrosByCategory(categoryId: string): Macro[] {
    return this.getMacros().filter(m => m.categoryId === categoryId);
  },
  createMacro(input: CreateMacroDto): Macro {
    const all = this.getMacros();
    const id = input.id ?? `mac_${Date.now()}`;
    const item: Macro = {
      id,
      categoryId: input.categoryId,
      title: input.title,
      content: input.content
    };
    all.push(item);
    writeJson(macrosPath, all);
    return item;
  },
  updateMacro(id: string, patch: Partial<CreateMacroDto>): Macro {
    const all = this.getMacros();
    const idx = all.findIndex(m => m.id === id);
    if (idx === -1) throw new Error("Macro not found");
    all[idx] = { ...all[idx], ...patch, id };
    writeJson(macrosPath, all);
    return all[idx];
  },
  deleteMacro(id: string) {
    const all = this.getMacros();
    const remaining = all.filter(m => m.id !== id);
    writeJson(macrosPath, remaining);
  }
};
export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type Macro = {
  id: string;
  categoryId: string;
  title: string;
  content: string;
};

export type CreateCategoryDto = Omit<Category, "id"> & { id?: string };
export type CreateMacroDto = Omit<Macro, "id"> & { id?: string };

export type SearchResult = {
  macro: Macro;
  score: number;
  matchedIn: "title" | "content" | "both";
};
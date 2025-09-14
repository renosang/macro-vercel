// src/app/admin/page.tsx
import { revalidatePath } from 'next/cache';
import MacroForm from './MacroForm';
import EditableMacroItem from './EditableMacroItem';
import { fileStorage } from '@lib/storage/fileStorage';

export default async function AdminPage() {
  const categories = await fileStorage.getCategories();
  const macros = await fileStorage.getMacros();

  async function handleCreate(data) {
    "use server";
    await fileStorage.createMacro(data);
    revalidatePath('/admin');
  }

  async function handleUpdate(data) {
    "use server";
    await fileStorage.updateMacro(data);
    revalidatePath('/admin');
  }
  
  async function handleDelete(id) {
    "use server";
    await fileStorage.deleteMacro(id);
    revalidatePath('/admin');
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Thêm Macro mới</h1>
      <MacroForm categories={categories} onSubmit={handleCreate} />

      <hr className="my-8" />

      <h2 className="text-2xl font-bold mb-4">Danh sách các Macro</h2>
      <div className="grid gap-4">
        {macros.map(macro => (
          <EditableMacroItem
            key={macro.id}
            macro={macro}
            categories={categories}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
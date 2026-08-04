'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createCategory(formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const { error } = await supabase
    .from('categories')
    .insert({
      name,
      slug,
      description: description || null,
    });

  if (error) {
    return { error: `Gagal menambah kategori: ${error.message}` };
  }

  revalidatePath('/dashboard/admin/categories');
  return { success: true };
}

export async function updateCategory(categoryId: string, formData: FormData) {
  const supabase = await createClient();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const { error } = await supabase
    .from('categories')
    .update({
      name,
      slug,
      description: description || null,
    })
    .eq('id', categoryId);

  if (error) {
    return { error: `Gagal memperbarui kategori: ${error.message}` };
  }

  revalidatePath('/dashboard/admin/categories');
  return { success: true };
}

export async function deleteCategory(categoryId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', categoryId);

  if (error) {
    return { error: `Gagal menghapus kategori: ${error.message}` };
  }

  revalidatePath('/dashboard/admin/categories');
  return { success: true };
}

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const umkmId = formData.get('umkm_id') as string;
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const { error } = await supabase
    .from('products')
    .insert({
      umkm_id: umkmId,
      name,
      slug: `${slug}-${Date.now().toString(36)}`,
      description: description || null,
      price,
      is_available: true,
      is_preorder: formData.get('is_preorder') === 'true',
      image_url: formData.get('image_url') as string || null,
    });

  if (error) {
    return { error: `Gagal menambah produk: ${error.message}` };
  }

  revalidatePath('/dashboard/umkm/products');
  return { success: true };
}

export async function updateProduct(productId: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const isAvailable = formData.get('is_available') === 'true';

  const { error } = await supabase
    .from('products')
    .update({
      name,
      description: description || null,
      price,
      is_available: isAvailable,
      is_preorder: formData.get('is_preorder') === 'true',
      ...(formData.get('image_url') ? { image_url: formData.get('image_url') as string } : {}),
    })
    .eq('id', productId);

  if (error) {
    return { error: `Gagal memperbarui produk: ${error.message}` };
  }

  revalidatePath('/dashboard/umkm/products');
  return { success: true };
}

export async function deleteProduct(productId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', productId);

  if (error) {
    return { error: `Gagal menghapus produk: ${error.message}` };
  }

  revalidatePath('/dashboard/umkm/products');
  return { success: true };
}

export async function updateProductImage(productId: string, imageUrl: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('products')
    .update({ image_url: imageUrl })
    .eq('id', productId);

  if (error) {
    return { error: `Gagal memperbarui foto: ${error.message}` };
  }

  revalidatePath('/dashboard/umkm/products');
  return { success: true };
}

'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function deleteMyAccount() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'Anda belum login.' };
  }

  try {
    // 1. Cari UMKM milik user
    const { data: umkm } = await supabase
      .from('umkms')
      .select('id')
      .eq('profile_id', user.id)
      .maybeSingle();

    if (umkm) {
      // 2. Hapus semua produk milik UMKM (cascade seharusnya otomatis,
      //    tapi kita hapus manual untuk bersih-bersih storage juga)
      const { data: products } = await supabase
        .from('products')
        .select('id, image_url')
        .eq('umkm_id', umkm.id);

      // Hapus foto produk dari storage
      if (products && products.length > 0) {
        const productImagePaths = products
          .filter(p => p.image_url)
          .map(p => {
            const url = p.image_url as string;
            const parts = url.split('/products/');
            return parts.length > 1 ? parts[parts.length - 1] : null;
          })
          .filter(Boolean) as string[];

        if (productImagePaths.length > 0) {
          await supabase.storage.from('products').remove(productImagePaths);
        }
      }

      // Hapus semua produk
      await supabase.from('products').delete().eq('umkm_id', umkm.id);

      // 3. Hapus logo & banner dari storage
      if (umkm) {
        const { data: umkmData } = await supabase
          .from('umkms')
          .select('logo_url, banner_url')
          .eq('id', umkm.id)
          .single();

        if (umkmData?.logo_url) {
          const parts = umkmData.logo_url.split('/logos/');
          if (parts.length > 1) {
            await supabase.storage.from('logos').remove([parts[parts.length - 1]]);
          }
        }
        if (umkmData?.banner_url) {
          const parts = umkmData.banner_url.split('/banners/');
          if (parts.length > 1) {
            await supabase.storage.from('banners').remove([parts[parts.length - 1]]);
          }
        }
      }

      // 4. Hapus UMKM
      await supabase.from('umkms').delete().eq('id', umkm.id);
    }

    // 5. Hapus profil
    await supabase.from('profiles').delete().eq('id', user.id);

    // 6. Sign out
    await supabase.auth.signOut();

    revalidatePath('/');
    return { error: null };
  } catch (err: any) {
    console.error('Error deleting account:', err);
    return { error: 'Terjadi kesalahan saat menghapus akun: ' + (err.message || 'Unknown error') };
  }
}

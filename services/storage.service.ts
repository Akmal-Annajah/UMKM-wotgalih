import { createClient } from '@/lib/supabase/client';

export type BucketName = 'logos' | 'banners' | 'products';

/**
 * Mengupload file gambar ke Supabase Storage.
 * Menghasilkan UUID acak untuk nama file agar tidak terjadi konflik (overwrite).
 * 
 * @param bucket Nama bucket (logos, banners, products)
 * @param file Objek File dari input HTML
 * @param oldFileUrl URL file lama jika ingin diganti (opsional)
 * @returns Public URL string dari gambar yang diupload
 */
export async function uploadImage(bucket: BucketName, file: File, oldFileUrl?: string): Promise<string> {
  const supabase = createClient();
  
  // Hapus file lama jika ada (berguna saat edit profile/produk)
  if (oldFileUrl) {
    await deleteImage(bucket, oldFileUrl);
  }

  // Generate nama unik
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;

  // Upload ke Supabase
  const { error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (error) {
    throw new Error(`Gagal mengunggah gambar: ${error.message}`);
  }

  // Dapatkan URL publik
  const { data } = supabase.storage.from(bucket).getPublicUrl(fileName);
  return data.publicUrl;
}

/**
 * Menghapus file dari Supabase Storage berdasarkan public URL-nya.
 */
export async function deleteImage(bucket: BucketName, publicUrl: string): Promise<void> {
  const supabase = createClient();
  
  // Ekstrak nama file dari public URL
  const bucketPath = `/storage/v1/object/public/${bucket}/`;
  const index = publicUrl.indexOf(bucketPath);
  
  if (index !== -1) {
    const filePath = publicUrl.substring(index + bucketPath.length);
    const { error } = await supabase.storage.from(bucket).remove([filePath]);
    if (error) {
      console.error(`Gagal menghapus aset lama di bucket ${bucket}:`, error.message);
    }
  }
}

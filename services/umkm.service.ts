import { createClient } from '@/lib/supabase/server';

export async function getMyUMKM(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('umkms')
    .select('*, categories(name)')
    .eq('profile_id', userId)
    .single();

  if (error) {
    console.error('Error fetching my umkm:', error);
    return null;
  }
  return data;
}

export async function getMyProducts(umkmId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('umkm_id', umkmId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching my products:', error);
    return [];
  }
  return data;
}

export async function getMyProductCount(umkmId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('umkm_id', umkmId);

  if (error) {
    console.error('Error counting products:', error);
    return 0;
  }
  return count || 0;
}

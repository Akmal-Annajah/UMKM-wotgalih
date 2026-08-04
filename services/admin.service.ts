import { createClient } from '@/lib/supabase/server';

export async function getAdminStats() {
  const supabase = await createClient();
  
  const { count: umkmCount } = await supabase
    .from('umkms')
    .select('*', { count: 'exact', head: true });
    
  const { count: productCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });
    
  const { count: categoryCount } = await supabase
    .from('categories')
    .select('*', { count: 'exact', head: true });

  return {
    umkm: umkmCount || 0,
    products: productCount || 0,
    categories: categoryCount || 0
  };
}

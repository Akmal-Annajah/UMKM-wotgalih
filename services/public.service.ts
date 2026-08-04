import { createClient } from '@/lib/supabase/server';

export async function getCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('name');
  
  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
  return data;
}

export async function getFeaturedUMKMs(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('umkms')
    .select('id, name, slug, description, logo_url, categories(name)')
    .eq('is_active', true)
    .limit(limit);

  if (error) {
    console.error('Error fetching umkms:', error);
    return [];
  }
  return data;
}

export async function getLatestProducts(limit = 4) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, slug, price, image_url, umkms(name, slug)')
    .eq('is_available', true)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }
  return data;
}

export async function getAllUMKMs(categorySlug?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('umkms')
    .select('id, name, slug, description, logo_url, categories!inner(name, slug)')
    .eq('is_active', true);

  if (categorySlug) {
    query = query.eq('categories.slug', categorySlug);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching all umkms:', error);
    return [];
  }
  return data;
}

export async function getUMKMBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('umkms')
    .select(`
      *,
      categories(name),
      products(id, name, slug, price, image_url, is_available)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching umkm details:', error);
    return null;
  }
  return data;
}

export async function getAllProducts(searchQ?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('products')
    .select('id, name, slug, price, image_url, is_available, umkms!inner(name, slug, is_active)')
    .eq('is_available', true)
    .eq('umkms.is_active', true);

  if (searchQ) {
    query = query.ilike('name', `%${searchQ}%`);
  }

  const { data, error } = await query;
  if (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
  return data;
}

export async function getProductBySlug(slug: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      umkms (
        name,
        slug,
        whatsapp,
        logo_url,
        is_active
      )
    `)
    .eq('slug', slug)
    .eq('is_available', true)
    .single();

  if (error || !data?.umkms?.is_active) {
    console.error('Error fetching product details:', error);
    return null;
  }
  return data;
}

import { createClient } from '@/lib/supabase/server';
import { CategoryTable } from './CategoryTable';

export const metadata = {
  title: 'Kelola Kategori - Admin',
};

export default async function AdminCategoriesPage() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('name');

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Kelola Kategori</h1>
        <p className="mt-2 text-slate-500">Buat atau ubah kategori untuk mengelompokkan UMKM.</p>
      </div>

      <CategoryTable categories={categories || []} />
    </div>
  );
}

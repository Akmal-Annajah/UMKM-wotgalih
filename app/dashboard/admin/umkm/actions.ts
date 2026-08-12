'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export async function toggleUMKMStatus(umkmId: string, isActive: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('umkms')
    .update({ is_active: isActive })
    .eq('id', umkmId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/admin/umkm');
  return { success: true };
}

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

export async function createUMKMWithAccount(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const fullName = formData.get('full_name') as string;
  const umkmName = formData.get('umkm_name') as string;
  const categoryId = formData.get('category_id') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const whatsapp = formData.get('whatsapp') as string;

  // Generate slug from umkm name
  const slug = umkmName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  // Create admin client using service_role_key
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  // 1. Check if user with this email already exists
  const { data: existingUsers } = await adminAuthClient.auth.admin.listUsers();
  const existingUser = existingUsers?.users?.find((u: any) => u.email === email);

  if (existingUser) {
    // Delete old UMKM data linked to this user
    await supabase.from('umkms').delete().eq('profile_id', existingUser.id);
    // Delete old auth user
    await adminAuthClient.auth.admin.deleteUser(existingUser.id);
  }

  // 2. Create auth user via Supabase Auth Admin (server-side)
  const { data: authData, error: authError } = await adminAuthClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: 'umkm',
    },
  });

  if (authError) {
    if (authError.message.includes('missing')) {
       return { error: `SUPABASE_SERVICE_ROLE_KEY belum diset di .env.local` };
    }
    return { error: `Gagal membuat akun: ${authError.message}` };
  }

  // 2. Create UMKM entry
  const { error: umkmError } = await supabase
    .from('umkms')
    .insert({
      profile_id: authData.user.id,
      category_id: categoryId || null,
      name: umkmName,
      slug,
      description: description || null,
      address: address || null,
      whatsapp: whatsapp || null,
    });

  if (umkmError) {
    return { error: `Akun dibuat, tapi gagal buat data UMKM: ${umkmError.message}` };
  }

  revalidatePath('/dashboard/admin/umkm');
  return { success: true };
}

export async function editUMKM(umkmId: string, formData: FormData) {
  const supabase = await createClient();

  const umkmName = formData.get('umkm_name') as string;
  const categoryId = formData.get('category_id') as string;
  const description = formData.get('description') as string;
  const address = formData.get('address') as string;
  const whatsapp = formData.get('whatsapp') as string;

  // Generate new slug if name changed
  const slug = umkmName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  const { error } = await supabase
    .from('umkms')
    .update({
      category_id: categoryId || null,
      name: umkmName,
      slug,
      description: description || null,
      address: address || null,
      whatsapp: whatsapp || null,
    })
    .eq('id', umkmId);

  if (error) {
    return { error: `Gagal memperbarui UMKM: ${error.message}` };
  }

  revalidatePath('/dashboard/admin/umkm');
  return { success: true };
}

export async function deleteUMKM(umkmId: string) {
  const supabase = await createClient();

  // 1. Get profile_id to delete the auth user
  const { data: umkm, error: fetchError } = await supabase
    .from('umkms')
    .select('profile_id')
    .eq('id', umkmId)
    .single();

  if (fetchError || !umkm) {
    return { error: fetchError?.message || 'UMKM tidak ditemukan' };
  }

  // 2. Delete Auth User using Service Role
  const adminAuthClient = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );

  const { error: authDeleteError } = await adminAuthClient.auth.admin.deleteUser(umkm.profile_id);
  
  if (authDeleteError) {
    console.error("Gagal menghapus user di Auth Supabase (apakah service_role_key sudah benar?):", authDeleteError);
    // Kita tetap coba lanjut hapus record jika perlu, atau lemparkan error
    // return { error: `Gagal menghapus kredensial login: ${authDeleteError.message}` };
  }

  // 3. Delete the UMKM record (Profile should cascade automatically if set up in DB, but just in case)
  const { error } = await supabase
    .from('umkms')
    .delete()
    .eq('id', umkmId);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard/admin/umkm');
  return { success: true };
}

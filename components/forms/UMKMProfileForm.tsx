'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

interface UMKMProfileFormProps {
  umkm: any;
}

export function UMKMProfileForm({ umkm }: UMKMProfileFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    const supabase = createClient();
    const newName = (formData.get('name') as string).trim();

    if (!newName) {
      toast.error('Nama UMKM tidak boleh kosong.');
      setIsLoading(false);
      return;
    }

    // Generate slug baru jika nama berubah
    const updateData: Record<string, string> = {
      name: newName,
      description: formData.get('description') as string,
      address: formData.get('address') as string,
      whatsapp: formData.get('whatsapp') as string,
      instagram: formData.get('instagram') as string,
      tiktok_url: formData.get('tiktok_url') as string,
      shopee_url: formData.get('shopee_url') as string,
      tokopedia_url: formData.get('tokopedia_url') as string,
      maps_url: formData.get('maps_url') as string,
    };

    // Jika nama berubah, buat slug baru
    if (newName !== umkm.name) {
      const slug = newName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .substring(0, 50);
      const randomSuffix = Math.random().toString(36).substring(2, 5);
      updateData.slug = `${slug}-${randomSuffix}`;
    }

    const { error } = await supabase
      .from('umkms')
      .update(updateData)
      .eq('id', umkm.id);

    setIsLoading(false);

    if (error) {
      toast.error('Gagal memperbarui profil: ' + error.message);
    } else {
      toast.success('Profil berhasil diperbarui!');
      router.refresh();
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logos' | 'banners') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi ukuran (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 2MB.');
      return;
    }

    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from(type)
      .upload(fileName, file, { cacheControl: '3600', upsert: false });

    if (uploadError) {
      toast.error('Gagal mengunggah gambar: ' + uploadError.message);
      return;
    }

    const { data } = supabase.storage.from(type).getPublicUrl(fileName);
    const field = type === 'logos' ? 'logo_url' : 'banner_url';

    const { error: updateError } = await supabase
      .from('umkms')
      .update({ [field]: data.publicUrl })
      .eq('id', umkm.id);

    if (updateError) {
      toast.error('Gagal menyimpan URL gambar.');
    } else {
      toast.success(`${type === 'logos' ? 'Logo' : 'Banner'} berhasil diperbarui!`);
      router.refresh();
    }
  };

  return (
    <div className="space-y-8">
      {/* Upload Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Logo UMKM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 w-32 rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50 mx-auto">
              {umkm.logo_url ? (
                <img src={umkm.logo_url} alt="Logo" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs">No Logo</div>
              )}
            </div>
            <div>
              <Label htmlFor="logo_upload">Upload Logo Baru</Label>
              <Input
                id="logo_upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(e, 'logos')}
                className="mt-2"
              />
              <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP. Maks 2MB.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Banner UMKM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-32 w-full rounded-xl border-2 border-dashed border-slate-300 overflow-hidden bg-slate-50">
              {umkm.banner_url ? (
                <img src={umkm.banner_url} alt="Banner" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400 text-xs">No Banner</div>
              )}
            </div>
            <div>
              <Label htmlFor="banner_upload">Upload Banner Baru</Label>
              <Input
                id="banner_upload"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => handleImageUpload(e, 'banners')}
                className="mt-2"
              />
              <p className="text-xs text-slate-500 mt-1">JPG, PNG, WEBP. Maks 2MB.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Profile Form */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Informasi UMKM</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nama UMKM</Label>
              <Input id="name" name="name" defaultValue={umkm.name || ''} placeholder="Nama usaha Anda" />
              <p className="text-xs text-slate-500">Mengubah nama akan otomatis memperbarui link profil (slug) Anda.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea id="description" name="description" defaultValue={umkm.description || ''} placeholder="Ceritakan tentang usaha Anda..." rows={5} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" name="address" defaultValue={umkm.address || ''} placeholder="Alamat lengkap" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp">No. WhatsApp</Label>
                <Input id="whatsapp" name="whatsapp" defaultValue={umkm.whatsapp || ''} placeholder="08xxxxxxxxxx" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Link Instagram</Label>
                <Input id="instagram" name="instagram" defaultValue={umkm.instagram || ''} placeholder="https://instagram.com/nama_akun" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="Facebook">Link Facebook</Label>
                <Input id="Facebook" name="Facebook" defaultValue={umkm.facebook || ''} placeholder="https://Facebook.com/" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tiktok_url">Link TikTok</Label>
                <Input id="tiktok_url" name="tiktok_url" defaultValue={umkm.tiktok_url || ''} placeholder="https://tiktok.com/@nama_akun" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="shopee_url">Link Toko Shopee</Label>
                <Input id="shopee_url" name="shopee_url" defaultValue={umkm.shopee_url || ''} placeholder="https://shopee.co.id/nama_toko" />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="maps_url">URL Google Maps</Label>
                <Input id="maps_url" name="maps_url" defaultValue={umkm.maps_url || ''} placeholder="https://maps.google.com/..." />
              </div>

            </div>
            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Simpan Perubahan'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

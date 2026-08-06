'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';

interface CreateUMKMFormProps {
  profileId: string;
}

export function CreateUMKMForm({ profileId }: CreateUMKMFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    
    // Create a simple slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Math.floor(Math.random() * 1000);

    const supabase = createClient();
    const { error } = await supabase
      .from('umkms')
      .insert({
        profile_id: profileId,
        name: name,
        slug: slug,
        description: formData.get('description') as string,
        address: formData.get('address') as string,
        whatsapp: formData.get('whatsapp') as string,
        is_active: true
      });

    setIsLoading(false);

    if (error) {
      toast.error('Gagal mendaftarkan UMKM: ' + error.message);
    } else {
      toast.success('Profil UMKM berhasil dibuat!');
      router.refresh();
    }
  };

  return (
    <Card className="max-w-2xl mx-auto shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Daftarkan Usaha Anda</CardTitle>
        <CardDescription>
          Lengkapi data awal usaha Anda agar dapat mulai menambahkan produk.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nama UMKM / Toko <span className="text-red-500">*</span></Label>
            <Input id="name" name="name" required placeholder="Contoh: Toko Berkah" />
          </div>



          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Singkat</Label>
            <Textarea id="description" name="description" placeholder="Ceritakan singkat tentang usaha Anda..." rows={3} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address">Alamat Utama</Label>
              <Input id="address" name="address" placeholder="Contoh: Jl. Merdeka No. 1" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp">No. WhatsApp</Label>
              <Input id="whatsapp" name="whatsapp" placeholder="08xxxxxxxxxx" />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto" disabled={isLoading}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menyimpan...</> : 'Daftarkan UMKM Sekarang'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

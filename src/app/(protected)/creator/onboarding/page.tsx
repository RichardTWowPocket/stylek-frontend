'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { routes } from '@/lib/config/routes';
import { completeCreatorProfile } from '@/lib/api/auth';
import { toast } from '@/lib/ui/toast';

const creatorOnboardingSchema = z.object({
  displayName: z.string().min(2, 'Nama lengkap minimal 2 karakter'),
  creatorType: z.enum(['INDIVIDUAL', 'AGENCY']).optional(),
  bio: z.string().optional(),
  mainNiche: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
});

type CreatorOnboardingFormData = z.infer<typeof creatorOnboardingSchema>;

export default function CreatorOnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login');
    }
  }, [status, router]);
  
  // Show loading while checking session
  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }
  
  // Don't render if not authenticated (will redirect)
  if (status === 'unauthenticated') {
    return null;
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatorOnboardingFormData>({
    resolver: zodResolver(creatorOnboardingSchema),
    defaultValues: {
      creatorType: 'INDIVIDUAL',
    },
  });

  const onSubmit = async (data: CreatorOnboardingFormData) => {
    setIsLoading(true);

    try {
      await completeCreatorProfile({
        displayName: data.displayName,
        creatorType: data.creatorType,
        bio: data.bio,
        mainNiche: data.mainNiche,
        city: data.city,
        province: data.province,
      });

      toast.success('Profile berhasil dibuat!');
      
      // Refresh session to update hasProfile
      // NextAuth will automatically update session on next request
      // But we can force refresh by calling signIn again or refreshing page
      window.location.href = routes.creator.dashboard;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan profile');
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-6">
      <Card className="p-6">
        <h1 className="mb-6 text-2xl font-bold">Lengkapi Profile Creator</h1>
        <p className="mb-6 text-muted-foreground">
          Lengkapi informasi profile Anda untuk mulai menggunakan platform.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Nama Lengkap *</Label>
            <Input
              id="displayName"
              {...register('displayName')}
              placeholder="Contoh: John Doe"
              disabled={isLoading}
            />
            {errors.displayName && (
              <p className="text-sm text-destructive">{errors.displayName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="creatorType">Tipe Creator</Label>
            <select
              id="creatorType"
              {...register('creatorType')}
              className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              disabled={isLoading}
            >
              <option value="INDIVIDUAL">Individual</option>
              <option value="AGENCY">Agency</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Opsional)</Label>
            <Textarea
              id="bio"
              {...register('bio')}
              placeholder="Ceritakan tentang diri Anda..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="mainNiche">Niche Utama (Opsional)</Label>
            <Input
              id="mainNiche"
              {...register('mainNiche')}
              placeholder="Contoh: Fashion, Food, Beauty"
              disabled={isLoading}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="city">Kota (Opsional)</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Contoh: Jakarta"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="province">Provinsi (Opsional)</Label>
              <Input
                id="province"
                {...register('province')}
                placeholder="Contoh: DKI Jakarta"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Menyimpan...' : 'Simpan & Lanjut'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}


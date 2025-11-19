'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useBrandProfile } from '@/lib/hooks/brand/useBrand';
import { completeBrandProfile } from '@/lib/api/auth';
import { toast } from '@/lib/ui/toast';
import { useQueryClient } from '@tanstack/react-query';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';

const step1Schema = z.object({
  name: z.string().min(2, 'Nama brand minimal 2 karakter'),
  brandType: z.enum(['BRAND', 'AGENCY', 'ONLINESHOP']),
  logoUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
  bannerUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
  description: z.string().optional(),
  category: z.string().min(1, 'Kategori harus diisi'),
  city: z.string().min(1, 'Kota harus diisi'),
  province: z.string().min(1, 'Provinsi harus diisi'),
});

type Step1FormData = z.infer<typeof step1Schema>;

interface BrandOnboardingStep1Props {
  onNext: () => void;
}

export function BrandOnboardingStep1({ onNext }: BrandOnboardingStep1Props) {
  // For onboarding, we don't need to fetch profile (it doesn't exist yet)
  // Disable query for onboarding to avoid unnecessary API calls and loading delays
  const { data: profile, isLoading, error } = useBrandProfile({
    enabled: false, // Don't fetch profile during onboarding
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Step1FormData>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      brandType: 'BRAND',
    },
  });

  // Populate form with existing data if available (for edit mode)
  useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        brandType: profile.brandType || 'BRAND',
        logoUrl: profile.logoUrl || '',
        bannerUrl: profile.bannerUrl || '',
        description: profile.description || '',
        category: profile.category || '',
        city: profile.city || '',
        province: profile.province || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: Step1FormData) => {
    setIsSubmitting(true);
    try {
      // For onboarding, use complete-brand-profile endpoint to create new profile
      await completeBrandProfile({
        name: data.name,
        brandType: data.brandType,
        description: data.description,
        category: data.category,
        city: data.city,
        province: data.province,
      });
      
      // After creating profile, update logo and banner if provided
      if (data.logoUrl || data.bannerUrl) {
        // Use updateBrandProfile for logo/banner (profile already exists now)
        const { updateBrandProfile } = await import('@/lib/api/brand');
        await updateBrandProfile({
          name: data.name,
          brandType: data.brandType,
          logoUrl: data.logoUrl || undefined,
          bannerUrl: data.bannerUrl || undefined,
          description: data.description,
          category: data.category,
          city: data.city,
          province: data.province,
        });
      }
      
      // Invalidate brand profile query to refresh data
      queryClient.invalidateQueries({ queryKey: ['brand', 'profile'] });
      
      toast.success('Informasi dasar berhasil disimpan');
      onNext();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan informasi dasar');
    } finally {
      setIsSubmitting(false);
    }
  };

  // For onboarding, we disabled the query, so isLoading should be false
  // But if somehow it's loading, show skeleton
  if (isLoading) {
    return <SkeletonCard />;
  }

  // Only show error for non-404 errors (network issues, etc.)
  // 404 errors are expected for onboarding and should be ignored
  const is404Error = (error as any)?.response?.status === 404;
  if (error && !is404Error) {
    return (
      <ErrorState
        title="Gagal memuat profil"
        description="Terjadi kesalahan saat memuat data profil brand."
      />
    );
  }

  return (
    <Card className="p-6">
      <h2 className="mb-6 text-xl font-semibold">Informasi Dasar Brand</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nama Brand / Toko *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="Contoh: Toko Fashion XYZ"
            disabled={isSubmitting}
          />
          {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="brandType">Tipe Brand *</Label>
          <select
            id="brandType"
            {...register('brandType')}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            disabled={isSubmitting}
          >
            <option value="BRAND">Brand</option>
            <option value="AGENCY">Agency</option>
            <option value="ONLINESHOP">Online Shop</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="logoUrl">Logo URL (Opsional)</Label>
          <Input
            id="logoUrl"
            type="url"
            {...register('logoUrl')}
            placeholder="https://example.com/logo.png"
            disabled={isSubmitting}
          />
          {errors.logoUrl && (
            <p className="text-sm text-destructive">{errors.logoUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="bannerUrl">Banner URL (Opsional)</Label>
          <Input
            id="bannerUrl"
            type="url"
            {...register('bannerUrl')}
            placeholder="https://example.com/banner.png"
            disabled={isSubmitting}
          />
          {errors.bannerUrl && (
            <p className="text-sm text-destructive">{errors.bannerUrl.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Deskripsi (Opsional)</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Ceritakan tentang brand Anda..."
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Kategori *</Label>
          <Input
            id="category"
            {...register('category')}
            placeholder="Contoh: Fashion, Food, Beauty"
            disabled={isSubmitting}
          />
          {errors.category && (
            <p className="text-sm text-destructive">{errors.category.message}</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="city">Kota *</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="Contoh: Jakarta"
              disabled={isSubmitting}
            />
            {errors.city && <p className="text-sm text-destructive">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="province">Provinsi *</Label>
            <Input
              id="province"
              {...register('province')}
              placeholder="Contoh: DKI Jakarta"
              disabled={isSubmitting}
            />
            {errors.province && (
              <p className="text-sm text-destructive">{errors.province.message}</p>
            )}
          </div>
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Menyimpan...' : 'Simpan & Lanjut'}
          </Button>
        </div>
      </form>
    </Card>
  );
}


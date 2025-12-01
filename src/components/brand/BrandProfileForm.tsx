'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateBrandProfile } from '@/lib/hooks/brand/useBrandMutations';
import type { BrandProfile, UpdateBrandProfileDto } from '@/lib/api/brand';
import { X } from 'lucide-react';

const profileSchema = z.object({
  name: z.string().min(2, 'Nama brand minimal 2 karakter'),
  brandType: z.enum(['BRAND', 'AGENCY', 'ONLINESHOP']),
  logoUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
  bannerUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
  description: z.string().optional(),
  category: z.string().min(1, 'Kategori harus diisi'),
  city: z.string().min(1, 'Kota harus diisi'),
  province: z.string().min(1, 'Provinsi harus diisi'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface BrandProfileFormProps {
  defaultValues: BrandProfile;
  onCancel: () => void;
  onSuccess: () => void;
}

export function BrandProfileForm({ defaultValues, onCancel, onSuccess }: BrandProfileFormProps) {
  const updateProfile = useUpdateBrandProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: defaultValues.name || '',
      brandType: defaultValues.brandType || 'BRAND',
      logoUrl: defaultValues.logoUrl || '',
      bannerUrl: defaultValues.bannerUrl || '',
      description: defaultValues.description || '',
      category: defaultValues.category || '',
      city: defaultValues.city || '',
      province: defaultValues.province || '',
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync({
        name: data.name,
        brandType: data.brandType,
        logoUrl: data.logoUrl || undefined,
        bannerUrl: data.bannerUrl || undefined,
        description: data.description,
        category: data.category,
        city: data.city,
        province: data.province,
      });
      onSuccess();
    } catch (err: any) {
      // Error handling is done by toast in mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs sm:text-sm">Nama Brand / Toko *</Label>
        <Input id="name" {...register('name')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
        {errors.name && <p className="text-xs text-destructive sm:text-sm">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="brandType" className="text-xs sm:text-sm">Tipe Brand *</Label>
        <select
          id="brandType"
          {...register('brandType')}
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          disabled={updateProfile.isPending}
        >
          <option value="BRAND">Brand</option>
          <option value="AGENCY">Agency</option>
          <option value="ONLINESHOP">Online Shop</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="logoUrl" className="text-xs sm:text-sm">Logo URL (Opsional)</Label>
        <Input
          id="logoUrl"
          type="url"
          {...register('logoUrl')}
          disabled={updateProfile.isPending}
          className="text-sm sm:text-base"
        />
        {errors.logoUrl && <p className="text-xs text-destructive sm:text-sm">{errors.logoUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bannerUrl" className="text-xs sm:text-sm">Banner URL (Opsional)</Label>
        <Input
          id="bannerUrl"
          type="url"
          {...register('bannerUrl')}
          disabled={updateProfile.isPending}
          className="text-sm sm:text-base"
        />
        {errors.bannerUrl && (
          <p className="text-xs text-destructive sm:text-sm">{errors.bannerUrl.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description" className="text-xs sm:text-sm">Deskripsi (Opsional)</Label>
        <Textarea id="description" {...register('description')} rows={4} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category" className="text-xs sm:text-sm">Kategori *</Label>
        <Input id="category" {...register('category')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
        {errors.category && (
          <p className="text-xs text-destructive sm:text-sm">{errors.category.message}</p>
        )}
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs sm:text-sm">Kota *</Label>
          <Input id="city" {...register('city')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
          {errors.city && <p className="text-xs text-destructive sm:text-sm">{errors.city.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="province" className="text-xs sm:text-sm">Provinsi *</Label>
          <Input id="province" {...register('province')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
          {errors.province && (
            <p className="text-xs text-destructive sm:text-sm">{errors.province.message}</p>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={updateProfile.isPending} className="w-full sm:w-auto" size="sm">
          <X className="mr-2 h-4 w-4" />
          Batal
        </Button>
        <Button type="submit" disabled={updateProfile.isPending} className="w-full sm:w-auto" size="sm">
          {updateProfile.isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}


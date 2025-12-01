'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateCreatorProfile } from '@/lib/hooks/creator/useCreatorMutations';
import type { CreatorProfile, UpdateCreatorProfileDto } from '@/lib/api/creator';
import { X } from 'lucide-react';

const profileSchema = z.object({
  displayName: z.string().min(2, 'Nama minimal 2 karakter'),
  creatorType: z.enum(['INDIVIDUAL', 'AGENCY_CREATOR']),
  avatarUrl: z.string().url('URL tidak valid').optional().or(z.literal('')),
  bio: z.string().optional(),
  mainNiche: z.string().optional(),
  additionalNiches: z.string().optional(),
  city: z.string().optional(),
  province: z.string().optional(),
  gender: z.string().optional(),
  ageRange: z.enum(['AGE_18_24', 'AGE_25_34', 'AGE_35_44', 'AGE_45_54', 'AGE_55_PLUS']).optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

interface CreatorProfileFormProps {
  defaultValues: CreatorProfile;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreatorProfileForm({ defaultValues, onCancel, onSuccess }: CreatorProfileFormProps) {
  const updateProfile = useUpdateCreatorProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: defaultValues.displayName || '',
      creatorType: defaultValues.creatorType || 'INDIVIDUAL',
      avatarUrl: defaultValues.avatarUrl || '',
      bio: defaultValues.bio || '',
      mainNiche: defaultValues.mainNiche || '',
      additionalNiches: defaultValues.additionalNiches?.join(', ') || '',
      city: defaultValues.city || '',
      province: defaultValues.province || '',
      gender: defaultValues.gender || '',
      ageRange: defaultValues.ageRange,
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const additionalNichesArray = data.additionalNiches
        ? data.additionalNiches.split(',').map((n) => n.trim()).filter(Boolean)
        : undefined;

      await updateProfile.mutateAsync({
        displayName: data.displayName,
        creatorType: data.creatorType,
        avatarUrl: data.avatarUrl || undefined,
        bio: data.bio || undefined,
        mainNiche: data.mainNiche || undefined,
        additionalNiches: additionalNichesArray,
        city: data.city || undefined,
        province: data.province || undefined,
        gender: data.gender || undefined,
        ageRange: data.ageRange,
      });
      onSuccess();
    } catch (err: any) {
      // Error handling is done by toast in mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="displayName" className="text-xs sm:text-sm">Nama Lengkap *</Label>
        <Input id="displayName" {...register('displayName')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
        {errors.displayName && <p className="text-xs text-destructive sm:text-sm">{errors.displayName.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="creatorType" className="text-xs sm:text-sm">Tipe Creator *</Label>
        <select
          id="creatorType"
          {...register('creatorType')}
          className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
          disabled={updateProfile.isPending}
        >
          <option value="INDIVIDUAL">Individual</option>
          <option value="AGENCY_CREATOR">Agency</option>
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="avatarUrl" className="text-xs sm:text-sm">Avatar URL (Opsional)</Label>
        <Input
          id="avatarUrl"
          type="url"
          {...register('avatarUrl')}
          disabled={updateProfile.isPending}
          className="text-sm sm:text-base"
        />
        {errors.avatarUrl && <p className="text-xs text-destructive sm:text-sm">{errors.avatarUrl.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio" className="text-xs sm:text-sm">Bio (Opsional)</Label>
        <Textarea id="bio" {...register('bio')} rows={4} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="mainNiche" className="text-xs sm:text-sm">Niche Utama (Opsional)</Label>
        <Input id="mainNiche" {...register('mainNiche')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
      </div>

      <div className="space-y-2">
        <Label htmlFor="additionalNiches" className="text-xs sm:text-sm">Niche Tambahan (Opsional, pisahkan dengan koma)</Label>
        <Input
          id="additionalNiches"
          {...register('additionalNiches')}
          placeholder="Contoh: Fashion, Beauty, Lifestyle"
          disabled={updateProfile.isPending}
          className="text-sm sm:text-base"
        />
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="city" className="text-xs sm:text-sm">Kota (Opsional)</Label>
          <Input id="city" {...register('city')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="province" className="text-xs sm:text-sm">Provinsi (Opsional)</Label>
          <Input id="province" {...register('province')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
        </div>
      </div>

      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 sm:gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-xs sm:text-sm">Jenis Kelamin (Opsional)</Label>
          <Input id="gender" {...register('gender')} disabled={updateProfile.isPending} className="text-sm sm:text-base" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ageRange" className="text-xs sm:text-sm">Rentang Usia (Opsional)</Label>
          <select
            id="ageRange"
            {...register('ageRange')}
            className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
            disabled={updateProfile.isPending}
          >
            <option value="">Pilih rentang usia</option>
            <option value="AGE_18_24">18-24 tahun</option>
            <option value="AGE_25_34">25-34 tahun</option>
            <option value="AGE_35_44">35-44 tahun</option>
            <option value="AGE_45_54">45-54 tahun</option>
            <option value="AGE_55_PLUS">55+ tahun</option>
          </select>
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



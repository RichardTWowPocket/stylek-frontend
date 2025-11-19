'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAccountProfile, useUpdateAccountProfile } from '@/lib/hooks/useAccount';
import { toast } from '@/lib/ui/toast';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';

const profileSchema = z.object({
  name: z.string().min(2, 'Nama minimal 2 karakter'),
  phoneNumber: z.string().min(10, 'Nomor HP tidak valid'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export function ProfileSection() {
  const { data: session } = useSession();
  const { data: profile, isLoading, error, refetch } = useAccountProfile();
  const updateProfile = useUpdateAccountProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || '',
      phoneNumber: profile?.phoneNumber || '',
    },
  });

  // Reset form when profile data loads
  React.useEffect(() => {
    if (profile) {
      reset({
        name: profile.name || '',
        phoneNumber: profile.phoneNumber || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      toast.success('Profil berhasil diperbarui');
      refetch();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal memperbarui profil');
    }
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat profil"
        description="Terjadi kesalahan saat memuat data profil."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <Card className="p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={session?.user?.email || ''}
            disabled
            className="bg-muted"
          />
          <p className="text-xs text-muted-foreground">
            Email tidak dapat diubah untuk saat ini
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Nama</Label>
          <Input
            id="name"
            {...register('name')}
            disabled={updateProfile.isPending}
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phoneNumber">Nomor HP</Label>
          <Input
            id="phoneNumber"
            type="tel"
            {...register('phoneNumber')}
            disabled={updateProfile.isPending}
          />
          {errors.phoneNumber && (
            <p className="text-sm text-destructive">{errors.phoneNumber.message}</p>
          )}
        </div>

        <div className="flex justify-end">
          <Button type="submit" disabled={updateProfile.isPending}>
            {updateProfile.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </div>
      </form>
    </Card>
  );
}


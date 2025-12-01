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
    // Disabled - endpoint not available
    toast.error('Fitur update profil akun belum tersedia. Silakan hubungi admin untuk perubahan.');
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-xs sm:text-sm">Email</Label>
        <Input
          id="email"
          type="email"
          value={session?.user?.email || ''}
          disabled
          className="bg-muted text-sm sm:text-base"
        />
        <p className="text-xs text-muted-foreground">
          Email tidak dapat diubah untuk saat ini
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name" className="text-xs sm:text-sm">Nama</Label>
        <Input
          id="name"
          {...register('name')}
          disabled={true}
          className="bg-muted text-sm sm:text-base"
        />
        <p className="text-xs text-muted-foreground">
          Update profil akun belum tersedia. Silakan hubungi admin untuk perubahan.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber" className="text-xs sm:text-sm">Nomor HP</Label>
        <Input
          id="phoneNumber"
          type="tel"
          {...register('phoneNumber')}
          disabled={true}
          className="bg-muted text-sm sm:text-base"
        />
        <p className="text-xs text-muted-foreground">
          Update profil akun belum tersedia. Silakan hubungi admin untuk perubahan.
        </p>
      </div>

      <div className="flex justify-end">
        <Button type="button" disabled={true} variant="outline" size="sm" className="w-full sm:w-auto">
          Fitur belum tersedia
        </Button>
      </div>
    </form>
  );
}


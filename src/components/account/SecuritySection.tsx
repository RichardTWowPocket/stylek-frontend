'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useChangePassword } from '@/lib/hooks/useAccount';
import { toast } from '@/lib/ui/toast';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Password saat ini harus diisi'),
    newPassword: z.string().min(6, 'Password baru minimal 6 karakter'),
    confirmPassword: z.string().min(6, 'Konfirmasi password minimal 6 karakter'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Password baru dan konfirmasi password tidak cocok',
    path: ['confirmPassword'],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

export function SecuritySection() {
  const changePassword = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    // Disabled - endpoint not available
    toast.error('Fitur ubah password belum tersedia. Silakan hubungi admin untuk perubahan.');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentPassword" className="text-xs sm:text-sm">Password Saat Ini</Label>
        <Input
          id="currentPassword"
          type="password"
          {...register('currentPassword')}
          disabled={changePassword.isPending}
          className="text-sm sm:text-base"
        />
        {errors.currentPassword && (
          <p className="text-xs text-destructive sm:text-sm">{errors.currentPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword" className="text-xs sm:text-sm">Password Baru</Label>
        <Input
          id="newPassword"
          type="password"
          {...register('newPassword')}
          disabled={changePassword.isPending}
          className="text-sm sm:text-base"
        />
        {errors.newPassword && (
          <p className="text-xs text-destructive sm:text-sm">{errors.newPassword.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-xs sm:text-sm">Konfirmasi Password Baru</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register('confirmPassword')}
          disabled={changePassword.isPending}
          className="text-sm sm:text-base"
        />
        {errors.confirmPassword && (
          <p className="text-xs text-destructive sm:text-sm">{errors.confirmPassword.message}</p>
        )}
      </div>

      <div className="flex justify-end">
        <Button type="button" disabled={true} variant="outline" size="sm" className="w-full sm:w-auto">
          Fitur belum tersedia
        </Button>
      </div>
    </form>
  );
}


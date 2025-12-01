'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateCreatorBank } from '@/lib/hooks/creator/useCreatorMutations';
import type { CreatorProfile, UpdateCreatorBankDto } from '@/lib/api/creator';
import { X } from 'lucide-react';

const bankSchema = z.object({
  bankAccountName: z.string().min(2, 'Nama rekening minimal 2 karakter'),
  bankAccountNumber: z.string().min(1, 'Nomor rekening harus diisi'),
  bankName: z.string().min(1, 'Nama bank harus diisi'),
});

type BankFormData = z.infer<typeof bankSchema>;

interface CreatorBankFormProps {
  defaultValues: CreatorProfile;
  onCancel: () => void;
  onSuccess: () => void;
}

export function CreatorBankForm({ defaultValues, onCancel, onSuccess }: CreatorBankFormProps) {
  const updateBank = useUpdateCreatorBank();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      bankAccountName: defaultValues.bankAccountName || '',
      bankAccountNumber: defaultValues.bankAccountNumber || '',
      bankName: defaultValues.bankName || '',
    },
  });

  const onSubmit = async (data: BankFormData) => {
    try {
      await updateBank.mutateAsync({
        bankAccountName: data.bankAccountName,
        bankAccountNumber: data.bankAccountNumber,
        bankName: data.bankName,
      });
      onSuccess();
    } catch (err: any) {
      // Error handling is done by toast in mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
      <div className="space-y-2">
        <Label htmlFor="bankAccountName" className="text-xs sm:text-sm">Nama Pemilik Rekening *</Label>
        <Input
          id="bankAccountName"
          {...register('bankAccountName')}
          disabled={updateBank.isPending}
          className="text-sm sm:text-base"
        />
        {errors.bankAccountName && (
          <p className="text-xs text-destructive sm:text-sm">{errors.bankAccountName.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankAccountNumber" className="text-xs sm:text-sm">Nomor Rekening *</Label>
        <Input
          id="bankAccountNumber"
          {...register('bankAccountNumber')}
          disabled={updateBank.isPending}
          className="text-sm sm:text-base"
        />
        {errors.bankAccountNumber && (
          <p className="text-xs text-destructive sm:text-sm">{errors.bankAccountNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="bankName" className="text-xs sm:text-sm">Nama Bank *</Label>
        <Input id="bankName" {...register('bankName')} disabled={updateBank.isPending} className="text-sm sm:text-base" />
        {errors.bankName && <p className="text-xs text-destructive sm:text-sm">{errors.bankName.message}</p>}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
        <Button type="button" variant="outline" onClick={onCancel} disabled={updateBank.isPending} className="w-full sm:w-auto" size="sm">
          <X className="mr-2 h-4 w-4" />
          Batal
        </Button>
        <Button type="submit" disabled={updateBank.isPending} className="w-full sm:w-auto" size="sm">
          {updateBank.isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
      </div>
    </form>
  );
}



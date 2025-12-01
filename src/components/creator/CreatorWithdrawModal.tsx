'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateWithdrawalRequest } from '@/lib/hooks/creator/useCreateWithdrawalRequest';
import { useCreatorWalletSummary } from '@/lib/hooks/creator/useCreatorWalletSummary';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { AlertCircle } from 'lucide-react';

const withdrawalSchema = z.object({
  amount: z.number().min(50000, 'Minimum withdrawal adalah Rp 50.000'),
});

type WithdrawalFormData = z.infer<typeof withdrawalSchema>;

interface CreatorWithdrawModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreatorWithdrawModal({ open, onOpenChange }: CreatorWithdrawModalProps) {
  const { data: summary } = useCreatorWalletSummary();
  const createWithdrawal = useCreateWithdrawalRequest();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<WithdrawalFormData>({
    resolver: zodResolver(withdrawalSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = watch('amount');
  const walletBalance = summary?.walletBalance || 0;
  const remainingBalance = walletBalance - (amount || 0);

  const onSubmit = async (data: WithdrawalFormData) => {
    if (data.amount > walletBalance) {
      return;
    }

    try {
      await createWithdrawal.mutateAsync({
        amount: data.amount,
        // bankAccountId will be handled by backend using default account
      });
      reset();
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleClose = () => {
    if (!createWithdrawal.isPending) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tarik Dana</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk membuat request withdrawal. Admin akan memproses request Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Wallet Balance Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm text-muted-foreground">Saldo Tersedia</p>
            <p className="text-xl font-bold">{formatIDRCurrency(walletBalance)}</p>
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal Withdrawal</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              min={50000}
              max={walletBalance}
              {...register('amount', {
                valueAsNumber: true,
                validate: (value) => {
                  if (value > walletBalance) {
                    return 'Nominal tidak boleh melebihi saldo tersedia';
                  }
                  return true;
                },
              })}
              disabled={createWithdrawal.isPending}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
            {amount > 0 && (
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  Nominal: {formatIDRCurrency(amount)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Saldo setelah withdrawal: {formatIDRCurrency(remainingBalance)}
                </p>
              </div>
            )}
          </div>

          {/* Warning */}
          <div className="flex gap-2 rounded-lg border border-yellow-200 bg-yellow-50 p-3">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <div className="flex-1">
              <p className="text-sm font-medium text-yellow-800">Informasi Penting</p>
              <p className="text-xs text-yellow-700">
                Proses withdrawal membutuhkan waktu maksimal 3-5 hari kerja. Biaya admin (jika
                ada) akan dipotong dari nominal withdrawal.
              </p>
            </div>
          </div>

          {/* Bank Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Rekening Tujuan:</p>
            <p className="text-sm text-muted-foreground">
              Dana akan ditransfer ke rekening bank yang terdaftar di profil Anda.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createWithdrawal.isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={createWithdrawal.isPending || !amount || amount > walletBalance}
            >
              {createWithdrawal.isPending ? 'Memproses...' : 'Kirim Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


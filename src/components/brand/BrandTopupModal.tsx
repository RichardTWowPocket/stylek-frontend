'use client';

import { useState } from 'react';
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
import { useCreateBrandTopup } from '@/lib/hooks/brand/useCreateBrandTopup';
import { Upload, X } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';

const topUpSchema = z.object({
  amount: z
    .number()
    .min(50000, 'Minimum top-up adalah Rp 50.000')
    .max(100000000, 'Maximum top-up adalah Rp 100.000.000'),
  proofFile: z.instanceof(File).optional(),
});

type TopUpFormData = z.infer<typeof topUpSchema>;

interface BrandTopupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandTopupModal({ open, onOpenChange }: BrandTopupModalProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const createTopup = useCreateBrandTopup();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<TopUpFormData>({
    resolver: zodResolver(topUpSchema),
    defaultValues: {
      amount: 0,
    },
  });

  const amount = watch('amount');
  const proofFile = watch('proofFile');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue('proofFile', file, { shouldValidate: true });
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setValue('proofFile', undefined, { shouldValidate: true });
    setPreviewUrl(null);
  };

  const onSubmit = async (data: TopUpFormData) => {
    try {
      await createTopup.mutateAsync({
        amount: data.amount,
        proofFile: data.proofFile,
      });
      reset();
      setPreviewUrl(null);
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleClose = () => {
    if (!createTopup.isPending) {
      reset();
      setPreviewUrl(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Top-up Saldo</DialogTitle>
          <DialogDescription>
            Isi form berikut untuk membuat request top-up saldo. Admin akan memproses request Anda.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Nominal Top-up</Label>
            <Input
              id="amount"
              type="number"
              placeholder="50000"
              min={50000}
              max={100000000}
              {...register('amount', { valueAsNumber: true })}
              disabled={createTopup.isPending}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
            {amount > 0 && (
              <p className="text-sm text-muted-foreground">
                {formatIDRCurrency(amount)}
              </p>
            )}
          </div>

          {/* Proof File Upload */}
          <div className="space-y-2">
            <Label htmlFor="proofFile">Bukti Transfer (Opsional)</Label>
            {!previewUrl ? (
              <div className="flex items-center gap-2">
                <Input
                  id="proofFile"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  disabled={createTopup.isPending}
                  className="cursor-pointer"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={previewUrl}
                  alt="Proof preview"
                  className="h-32 w-full rounded-lg object-cover"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removeFile}
                  disabled={createTopup.isPending}
                  className="absolute right-2 top-2"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            {errors.proofFile && (
              <p className="text-sm text-destructive">{errors.proofFile.message}</p>
            )}
          </div>

          {/* Transfer Info */}
          <div className="rounded-lg border border-border bg-muted/50 p-4">
            <p className="text-sm font-medium mb-2">Cara Transfer:</p>
            <p className="text-sm text-muted-foreground">
              Silakan transfer ke rekening berikut:
            </p>
            <p className="text-sm font-mono mt-1">
              Bank: BCA<br />
              No. Rekening: 1234567890<br />
              Atas Nama: PT StyleK Indonesia
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              * Pastikan nominal transfer sesuai dengan nominal top-up yang diminta.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createTopup.isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={createTopup.isPending}>
              {createTopup.isPending ? 'Memproses...' : 'Kirim Request'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


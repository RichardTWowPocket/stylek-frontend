'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBrandProfile } from '@/lib/hooks/brand/useBrand';
import { useRequestBrandVerification } from '@/lib/hooks/brand/useBrandMutations';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { CheckCircle2, AlertCircle, Upload } from 'lucide-react';
import { toast } from '@/lib/ui/toast';

const verificationSchema = z.object({
  documentUrl: z.string().url('URL dokumen tidak valid'),
  notes: z.string().optional(),
});

type VerificationFormData = z.infer<typeof verificationSchema>;

export default function BrandVerificationPage() {
  const { data: profile, isLoading, error } = useBrandProfile();
  const requestVerification = useRequestBrandVerification();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerificationFormData>({
    resolver: zodResolver(verificationSchema),
  });

  const onSubmit = async (data: VerificationFormData) => {
    setIsSubmitting(true);
    try {
      await requestVerification.mutateAsync({
        documentUrl: data.documentUrl,
        notes: data.notes,
      });
      toast.success('Permohonan verifikasi berhasil dikirim');
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mengirim permohonan verifikasi');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat profil"
        description="Terjadi kesalahan saat memuat data profil brand."
      />
    );
  }

  if (!profile) {
    return null;
  }

  const isVerified = profile.verifyStatus === 'VERIFIED';
  const hasRejectedReason = !!profile.verifyRejectedReason;

  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Verifikasi Brand</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Ajukan verifikasi untuk meningkatkan kredibilitas brand Anda</p>
      </div>

      {isVerified ? (
        <Card className="p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div className="rounded-full bg-success/10 p-2 flex-shrink-0 sm:p-3">
              <CheckCircle2 className="h-6 w-6 text-success sm:h-8 sm:w-8" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-base font-semibold sm:text-lg">Brand Anda Sudah Terverifikasi</h2>
              <p className="text-xs text-muted-foreground sm:text-sm">
                Brand Anda telah diverifikasi dan dapat menggunakan fitur-fitur premium.
              </p>
            </div>
            <Badge variant="default" className="w-fit text-xs sm:text-sm">
              Verified
            </Badge>
          </div>
        </Card>
      ) : (
        <>
          {/* Benefits Card */}
          <Card className="p-4 sm:p-6">
            <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Manfaat Brand Terverifikasi</h2>
            <ul className="space-y-2 text-xs text-muted-foreground sm:text-sm">
              <li>• Meningkatkan kredibilitas di mata creator</li>
              <li>• Prioritas dalam pencarian campaign</li>
              <li>• Badge verified di profil brand</li>
              <li>• Akses ke fitur-fitur premium</li>
            </ul>
          </Card>

          {/* Rejection Reason */}
          {hasRejectedReason && (
            <Card className="border-destructive p-4 sm:p-6">
              <div className="flex items-start gap-3 sm:gap-4">
                <AlertCircle className="h-4 w-4 text-destructive flex-shrink-0 sm:h-5 sm:w-5" />
                <div className="flex-1 min-w-0">
                  <h3 className="mb-2 text-sm font-semibold text-destructive sm:text-base">Verifikasi Ditolak</h3>
                  <p className="text-xs sm:text-sm">{profile.verifyRejectedReason}</p>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Silakan perbaiki dokumen dan ajukan ulang.
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Verification Form */}
          <Card className="p-4 sm:p-6">
            <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Upload Dokumen Verifikasi</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="documentUrl" className="text-xs sm:text-sm">URL Dokumen *</Label>
                <p className="text-xs text-muted-foreground mb-2">
                  Upload dokumen (NPWP/NIB/SIUP) ke Google Drive atau platform penyimpanan lainnya,
                  lalu masukkan URL di sini
                </p>
                <Input
                  id="documentUrl"
                  type="url"
                  {...register('documentUrl')}
                  placeholder="https://drive.google.com/file/d/..."
                  disabled={isSubmitting}
                  className="text-sm sm:text-base"
                />
                {errors.documentUrl && (
                  <p className="text-xs text-destructive sm:text-sm">{errors.documentUrl.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes" className="text-xs sm:text-sm">Catatan Tambahan (Opsional)</Label>
                <Textarea
                  id="notes"
                  {...register('notes')}
                  placeholder="Tambahkan catatan atau informasi tambahan..."
                  rows={4}
                  disabled={isSubmitting}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto" size="sm">
                  <Upload className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Mengirim...' : 'Ajukan Verifikasi'}
                </Button>
              </div>
            </form>
          </Card>
        </>
      )}
    </div>
  );
}


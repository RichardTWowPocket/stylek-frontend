'use client';

import { useParams, useRouter } from 'next/navigation';
import { useAdminBrandDetail } from '@/lib/hooks/admin/useAdminBrands';
import { useVerifyBrand } from '@/lib/hooks/admin/useVerifyBrand';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { CheckCircle2, XCircle, ExternalLink, ArrowLeft } from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

function getStatusBadgeVariant(status: string) {
  return status === 'VERIFIED' ? 'default' : 'secondary';
}

export default function AdminBrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;
  const { data: brand, isLoading, error, refetch } = useAdminBrandDetail(brandId);
  const verifyBrand = useVerifyBrand();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    try {
      await verifyBrand.mutateAsync({
        id: brandId,
        payload: { approve: true },
      });
      refetch();
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return;
    }
    try {
      await verifyBrand.mutateAsync({
        id: brandId,
        payload: { approve: false, reason: rejectReason },
      });
      setShowRejectDialog(false);
      setRejectReason('');
      refetch();
    } catch (err) {
      // Error handled in mutation
    }
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat brand"
        description="Terjadi kesalahan saat memuat data brand."
        onRetry={() => refetch()}
      />
    );
  }

  if (!brand) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={routes.admin.brands}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold">{brand.name}</h1>
            <Badge variant={getStatusBadgeVariant(brand.verificationStatus)}>
              {brand.verificationStatus}
            </Badge>
          </div>
          <p className="text-muted-foreground">Detail brand dan verifikasi</p>
        </div>
      </div>

      {/* Basic Info */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Informasi Brand</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Brand Name</p>
            <p className="font-medium">{brand.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Owner Email</p>
            <p className="font-medium">{brand.ownerEmail}</p>
          </div>
          {brand.city && brand.province && (
            <div>
              <p className="text-sm text-muted-foreground">Lokasi</p>
              <p className="font-medium">
                {brand.city}, {brand.province}
              </p>
            </div>
          )}
          {brand.category && (
            <div>
              <p className="text-sm text-muted-foreground">Kategori</p>
              <p className="font-medium">{brand.category}</p>
            </div>
          )}
          {brand.logoUrl && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm text-muted-foreground">Logo</p>
              <img
                src={brand.logoUrl}
                alt={brand.name}
                className="h-24 w-24 rounded-lg object-cover"
              />
            </div>
          )}
          {brand.channels && brand.channels.length > 0 && (
            <div className="md:col-span-2">
              <p className="mb-2 text-sm text-muted-foreground">Channels</p>
              <div className="flex flex-wrap gap-2">
                {brand.channels.map((channel) => (
                  <Badge key={channel} variant="secondary">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Verification Section */}
      <Card className="p-6">
        <h2 className="mb-4 text-lg font-semibold">Verifikasi</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={getStatusBadgeVariant(brand.verificationStatus)} className="mt-1">
              {brand.verificationStatus}
            </Badge>
          </div>

          {brand.verificationDocuments && brand.verificationDocuments.length > 0 && (
            <div>
              <p className="mb-2 text-sm text-muted-foreground">Dokumen Verifikasi</p>
              <div className="space-y-2">
                {brand.verificationDocuments.map((doc, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      {doc.type} - {formatDateTimeShort(doc.uploadedAt)}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          )}

          {brand.verificationStatus === 'VERIFIED' && brand.verifiedAt && (
            <div>
              <p className="text-sm text-muted-foreground">Diverifikasi pada</p>
              <p className="font-medium">{formatDateTimeShort(brand.verifiedAt)}</p>
              {brand.verifiedBy && (
                <p className="mt-1 text-sm text-muted-foreground">Oleh: {brand.verifiedBy}</p>
              )}
            </div>
          )}

          {brand.verifyRejectedReason && (
            <div className="rounded-lg border border-destructive bg-destructive/10 p-3">
              <p className="text-sm font-medium text-destructive">Alasan Penolakan</p>
              <p className="text-sm">{brand.verifyRejectedReason}</p>
            </div>
          )}

          {brand.verificationStatus === 'UNVERIFIED' && (
            <div className="flex gap-2">
              <Button onClick={handleApprove} disabled={verifyBrand.isPending}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button
                variant="destructive"
                onClick={() => setShowRejectDialog(true)}
                disabled={verifyBrand.isPending}
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* Wallet Summary */}
      {brand.walletSummary && (
        <Card className="p-6">
          <h2 className="mb-4 text-lg font-semibold">Wallet Summary</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Available Balance</p>
              <p className="text-xl font-bold">
                {formatIDRCurrency(brand.walletSummary.availableBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Locked Balance</p>
              <p className="text-xl font-bold">
                {formatIDRCurrency(brand.walletSummary.lockedBalance)}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Brand Verification?</AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan alasan penolakan verifikasi brand ini.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejectReason">Alasan Penolakan</Label>
            <Textarea
              id="rejectReason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Masukkan alasan penolakan..."
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={verifyBrand.isPending || !rejectReason.trim()}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}


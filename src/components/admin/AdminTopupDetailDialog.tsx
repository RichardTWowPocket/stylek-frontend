'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAdminTopups } from '@/lib/hooks/admin/useAdminTopups';
import { useApproveTopup, useRejectTopup } from '@/lib/hooks/admin/useTopupMutations';
import { CheckCircle2, XCircle, ExternalLink } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
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

interface AdminTopupDetailDialogProps {
  topupId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminTopupDetailDialog({
  topupId,
  open,
  onOpenChange,
}: AdminTopupDetailDialogProps) {
  const { data: topupsData } = useAdminTopups();
  const topup = topupsData?.data.find((t) => t.id === topupId);
  const approveTopup = useApproveTopup();
  const rejectTopup = useRejectTopup();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [approveNote, setApproveNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    try {
      await approveTopup.mutateAsync({
        id: topupId,
        payload: approveNote ? { note: approveNote } : undefined,
      });
      setApproveNote('');
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      return;
    }
    try {
      await rejectTopup.mutateAsync({
        id: topupId,
        payload: { reason: rejectReason },
      });
      setShowRejectDialog(false);
      setRejectReason('');
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  if (!topup) {
    return null;
  }

  const canApprove = topup.status === 'PENDING';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Top-up Detail</DialogTitle>
            <DialogDescription>Review top-up request dari brand</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Brand Info */}
            <div>
              <p className="text-sm text-muted-foreground">Brand</p>
              <p className="font-medium">{topup.brandName}</p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">{formatIDRCurrency(topup.amount)}</p>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={topup.status === 'APPROVED' ? 'default' : 'secondary'}>
                {topup.status}
              </Badge>
            </div>

            {/* Created At */}
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDateTimeShort(topup.createdAt)}</p>
            </div>

            {/* Proof Image */}
            {topup.proofImageUrl && (
              <div>
                <p className="mb-2 text-sm text-muted-foreground">Proof Image</p>
                <a
                  href={topup.proofImageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <img
                    src={topup.proofImageUrl}
                    alt="Proof"
                    className="h-48 w-full rounded-lg object-cover"
                  />
                  <div className="mt-2 flex items-center gap-2 text-sm text-primary">
                    <ExternalLink className="h-4 w-4" />
                    Buka gambar penuh
                  </div>
                </a>
              </div>
            )}

            {/* Approve Note Input */}
            {canApprove && (
              <div className="space-y-2">
                <Label htmlFor="approveNote">Note (Opsional)</Label>
                <Textarea
                  id="approveNote"
                  value={approveNote}
                  onChange={(e) => setApproveNote(e.target.value)}
                  placeholder="Masukkan catatan untuk brand..."
                  rows={3}
                />
              </div>
            )}

            {/* Actions */}
            {canApprove && (
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={approveTopup.isPending}
                  className="flex-1"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={rejectTopup.isPending}
                  className="flex-1"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Reject
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Reject Confirmation Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Top-up?</AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan alasan penolakan top-up ini.
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
              disabled={rejectTopup.isPending || !rejectReason.trim()}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


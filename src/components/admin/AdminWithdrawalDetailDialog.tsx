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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useAdminWithdrawals } from '@/lib/hooks/admin/useAdminWithdrawals';
import { useApproveWithdrawal, useRejectWithdrawal } from '@/lib/hooks/admin/useWithdrawalMutations';
import { CheckCircle2, XCircle } from 'lucide-react';
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

interface AdminWithdrawalDetailDialogProps {
  withdrawalId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminWithdrawalDetailDialog({
  withdrawalId,
  open,
  onOpenChange,
}: AdminWithdrawalDetailDialogProps) {
  const { data: withdrawalsData } = useAdminWithdrawals();
  const withdrawal = withdrawalsData?.data.find((w) => w.id === withdrawalId);
  const approveWithdrawal = useApproveWithdrawal();
  const rejectWithdrawal = useRejectWithdrawal();
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [externalRef, setExternalRef] = useState('');
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = async () => {
    try {
      await approveWithdrawal.mutateAsync({
        id: withdrawalId,
        payload: externalRef ? { externalRef } : undefined,
      });
      setExternalRef('');
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
      await rejectWithdrawal.mutateAsync({
        id: withdrawalId,
        payload: { reason: rejectReason },
      });
      setShowRejectDialog(false);
      setRejectReason('');
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  if (!withdrawal) {
    return null;
  }

  const canApprove = withdrawal.status === 'PENDING';

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Withdrawal Detail</DialogTitle>
            <DialogDescription>Review withdrawal request dari creator</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Creator Info */}
            <div>
              <p className="text-sm text-muted-foreground">Creator</p>
              <p className="font-medium">{withdrawal.creatorName}</p>
              <p className="text-sm text-muted-foreground">{withdrawal.creatorEmail}</p>
            </div>

            {/* Amount */}
            <div>
              <p className="text-sm text-muted-foreground">Amount</p>
              <p className="text-2xl font-bold">{formatIDRCurrency(withdrawal.amount)}</p>
            </div>

            {/* Bank Info */}
            <div className="rounded-lg border border-border bg-muted/50 p-4">
              <p className="mb-2 text-sm font-medium">Bank Information</p>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Bank:</span>{' '}
                  <span className="font-medium">{withdrawal.bankName}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Account Name:</span>{' '}
                  <span className="font-medium">{withdrawal.bankAccountName}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Account Number:</span>{' '}
                  <span className="font-medium">{withdrawal.bankAccountNumber}</span>
                </p>
              </div>
            </div>

            {/* Status */}
            <div>
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge variant={withdrawal.status === 'APPROVED' ? 'default' : 'secondary'}>
                {withdrawal.status}
              </Badge>
            </div>

            {/* Created At */}
            <div>
              <p className="text-sm text-muted-foreground">Created At</p>
              <p className="font-medium">{formatDateTimeShort(withdrawal.createdAt)}</p>
            </div>

            {/* External Ref Input */}
            {canApprove && (
              <div className="space-y-2">
                <Label htmlFor="externalRef">External Reference (No. Transfer) - Opsional</Label>
                <Input
                  id="externalRef"
                  value={externalRef}
                  onChange={(e) => setExternalRef(e.target.value)}
                  placeholder="Masukkan nomor transfer bank..."
                />
              </div>
            )}

            {/* Actions */}
            {canApprove && (
              <div className="flex gap-2">
                <Button
                  onClick={handleApprove}
                  disabled={approveWithdrawal.isPending}
                  className="flex-1"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowRejectDialog(true)}
                  disabled={rejectWithdrawal.isPending}
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
            <AlertDialogTitle>Reject Withdrawal?</AlertDialogTitle>
            <AlertDialogDescription>
              Masukkan alasan penolakan withdrawal ini.
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
              disabled={rejectWithdrawal.isPending || !rejectReason.trim()}
            >
              Reject
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}


'use client';

import { useState } from 'react';
import { useAdminWithdrawals } from '@/lib/hooks/admin/useAdminWithdrawals';
import { useAdminWithdrawalsStore } from '@/store/adminWithdrawals.store';
import { AdminWithdrawalDetailDialog } from '@/components/admin/AdminWithdrawalDetailDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ArrowDownCircle, Eye } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'default';
    case 'REJECTED':
      return 'destructive';
    case 'PENDING':
    default:
      return 'secondary';
  }
}

function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return `****${accountNumber.slice(-4)}`;
}

export default function AdminWithdrawalsPage() {
  const { status, setStatus } = useAdminWithdrawalsStore();
  const { data, isLoading, error, refetch } = useAdminWithdrawals();
  const [selectedWithdrawalId, setSelectedWithdrawalId] = useState<string | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <SkeletonCard />
        <SkeletonCard />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Gagal memuat withdrawals"
        description="Terjadi kesalahan saat memuat daftar withdrawal."
        onRetry={() => refetch()}
      />
    );
  }

  const withdrawals = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Withdrawal Management</h1>
        <p className="text-muted-foreground">Review dan approve/reject withdrawal requests</p>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <Select value={status} onValueChange={(value) => setStatus(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="REJECTED">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Withdrawals List */}
      {withdrawals.length === 0 ? (
        <EmptyState
          icon={ArrowDownCircle}
          title="Belum ada withdrawal"
          description={
            status !== 'ALL'
              ? `Tidak ada withdrawal dengan status ${status}.`
              : 'Belum ada withdrawal request.'
          }
        />
      ) : (
        <div className="space-y-2">
          {withdrawals.map((withdrawal) => (
            <Card key={withdrawal.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{withdrawal.creatorName}</h3>
                    <Badge variant={getStatusBadgeVariant(withdrawal.status)}>
                      {withdrawal.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatIDRCurrency(withdrawal.amount)}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-4 text-xs text-muted-foreground">
                    <span>
                      {withdrawal.bankName} - {maskAccountNumber(withdrawal.bankAccountNumber)}
                    </span>
                    <span>{formatDateTimeShort(withdrawal.createdAt)}</span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedWithdrawalId(withdrawal.id)}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Detail Dialog */}
      {selectedWithdrawalId && (
        <AdminWithdrawalDetailDialog
          withdrawalId={selectedWithdrawalId}
          open={!!selectedWithdrawalId}
          onOpenChange={(open) => !open && setSelectedWithdrawalId(null)}
        />
      )}
    </div>
  );
}


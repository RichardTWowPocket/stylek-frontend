'use client';

import { useState } from 'react';
import { useAdminTopups } from '@/lib/hooks/admin/useAdminTopups';
import { useAdminTopupsStore } from '@/store/adminTopups.store';
import { AdminTopupDetailDialog } from '@/components/admin/AdminTopupDetailDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { ArrowUpCircle, Eye } from 'lucide-react';
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

export default function AdminTopupsPage() {
  const { status, setStatus } = useAdminTopupsStore();
  const { data, isLoading, error, refetch } = useAdminTopups();
  const [selectedTopupId, setSelectedTopupId] = useState<string | null>(null);

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
        title="Gagal memuat top-ups"
        description="Terjadi kesalahan saat memuat daftar top-up."
        onRetry={() => refetch()}
      />
    );
  }

  const topups = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Top-up Management</h1>
        <p className="text-muted-foreground">Review dan approve/reject top-up requests</p>
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

      {/* Top-ups List */}
      {topups.length === 0 ? (
        <EmptyState
          icon={ArrowUpCircle}
          title="Belum ada top-up"
          description={
            status !== 'ALL'
              ? `Tidak ada top-up dengan status ${status}.`
              : 'Belum ada top-up request.'
          }
        />
      ) : (
        <div className="space-y-2">
          {topups.map((topup) => (
            <Card key={topup.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{topup.brandName}</h3>
                    <Badge variant={getStatusBadgeVariant(topup.status)}>{topup.status}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatIDRCurrency(topup.amount)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTimeShort(topup.createdAt)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTopupId(topup.id)}
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
      {selectedTopupId && (
        <AdminTopupDetailDialog
          topupId={selectedTopupId}
          open={!!selectedTopupId}
          onOpenChange={(open) => !open && setSelectedTopupId(null)}
        />
      )}
    </div>
  );
}


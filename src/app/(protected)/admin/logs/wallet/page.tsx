'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAdminWalletLogs, type GetAdminWalletLogsParams, type WalletType } from '@/lib/api/admin-wallet-logs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { FileText, ExternalLink } from 'lucide-react';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

function getWalletTypeBadgeVariant(type: WalletType) {
  return type === 'BRAND' ? 'default' : 'secondary';
}

export default function AdminWalletLogsPage() {
  const [walletType, setWalletType] = useState<WalletType | 'ALL'>('ALL');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [type, setType] = useState('');

  const params: GetAdminWalletLogsParams = {
    walletType: walletType === 'ALL' ? undefined : walletType,
    fromDate: fromDate || undefined,
    toDate: toDate || undefined,
    type: type || undefined,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'logs', 'wallet', params],
    queryFn: () => getAdminWalletLogs(params),
  });

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
        title="Gagal memuat wallet logs"
        description="Terjadi kesalahan saat memuat log transaksi wallet."
        onRetry={() => refetch()}
      />
    );
  }

  const logs = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Wallet Logs</h1>
        <p className="text-muted-foreground">Riwayat transaksi wallet semua user (read-only)</p>
      </div>

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="grid gap-4 md:grid-cols-4">
          <div>
            <Label htmlFor="walletType">Wallet Type</Label>
            <Select value={walletType} onValueChange={(value) => setWalletType(value as any)}>
              <SelectTrigger id="walletType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua</SelectItem>
                <SelectItem value="BRAND">Brand</SelectItem>
                <SelectItem value="CREATOR">Creator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="fromDate">From Date</Label>
            <Input
              id="fromDate"
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="toDate">To Date</Label>
            <Input
              id="toDate"
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="type">Transaction Type</Label>
            <Input
              id="type"
              placeholder="Type..."
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </div>
        </div>
      </Card>

      {/* Logs List */}
      {logs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Belum ada log"
          description="Tidak ada transaksi wallet yang sesuai dengan filter Anda."
        />
      ) : (
        <div className="space-y-2">
          {logs.map((log) => (
            <Card key={log.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant={getWalletTypeBadgeVariant(log.walletType)}>
                      {log.walletType}
                    </Badge>
                    <span className="font-medium">{log.ownerName}</span>
                    <Badge variant="secondary">{log.transactionType}</Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="font-medium">
                      {log.amount >= 0 ? '+' : ''}
                      {formatIDRCurrency(log.amount)}
                    </span>
                    {log.relatedCampaignId && (
                      <Link
                        href={routes.brand.campaignDetail(log.relatedCampaignId)}
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        Campaign
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    )}
                    {log.externalRef && <span>Ref: {log.externalRef}</span>}
                    <span>{formatDateTimeShort(log.createdAt)}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


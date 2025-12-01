'use client';

import { useQuery } from '@tanstack/react-query';
import { getAdminCampaigns, type GetAdminCampaignsParams } from '@/lib/api/admin-campaigns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { FolderKanban, ExternalLink } from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';
import type { CampaignStatus } from '@/lib/api/campaigns';

function getStatusBadgeVariant(status: CampaignStatus) {
  switch (status) {
    case 'OPEN':
    case 'ONGOING':
      return 'default';
    case 'COMPLETED':
      return 'secondary';
    case 'DRAFT':
    default:
      return 'secondary';
  }
}

export default function AdminCampaignsPage() {
  const [status, setStatus] = useState<CampaignStatus | 'ALL'>('ALL');
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['admin', 'campaigns', { status: status === 'ALL' ? undefined : status }],
    queryFn: () => getAdminCampaigns({ status: status === 'ALL' ? undefined : status }),
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
        title="Gagal memuat campaigns"
        description="Terjadi kesalahan saat memuat daftar campaign."
        onRetry={() => refetch()}
      />
    );
  }

  const campaigns = data?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Campaign Monitoring</h1>
        <p className="text-muted-foreground">Lihat semua campaign di platform (read-only)</p>
      </div>

      {/* Filter */}
      <Card className="p-4">
        <Select value={status} onValueChange={(value) => setStatus(value as any)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">Semua Status</SelectItem>
            <SelectItem value="DRAFT">Draft</SelectItem>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ONGOING">Ongoing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
      </Card>

      {/* Campaigns List */}
      {campaigns.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Belum ada campaign"
          description={
            status !== 'ALL'
              ? `Tidak ada campaign dengan status ${status}.`
              : 'Belum ada campaign yang dibuat.'
          }
        />
      ) : (
        <div className="space-y-2">
          {campaigns.map((campaign) => (
            <Card key={campaign.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{campaign.title}</h3>
                    <Badge variant={getStatusBadgeVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Brand: {campaign.brandName}</p>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      Apply: {formatDateTimeShort(campaign.applyStartDate)} -{' '}
                      {formatDateTimeShort(campaign.applyEndDate)}
                    </span>
                    <span>
                      Slots: {campaign.filledSlots}/{campaign.slots}
                    </span>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href={routes.brand.campaignDetail(campaign.id)}>
                    <ExternalLink className="mr-2 h-4 w-4" />
                    Lihat Detail
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}


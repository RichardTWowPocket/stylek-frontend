'use client';

import { useRouter } from 'next/navigation';
import { useBrandCampaigns } from '@/lib/hooks/brand/useBrandCampaigns';
import { useBrandCampaignFiltersStore } from '@/store/brandCampaignFilters.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { Plus, Search } from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import type { CampaignStatus } from '@/lib/api/campaigns';

const statusOptions: Array<{ value: CampaignStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'DRAFT', label: 'Draft' },
  { value: 'OPEN', label: 'Open' },
  { value: 'SELECTION', label: 'Selection' },
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'COMPLETED', label: 'Completed' },
];

function getStatusBadgeVariant(status: CampaignStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'DRAFT':
      return 'secondary';
    case 'OPEN':
      return 'default';
    case 'ONGOING':
      return 'default';
    case 'COMPLETED':
      return 'secondary';
    case 'SELECTION':
      return 'default';
    default:
      return 'secondary';
  }
}

export default function BrandCampaignsPage() {
  const router = useRouter();
  const { status, search, page, pageSize, setStatus, setSearch, setPage } = useBrandCampaignFiltersStore();
  const { data, isLoading, error, refetch } = useBrandCampaigns({
    status: status === 'ALL' ? undefined : status,
    search: search || undefined,
    page,
    pageSize,
  });

  const campaigns = data?.data || [];
  const total = data?.total || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Campaign Saya</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Kelola semua campaign brand Anda</p>
        </div>
        <Button asChild className="w-full sm:w-auto" size="sm">
          <Link href={routes.brand.campaignNew}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Buat Campaign Baru</span>
            <span className="sm:hidden">Buat Campaign</span>
          </Link>
        </Button>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center">
          <div className="flex-1 w-full">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari campaign..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 overflow-x-auto pb-1 sm:pb-0">
            {statusOptions.map((option) => (
              <Button
                key={option.value}
                variant={status === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus(option.value)}
                className="text-xs sm:text-sm whitespace-nowrap"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Campaign List */}
      {isLoading ? (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Gagal memuat campaign"
          description="Terjadi kesalahan saat memuat daftar campaign."
          onRetry={() => refetch()}
        />
      ) : campaigns.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="Belum ada campaign"
          description={
            search
              ? 'Tidak ada campaign yang sesuai dengan pencarian Anda.'
              : 'Mulai dengan membuat campaign pertama Anda.'
          }
          action={
            <Button asChild size="sm">
              <Link href={routes.brand.campaignNew}>Buat Campaign Pertama</Link>
            </Button>
          }
        />
      ) : (
        <>
          <div className="space-y-2 sm:space-y-3">
            {campaigns.map((campaign) => (
              <Card
                key={campaign.id}
                className="cursor-pointer p-3 transition-colors hover:bg-muted/50 sm:p-4"
                onClick={() => router.push(routes.brand.campaignDetail(campaign.id))}
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{campaign.title}</h3>
                      <Badge variant={getStatusBadgeVariant(campaign.status)} className="w-fit text-xs">
                        {campaign.status}
                      </Badge>
                    </div>
                    <div className="mt-2 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:gap-4 sm:text-sm">
                      <span className="truncate">Tipe: {campaign.campaignType}</span>
                      <span className="hidden sm:inline">•</span>
                      <span>Slots: {campaign.slots}</span>
                      <span className="hidden sm:inline">•</span>
                      <span className="truncate">
                        Apply sampai: {new Date(campaign.applyEndDate).toLocaleDateString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {total > pageSize && (
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="w-full sm:w-auto"
              >
                Sebelumnya
              </Button>
              <span className="text-xs text-muted-foreground sm:text-sm">
                Halaman {page} dari {Math.ceil(total / pageSize)}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= Math.ceil(total / pageSize)}
                className="w-full sm:w-auto"
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


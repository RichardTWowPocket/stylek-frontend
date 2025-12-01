'use client';

import { useRouter } from 'next/navigation';
import { useCreatorApplications } from '@/lib/hooks/creator/useCreatorApplications';
import { useMyCampaignsFiltersStore } from '@/store/myCampaignsFilters.store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import {
  FolderKanban,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  AlertCircle,
} from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import type { ApplicationStatus } from '@/lib/api/campaigns';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

const statusOptions: Array<{ value: ApplicationStatus | 'ALL'; label: string; icon: any }> = [
  { value: 'ALL', label: 'Semua', icon: FolderKanban },
  { value: 'APPLIED', label: 'Applied', icon: Hourglass },
  { value: 'ACCEPTED', label: 'Accepted', icon: CheckCircle2 },
  { value: 'REJECTED', label: 'Rejected', icon: XCircle },
  { value: 'WAITLISTED', label: 'Waitlisted', icon: AlertCircle },
];

function getStatusBadgeVariant(status: ApplicationStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'ACCEPTED':
      return 'default';
    case 'REJECTED':
      return 'destructive';
    case 'WAITLISTED':
      return 'secondary';
    case 'APPLIED':
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: ApplicationStatus): string {
  switch (status) {
    case 'APPLIED':
      return 'Menunggu Review';
    case 'ACCEPTED':
      return 'Diterima';
    case 'REJECTED':
      return 'Ditolak';
    case 'WAITLISTED':
      return 'Waitlist';
    default:
      return status;
  }
}

function getCampaignStatusBadgeVariant(status: string): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'OPEN':
    case 'ONGOING':
      return 'default';
    case 'COMPLETED':
      return 'secondary';
    case 'DRAFT':
    case 'SELECTION':
    default:
      return 'secondary';
  }
}

function ApplicationCard({ application }: { application: any }) {
  const router = useRouter();
  const { campaign, tasks } = application;
  const completedTasks = tasks.filter((t: any) => t.status === 'LIVE_APPROVED').length;
  const totalTasks = tasks.length;
  const hasPendingTasks = tasks.some((t: any) => 
    ['DRAFT_PENDING', 'DRAFT_SUBMITTED', 'LIVE_SUBMITTED'].includes(t.status)
  );

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => router.push(routes.creator.campaignDetail(campaign.id))}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              {campaign.brand?.logoUrl && (
                <img
                  src={campaign.brand.logoUrl}
                  alt={campaign.brand.name}
                  className="h-6 w-6 flex-shrink-0 rounded-full object-cover sm:h-8 sm:w-8"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold truncate sm:text-base">{campaign.title}</h3>
                <p className="text-xs text-muted-foreground truncate sm:text-sm">{campaign.brand?.name}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge variant={getStatusBadgeVariant(application.status)} className="text-xs">
                {getStatusLabel(application.status)}
              </Badge>
              <Badge variant={getCampaignStatusBadgeVariant(campaign.status)} className="text-xs">
                {campaign.status}
              </Badge>
              <Badge variant="outline" className="text-xs">{application.selectedPlatform}</Badge>
            </div>
          </div>
        </div>

        {/* Product Info */}
        {campaign.productImages && campaign.productImages.length > 0 && (
          <div className="mb-3 sm:mb-4">
            <img
              src={campaign.productImages[0]}
              alt={campaign.productName}
              className="h-24 w-full rounded-lg object-cover sm:h-32"
            />
          </div>
        )}

        {/* Details */}
        <div className="mb-3 space-y-1.5 text-xs sm:mb-4 sm:space-y-2 sm:text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Product:</span>
            <span className="font-medium truncate ml-2">{campaign.productName}</span>
          </div>
          {campaign.feePerCreator && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Fee:</span>
              <span className="font-semibold text-green-600">
                {formatIDRCurrency(campaign.feePerCreator)}
              </span>
            </div>
          )}
          {totalTasks > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Progress Tasks:</span>
              <span className="font-medium">
                {completedTasks} / {totalTasks} selesai
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
            <span className="text-muted-foreground">Deadline:</span>
            <span className="font-medium">{formatDate(campaign.postDeadline)}</span>
          </div>
        </div>

        {/* Tasks Status */}
        {totalTasks > 0 && (
          <div className="mb-3 rounded-lg bg-muted/50 p-2 sm:mb-4 sm:p-3">
            <p className="mb-1.5 text-xs font-medium text-muted-foreground sm:mb-2">Tasks Status:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {tasks.map((task: any) => (
                <Badge
                  key={task.id}
                  variant={
                    task.status === 'LIVE_APPROVED'
                      ? 'default'
                      : ['DRAFT_PENDING', 'DRAFT_SUBMITTED', 'LIVE_SUBMITTED'].includes(
                          task.status
                        )
                        ? 'secondary'
                        : 'outline'
                  }
                  className="text-xs"
                >
                  {task.deliverableType} - {task.status}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <span className="text-xs text-muted-foreground">
            Applied: {formatDate(application.createdAt)}
          </span>
          <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
            <Link href={routes.creator.campaignDetail(campaign.id)}>
              Lihat Detail
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>

        {/* Warning for pending tasks */}
        {hasPendingTasks && application.status === 'ACCEPTED' && (
          <div className="mt-2 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2 sm:mt-3">
            <p className="text-xs text-yellow-700 dark:text-yellow-400">
              ⚠️ Anda memiliki tasks yang perlu diselesaikan
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function MyCampaignsPage() {
  const router = useRouter();
  const { status, page, pageSize, setStatus, setPage } = useMyCampaignsFiltersStore();

  const { data, isLoading, error, refetch } = useCreatorApplications({
    status: status === 'ALL' ? undefined : status,
    page,
    pageSize,
  });

  const applications = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">My Campaigns</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Lihat semua campaign yang Anda ikuti</p>
      </div>

      {/* Filter Bar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => {
            const Icon = option.icon;
            return (
              <Button
                key={option.value}
                variant={status === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatus(option.value)}
                className="gap-1.5 text-xs sm:gap-2 sm:text-sm"
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                {option.label}
              </Button>
            );
          })}
        </div>
      </Card>

      {/* Applications List */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Gagal memuat campaigns"
          description="Terjadi kesalahan saat memuat daftar campaign Anda."
          onRetry={() => refetch()}
        />
      ) : applications.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="Belum ada campaign"
          description={
            status === 'ALL'
              ? 'Mulai dengan mencari dan apply ke campaign yang sesuai dengan Anda.'
              : `Tidak ada campaign dengan status ${getStatusLabel(status as ApplicationStatus)}.`
          }
          action={
            status === 'ALL' ? (
              <Button asChild size="sm" className="w-full sm:w-auto">
                <Link href={routes.creator.discoverCampaigns}>Discover Campaigns</Link>
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
            Menampilkan {applications.length} dari {total} aplikasi
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {applications.map((application) => (
              <ApplicationCard key={application.id} application={application} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col gap-3 items-center sm:flex-row sm:justify-center sm:gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Sebelumnya</span>
              </Button>
              <span className="text-xs text-muted-foreground text-center sm:text-sm">
                Halaman {page} dari {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page >= totalPages}
                className="w-full sm:w-auto"
              >
                <span className="hidden sm:inline">Selanjutnya</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}



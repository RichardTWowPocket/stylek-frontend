'use client';

import { useState } from 'react';
import { useCampaignTasks } from '@/lib/hooks/brand/useCampaignTasks';
import { useBrandContentFiltersStore } from '@/store/brandContentFilters.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { Search, ClipboardList, ExternalLink, Eye, AlertCircle } from 'lucide-react';
import { BrandTaskReviewDrawer } from './BrandTaskReviewDrawer';
import type { TaskStatus, SocialPlatformType } from '@/lib/api/tasks';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BrandCampaignContentTabProps {
  campaignId: string;
}

const statusOptions: Array<{ value: TaskStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'DRAFT_SUBMITTED', label: 'Draft Submitted' },
  { value: 'DRAFT_APPROVED', label: 'Draft Approved' },
  { value: 'DRAFT_REVISION_REQUESTED', label: 'Draft Revision' },
  { value: 'LIVE_SUBMITTED', label: 'Live Submitted' },
  { value: 'LIVE_APPROVED', label: 'Live Approved' },
  { value: 'LIVE_REJECTED', label: 'Live Rejected' },
  { value: 'COMPLETED', label: 'Completed' },
];

const platformOptions: Array<{ value: SocialPlatformType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua Platform' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'BLOG', label: 'Blog' },
  { value: 'OTHER', label: 'Lainnya' },
];

function getStatusBadgeVariant(status: TaskStatus) {
  switch (status) {
    case 'DRAFT_APPROVED':
    case 'LIVE_APPROVED':
    case 'COMPLETED':
      return 'default';
    case 'DRAFT_REVISION_REQUESTED':
    case 'LIVE_REVISION_REQUESTED':
      return 'secondary';
    case 'LIVE_REJECTED':
      return 'destructive';
    case 'DRAFT_SUBMITTED':
    case 'LIVE_SUBMITTED':
      return 'default';
    case 'PENDING':
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: TaskStatus): string {
  switch (status) {
    case 'PENDING':
      return 'Pending';
    case 'DRAFT_SUBMITTED':
      return 'Draft Submitted';
    case 'DRAFT_APPROVED':
      return 'Draft Approved';
    case 'DRAFT_REVISION_REQUESTED':
      return 'Draft Revision Needed';
    case 'LIVE_SUBMITTED':
      return 'Live Submitted';
    case 'LIVE_APPROVED':
      return 'Live Approved';
    case 'LIVE_REJECTED':
      return 'Live Rejected';
    case 'LIVE_REVISION_REQUESTED':
      return 'Live Revision Needed';
    default:
      return status;
  }
}

export function BrandCampaignContentTab({ campaignId }: BrandCampaignContentTabProps) {
  const { status, platform, search, setStatus, setPlatform, setSearch } =
    useBrandContentFiltersStore();
  const { data, isLoading, error, refetch } = useCampaignTasks(campaignId);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const tasks = data?.data || [];
  const summary = data?.summary;

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
        title="Gagal memuat tasks"
        description="Terjadi kesalahan saat memuat daftar task."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden">
      {/* Summary */}
      {summary && (
        <Card className="p-3 sm:p-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground flex-shrink-0" />
              <span className="text-sm sm:text-base font-semibold">Total Tasks: {summary.total}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {summary.pending > 0 && (
                <Badge variant="secondary" className="text-xs">{summary.pending} Pending</Badge>
              )}
              {summary.draftSubmitted > 0 && (
                <Badge variant="default" className="text-xs">{summary.draftSubmitted} Draft Submitted</Badge>
              )}
              {summary.liveSubmitted > 0 && (
                <Badge variant="default" className="text-xs">{summary.liveSubmitted} Live Submitted</Badge>
              )}
              {summary.approved > 0 && (
                <Badge variant="default" className="text-xs">{summary.approved} Approved</Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Filter Bar */}
      <Card className="p-3 sm:p-4">
        <div className="flex flex-col gap-3 sm:gap-4 md:flex-row md:items-center">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama influencer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 sm:pl-9 text-sm sm:text-base"
              />
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <Select value={status} onValueChange={(value) => setStatus(value as any)}>
              <SelectTrigger className="w-full sm:w-[140px] md:w-[180px] text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs sm:text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platform} onValueChange={(value) => setPlatform(value as any)}>
              <SelectTrigger className="w-full sm:w-[140px] md:w-[160px] text-xs sm:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-xs sm:text-sm">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada task"
          description={
            search || status !== 'ALL' || platform !== 'ALL'
              ? 'Tidak ada task yang sesuai dengan filter Anda.'
              : 'Belum ada task untuk campaign ini.'
          }
        />
      ) : (
        <div className="space-y-2 sm:space-y-3">
          {tasks.map((task) => (
            <Card key={task.id} className="p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                    <AvatarImage src={task.creator.avatarUrl} alt={task.creator.displayName} />
                    <AvatarFallback className="text-xs">
                      {task.creator.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1.5">
                      <span className="text-sm sm:text-base font-medium break-words">{task.creator.displayName}</span>
                      <Badge variant="secondary" className="text-xs">{task.deliverableType}</Badge>
                      <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">{getStatusLabel(task.status)}</Badge>
                    </div>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
                      {task.draftAssetLink && (
                        <a
                          href={task.draftAssetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline flex-shrink-0"
                        >
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">Draft Link</span>
                        </a>
                      )}
                      {task.livePostLink && (
                        <a
                          href={task.livePostLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-primary hover:underline flex-shrink-0"
                        >
                          <ExternalLink className="h-3 w-3 flex-shrink-0" />
                          <span className="truncate max-w-[120px] sm:max-w-none">Live Link</span>
                        </a>
                      )}
                      <span className="flex-shrink-0">
                        Deadline:{' '}
                        {new Date(task.deadline).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    {/* Show revision note if exists */}
                    {task.lastReviewNote && (
                      <div className="mt-2 rounded-lg border border-orange-500/30 bg-orange-500/10 p-2">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-3.5 w-3.5 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-orange-600 mb-1">Review Note:</p>
                            <p className="text-xs text-orange-700 dark:text-orange-400 break-words line-clamp-2">{task.lastReviewNote}</p>
                            {task.reviewedBy && (
                              <p className="mt-1 text-xs text-orange-600/80">By: {task.reviewedBy}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedTaskId(task.id)}
                  className="w-full sm:w-auto text-xs sm:text-sm flex-shrink-0"
                >
                  <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  Review
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Task Review Drawer */}
      {selectedTaskId && (
        <BrandTaskReviewDrawer
          taskId={selectedTaskId}
          campaignId={campaignId}
          open={!!selectedTaskId}
          onOpenChange={(open) => !open && setSelectedTaskId(null)}
        />
      )}
    </div>
  );
}


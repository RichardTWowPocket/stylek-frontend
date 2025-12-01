'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreatorTasks } from '@/lib/hooks/creator/useCreatorTasks';
import { useCreatorTasksFiltersStore } from '@/store/creatorTasksFilters.store';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import {
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  XCircle,
  Hourglass,
  AlertCircle,
  FileText,
  Upload,
  Eye,
} from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import type { TaskStatus } from '@/lib/api/tasks';
import { formatDate } from '@/lib/utils/formatDate';

const statusOptions: Array<{ value: TaskStatus | 'ALL'; label: string; icon: any }> = [
  { value: 'ALL', label: 'Semua', icon: ClipboardList },
  { value: 'PENDING', label: 'Pending', icon: Hourglass },
  { value: 'DRAFT_SUBMITTED', label: 'Draft Submitted', icon: Upload },
  { value: 'DRAFT_APPROVED', label: 'Draft Approved', icon: CheckCircle2 },
  { value: 'DRAFT_REVISION_REQUESTED', label: 'Draft Revision Needed', icon: AlertCircle },
  { value: 'LIVE_SUBMITTED', label: 'Live Submitted', icon: Eye },
  { value: 'LIVE_REVISION_REQUESTED', label: 'Live Revision Needed', icon: AlertCircle },
  { value: 'LIVE_APPROVED', label: 'Approved', icon: CheckCircle2 },
  { value: 'LIVE_REJECTED', label: 'Rejected', icon: XCircle },
];

function getStatusBadgeVariant(status: TaskStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'DRAFT_APPROVED':
    case 'LIVE_APPROVED':
      return 'default';
    case 'LIVE_REJECTED':
      return 'destructive';
    case 'DRAFT_REVISION_REQUESTED':
    case 'LIVE_REVISION_REQUESTED':
      return 'destructive';
    case 'DRAFT_SUBMITTED':
    case 'LIVE_SUBMITTED':
      return 'secondary';
    case 'PENDING':
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: TaskStatus, hasReviewNote?: boolean): string {
  // Handle legacy tasks: LIVE_SUBMITTED with review note should show as revision needed
  if (status === 'LIVE_SUBMITTED' && hasReviewNote) {
    return 'Perlu Revisi Live';
  }
  
  switch (status) {
    case 'PENDING':
      return 'Menunggu';
    case 'DRAFT_SUBMITTED':
      return 'Draft Dikirim';
    case 'DRAFT_APPROVED':
      return 'Draft Disetujui';
    case 'DRAFT_REVISION_REQUESTED':
      return 'Perlu Revisi Draft';
    case 'LIVE_SUBMITTED':
      return 'Live Dikirim';
    case 'LIVE_APPROVED':
      return 'Live Disetujui';
    case 'LIVE_REJECTED':
      return 'Live Ditolak';
    case 'LIVE_REVISION_REQUESTED':
      return 'Perlu Revisi Live';
    default:
      return status;
  }
}

function getStatusColor(status: TaskStatus): string {
  switch (status) {
    case 'DRAFT_APPROVED':
    case 'LIVE_APPROVED':
      return 'text-green-600';
    case 'LIVE_REJECTED':
    case 'DRAFT_REVISION_REQUESTED':
    case 'LIVE_REVISION_REQUESTED':
      return 'text-red-600';
    case 'DRAFT_SUBMITTED':
    case 'LIVE_SUBMITTED':
      return 'text-blue-600';
    case 'PENDING':
    default:
      return 'text-muted-foreground';
  }
}

function TaskCard({ task }: { task: any }) {
  const router = useRouter();
  const isOverdue = task.deadline && new Date(task.deadline) < new Date() && task.status !== 'LIVE_APPROVED';
  const canSubmitDraft = task.status === 'PENDING' || task.status === 'DRAFT_REVISION_REQUESTED';
  const canSubmitLive = task.status === 'DRAFT_APPROVED' || task.status === 'LIVE_REVISION_REQUESTED';

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={() => router.push(routes.creator.taskDetail(task.id))}
    >
      <div className="p-4 sm:p-6">
        {/* Header */}
        <div className="mb-3 flex items-start justify-between gap-2 sm:mb-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex items-center gap-2">
              {task.campaign.brand?.logoUrl && (
                <img
                  src={task.campaign.brand.logoUrl}
                  alt={task.campaign.brand.name}
                  className="h-6 w-6 flex-shrink-0 rounded-full object-cover sm:h-8 sm:w-8"
                />
              )}
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold truncate sm:text-base">{task.campaign.title}</h3>
                <p className="text-xs text-muted-foreground truncate sm:text-sm">{task.campaign.brand?.name}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              <Badge 
                variant={getStatusBadgeVariant(
                  (task.status === 'LIVE_SUBMITTED' && task.lastReviewNote) 
                    ? 'LIVE_REVISION_REQUESTED' 
                    : task.status
                )} 
                className="text-xs"
              >
                {getStatusLabel(task.status, !!task.lastReviewNote)}
              </Badge>
              <Badge variant="outline" className="text-xs">{task.deliverableType}</Badge>
              {isOverdue && (
                <Badge variant="destructive" className="text-xs">Overdue</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Task Details */}
        <div className="mb-3 space-y-1.5 text-xs sm:mb-4 sm:space-y-2 sm:text-sm">
          {task.deadline && (
            <div className="flex items-center gap-2">
              <Clock className={`h-3 w-3 flex-shrink-0 ${isOverdue ? 'text-red-600' : 'text-muted-foreground'} sm:h-4 sm:w-4`} />
              <span className={isOverdue ? 'font-semibold text-red-600' : 'text-muted-foreground'}>
                Deadline:
              </span>
              <span className={isOverdue ? 'font-semibold text-red-600' : 'font-medium'}>
                {formatDate(task.deadline)}
              </span>
            </div>
          )}
          {task.requiredHashtags && task.requiredHashtags.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground flex-shrink-0">Hashtags:</span>
              <div className="flex flex-wrap gap-1">
                {task.requiredHashtags.map((tag: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          {task.requiredMentions && task.requiredMentions.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-muted-foreground flex-shrink-0">Mentions:</span>
              <div className="flex flex-wrap gap-1">
                {task.requiredMentions.map((mention: string, idx: number) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {mention}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Submission Status */}
        {task.draftAssetLink && (
          <div className="mb-3 rounded-lg bg-muted/50 p-2 sm:mb-4 sm:p-3">
            <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
              <FileText className="h-3.5 w-3.5 text-muted-foreground sm:h-4 sm:w-4" />
              <span className="text-xs font-medium sm:text-sm">Draft Submitted</span>
            </div>
            {task.draftCaption && (
              <p className="text-xs text-muted-foreground line-clamp-2">{task.draftCaption}</p>
            )}
          </div>
        )}

        {task.livePostLink && (
          <div className={`mb-3 rounded-lg p-2 sm:mb-4 sm:p-3 ${task.status === 'LIVE_REVISION_REQUESTED' ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-green-500/10'}`}>
            <div className="mb-1.5 flex items-center gap-2 sm:mb-2">
              <CheckCircle2 className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${task.status === 'LIVE_REVISION_REQUESTED' ? 'text-orange-600' : 'text-green-600'}`} />
              <span className={`text-xs font-medium sm:text-sm ${task.status === 'LIVE_REVISION_REQUESTED' ? 'text-orange-600' : 'text-green-600'}`}>
                {task.status === 'LIVE_REVISION_REQUESTED' ? 'Live Content Submitted (Revision Required)' : 'Live Content Submitted'}
              </span>
            </div>
            <a
              href={task.livePostLink}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-primary hover:underline"
            >
              View Post
            </a>
          </div>
        )}

        {/* Review Note */}
        {task.lastReviewNote && (
          <div className="mb-3 rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-2 sm:mb-4 sm:p-3">
            <p className="mb-1 text-xs font-medium text-yellow-700 dark:text-yellow-400">
              Review Note:
            </p>
            <p className="text-xs text-yellow-700 dark:text-yellow-400">{task.lastReviewNote}</p>
            {task.reviewedBy && (
              <p className="mt-1 text-xs text-muted-foreground">
                Reviewed by: {task.reviewedBy}
              </p>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <span className="text-xs text-muted-foreground">
            Created: {formatDate(task.createdAt)}
          </span>
          <div className="flex flex-col gap-2 sm:flex-row">
            {(canSubmitDraft || canSubmitLive) && (
              <Button
                variant="outline"
                size="sm"
                asChild
                onClick={(e) => e.stopPropagation()}
                className="w-full sm:w-auto"
              >
                <Link href={routes.creator.taskDetail(task.id)}>
                  {canSubmitDraft ? 'Submit Draft' : 'Submit Live'}
                </Link>
              </Button>
            )}
            <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
              <Link href={routes.creator.taskDetail(task.id)}>
                View Details
                <ExternalLink className="ml-2 h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Warning for overdue */}
        {isOverdue && (
          <div className="mt-2 rounded-lg border border-red-500/20 bg-red-500/10 p-2 sm:mt-3">
            <p className="text-xs text-red-700 dark:text-red-400">
              ⚠️ Task sudah melewati deadline!
            </p>
          </div>
        )}
      </div>
    </Card>
  );
}

export default function CreatorTasksPage() {
  const router = useRouter();
  const { status, page, pageSize, setStatus, setPage } = useCreatorTasksFiltersStore();

  const { data, isLoading, error, refetch } = useCreatorTasks({
    status: status === 'ALL' ? undefined : status,
    page,
    pageSize,
  });

  const tasks = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  // Calculate stats
  const stats = {
    pending: tasks.filter((t) => t.status === 'PENDING').length,
    submitted: tasks.filter((t) => ['DRAFT_SUBMITTED', 'LIVE_SUBMITTED'].includes(t.status)).length,
    approved: tasks.filter((t) => ['DRAFT_APPROVED', 'LIVE_APPROVED'].includes(t.status)).length,
    needsAction: tasks.filter((t) => 
      ['DRAFT_REVISION_REQUESTED', 'LIVE_REVISION_REQUESTED'].includes(t.status) ||
      // Also include tasks with LIVE_SUBMITTED status that have a review note (legacy revision requests)
      (t.status === 'LIVE_SUBMITTED' && t.lastReviewNote)
    ).length,
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">My Tasks</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Kelola semua tasks campaign Anda</p>
      </div>

      {/* Stats Cards */}
      {status === 'ALL' && tasks.length > 0 && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4 sm:gap-4">
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Hourglass className="h-4 w-4 text-muted-foreground flex-shrink-0 sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">Pending</p>
                <p className="text-xl font-bold sm:text-2xl">{stats.pending}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-600 flex-shrink-0 sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">Submitted</p>
                <p className="text-xl font-bold sm:text-2xl">{stats.submitted}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0 sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">Approved</p>
                <p className="text-xl font-bold sm:text-2xl">{stats.approved}</p>
              </div>
            </div>
          </Card>
          <Card className="p-3 sm:p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0 sm:h-5 sm:w-5" />
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground sm:text-sm">Needs Action</p>
                <p className="text-xl font-bold sm:text-2xl">{stats.needsAction}</p>
              </div>
            </div>
          </Card>
        </div>
      )}

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

      {/* Tasks List */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : error ? (
        <ErrorState
          title="Gagal memuat tasks"
          description="Terjadi kesalahan saat memuat daftar tasks Anda."
          onRetry={() => refetch()}
        />
      ) : tasks.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="Belum ada tasks"
          description={
            status === 'ALL'
              ? 'Tasks akan muncul setelah Anda diterima di sebuah campaign.'
              : `Tidak ada tasks dengan status ${getStatusLabel(status as TaskStatus)}.`
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
            Menampilkan {tasks.length} dari {total} tasks
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
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


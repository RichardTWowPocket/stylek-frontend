'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useTaskDetail } from '@/lib/hooks/creator/useTaskDetail';
import { SubmitDraftDialog } from '@/components/creator/SubmitDraftDialog';
import { SubmitLiveDialog } from '@/components/creator/SubmitLiveDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Hash,
  AtSign,
  Tag,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Hourglass,
  AlertCircle,
  Upload,
  Eye,
  Download,
  Building2,
} from 'lucide-react';
import { routes } from '@/lib/config/routes';
import { formatDate, formatDateTimeShort } from '@/lib/utils/formatDate';
import type { TaskStatus } from '@/lib/api/tasks';
import type { DeliverableType } from '@/lib/api/campaigns';

function getStatusBadgeVariant(status: TaskStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'DRAFT_APPROVED':
    case 'LIVE_APPROVED':
      return 'default';
    case 'LIVE_REJECTED':
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

function getStatusLabel(status: TaskStatus): string {
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

function getDeliverableTypeLabel(type: DeliverableType): string {
  switch (type) {
    case 'INSTAGRAM_POST':
      return 'Instagram Post';
    case 'INSTAGRAM_REELS':
      return 'Instagram Reels';
    case 'INSTAGRAM_STORY':
      return 'Instagram Story';
    case 'TIKTOK_VIDEO':
      return 'TikTok Video';
    case 'YOUTUBE_SHORT':
      return 'YouTube Short';
    case 'YOUTUBE_VIDEO':
      return 'YouTube Video';
    case 'MARKETPLACE_REVIEW':
      return 'Marketplace Review';
    case 'BLOG_ARTICLE':
      return 'Blog Article';
    default:
      return type;
  }
}

export default function TaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const taskId = params.id as string;
  const [showDraftDialog, setShowDraftDialog] = useState(false);
  const [showLiveDialog, setShowLiveDialog] = useState(false);

  const { data: task, isLoading, error } = useTaskDetail(taskId);

  // Check if task is overdue
  const isOverdue = useMemo(() => {
    if (!task?.deadline) return false;
    return new Date(task.deadline) < new Date() && task.status !== 'LIVE_APPROVED';
  }, [task]);

  // Check if campaign requires pre-approval
  const requiresPreApproval = useMemo(() => {
    return task?.campaign?.requirePreApproval ?? false;
  }, [task]);

  // Check what actions are available
  const canSubmitDraft = useMemo(() => {
    if (!task || !requiresPreApproval) {
      console.log('[Task Debug] canSubmitDraft:', false, {
        hasTask: !!task,
        requiresPreApproval,
        taskStatus: task?.status,
      });
      return false;
    }
    const canSubmit = task.status === 'PENDING' || task.status === 'DRAFT_REVISION_REQUESTED';
    console.log('[Task Debug] canSubmitDraft:', canSubmit, {
      taskStatus: task.status,
      requiresPreApproval,
      isPending: task.status === 'PENDING',
      isDraftRevisionRequested: task.status === 'DRAFT_REVISION_REQUESTED',
    });
    return canSubmit;
  }, [task, requiresPreApproval]);

  const canSubmitLive = useMemo(() => {
    if (!task) {
      console.log('[Task Debug] canSubmitLive:', false, { hasTask: false });
      return false;
    }
    
    let canSubmit = false;
    // If pre-approval required, can only submit live after draft approved
    // OR can resubmit if revision was requested (LIVE_REVISION_REQUESTED)
    if (requiresPreApproval) {
      canSubmit = task.status === 'DRAFT_APPROVED' || task.status === 'LIVE_REVISION_REQUESTED';
      console.log('[Task Debug] canSubmitLive:', canSubmit, {
        taskStatus: task.status,
        requiresPreApproval: true,
        isDraftApproved: task.status === 'DRAFT_APPROVED',
        isLiveRevisionRequested: task.status === 'LIVE_REVISION_REQUESTED',
      });
    } else {
      // If no pre-approval, can submit live directly from PENDING
      // OR can resubmit if revision was requested (LIVE_REVISION_REQUESTED)
      canSubmit = task.status === 'PENDING' || task.status === 'LIVE_REVISION_REQUESTED';
      console.log('[Task Debug] canSubmitLive:', canSubmit, {
        taskStatus: task.status,
        requiresPreApproval: false,
        isPending: task.status === 'PENDING',
        isLiveRevisionRequested: task.status === 'LIVE_REVISION_REQUESTED',
      });
    }
    return canSubmit;
  }, [task, requiresPreApproval]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mx-auto max-w-6xl">
        <ErrorState
          title="Task tidak ditemukan"
          description="Task yang Anda cari tidak ditemukan atau telah dihapus."
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  // Task is now properly typed as CreatorTask
  // Debug logging
  console.log('[Task Debug] Task Status:', task.status);
  console.log('[Task Debug] Requires Pre-Approval:', requiresPreApproval);
  console.log('[Task Debug] Can Submit Draft:', canSubmitDraft);
  console.log('[Task Debug] Can Submit Live:', canSubmitLive);
  console.log('[Task Debug] Has Draft Link:', !!task.draftAssetLink);
  console.log('[Task Debug] Has Live Link:', !!task.livePostLink);
  console.log('[Task Debug] Show Live Section:', task.livePostLink || canSubmitLive || task.status === 'LIVE_REVISION_REQUESTED');
  console.log('[Task Debug] Campaign requirePreApproval:', task.campaign?.requirePreApproval);
  console.log('[Task Debug] Has Review Note:', !!task.lastReviewNote);
  console.log('[Task Debug] Review Note:', task.lastReviewNote);
  console.log('[Task Debug] Is Draft Revision Requested:', task.status === 'DRAFT_REVISION_REQUESTED');
  console.log('[Task Debug] Is Live Revision Requested:', task.status === 'LIVE_REVISION_REQUESTED');
  console.log('[Task Debug] Full Task Object:', task);

  return (
    <div className="container mx-auto max-w-6xl">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-4 sm:mb-6"
        size="sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        <span className="text-sm sm:text-base">Kembali</span>
      </Button>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Hero Section */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  {task.campaign?.brand?.logoUrl && (
                    <img
                      src={task.campaign.brand.logoUrl}
                      alt={task.campaign.brand.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 md:h-16 md:w-16 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="mb-1.5 sm:mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                      <h1 className="text-lg font-bold sm:text-xl md:text-2xl break-words">
                        {task.campaign?.title || 'Task Detail'}
                      </h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                      <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="break-words">{task.campaign?.brand?.name || 'Unknown Brand'}</span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">
                    {getStatusLabel(task.status)}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getDeliverableTypeLabel(task.deliverableType)}
                  </Badge>
                  {isOverdue && (
                    <Badge variant="destructive" className="text-xs">
                      Overdue
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Task Guidelines */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Task Guidelines</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Panduan dan requirement untuk task ini
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
              {task.captionGuideline && (
                <div>
                  <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                    <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    Caption Guidelines
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground break-words whitespace-pre-wrap">
                    {task.captionGuideline}
                  </p>
                </div>
              )}

              {task.requiredHashtags && task.requiredHashtags.length > 0 && (
                <div>
                  <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                    <Hash className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    Required Hashtags
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {task.requiredHashtags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {task.requiredMentions && task.requiredMentions.length > 0 && (
                <div>
                  <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                    <AtSign className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    Required Mentions
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {task.requiredMentions.map((mention, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        @{mention}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {task.promoCodeOrLink && (
                <div>
                  <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                    <Tag className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    Promo Code/Link
                  </div>
                  <p className="text-xs sm:text-sm font-mono break-all">{task.promoCodeOrLink}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Draft Submission - Only show if pre-approval is required */}
          {/* Show if: has draft link, can submit draft, OR revision was requested */}
          {requiresPreApproval && (task.draftAssetLink || canSubmitDraft || task.status === 'DRAFT_REVISION_REQUESTED') && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Draft Submission</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
                {/* Show revision note if revision was requested */}
                {task.lastReviewNote && task.status === 'DRAFT_REVISION_REQUESTED' && (
                  <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-3 sm:p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-orange-600">Revision Requested</span>
                    </div>
                    <p className="text-xs sm:text-sm break-words whitespace-pre-wrap">{task.lastReviewNote}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Silakan perbaiki draft sesuai catatan di atas dan resubmit.
                    </p>
                  </div>
                )}
                {task.draftAssetLink ? (
                  <div className="space-y-2 sm:space-y-3">
                    <div className={`rounded-lg p-3 sm:p-4 ${task.status === 'DRAFT_REVISION_REQUESTED' ? 'bg-muted/50' : 'bg-muted/50'}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-xs sm:text-sm font-medium">
                          {task.status === 'DRAFT_REVISION_REQUESTED' ? 'Draft Submitted (Revision Required)' : 'Draft Submitted'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Draft Link:</p>
                          <a
                            href={task.draftAssetLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-primary hover:underline break-all"
                          >
                            {task.draftAssetLink}
                            <ExternalLink className="ml-1.5 inline h-3 w-3" />
                          </a>
                        </div>
                        {task.draftCaption && (
                          <div>
                            <p className="mb-1 text-xs text-muted-foreground">Draft Caption:</p>
                            <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{task.draftCaption}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    {(canSubmitDraft || task.status === 'DRAFT_REVISION_REQUESTED') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowDraftDialog(true)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Upload className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {task.status === 'DRAFT_REVISION_REQUESTED' ? 'Resubmit Draft' : 'Update Draft'}
                      </Button>
                    )}
                  </div>
                ) : (canSubmitDraft || task.status === 'DRAFT_REVISION_REQUESTED') ? (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Belum ada draft yang dikirim. Klik tombol di bawah untuk submit draft.
                    </p>
                    <Button
                      onClick={() => setShowDraftDialog(true)}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Upload className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Submit Draft
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Live Submission */}
          {/* Show if: has live link, can submit live, OR revision was requested, OR draft is approved (for pre-approval campaigns) */}
          {(task.livePostLink || canSubmitLive || task.status === 'LIVE_REVISION_REQUESTED' || (requiresPreApproval && task.status === 'DRAFT_APPROVED')) && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Live Content Submission</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
                {/* Show revision note if revision was requested */}
                {task.lastReviewNote && task.status === 'LIVE_REVISION_REQUESTED' && (
                  <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-3 sm:p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0" />
                      <span className="text-xs sm:text-sm font-medium text-orange-600">Revision Requested</span>
                    </div>
                    <p className="text-xs sm:text-sm break-words whitespace-pre-wrap">{task.lastReviewNote}</p>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Silakan perbaiki konten sesuai catatan di atas dan resubmit.
                    </p>
                  </div>
                )}
                {task.livePostLink ? (
                  <div className="space-y-2 sm:space-y-3">
                    <div className={`rounded-lg p-3 sm:p-4 ${task.status === 'LIVE_REVISION_REQUESTED' ? 'bg-muted/50' : 'bg-green-500/10'}`}>
                      <div className="mb-2 flex items-center gap-2">
                        <CheckCircle2 className={`h-4 w-4 ${task.status === 'LIVE_REVISION_REQUESTED' ? 'text-muted-foreground' : 'text-green-600'}`} />
                        <span className={`text-xs sm:text-sm font-medium ${task.status === 'LIVE_REVISION_REQUESTED' ? 'text-muted-foreground' : 'text-green-600'}`}>
                          {task.status === 'LIVE_REVISION_REQUESTED' ? 'Live Content Submitted (Revision Required)' : 'Live Content Submitted'}
                        </span>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <p className="mb-1 text-xs text-muted-foreground">Live Post Link:</p>
                          <a
                            href={task.livePostLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs sm:text-sm text-primary hover:underline break-all"
                          >
                            {task.livePostLink}
                            <ExternalLink className="ml-1.5 inline h-3 w-3" />
                          </a>
                        </div>
                        {task.liveScreenshotLink && (
                          <div>
                            <p className="mb-1 text-xs text-muted-foreground">Screenshot Link:</p>
                            <a
                              href={task.liveScreenshotLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs sm:text-sm text-primary hover:underline break-all"
                            >
                              {task.liveScreenshotLink}
                              <ExternalLink className="ml-1.5 inline h-3 w-3" />
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    {(canSubmitLive || task.status === 'LIVE_REVISION_REQUESTED') && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowLiveDialog(true)}
                        className="w-full sm:w-auto text-xs sm:text-sm"
                      >
                        <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        {task.status === 'LIVE_REVISION_REQUESTED' ? 'Resubmit Live Content' : 'Update Live Content'}
                      </Button>
                    )}
                  </div>
                ) : (canSubmitLive || task.status === 'LIVE_REVISION_REQUESTED') ? (
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      {task.status === 'LIVE_REVISION_REQUESTED'
                        ? 'Silakan perbaiki konten sesuai catatan revisi dan resubmit.'
                        : requiresPreApproval && task.status === 'DRAFT_APPROVED'
                        ? 'Draft telah disetujui. Silakan submit live content.'
                        : 'Klik tombol di bawah untuk submit live content.'}
                    </p>
                    <Button
                      onClick={() => setShowLiveDialog(true)}
                      className="w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      {task.status === 'LIVE_REVISION_REQUESTED' ? 'Resubmit Live Content' : 'Submit Live Content'}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          )}

          {/* Review Notes */}
          {task.lastReviewNote && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Review Notes</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/10 p-3 sm:p-4">
                  <p className="mb-2 text-xs sm:text-sm font-medium text-yellow-700 dark:text-yellow-400">
                    Review Note:
                  </p>
                  <p className="mb-2 text-xs sm:text-sm text-yellow-700 dark:text-yellow-400 whitespace-pre-wrap break-words">
                    {task.lastReviewNote}
                  </p>
                  {task.reviewedBy && (
                    <p className="text-xs text-muted-foreground">
                      Reviewed by: {task.reviewedBy}
                    </p>
                  )}
                  {task.reviewedAt && (
                    <p className="text-xs text-muted-foreground">
                      Reviewed at: {formatDateTimeShort(task.reviewedAt)}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Task Info */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Task Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
              <div>
                <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  Deadline
                </div>
                <p className={`text-xs sm:text-sm ${isOverdue ? 'font-semibold text-red-600' : 'text-muted-foreground'}`}>
                  {task.deadline ? formatDate(task.deadline) : 'No deadline'}
                </p>
                {isOverdue && (
                  <p className="mt-1 text-xs text-red-600">⚠️ Task sudah melewati deadline!</p>
                )}
              </div>
              <div>
                <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  Created At
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {formatDateTimeShort(task.createdAt)}
                </p>
              </div>
              <div>
                <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                  <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  Last Updated
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {formatDateTimeShort(task.updatedAt)}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-2 sm:space-y-3">
              {(requiresPreApproval && (canSubmitDraft || task.status === 'DRAFT_REVISION_REQUESTED')) && (
                <Button
                  onClick={() => setShowDraftDialog(true)}
                  className="w-full text-xs sm:text-sm"
                >
                  <Upload className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {task.status === 'DRAFT_REVISION_REQUESTED' ? 'Resubmit Draft' : 'Submit Draft'}
                </Button>
              )}
              {(canSubmitLive || task.status === 'LIVE_REVISION_REQUESTED') && (
                <Button
                  onClick={() => setShowLiveDialog(true)}
                  className="w-full text-xs sm:text-sm"
                >
                  <Eye className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  {task.status === 'LIVE_REVISION_REQUESTED' ? 'Resubmit Live Content' : 'Submit Live Content'}
                </Button>
              )}
              {task.campaign?.id && (
                <Button
                  variant="outline"
                  onClick={() => router.push(routes.creator.campaignDetail(task.campaign.id))}
                  className="w-full text-xs sm:text-sm"
                >
                  View Campaign
                  <ExternalLink className="ml-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Dialogs */}
      <SubmitDraftDialog
        taskId={taskId}
        open={showDraftDialog}
        onOpenChange={setShowDraftDialog}
      />
      <SubmitLiveDialog
        taskId={taskId}
        open={showLiveDialog}
        onOpenChange={setShowLiveDialog}
      />
    </div>
  );
}


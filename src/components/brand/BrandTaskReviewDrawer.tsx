'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { useTaskDetail } from '@/lib/hooks/brand/useCampaignTasks';
import { useReviewDraft, useReviewLive } from '@/lib/hooks/brand/useTaskReviewMutations';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { ExternalLink, CheckCircle2, XCircle, MessageSquare, AlertCircle } from 'lucide-react';
import { toast } from '@/lib/ui/toast';

interface BrandTaskReviewDrawerProps {
  taskId: string;
  campaignId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getStatusBadgeVariant(status: string) {
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

function getStatusLabel(status: string): string {
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

export function BrandTaskReviewDrawer({
  taskId,
  campaignId,
  open,
  onOpenChange,
}: BrandTaskReviewDrawerProps) {
  const { data: task, isLoading, error } = useTaskDetail(taskId);
  const reviewDraft = useReviewDraft(taskId, campaignId);
  const reviewLive = useReviewLive(taskId, campaignId, task?.creator.id);
  const [revisionNote, setRevisionNote] = useState('');
  const [showRevisionInput, setShowRevisionInput] = useState(false);
  const [revisionMode, setRevisionMode] = useState<'revision' | 'reject' | null>(null);

  const handleApproveDraft = async () => {
    try {
      await reviewDraft.approve.mutateAsync();
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleRequestDraftRevision = async () => {
    if (!revisionNote.trim()) {
      toast.error('Catatan revisi harus diisi');
      return;
    }
    try {
      await reviewDraft.requestRevision.mutateAsync(revisionNote);
      setRevisionNote('');
      setShowRevisionInput(false);
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleApproveLive = async () => {
    try {
      await reviewLive.approve.mutateAsync();
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleRequestLiveRevision = async () => {
    if (!revisionNote.trim()) {
      toast.error('Catatan revisi harus diisi');
      return;
    }
    try {
      await reviewLive.requestRevision.mutateAsync(revisionNote);
      setRevisionNote('');
      setShowRevisionInput(false);
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  const handleRejectLive = async () => {
    if (!revisionNote.trim()) {
      toast.error('Alasan penolakan harus diisi');
      return;
    }
    try {
      await reviewLive.reject.mutateAsync(revisionNote);
      setRevisionNote('');
      setShowRevisionInput(false);
      onOpenChange(false);
    } catch (err) {
      // Error handled in mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-full p-4 sm:p-6">
        <DialogHeader className="pb-3 sm:pb-4">
          <DialogTitle className="text-lg sm:text-xl">Review Task</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">Review draft dan live content dari creator</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <SkeletonCard />
        ) : error ? (
          <ErrorState
            title="Gagal memuat task"
            description="Terjadi kesalahan saat memuat data task."
          />
        ) : task ? (
          <div className="space-y-4 sm:space-y-6">
            {/* Header */}
            <div className="flex items-start gap-3 sm:gap-4">
              <Avatar className="h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0">
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
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                  <h3 className="text-base sm:text-lg font-semibold break-words">{task.creator.displayName}</h3>
                  <Badge variant="secondary" className="text-xs">{task.deliverableType}</Badge>
                  <Badge variant={getStatusBadgeVariant(task.status)} className="text-xs">{getStatusLabel(task.status)}</Badge>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Deadline:{' '}
                  {new Date(task.deadline).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            </div>

            {/* Guideline Section */}
            <Card className="p-3 sm:p-4">
              <h4 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold">Guideline</h4>
              {task.captionGuideline && (
                <div className="mb-3">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">Caption Guideline</p>
                  <p className="text-xs sm:text-sm break-words whitespace-pre-wrap">{task.captionGuideline}</p>
                </div>
              )}
              {task.requiredHashtags && task.requiredHashtags.length > 0 && (
                <div className="mb-3">
                  <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm text-muted-foreground">Required Hashtags</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {task.requiredHashtags.map((tag, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              {task.requiredMentions && task.requiredMentions.length > 0 && (
                <div>
                  <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm text-muted-foreground">Required Mentions</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {task.requiredMentions.map((mention, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {mention}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </Card>

            {/* Draft Section */}
            {(task.draftAssetLink || task.draftCaption || task.status.includes('DRAFT')) && (
              <Card className="p-3 sm:p-4">
                <h4 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold">Draft</h4>
                {task.draftAssetLink && (
                  <div className="mb-3">
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <a
                        href={task.draftAssetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Buka Draft (GDrive)
                      </a>
                    </Button>
                  </div>
                )}
                {task.draftCaption && (
                  <div className="mb-3">
                    <p className="mb-1 text-xs sm:text-sm text-muted-foreground">Draft Caption</p>
                    <p className="text-xs sm:text-sm whitespace-pre-wrap break-words">{task.draftCaption}</p>
                  </div>
                )}
                {task.lastReviewNote && (
                  <div className="rounded-lg border border-border bg-muted/50 p-2.5 sm:p-3">
                    <div className="mb-1 flex items-center gap-2">
                      <AlertCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs sm:text-sm font-medium">Last Review Note</p>
                    </div>
                    <p className="text-xs sm:text-sm break-words whitespace-pre-wrap">{task.lastReviewNote}</p>
                    {task.reviewedAt && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Reviewed at:{' '}
                        {new Date(task.reviewedAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    )}
                  </div>
                )}
              </Card>
            )}

            {/* Live Content Section */}
            {(task.livePostLink || task.status.includes('LIVE')) && (
              <Card className="p-3 sm:p-4">
                <h4 className="mb-2 sm:mb-3 text-sm sm:text-base font-semibold">Live Content</h4>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                  {task.livePostLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <a
                        href={task.livePostLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Buka Post
                      </a>
                    </Button>
                  )}
                  {task.liveScreenshotLink && (
                    <Button
                      variant="outline"
                      size="sm"
                      asChild
                      className="gap-2 w-full sm:w-auto text-xs sm:text-sm"
                    >
                      <a
                        href={task.liveScreenshotLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        Screenshot
                      </a>
                    </Button>
                  )}
                </div>
              </Card>
            )}

            {/* Revision Input */}
            {showRevisionInput && (
              <Card className="p-3 sm:p-4">
                <Label htmlFor="revisionNote" className="text-sm">
                  {revisionMode === 'reject' ? 'Alasan Penolakan' : 'Catatan Revisi'}
                </Label>
                <Textarea
                  id="revisionNote"
                  value={revisionNote}
                  onChange={(e) => setRevisionNote(e.target.value)}
                  placeholder={
                    revisionMode === 'reject'
                      ? 'Masukkan alasan penolakan...'
                      : 'Masukkan catatan revisi...'
                  }
                  rows={4}
                  className="mt-2 text-sm"
                />
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-2">
              {task.status === 'DRAFT_SUBMITTED' && (
                <>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleApproveDraft}
                      disabled={reviewDraft.approve.isPending}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Approve Draft
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRevisionMode('revision');
                        setShowRevisionInput(true);
                      }}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <MessageSquare className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Request Revision
                    </Button>
                  </div>
                  {showRevisionInput && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button
                        onClick={handleRequestDraftRevision}
                        disabled={reviewDraft.requestRevision.isPending || !revisionNote.trim()}
                        variant="secondary"
                        className="flex-1 text-xs sm:text-sm"
                      >
                        Kirim Catatan Revisi
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRevisionInput(false);
                          setRevisionNote('');
                          setRevisionMode(null);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </>
              )}
              {task.status === 'LIVE_SUBMITTED' && (
                <>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Button
                      onClick={handleApproveLive}
                      disabled={reviewLive.approve.isPending}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <CheckCircle2 className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Approve Content
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setRevisionMode('revision');
                        setShowRevisionInput(true);
                      }}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <MessageSquare className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Request Revision
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        setRevisionMode('reject');
                        setShowRevisionInput(true);
                      }}
                      className="flex-1 text-xs sm:text-sm"
                    >
                      <XCircle className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Reject
                    </Button>
                  </div>
                  {showRevisionInput && task.status === 'LIVE_SUBMITTED' && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      {revisionMode === 'revision' && (
                        <Button
                          onClick={handleRequestLiveRevision}
                          disabled={reviewLive.requestRevision.isPending || !revisionNote.trim()}
                          variant="secondary"
                          className="flex-1 text-xs sm:text-sm"
                        >
                          Kirim Catatan Revisi
                        </Button>
                      )}
                      {revisionMode === 'reject' && (
                        <Button
                          onClick={handleRejectLive}
                          disabled={reviewLive.reject.isPending || !revisionNote.trim()}
                          variant="destructive"
                          className="flex-1 text-xs sm:text-sm"
                        >
                          Reject dengan Catatan
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowRevisionInput(false);
                          setRevisionNote('');
                          setRevisionMode(null);
                        }}
                        className="text-xs sm:text-sm"
                      >
                        Batal
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}


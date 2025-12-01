'use client';

import { useState } from 'react';
import { useCampaignApplications } from '@/lib/hooks/brand/useCampaignApplications';
import { useAcceptApplication, useRejectApplication, useWaitlistApplication } from '@/lib/hooks/brand/useApplicationMutations';
import { useBrandApplicantsFiltersStore } from '@/store/brandApplicantsFilters.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { Search, Users, CheckCircle2, XCircle, Clock, Eye } from 'lucide-react';
import { CreatorProfileModal } from './CreatorProfileModal';
import type { ApplicationStatus, SocialPlatformType } from '@/lib/api/campaigns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface BrandCampaignApplicantsTabProps {
  campaignId: string;
}

const statusOptions: Array<{ value: ApplicationStatus | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'APPLIED', label: 'Applied' },
  { value: 'ACCEPTED', label: 'Accepted' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'WAITLISTED', label: 'Waitlisted' },
];

const platformOptions: Array<{ value: SocialPlatformType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua Platform' },
  { value: 'INSTAGRAM', label: 'Instagram' },
  { value: 'TIKTOK', label: 'TikTok' },
  { value: 'YOUTUBE', label: 'YouTube' },
  { value: 'BLOG', label: 'Blog' },
  { value: 'OTHER', label: 'Lainnya' },
];

function getStatusBadgeVariant(status: ApplicationStatus) {
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

export function BrandCampaignApplicantsTab({ campaignId }: BrandCampaignApplicantsTabProps) {
  const { status, platform, search, setStatus, setPlatform, setSearch } =
    useBrandApplicantsFiltersStore();
  const { data, isLoading, error, refetch } = useCampaignApplications(campaignId);
  const acceptApplication = useAcceptApplication(campaignId);
  const rejectApplication = useRejectApplication(campaignId);
  const waitlistApplication = useWaitlistApplication(campaignId);
  const [selectedCreatorId, setSelectedCreatorId] = useState<string | null>(null);

  const applications = data?.data || [];
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
        title="Gagal memuat applicants"
        description="Terjadi kesalahan saat memuat daftar pendaftar."
        onRetry={() => refetch()}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary */}
      {summary && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold">Total Applicants: {summary.total}</span>
            </div>
            <div className="flex gap-2">
              {summary.applied > 0 && (
                <Badge variant="secondary" className="gap-1">
                  <Clock className="h-3 w-3" />
                  {summary.applied} Applied
                </Badge>
              )}
              {summary.accepted > 0 && (
                <Badge variant="default" className="gap-1">
                  <CheckCircle2 className="h-3 w-3" />
                  {summary.accepted} Accepted
                </Badge>
              )}
              {summary.rejected > 0 && (
                <Badge variant="destructive" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  {summary.rejected} Rejected
                </Badge>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Filter Bar */}
      <Card className="p-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau note..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Select value={status} onValueChange={(value) => setStatus(value as any)}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={platform} onValueChange={(value) => setPlatform(value as any)}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {platformOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Applications List */}
      {applications.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Belum ada pendaftar"
          description={
            search || status !== 'ALL' || platform !== 'ALL'
              ? 'Tidak ada pendaftar yang sesuai dengan filter Anda.'
              : 'Belum ada creator yang mendaftar ke campaign ini.'
          }
        />
      ) : (
        <div className="space-y-2">
          {applications.map((application) => (
            <Card key={application.id} className="p-4">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={application.creator.avatarUrl} alt={application.creator.displayName} />
                  <AvatarFallback>
                    {application.creator.displayName
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">{application.creator.displayName}</h4>
                    <Badge variant={getStatusBadgeVariant(application.status)}>
                      {application.status}
                    </Badge>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span>
                      Platform: <span className="font-medium">{application.selectedPlatform}</span>
                      {application.selectedPlatformHandle && (
                        <span> (@{application.selectedPlatformHandle})</span>
                      )}
                    </span>
                    {application.creator.city && application.creator.province && (
                      <span>
                        Lokasi: {application.creator.city}, {application.creator.province}
                      </span>
                    )}
                    {application.creator.mainNiche && (
                      <span>Niche: {application.creator.mainNiche}</span>
                    )}
                  </div>
                  {application.applyNote && (
                    <p className="mt-2 text-sm line-clamp-2">{application.applyNote}</p>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCreatorId(application.creator.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Button>
                  {application.status === 'APPLIED' && (
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => acceptApplication.mutate(application.id)}
                        disabled={acceptApplication.isPending}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => rejectApplication.mutate(application.id)}
                        disabled={rejectApplication.isPending}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Creator Profile Modal */}
      {selectedCreatorId && (
        <CreatorProfileModal
          creatorId={selectedCreatorId}
          open={!!selectedCreatorId}
          onOpenChange={(open) => !open && setSelectedCreatorId(null)}
        />
      )}
    </div>
  );
}


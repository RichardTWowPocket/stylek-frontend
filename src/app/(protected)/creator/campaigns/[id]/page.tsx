'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState, useMemo } from 'react';
import { useCampaignDetail } from '@/lib/hooks/creator/useCampaignDetail';
import { useCreatorApplications } from '@/lib/hooks/creator/useCreatorApplications';
import { useCreatorProfile } from '@/lib/hooks/creator/useCreator';
import { ApplyCampaignDialog } from '@/components/creator/ApplyCampaignDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { ErrorState } from '@/components/common/ErrorState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Gift,
  DollarSign,
  Users,
  FileText,
  Download,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Hourglass,
  AlertCircle,
  Share2,
  Tag,
  Target,
  Clock,
  Shield,
  Building2,
} from 'lucide-react';
import { routes } from '@/lib/config/routes';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDate, formatDateTimeShort } from '@/lib/utils/formatDate';
import type {
  CampaignStatus,
  CampaignType,
  RewardType,
  PromoType,
  CampaignGoal,
  DeliverableType,
  ApplicationStatus,
} from '@/lib/api/campaigns';
import type { SocialPlatformType } from '@/lib/api/creators';

function getStatusBadgeVariant(status: CampaignStatus): 'default' | 'secondary' | 'destructive' {
  switch (status) {
    case 'OPEN':
      return 'default';
    case 'COMPLETED':
      return 'secondary';
    case 'DRAFT':
    case 'SELECTION':
    case 'ONGOING':
    default:
      return 'secondary';
  }
}

function getStatusLabel(status: CampaignStatus): string {
  switch (status) {
    case 'OPEN':
      return 'Terbuka';
    case 'SELECTION':
      return 'Seleksi';
    case 'ONGOING':
      return 'Berlangsung';
    case 'COMPLETED':
      return 'Selesai';
    case 'DRAFT':
      return 'Draft';
    default:
      return status;
  }
}

function getApplicationStatusBadgeVariant(
  status: ApplicationStatus
): 'default' | 'secondary' | 'destructive' {
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

function getApplicationStatusLabel(status: ApplicationStatus): string {
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

function getCampaignTypeLabel(type: CampaignType): string {
  switch (type) {
    case 'PRODUCT_SEEDING':
      return 'Product Seeding';
    case 'STORE_VISIT':
      return 'Store Visit';
    case 'DELIVERY_REVIEW':
      return 'Delivery Review';
    default:
      return type;
  }
}

function getRewardTypeLabel(type: RewardType): string {
  switch (type) {
    case 'FREE_PRODUCT':
      return 'Free Product';
    case 'FREE_PRODUCT_PLUS_FEE':
      return 'Free Product + Fee';
    case 'CASHBACK_AFTER_PURCHASE':
      return 'Cashback';
    default:
      return type;
  }
}

function getPromoTypeLabel(type: PromoType): string {
  switch (type) {
    case 'PHYSICAL_PRODUCT':
      return 'Physical Product';
    case 'STORE_VISIT':
      return 'Store Visit';
    case 'SERVICE':
      return 'Service';
    default:
      return type;
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

function getGoalLabel(goal: CampaignGoal): string {
  switch (goal) {
    case 'BRAND_AWARENESS':
      return 'Brand Awareness';
    case 'REVIEW_MARKETPLACE':
      return 'Review Marketplace';
    case 'SOCIAL_CONTENT':
      return 'Social Content';
    case 'TRAFFIC_TO_STORE':
      return 'Traffic to Store';
    case 'COLLECT_UGC':
      return 'Collect UGC';
    default:
      return goal;
  }
}

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const campaignId = params.id as string;
  const [showApplyDialog, setShowApplyDialog] = useState(false);

  const { data: campaign, isLoading, error } = useCampaignDetail(campaignId);
  const { data: applicationsData } = useCreatorApplications();

  // Find user's application for this campaign
  const userApplication = useMemo(() => {
    if (!applicationsData?.data || !campaignId) return null;
    return applicationsData.data.find((app) => app.campaign.id === campaignId);
  }, [applicationsData, campaignId]);

  // Check if campaign is still open for applications
  const isOpenForApplication = useMemo(() => {
    if (!campaign) return false;
    const now = new Date();
    const applyEnd = new Date(campaign.applyEndDate);
    return campaign.status === 'OPEN' && now < applyEnd;
  }, [campaign]);

  // Get required platforms from deliverables
  const requiredPlatforms = useMemo(() => {
    if (!campaign?.deliverables) return [];
    return campaign.deliverables.map((d) => d.deliverableType);
  }, [campaign]);

  // Get creator profile to check platforms
  const { data: creatorProfile } = useCreatorProfile();

  // Map deliverable types to platform types
  const deliverableToPlatformMap: Partial<Record<DeliverableType, SocialPlatformType>> = {
    INSTAGRAM_POST: 'INSTAGRAM',
    INSTAGRAM_REELS: 'INSTAGRAM',
    INSTAGRAM_STORY: 'INSTAGRAM',
    TIKTOK_VIDEO: 'TIKTOK',
    YOUTUBE_SHORT: 'YOUTUBE',
    YOUTUBE_VIDEO: 'YOUTUBE',
    BLOG_ARTICLE: 'BLOG',
    // MARKETPLACE_REVIEW doesn't map to a specific platform type, so we'll skip it
  };

  // Get required platform types from deliverables
  const requiredPlatformTypes = useMemo(() => {
    if (!requiredPlatforms.length) return [];
    const platformTypes = requiredPlatforms
      .map((dt) => deliverableToPlatformMap[dt])
      .filter((pt): pt is SocialPlatformType => pt !== undefined);
    // Remove duplicates
    return Array.from(new Set(platformTypes));
  }, [requiredPlatforms]);

  // Check if creator has all required platforms
  const hasRequiredPlatforms = useMemo(() => {
    if (!creatorProfile?.platforms || !requiredPlatformTypes.length) return true;
    const creatorPlatformTypes = creatorProfile.platforms.map((p) => p.platformType);
    return requiredPlatformTypes.every((required) => creatorPlatformTypes.includes(required));
  }, [creatorProfile, requiredPlatformTypes]);

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-6xl">
        <SkeletonCard />
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="container mx-auto max-w-6xl">
        <ErrorState
          title="Campaign tidak ditemukan"
          description="Campaign yang Anda cari tidak ditemukan atau telah dihapus."
          onRetry={() => router.refresh()}
        />
      </div>
    );
  }

  const availableSlots = campaign.slots - (campaign.acceptedCount || 0);
  const canApply = isOpenForApplication && !userApplication && hasRequiredPlatforms;

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
              <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                  <div className="flex items-start gap-2 sm:gap-3">
                    {campaign.brand?.logoUrl && (
                      <img
                        src={campaign.brand.logoUrl}
                        alt={campaign.brand.name}
                        className="h-10 w-10 flex-shrink-0 rounded-full object-cover sm:h-12 sm:w-12 md:h-16 md:w-16"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="mb-1.5 sm:mb-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h1 className="text-lg font-bold sm:text-xl md:text-2xl break-words">{campaign.title}</h1>
                        {campaign.brand?.verifyStatus === 'VERIFIED' && (
                          <Badge variant="default" className="text-xs flex-shrink-0">
                            <Shield className="mr-1 h-3 w-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted-foreground">
                        <Building2 className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="break-words">{campaign.brand?.name}</span>
                        {campaign.brand?.category && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span className="break-words">{campaign.brand.category}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    <Badge variant={getStatusBadgeVariant(campaign.status)} className="text-xs">
                      {getStatusLabel(campaign.status)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">{getCampaignTypeLabel(campaign.campaignType)}</Badge>
                    <Badge variant="secondary" className="text-xs">{getRewardTypeLabel(campaign.rewardType)}</Badge>
                    {userApplication && (
                      <Badge variant={getApplicationStatusBadgeVariant(userApplication.status)} className="text-xs">
                        {getApplicationStatusLabel(userApplication.status)}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                    <Share2 className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Product Information */}
          {campaign.productImages && campaign.productImages.length > 0 && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Product Information</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
                    {campaign.productImages.map((image, index) => (
                      <div key={index} className="relative aspect-square overflow-hidden rounded-lg">
                        <img
                          src={image}
                          alt={`${campaign.productName} ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1.5 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold break-words">{campaign.productName}</h3>
                    {campaign.normalPrice && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Harga Normal: <span className="font-medium">{formatIDRCurrency(campaign.normalPrice)}</span>
                      </p>
                    )}
                    {campaign.estimatedProductValue && (
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Estimasi Nilai Product: <span className="font-medium">{formatIDRCurrency(campaign.estimatedProductValue)}</span>
                      </p>
                    )}
                    {campaign.productLink && (
                      <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm w-full sm:w-auto">
                        <a href={campaign.productLink} target="_blank" rel="noopener noreferrer">
                          Lihat Product
                          <ExternalLink className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Campaign Details */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Detail Campaign</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
              {campaign.goals && campaign.goals.length > 0 && (
                <div>
                  <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                    <Target className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                    Campaign Goals
                  </div>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {campaign.goals.map((goal, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {getGoalLabel(goal)}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <Tag className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Tipe Campaign</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">{getCampaignTypeLabel(campaign.campaignType)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-1.5 sm:gap-2">
                  <Gift className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Tipe Promo</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">{getPromoTypeLabel(campaign.promoType)}</p>
                  </div>
                </div>
              </div>
              {campaign.briefAttachmentUrl && (
                <div>
                  <Button variant="outline" size="sm" asChild className="text-xs sm:text-sm w-full sm:w-auto">
                    <a href={campaign.briefAttachmentUrl} download>
                      <Download className="mr-1.5 sm:mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                      Download Brief
                    </a>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Deliverables */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Deliverables</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Konten yang harus dibuat untuk campaign ini</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
              {campaign.deliverables.map((deliverable) => (
                <div key={deliverable.id} className="rounded-lg border p-3 sm:p-4">
                  <div className="mb-2 sm:mb-3 flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs">
                      {getDeliverableTypeLabel(deliverable.deliverableType)}
                    </Badge>
                    <span className="text-xs sm:text-sm text-muted-foreground flex-shrink-0">
                      {deliverable.quantity}x
                    </span>
                  </div>
                  {deliverable.captionGuideline && (
                    <div className="mb-2">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Caption Guidelines:</p>
                      <p className="text-xs sm:text-sm break-words">{deliverable.captionGuideline}</p>
                    </div>
                  )}
                  {deliverable.requiredHashtags && deliverable.requiredHashtags.length > 0 && (
                    <div className="mb-2">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Required Hashtags:</p>
                      <div className="flex flex-wrap gap-1">
                        {deliverable.requiredHashtags.map((tag, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {deliverable.requiredMentions && deliverable.requiredMentions.length > 0 && (
                    <div className="mb-2">
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Required Mentions:</p>
                      <div className="flex flex-wrap gap-1">
                        {deliverable.requiredMentions.map((mention, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            @{mention}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  {deliverable.promoCodeOrLink && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Promo Code/Link:</p>
                      <p className="text-xs sm:text-sm font-mono break-all">{deliverable.promoCodeOrLink}</p>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              <div className="space-y-2.5 sm:space-y-3">
                <div className="flex items-start gap-2 sm:gap-3">
                  <Calendar className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Application Period</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {formatDate(campaign.applyStartDate)} - {formatDate(campaign.applyEndDate)}
                    </p>
                  </div>
                </div>
                {campaign.announcementDate && (
                  <div className="flex items-start gap-2 sm:gap-3">
                    <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs sm:text-sm font-medium">Announcement Date</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        {formatDate(campaign.announcementDate)}
                      </p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-2 sm:gap-3">
                  <Clock className="mt-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm font-medium">Post Deadline</p>
                    <p className="text-xs sm:text-sm text-muted-foreground break-words">
                      {formatDate(campaign.postDeadline)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Brand Information */}
          {campaign.brand && (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Tentang Brand</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
                <div className="flex items-start gap-2 sm:gap-3">
                  {campaign.brand.logoUrl && (
                    <img
                      src={campaign.brand.logoUrl}
                      alt={campaign.brand.name}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold break-words">{campaign.brand.name}</h3>
                    {campaign.brand.description && (
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground break-words">{campaign.brand.description}</p>
                    )}
                    {(campaign.brand.city || campaign.brand.province) && (
                      <div className="mt-1.5 sm:mt-2 flex items-center gap-1 text-xs sm:text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="break-words">
                          {[campaign.brand.city, campaign.brand.province].filter(Boolean).join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                {campaign.brand.channels && campaign.brand.channels.length > 0 && (
                  <div>
                    <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium">Brand Channels</p>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      {campaign.brand.channels.map((channel, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          asChild
                          className="text-xs sm:text-sm"
                        >
                          <a href={channel.url} target="_blank" rel="noopener noreferrer">
                            {channel.label || channel.type}
                            <ExternalLink className="ml-1.5 sm:ml-2 h-3 w-3 sm:h-3.5 sm:w-3.5" />
                          </a>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4 sm:space-y-6">
          {/* Rewards & Compensation */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Rewards & Compensation</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
              <div>
                <p className="mb-1 text-xs sm:text-sm font-medium">Reward Type</p>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">{getRewardTypeLabel(campaign.rewardType)}</p>
              </div>
              {campaign.feePerCreator && (
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-medium">Fee per Creator</p>
                  <p className="text-base sm:text-lg font-semibold text-green-600">
                    {formatIDRCurrency(campaign.feePerCreator)}
                  </p>
                </div>
              )}
              {campaign.estimatedProductValue && (
                <div>
                  <p className="mb-1 text-xs sm:text-sm font-medium">Estimated Product Value</p>
                  <p className="text-xs sm:text-sm font-medium">{formatIDRCurrency(campaign.estimatedProductValue)}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Requirements */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Requirements</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0 space-y-3 sm:space-y-4">
              <div>
                <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                  <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  Slots Available
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  {availableSlots} / {campaign.slots} tersedia
                </p>
              </div>
              <div>
                <div className="mb-1.5 sm:mb-2 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-medium">
                  <MapPin className="h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0" />
                  Eligible Regions
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground break-words">
                  {campaign.eligibleRegions.length > 0
                    ? campaign.eligibleRegions.join(', ')
                    : 'Semua daerah'}
                </p>
              </div>
              {campaign.requirePreApproval && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <FileText className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-muted-foreground">Pre-approval required</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Application Status / Action */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Application</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
              {userApplication ? (
                <div className="space-y-2.5 sm:space-y-3">
                  <div>
                    <p className="mb-1.5 sm:mb-2 text-xs sm:text-sm font-medium">Status Aplikasi</p>
                    <Badge variant={getApplicationStatusBadgeVariant(userApplication.status)} className="text-xs">
                      {getApplicationStatusLabel(userApplication.status)}
                    </Badge>
                  </div>
                  <div>
                    <p className="mb-1 text-xs text-muted-foreground">Tanggal Apply</p>
                    <p className="text-xs sm:text-sm break-words">{formatDateTimeShort(userApplication.createdAt)}</p>
                  </div>
                  {userApplication.applyNote && (
                    <div>
                      <p className="mb-1 text-xs text-muted-foreground">Catatan</p>
                      <p className="text-xs sm:text-sm break-words">{userApplication.applyNote}</p>
                    </div>
                  )}
                  {userApplication.status === 'ACCEPTED' && (
                    <Button
                      className="w-full text-xs sm:text-sm"
                      onClick={() => router.push(routes.creator.tasks)}
                    >
                      Lihat Tasks
                    </Button>
                  )}
                </div>
              ) : canApply ? (
                <div className="space-y-2.5 sm:space-y-3">
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Belum apply ke campaign ini. Klik tombol di bawah untuk apply.
                  </p>
                  <Button
                    className="w-full text-xs sm:text-sm"
                    onClick={() => setShowApplyDialog(true)}
                  >
                    Apply ke Campaign
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5 sm:space-y-3">
                  {!isOpenForApplication ? (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Campaign ini sudah tidak menerima aplikasi baru.
                    </p>
                  ) : !hasRequiredPlatforms ? (
                    <div className="space-y-2">
                      <div className="rounded-lg border border-orange-500/50 bg-orange-500/10 p-3">
                        <div className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm text-orange-700 dark:text-orange-400">
                              Anda belum memiliki platform sosial media yang diperlukan untuk campaign ini! Silakan daftarkan platform yang diperlukan di{' '}
                              <button
                                onClick={() => router.push(routes.creator.profile)}
                                className="font-semibold underline hover:text-orange-800 dark:hover:text-orange-300"
                              >
                                profile
                              </button>
                              .
                            </p>
                          </div>
                        </div>
                      </div>
                      <Button
                        className="w-full text-xs sm:text-sm"
                        disabled
                        variant="outline"
                      >
                        Apply ke Campaign
                      </Button>
                    </div>
                  ) : (
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Anda tidak dapat apply ke campaign ini.
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Apply Dialog */}
      <ApplyCampaignDialog
        campaignId={campaignId}
        open={showApplyDialog}
        onOpenChange={setShowApplyDialog}
        requiredPlatforms={requiredPlatforms}
      />
    </div>
  );
}


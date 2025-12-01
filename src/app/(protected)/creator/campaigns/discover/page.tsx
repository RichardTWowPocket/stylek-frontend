'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDiscoverCampaigns } from '@/lib/hooks/creator/useDiscoverCampaigns';
import { useDiscoverCampaignFiltersStore } from '@/store/discoverCampaignFilters.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  MapPin,
  Tag,
  Gift,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import type {
  DeliverableType,
  RewardType,
  CampaignType,
  PromoType,
  Campaign,
} from '@/lib/api/campaigns';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDate } from '@/lib/utils/formatDate';

const platformOptions: Array<{ value: DeliverableType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua Platform' },
  { value: 'INSTAGRAM_POST', label: 'Instagram Post' },
  { value: 'INSTAGRAM_REELS', label: 'Instagram Reels' },
  { value: 'INSTAGRAM_STORY', label: 'Instagram Story' },
  { value: 'TIKTOK_VIDEO', label: 'TikTok Video' },
  { value: 'YOUTUBE_SHORT', label: 'YouTube Short' },
  { value: 'YOUTUBE_VIDEO', label: 'YouTube Video' },
  { value: 'MARKETPLACE_REVIEW', label: 'Marketplace Review' },
  { value: 'BLOG_ARTICLE', label: 'Blog Article' },
];

const rewardTypeOptions: Array<{ value: RewardType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua Reward' },
  { value: 'FREE_PRODUCT', label: 'Free Product' },
  { value: 'FREE_PRODUCT_PLUS_FEE', label: 'Free Product + Fee' },
  { value: 'CASHBACK_AFTER_PURCHASE', label: 'Cashback' },
];

const campaignTypeOptions: Array<{ value: CampaignType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua Tipe' },
  { value: 'PRODUCT_SEEDING', label: 'Product Seeding' },
  { value: 'STORE_VISIT', label: 'Store Visit' },
  { value: 'DELIVERY_REVIEW', label: 'Delivery Review' },
];

const promoTypeOptions: Array<{ value: PromoType | 'ALL'; label: string }> = [
  { value: 'ALL', label: 'Semua Promo' },
  { value: 'PHYSICAL_PRODUCT', label: 'Physical Product' },
  { value: 'STORE_VISIT', label: 'Store Visit' },
  { value: 'SERVICE', label: 'Service' },
];

function getRewardTypeLabel(rewardType: RewardType): string {
  switch (rewardType) {
    case 'FREE_PRODUCT':
      return 'Free Product';
    case 'FREE_PRODUCT_PLUS_FEE':
      return 'Free Product + Fee';
    case 'CASHBACK_AFTER_PURCHASE':
      return 'Cashback';
    default:
      return rewardType;
  }
}

function CampaignCard({ campaign }: { campaign: Campaign }) {
  const router = useRouter();
  const availableSlots = campaign.slots - (campaign.acceptedCount || 0);
  const isOpen = new Date(campaign.applyEndDate) > new Date();

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
              <Badge variant="outline" className="text-xs">{campaign.campaignType}</Badge>
              <Badge variant="secondary" className="text-xs">{getRewardTypeLabel(campaign.rewardType)}</Badge>
              {campaign.brand?.verifyStatus === 'VERIFIED' && (
                <Badge variant="default" className="text-xs">Verified Brand</Badge>
              )}
            </div>
          </div>
          {isOpen && (
            <Badge variant="default" className="ml-2 flex-shrink-0 text-xs">
              Open
            </Badge>
          )}
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
          <div className="flex items-center gap-2">
            <Gift className="h-3 w-3 flex-shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
            <span className="text-muted-foreground">Product:</span>
            <span className="font-medium truncate">{campaign.productName}</span>
          </div>
          {campaign.feePerCreator && (
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Fee:</span>
              <span className="font-semibold text-green-600">
                {formatIDRCurrency(campaign.feePerCreator)}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Slots:</span>
            <span className="font-medium">
              {availableSlots} / {campaign.slots} tersedia
            </span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="h-3 w-3 flex-shrink-0 text-muted-foreground mt-0.5 sm:h-4 sm:w-4" />
            <span className="text-muted-foreground line-clamp-2">
              {campaign.eligibleRegions.length > 0
                ? campaign.eligibleRegions.join(', ')
                : 'Semua daerah'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Apply sampai:</span>
            <span className="font-medium">{formatDate(campaign.applyEndDate)}</span>
          </div>
        </div>

        {/* Deliverables */}
        <div className="mb-3 sm:mb-4">
          <p className="mb-1.5 text-xs font-medium text-muted-foreground sm:mb-2 sm:text-sm">Deliverables:</p>
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {campaign.deliverables.map((deliverable) => (
              <Badge key={deliverable.id} variant="outline" className="text-xs">
                {deliverable.deliverableType} ({deliverable.quantity}x)
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col gap-2 border-t pt-3 sm:flex-row sm:items-center sm:justify-between sm:pt-4">
          <span className="text-xs text-muted-foreground">
            {campaign.applicationCount || 0} aplikasi diterima
          </span>
          <Button variant="outline" size="sm" asChild onClick={(e) => e.stopPropagation()} className="w-full sm:w-auto">
            <Link href={routes.creator.campaignDetail(campaign.id)}>
              Lihat Detail
              <ExternalLink className="ml-2 h-3 w-3" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}

export default function DiscoverCampaignsPage() {
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);
  const {
    search,
    category,
    location,
    city,
    province,
    platform,
    rewardType,
    campaignType,
    promoType,
    page,
    pageSize,
    setSearch,
    setCategory,
    setLocation,
    setCity,
    setProvince,
    setPlatform,
    setRewardType,
    setCampaignType,
    setPromoType,
    setPage,
    resetFilters,
  } = useDiscoverCampaignFiltersStore();

  // Build query params
  const queryParams: any = {
    page,
    pageSize,
  };
  if (search) queryParams.search = search;
  if (category) queryParams.category = category;
  if (location) queryParams.location = location;
  if (city) queryParams.city = city;
  if (province) queryParams.province = province;
  if (platform !== 'ALL') queryParams.platform = platform;
  if (rewardType !== 'ALL') queryParams.rewardType = rewardType;
  if (campaignType !== 'ALL') queryParams.campaignType = campaignType;
  if (promoType !== 'ALL') queryParams.promoType = promoType;

  const { data, isLoading, error, refetch } = useDiscoverCampaigns(queryParams);

  const campaigns = data?.data || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / pageSize);

  const hasActiveFilters =
    search ||
    category ||
    location ||
    city ||
    province ||
    platform !== 'ALL' ||
    rewardType !== 'ALL' ||
    campaignType !== 'ALL' ||
    promoType !== 'ALL';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Discover Campaigns</h1>
        <p className="text-sm text-muted-foreground sm:text-base">Temukan campaign yang sesuai dengan Anda</p>
      </div>

      {/* Search and Filter Bar */}
      <Card className="p-3 sm:p-4">
        <div className="space-y-3 sm:space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari campaign atau brand..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 text-sm sm:text-base"
            />
          </div>

          {/* Filter Toggle */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filter
              {hasActiveFilters && (
                <Badge variant="default" className="ml-2 text-xs">
                  {[
                    platform !== 'ALL' ? 1 : 0,
                    rewardType !== 'ALL' ? 1 : 0,
                    campaignType !== 'ALL' ? 1 : 0,
                    promoType !== 'ALL' ? 1 : 0,
                    location ? 1 : 0,
                    city ? 1 : 0,
                    province ? 1 : 0,
                  ].reduce((a, b) => a + b, 0)}
                </Badge>
              )}
            </Button>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={resetFilters} className="w-full sm:w-auto">
                <X className="mr-2 h-4 w-4" />
                Reset
              </Button>
            )}
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="grid gap-3 border-t pt-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4 sm:pt-4">
              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Platform</label>
                <Select value={platform} onValueChange={(value) => setPlatform(value as any)}>
                  <SelectTrigger className="text-sm sm:text-base">
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

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Reward Type</label>
                <Select value={rewardType} onValueChange={(value) => setRewardType(value as any)}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rewardTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Campaign Type</label>
                <Select
                  value={campaignType}
                  onValueChange={(value) => setCampaignType(value as any)}
                >
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {campaignTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Promo Type</label>
                <Select value={promoType} onValueChange={(value) => setPromoType(value as any)}>
                  <SelectTrigger className="text-sm sm:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {promoTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Location</label>
                <Input
                  placeholder="Kota atau provinsi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">City</label>
                <Input
                  placeholder="Kota"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-medium sm:text-sm">Province</label>
                <Input
                  placeholder="Provinsi"
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="text-sm sm:text-base"
                />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Campaign List */}
      {isLoading ? (
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
          {[...Array(6)].map((_, i) => (
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
          icon={Search}
          title="Tidak ada campaign ditemukan"
          description={
            hasActiveFilters
              ? 'Coba ubah filter atau reset untuk melihat lebih banyak campaign.'
              : 'Belum ada campaign yang tersedia saat ini.'
          }
          action={
            hasActiveFilters ? (
              <Button variant="outline" onClick={resetFilters} size="sm" className="w-full sm:w-auto">
                Reset Filter
              </Button>
            ) : undefined
          }
        />
      ) : (
        <>
          <div className="mb-3 text-xs text-muted-foreground sm:mb-4 sm:text-sm">
            Menampilkan {campaigns.length} dari {total} campaign
          </div>
          <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.id} campaign={campaign} />
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



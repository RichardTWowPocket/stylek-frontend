'use client';

import { useSession } from 'next-auth/react';
import { Wallet, FolderKanban, FileCheck, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { useBrandProfile, useBrandWalletSummary, useBrandCampaignSummary } from '@/lib/hooks/brand/useBrand';

export default function BrandDashboardPage() {
  const { data: session } = useSession();
  const { data: profile, isLoading: profileLoading } = useBrandProfile();
  const { data: wallet, isLoading: walletLoading } = useBrandWalletSummary();
  const { data: campaigns, isLoading: campaignsLoading } = useBrandCampaignSummary();

  const isLoading = profileLoading || walletLoading || campaignsLoading;
  const brandName = profile?.name || 'Brand';

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
            <p className="text-sm text-muted-foreground sm:text-base">Memuat...</p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  const verificationStatus = profile?.verifyStatus || 'UNVERIFIED';
  const availableBalance = wallet?.availableBalance || 0;
  const lockedBalance = wallet?.lockedBalance || 0;
  const activeCampaigns = campaigns?.activeCount || 0;
  const pendingReviews = campaigns?.pendingReviewCount || 0;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Halo, {brandName}</h1>
          <div className="mt-2">
            <Badge variant={verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
              {verificationStatus === 'VERIFIED' ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href={routes.brand.campaigns + '/new'}>
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Buat Campaign Baru</span>
            <span className="sm:hidden">Buat Campaign</span>
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
        <StatCard
          label="Available Balance"
          value={`Rp ${availableBalance.toLocaleString('id-ID')}`}
          icon={Wallet}
        />
        <StatCard
          label="Locked Balance"
          value={`Rp ${lockedBalance.toLocaleString('id-ID')}`}
          icon={Wallet}
        />
        <StatCard
          label="Campaign Aktif"
          value={activeCampaigns}
          icon={FolderKanban}
        />
        <StatCard
          label="Menunggu Review"
          value={pendingReviews}
          icon={FileCheck}
        />
      </div>

      {/* Recent Campaigns */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card className="p-4 sm:p-6">
          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold sm:text-lg">Campaign Terbaru</h2>
            <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
              <Link href={routes.brand.campaigns}>Lihat semua</Link>
            </Button>
          </div>
          {campaigns?.recentCampaigns && campaigns.recentCampaigns.length > 0 ? (
            <div className="space-y-2">
              {campaigns.recentCampaigns.slice(0, 5).map((campaign: any) => (
                <div
                  key={campaign.id}
                  className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-sm sm:text-base">{campaign.title}</p>
                    <p className="text-xs text-muted-foreground sm:text-sm">{campaign.status}</p>
                  </div>
                  <Badge className="w-fit">{campaign.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="Belum ada campaign"
              description="Mulai dengan membuat campaign pertama Anda"
              action={
                <Button asChild size="sm">
                  <Link href={routes.brand.campaigns + '/new'}>Buat Campaign</Link>
                </Button>
              }
            />
          )}
        </Card>

        <Card className="p-4 sm:p-6">
          <div className="mb-4">
            <h2 className="text-base font-semibold sm:text-lg">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" size="sm" asChild>
              <Link href={routes.brand.campaigns + '/new'}>
                <Plus className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Buat Campaign Baru</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm" asChild>
              <Link href={routes.brand.campaigns}>
                <FileCheck className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Lihat Applicants</span>
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" size="sm" asChild>
              <Link href={routes.brand.wallet}>
                <Wallet className="mr-2 h-4 w-4" />
                <span className="text-sm sm:text-base">Top-up Saldo</span>
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

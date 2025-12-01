'use client';

import { Wallet, Clock, Search, FolderKanban } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/common/EmptyState';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { useCreatorProfile, useCreatorWalletSummary, useCreatorCampaignSummary } from '@/lib/hooks/creator/useCreator';

export default function CreatorDashboardPage() {
  const { data: profile, isLoading: profileLoading } = useCreatorProfile();
  const { data: wallet, isLoading: walletLoading } = useCreatorWalletSummary();
  const { data: campaigns, isLoading: campaignsLoading } = useCreatorCampaignSummary();

  const isLoading = profileLoading || walletLoading || campaignsLoading;
  const displayName = profile?.displayName || 'Creator';

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Dashboard</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Memuat...</p>
        </div>
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-lg bg-muted sm:h-32" />
          ))}
        </div>
      </div>
    );
  }

  const verificationStatus = profile?.verificationStatus || 'UNVERIFIED';
  const walletBalance = wallet?.balance || 0;
  const pendingEarnings = wallet?.pendingEarnings || 0;
  const ongoingCampaigns = campaigns?.ongoingCount || 0;
  const nearestDeadline = campaigns?.nearestDeadline;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Hero Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Halo, {displayName}</h1>
          <div className="mt-2">
            <Badge variant={verificationStatus === 'SOCIAL_VERIFIED' ? 'default' : 'secondary'} className="text-xs sm:text-sm">
              {verificationStatus === 'SOCIAL_VERIFIED' ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto" size="sm">
          <Link href={routes.creator.discoverCampaigns}>
            <Search className="mr-2 h-4 w-4" />
            Cari Campaign
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:gap-4">
        <StatCard
          label="Wallet Balance"
          value={`Rp ${walletBalance.toLocaleString('id-ID')}`}
          icon={Wallet}
        />
        <StatCard
          label="Pending Earnings"
          value={`Rp ${pendingEarnings.toLocaleString('id-ID')}`}
          icon={Wallet}
        />
        <StatCard
          label="Campaign Ongoing"
          value={ongoingCampaigns}
          icon={FolderKanban}
        />
        <StatCard
          label="Deadline Terdekat"
          value={nearestDeadline ? new Date(nearestDeadline).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }) : '-'}
          icon={Clock}
        />
      </div>

      {/* Recommended Campaigns */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-2 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Rekomendasi Campaign untuk Kamu</h2>
          <Button variant="ghost" size="sm" asChild className="w-full sm:w-auto">
            <Link href={routes.creator.discoverCampaigns}>Lihat semua</Link>
          </Button>
        </div>
        <EmptyState
          icon={Search}
          title="Belum ada rekomendasi"
          description="Mulai dengan mencari campaign yang sesuai dengan profil Anda"
          action={
            <Button asChild size="sm" className="w-full sm:w-auto">
              <Link href={routes.creator.discoverCampaigns}>Cari Campaign</Link>
            </Button>
          }
        />
      </Card>
    </div>
  );
}

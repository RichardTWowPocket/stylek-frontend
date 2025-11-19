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
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Memuat...</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
    <div className="space-y-6">
      {/* Hero Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Halo, {brandName}</h1>
          <div className="mt-2">
            <Badge variant={verificationStatus === 'VERIFIED' ? 'default' : 'secondary'}>
              {verificationStatus === 'VERIFIED' ? 'Verified' : 'Unverified'}
            </Badge>
          </div>
        </div>
        <Button asChild>
          <Link href={routes.brand.campaigns + '/new'}>
            <Plus className="mr-2 h-4 w-4" />
            Buat Campaign Baru
          </Link>
        </Button>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Campaign Terbaru</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href={routes.brand.campaigns}>Lihat semua</Link>
            </Button>
          </div>
          {campaigns?.recentCampaigns && campaigns.recentCampaigns.length > 0 ? (
            <div className="space-y-2">
              {campaigns.recentCampaigns.slice(0, 5).map((campaign: any) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div>
                    <p className="font-medium">{campaign.title}</p>
                    <p className="text-sm text-muted-foreground">{campaign.status}</p>
                  </div>
                  <Badge>{campaign.status}</Badge>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FolderKanban}
              title="Belum ada campaign"
              description="Mulai dengan membuat campaign pertama Anda"
              action={
                <Button asChild>
                  <Link href={routes.brand.campaigns + '/new'}>Buat Campaign</Link>
                </Button>
              }
            />
          )}
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
          </div>
          <div className="space-y-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={routes.brand.campaigns + '/new'}>
                <Plus className="mr-2 h-4 w-4" />
                Buat Campaign Baru
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={routes.brand.campaigns}>
                <FileCheck className="mr-2 h-4 w-4" />
                Lihat Applicants
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href={routes.brand.wallet}>
                <Wallet className="mr-2 h-4 w-4" />
                Top-up Saldo
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

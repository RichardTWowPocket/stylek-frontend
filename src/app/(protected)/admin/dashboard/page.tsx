'use client';

import { Building2, ArrowUpCircle, ArrowDownCircle, Lock } from 'lucide-react';
import { StatCard } from '@/components/common/StatCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import { useAdminSummary } from '@/lib/hooks/admin/useAdmin';

export default function AdminDashboardPage() {
  const { data: summary, isLoading } = useAdminSummary();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Memuat...</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Ringkasan aktivitas platform</p>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Brand Pending Verification"
          value={summary?.brandsPendingVerification || 0}
          icon={Building2}
        />
        <StatCard
          label="Top-up Pending"
          value={summary?.topupsPending || 0}
          icon={ArrowUpCircle}
        />
        <StatCard
          label="Withdrawal Pending"
          value={summary?.withdrawalsPending || 0}
          icon={ArrowDownCircle}
        />
        <StatCard
          label="Total Locked Funds"
          value={`Rp ${(summary?.totalLockedFunds || 0).toLocaleString('id-ID')}`}
          icon={Lock}
        />
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top-up Terbaru</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href={routes.admin.topups}>Lihat semua</Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {summary?.recentTopups && summary.recentTopups.length > 0
              ? `${summary.recentTopups.length} top-up menunggu approval`
              : 'Tidak ada top-up pending'}
          </div>
        </Card>

        <Card className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Withdrawal Terbaru</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href={routes.admin.withdrawals}>Lihat semua</Link>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {summary?.recentWithdrawals && summary.recentWithdrawals.length > 0
              ? `${summary.recentWithdrawals.length} withdrawal menunggu approval`
              : 'Tidak ada withdrawal pending'}
          </div>
        </Card>
      </div>
    </div>
  );
}

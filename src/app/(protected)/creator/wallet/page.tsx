'use client';

import { useState } from 'react';
import { useCreatorWalletSummary } from '@/lib/hooks/creator/useCreatorWalletSummary';
import { useCreatorWalletTransactions } from '@/lib/hooks/creator/useCreatorWalletTransactions';
import { useCreatorWithdrawalRequests } from '@/lib/hooks/creator/useCreatorWithdrawalRequests';
import { useCreatorWalletStore } from '@/store/creatorWallet.store';
import { CreatorWithdrawModal } from '@/components/creator/CreatorWithdrawModal';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { formatIDRCurrency } from '@/lib/utils/formatCurrency';
import { formatDateTimeShort } from '@/lib/utils/formatDate';
import { Wallet, ArrowDownToLine, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';
import { routes } from '@/lib/config/routes';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { CreatorWalletTransactionType } from '@/types/wallet';

const transactionTypeOptions: Array<{
  value: CreatorWalletTransactionType | 'ALL';
  label: string;
}> = [
  { value: 'ALL', label: 'Semua' },
  { value: 'CAMPAIGN_REWARD', label: 'Campaign Reward' },
  { value: 'CASHBACK', label: 'Cashback' },
  { value: 'BONUS', label: 'Bonus' },
  { value: 'WITHDRAWAL', label: 'Withdrawal' },
  { value: 'ADJUSTMENT', label: 'Adjustment' },
];

function getStatusBadgeVariant(status: string) {
  switch (status) {
    case 'APPROVED':
      return 'default';
    case 'REJECTED':
      return 'destructive';
    case 'PENDING':
    default:
      return 'secondary';
  }
}

function getTransactionTypeBadge(type: CreatorWalletTransactionType) {
  const variants: Record<
    CreatorWalletTransactionType,
    { label: string; variant: 'default' | 'secondary' | 'destructive' }
  > = {
    CAMPAIGN_REWARD: { label: 'Reward', variant: 'default' },
    CASHBACK: { label: 'Cashback', variant: 'default' },
    BONUS: { label: 'Bonus', variant: 'default' },
    WITHDRAWAL: { label: 'Withdrawal', variant: 'destructive' },
    ADJUSTMENT: { label: 'Adjustment', variant: 'secondary' },
  };
  return variants[type] || { label: type, variant: 'secondary' };
}

export default function CreatorWalletPage() {
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const { data: summary, isLoading: summaryLoading, error: summaryError } =
    useCreatorWalletSummary();
  const {
    data: transactions,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useCreatorWalletTransactions();
  const { data: withdrawals } = useCreatorWithdrawalRequests({ page: 1, pageSize: 5 });
  const { transactionType, page, pageSize, setTransactionType, setPage } =
    useCreatorWalletStore();

  const totalPages = transactions ? Math.ceil(transactions.total / pageSize) : 1;

  if (summaryLoading) {
    return <SkeletonCard />;
  }

  if (summaryError) {
    return (
      <ErrorState
        title="Gagal memuat wallet"
        description="Terjadi kesalahan saat memuat data wallet."
      />
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-bold sm:text-2xl">Wallet</h1>
          <p className="text-sm text-muted-foreground sm:text-base">Kelola saldo dan transaksi Anda</p>
        </div>
        <Button onClick={() => setShowWithdrawModal(true)} disabled={!summary || summary.walletBalance < 50000} className="w-full sm:w-auto" size="sm">
          <ArrowDownToLine className="mr-2 h-4 w-4" />
          Tarik Dana
        </Button>
      </div>

      {/* Summary Card */}
      <Card className="p-4 sm:p-6">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-3 sm:gap-4">
          <div>
            <p className="text-xs text-muted-foreground sm:text-sm">Saldo Tersedia</p>
            <p className="text-xl font-bold sm:text-2xl">
              {summary ? formatIDRCurrency(summary.walletBalance) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground sm:text-sm">Pending Earnings</p>
            <p className="text-xl font-bold sm:text-2xl">
              {summary ? formatIDRCurrency(summary.pendingEarnings) : '-'}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground sm:text-sm">Total Earnings</p>
            <p className="text-xl font-bold sm:text-2xl">
              {summary ? formatIDRCurrency(summary.lifetimeEarnings) : '-'}
            </p>
          </div>
        </div>
      </Card>

      {/* Withdrawal Requests */}
      {withdrawals && withdrawals.data.length > 0 && (
        <Card className="p-4 sm:p-6">
          <h2 className="mb-3 text-base font-semibold sm:mb-4 sm:text-lg">Withdrawal Requests Terbaru</h2>
          <div className="space-y-2">
            {withdrawals.data.map((withdrawal) => (
              <div
                key={withdrawal.id}
                className="flex flex-col gap-2 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{formatIDRCurrency(withdrawal.amount)}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDateTimeShort(withdrawal.createdAt)}
                  </p>
                </div>
                <Badge variant={getStatusBadgeVariant(withdrawal.status)} className="w-fit text-xs">
                  {withdrawal.status}
                </Badge>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs text-muted-foreground sm:mt-4">
            Proses withdrawal membutuhkan waktu maksimal 3-5 hari kerja.
          </p>
        </Card>
      )}

      {/* Transaction History */}
      <Card className="p-4 sm:p-6">
        <div className="mb-3 flex flex-col gap-3 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold sm:text-lg">Riwayat Transaksi</h2>
          <Select
            value={transactionType}
            onValueChange={(value) => setTransactionType(value as any)}
          >
            <SelectTrigger className="w-full text-sm sm:w-[180px] sm:text-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {transactionTypeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {transactionsLoading ? (
          <SkeletonCard />
        ) : transactionsError ? (
          <ErrorState
            title="Gagal memuat transaksi"
            description="Terjadi kesalahan saat memuat riwayat transaksi."
          />
        ) : !transactions || transactions.data.length === 0 ? (
          <EmptyState
            icon={Wallet}
            title="Belum ada transaksi"
            description="Transaksi Anda akan muncul di sini."
          />
        ) : (
          <>
            <div className="space-y-2">
              {transactions.data.map((transaction) => {
                const typeBadge = getTransactionTypeBadge(transaction.type);
                const isPositive = transaction.type !== 'WITHDRAWAL';

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-3 rounded-lg border border-border p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant={typeBadge.variant} className="text-xs">
                          {typeBadge.label}
                        </Badge>
                        <span
                          className={`text-sm font-medium sm:text-base ${
                            isPositive ? 'text-green-600' : 'text-red-600'
                          }`}
                        >
                          {isPositive ? '+' : '-'}
                          {formatIDRCurrency(Math.abs(transaction.amount))}
                        </span>
                      </div>
                      {transaction.description && (
                        <p className="mt-1 text-xs text-muted-foreground sm:text-sm line-clamp-2">
                          {transaction.description}
                        </p>
                      )}
                      {transaction.relatedCampaignId && (
                        <Link
                          href={routes.creator.campaignDetail(transaction.relatedCampaignId)}
                          className="mt-1 flex items-center gap-1 text-xs text-primary hover:underline sm:text-sm"
                        >
                          Lihat Campaign
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      )}
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-xs text-muted-foreground sm:text-sm">
                        {formatDateTimeShort(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs text-muted-foreground text-center sm:text-left sm:text-sm">
                  Halaman {page} dari {totalPages}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="flex-1 sm:flex-initial"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Sebelumnya</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="flex-1 sm:flex-initial"
                  >
                    <span className="hidden sm:inline">Selanjutnya</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      {/* Withdrawal Modal */}
      <CreatorWithdrawModal open={showWithdrawModal} onOpenChange={setShowWithdrawModal} />
    </div>
  );
}


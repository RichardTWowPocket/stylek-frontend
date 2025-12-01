import { useQuery } from '@tanstack/react-query';
import {
  getCreatorWalletTransactions,
  type GetCreatorWalletTransactionsParams,
} from '@/lib/api/creator-wallet';
import { useCreatorWalletStore } from '@/store/creatorWallet.store';

export function useCreatorWalletTransactions() {
  const { transactionType, page, pageSize } = useCreatorWalletStore();

  const params: GetCreatorWalletTransactionsParams = {
    page,
    pageSize,
    type: transactionType === 'ALL' ? undefined : transactionType,
  };

  return useQuery({
    queryKey: ['creator', 'wallet', 'transactions', params],
    queryFn: () => getCreatorWalletTransactions(params),
  });
}


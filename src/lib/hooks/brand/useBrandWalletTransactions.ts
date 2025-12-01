import { useQuery } from '@tanstack/react-query';
import {
  getBrandWalletTransactions,
  type GetBrandWalletTransactionsParams,
} from '@/lib/api/brand-wallet';
import { useBrandWalletStore } from '@/store/brandWallet.store';

export function useBrandWalletTransactions() {
  const { transactionType, page, pageSize } = useBrandWalletStore();

  const params: GetBrandWalletTransactionsParams = {
    page,
    pageSize,
    type: transactionType === 'ALL' ? undefined : transactionType,
  };

  return useQuery({
    queryKey: ['brand', 'wallet', 'transactions', params],
    queryFn: () => getBrandWalletTransactions(params),
  });
}


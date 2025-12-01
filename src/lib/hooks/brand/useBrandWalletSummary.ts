import { useQuery } from '@tanstack/react-query';
import { getBrandWalletSummary } from '@/lib/api/brand-wallet';

export function useBrandWalletSummary() {
  return useQuery({
    queryKey: ['brand', 'wallet', 'summary'],
    queryFn: getBrandWalletSummary,
  });
}


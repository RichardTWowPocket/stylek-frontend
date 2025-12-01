import { useQuery } from '@tanstack/react-query';
import { getCreatorWalletSummary } from '@/lib/api/creator-wallet';

export function useCreatorWalletSummary() {
  return useQuery({
    queryKey: ['creator', 'wallet', 'summary'],
    queryFn: getCreatorWalletSummary,
  });
}


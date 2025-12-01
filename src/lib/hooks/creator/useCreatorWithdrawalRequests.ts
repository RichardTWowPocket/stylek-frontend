import { useQuery } from '@tanstack/react-query';
import {
  getWithdrawalRequests,
  type GetWithdrawalRequestsParams,
} from '@/lib/api/creator-wallet';

export function useCreatorWithdrawalRequests(params: GetWithdrawalRequestsParams = {}) {
  return useQuery({
    queryKey: ['creator', 'wallet', 'withdrawals', params],
    queryFn: () => getWithdrawalRequests(params),
  });
}


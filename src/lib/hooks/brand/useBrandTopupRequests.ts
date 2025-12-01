import { useQuery } from '@tanstack/react-query';
import { getBrandTopUpRequests, type GetBrandTopUpRequestsParams } from '@/lib/api/brand-wallet';

export function useBrandTopupRequests(params: GetBrandTopUpRequestsParams = {}) {
  return useQuery({
    queryKey: ['brand', 'wallet', 'topups', params],
    queryFn: () => getBrandTopUpRequests(params),
  });
}


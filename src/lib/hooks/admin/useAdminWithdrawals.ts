import { useQuery } from '@tanstack/react-query';
import {
  getAdminWithdrawals,
  type GetAdminWithdrawalsParams,
} from '@/lib/api/admin-withdrawals';
import { useAdminWithdrawalsStore } from '@/store/adminWithdrawals.store';

export function useAdminWithdrawals() {
  const { status, page, pageSize } = useAdminWithdrawalsStore();

  const params: GetAdminWithdrawalsParams = {
    status: status === 'ALL' ? undefined : status,
    page,
    pageSize,
  };

  return useQuery({
    queryKey: ['admin', 'withdrawals', params],
    queryFn: () => getAdminWithdrawals(params),
  });
}


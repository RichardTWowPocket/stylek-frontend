import { useQuery } from '@tanstack/react-query';
import { getAdminTopups, type GetAdminTopupsParams } from '@/lib/api/admin-topups';
import { useAdminTopupsStore } from '@/store/adminTopups.store';

export function useAdminTopups() {
  const { status, page, pageSize } = useAdminTopupsStore();

  const params: GetAdminTopupsParams = {
    status: status === 'ALL' ? undefined : status,
    page,
    pageSize,
  };

  return useQuery({
    queryKey: ['admin', 'topups', params],
    queryFn: () => getAdminTopups(params),
  });
}


import { useQuery } from '@tanstack/react-query';
import { getAdminUsers, type GetAdminUsersParams } from '@/lib/api/admin-users';
import { useAdminUsersStore } from '@/store/adminUsers.store';

export function useAdminUsers() {
  const { role, status, search, page, pageSize } = useAdminUsersStore();

  const params: GetAdminUsersParams = {
    role: role === 'ALL' ? undefined : role,
    status: status === 'ALL' ? undefined : status,
    search: search || undefined,
    page,
    pageSize,
  };

  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => getAdminUsers(params),
  });
}


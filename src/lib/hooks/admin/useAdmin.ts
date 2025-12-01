import { useQuery } from '@tanstack/react-query';
import { getAdminSummary } from '@/lib/api/admin';

export function useAdminSummary() {
  return useQuery({
    queryKey: ['admin', 'dashboard', 'summary'],
    queryFn: getAdminSummary,
  });
}


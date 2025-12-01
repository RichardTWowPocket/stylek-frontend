import { useQuery } from '@tanstack/react-query';
import {
  getCreatorApplications,
  type GetCreatorApplicationsParams,
} from '@/lib/api/campaigns';

export function useCreatorApplications(params: GetCreatorApplicationsParams = {}) {
  return useQuery({
    queryKey: ['creator', 'applications', params],
    queryFn: () => getCreatorApplications(params),
  });
}



import { useQuery } from '@tanstack/react-query';
import { getCreatorPublicProfile } from '@/lib/api/creator';

export function useCreatorPublicProfile(creatorId: string) {
  return useQuery({
    queryKey: ['creator', creatorId, 'public'],
    queryFn: () => getCreatorPublicProfile(creatorId),
    enabled: !!creatorId,
  });
}


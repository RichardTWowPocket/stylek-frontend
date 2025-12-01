import { useQuery } from '@tanstack/react-query';
import { discoverCampaigns, type DiscoverCampaignsParams } from '@/lib/api/campaigns';

export function useDiscoverCampaigns(params: DiscoverCampaignsParams = {}) {
  return useQuery({
    queryKey: ['campaigns', 'discover', params],
    queryFn: () => discoverCampaigns(params),
  });
}



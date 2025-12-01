import { useQuery } from '@tanstack/react-query';
import { getCampaignById } from '@/lib/api/campaigns';

export function useCampaignDetail(campaignId: string) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaignById(campaignId),
    enabled: !!campaignId,
  });
}




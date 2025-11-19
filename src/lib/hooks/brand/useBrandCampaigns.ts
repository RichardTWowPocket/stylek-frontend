import { useQuery } from '@tanstack/react-query';
import { getBrandCampaigns, getCampaignById, type GetBrandCampaignsParams } from '@/lib/api/campaigns';

export function useBrandCampaigns(params: GetBrandCampaignsParams = {}) {
  return useQuery({
    queryKey: ['brand', 'campaigns', params],
    queryFn: () => getBrandCampaigns(params),
  });
}

export function useCampaignDetail(campaignId: string) {
  return useQuery({
    queryKey: ['campaign', campaignId],
    queryFn: () => getCampaignById(campaignId),
    enabled: !!campaignId,
  });
}


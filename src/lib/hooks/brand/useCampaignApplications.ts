import { useQuery } from '@tanstack/react-query';
import {
  getCampaignApplications,
  type GetCampaignApplicationsParams,
} from '@/lib/api/campaigns';
import { useBrandApplicantsFiltersStore } from '@/store/brandApplicantsFilters.store';

export function useCampaignApplications(campaignId: string) {
  const { status, platform, search, page, pageSize } = useBrandApplicantsFiltersStore();

  const filters: GetCampaignApplicationsParams = {
    status: status === 'ALL' ? undefined : status,
    platform: platform === 'ALL' ? undefined : platform,
    search: search || undefined,
    page,
    pageSize,
  };

  return useQuery({
    queryKey: ['campaign', campaignId, 'applications', filters],
    queryFn: () => getCampaignApplications(campaignId, filters),
    enabled: !!campaignId,
  });
}


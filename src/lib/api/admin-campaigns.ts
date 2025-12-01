import { api } from './axios';
import type { CampaignStatus } from '@/lib/api/campaigns';

export interface AdminCampaign {
  id: string;
  title: string;
  brandName: string;
  brandId: string;
  status: CampaignStatus;
  applyStartDate: string;
  applyEndDate: string;
  slots: number;
  filledSlots: number;
}

export interface GetAdminCampaignsParams {
  status?: CampaignStatus;
  brandId?: string;
  page?: number;
  pageSize?: number;
}

export interface AdminCampaignsResponse {
  data: AdminCampaign[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getAdminCampaigns(
  params: GetAdminCampaignsParams = {}
): Promise<AdminCampaignsResponse> {
  const { status, brandId, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  if (brandId) {
    queryParams.brandId = brandId;
  }

  const res = await api.get<AdminCampaignsResponse>('/admin/campaigns', {
    params: queryParams,
  });
  return res.data;
}


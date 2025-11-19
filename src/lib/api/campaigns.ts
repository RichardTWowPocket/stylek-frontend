import { api } from './axios';

export type CampaignStatus = 'DRAFT' | 'OPEN' | 'SELECTION' | 'ONGOING' | 'COMPLETED';
export type CampaignType = 'PRODUCT_SEEDING' | 'STORE_VISIT' | 'DELIVERY_REVIEW';
export type PromoType = 'PHYSICAL_PRODUCT' | 'STORE_VISIT' | 'SERVICE';
export type RewardType = 'FREE_PRODUCT' | 'FREE_PRODUCT_PLUS_FEE' | 'CASHBACK_AFTER_PURCHASE';
export type CampaignGoal =
  | 'BRAND_AWARENESS'
  | 'REVIEW_MARKETPLACE'
  | 'SOCIAL_CONTENT'
  | 'TRAFFIC_TO_STORE'
  | 'COLLECT_UGC';

export type DeliverableType =
  | 'INSTAGRAM_POST'
  | 'INSTAGRAM_REELS'
  | 'INSTAGRAM_STORY'
  | 'TIKTOK_VIDEO'
  | 'YOUTUBE_SHORT'
  | 'YOUTUBE_VIDEO'
  | 'MARKETPLACE_REVIEW'
  | 'BLOG_ARTICLE';

export interface CampaignDeliverable {
  id: string;
  deliverableType: DeliverableType;
  quantity: number;
  captionGuideline?: string;
  requiredHashtags: string[];
  requiredMentions: string[];
  promoCodeOrLink?: string;
}

export interface Campaign {
  id: string;
  title: string;
  goals: CampaignGoal[];
  campaignType: CampaignType;
  promoType: PromoType;
  productName: string;
  productImages: string[];
  productLink?: string;
  normalPrice?: number;
  rewardType: RewardType;
  feePerCreator?: number;
  estimatedProductValue?: number;
  slots: number;
  eligibleRegions: string[];
  applyStartDate: string;
  applyEndDate: string;
  announcementDate?: string;
  postDeadline: string;
  requirePreApproval: boolean;
  briefAttachmentUrl?: string;
  status: CampaignStatus;
  createdAt: string;
  updatedAt: string;
  deliverables: CampaignDeliverable[];
  brand?: {
    id: string;
    name: string;
    logoUrl?: string;
  };
}

export interface GetBrandCampaignsParams {
  status?: CampaignStatus | 'ALL';
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface CampaignsResponse {
  data: Campaign[];
  total: number;
  page: number;
  pageSize: number;
}

export interface CreateCampaignDto {
  title: string;
  goals: CampaignGoal[];
  campaignType: CampaignType;
  promoType: PromoType;
  productName: string;
  productImages: string[];
  productLink?: string;
  normalPrice?: number;
  rewardType: RewardType;
  feePerCreator?: number;
  estimatedProductValue?: number;
  slots: number;
  eligibleRegions: string[];
  applyStartDate: string;
  applyEndDate: string;
  announcementDate?: string;
  postDeadline: string;
  requirePreApproval: boolean;
  briefAttachmentUrl?: string;
  deliverables: Array<{
    deliverableType: DeliverableType;
    quantity: number;
    captionGuideline?: string;
    requiredHashtags: string[];
    requiredMentions: string[];
    promoCodeOrLink?: string;
  }>;
}

export type UpdateCampaignDto = Partial<CreateCampaignDto>;

export async function getBrandCampaigns(
  params: GetBrandCampaignsParams = {}
): Promise<CampaignsResponse> {
  const { status, search, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status && status !== 'ALL') {
    queryParams.status = status;
  }

  if (search) {
    queryParams.search = search;
  }

  const res = await api.get<CampaignsResponse>('/brands/me/campaigns', {
    params: queryParams,
  });
  return res.data;
}

export async function getCampaignById(id: string): Promise<Campaign> {
  const res = await api.get<Campaign>(`/campaigns/${id}`);
  return res.data;
}

export async function createCampaign(data: CreateCampaignDto): Promise<Campaign> {
  const res = await api.post<Campaign>('/campaigns', data);
  return res.data;
}

export async function updateCampaign(id: string, data: UpdateCampaignDto): Promise<Campaign> {
  const res = await api.put<Campaign>(`/campaigns/${id}`, data);
  return res.data;
}

export async function publishCampaign(id: string): Promise<Campaign> {
  const res = await api.post<Campaign>(`/campaigns/${id}/publish`, {});
  return res.data;
}


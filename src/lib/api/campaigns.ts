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
    bannerUrl?: string;
    description?: string;
    category?: string;
    city?: string;
    province?: string;
    verifyStatus?: string;
    channels?: Array<{
      type: string;
      label?: string;
      url: string;
    }>;
  };
  applicationCount?: number;
  acceptedCount?: number;
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

// Campaign Applications Types & APIs
export type ApplicationStatus = 'APPLIED' | 'ACCEPTED' | 'REJECTED' | 'WAITLISTED';
export type SocialPlatformType = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'BLOG' | 'OTHER';

export interface CreatorPlatform {
  id: string;
  type: SocialPlatformType;
  handle: string;
  profileUrl?: string;
  followers?: number;
  avgViews?: number;
  avgLikes?: number;
}

export interface CreatorBasicInfo {
  id: string;
  displayName: string;
  avatarUrl?: string;
  city?: string;
  province?: string;
  mainNiche?: string;
  additionalNiches?: string[];
  platforms?: CreatorPlatform[];
}

export interface CampaignApplication {
  id: string;
  status: ApplicationStatus;
  selectedPlatform: SocialPlatformType;
  selectedPlatformHandle?: string;
  applyNote?: string;
  sampleContentUrls?: string[];
  createdAt: string;
  updatedAt: string;
  creator: CreatorBasicInfo;
}

export interface GetCampaignApplicationsParams {
  status?: ApplicationStatus;
  search?: string;
  platform?: SocialPlatformType;
  page?: number;
  pageSize?: number;
}

export interface CampaignApplicationsResponse {
  data: CampaignApplication[];
  total: number;
  page: number;
  pageSize: number;
  summary?: {
    total: number;
    applied: number;
    accepted: number;
    rejected: number;
    waitlisted: number;
  };
}

export async function getCampaignApplications(
  campaignId: string,
  params: GetCampaignApplicationsParams = {}
): Promise<CampaignApplicationsResponse> {
  const { status, search, platform, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  if (search) {
    queryParams.search = search;
  }

  if (platform) {
    queryParams.platform = platform;
  }

  const res = await api.get<CampaignApplicationsResponse>(
    `/campaigns/${campaignId}/applications`,
    { params: queryParams }
  );
  return res.data;
}

export async function acceptApplication(campaignId: string, applicationId: string): Promise<void> {
  await api.post(`/campaigns/${campaignId}/applications/${applicationId}/accept`);
}

export async function rejectApplication(campaignId: string, applicationId: string): Promise<void> {
  await api.post(`/campaigns/${campaignId}/applications/${applicationId}/reject`);
}

export async function waitlistApplication(campaignId: string, applicationId: string): Promise<void> {
  await api.post(`/campaigns/${campaignId}/applications/${applicationId}/waitlist`);
}

// Discover Campaigns Types & APIs
export interface DiscoverCampaignsParams {
  search?: string;
  category?: string;
  location?: string;
  city?: string;
  province?: string;
  platform?: DeliverableType;
  rewardType?: RewardType;
  campaignType?: CampaignType;
  promoType?: PromoType;
  page?: number;
  pageSize?: number;
}

export async function discoverCampaigns(
  params: DiscoverCampaignsParams = {}
): Promise<CampaignsResponse> {
  const { page = 1, pageSize = 20, ...filters } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  // Add filters only if they have values
  if (filters.search) queryParams.search = filters.search;
  if (filters.category) queryParams.category = filters.category;
  if (filters.location) queryParams.location = filters.location;
  if (filters.city) queryParams.city = filters.city;
  if (filters.province) queryParams.province = filters.province;
  if (filters.platform) queryParams.platform = filters.platform;
  if (filters.rewardType) queryParams.rewardType = filters.rewardType;
  if (filters.campaignType) queryParams.campaignType = filters.campaignType;
  if (filters.promoType) queryParams.promoType = filters.promoType;

  const res = await api.get<CampaignsResponse>('/campaigns', {
    params: queryParams,
  });
  return res.data;
}

export interface ApplyCampaignDto {
  selectedPlatform: SocialPlatformType;
  selectedPlatformHandle?: string;
  applyNote?: string;
  sampleContentUrls?: string[];
}

export async function applyToCampaign(
  campaignId: string,
  data: ApplyCampaignDto
): Promise<void> {
  await api.post(`/campaigns/${campaignId}/applications`, data);
}

// Creator My Campaigns Types & APIs
export interface CreatorApplication {
  id: string;
  status: ApplicationStatus;
  selectedPlatform: SocialPlatformType;
  selectedPlatformHandle?: string;
  applyNote?: string;
  sampleContentUrls?: string[];
  createdAt: string;
  updatedAt: string;
  campaign: Campaign;
  tasks: Array<{
    id: string;
    status: string;
    deliverableType: DeliverableType;
  }>;
}

export interface GetCreatorApplicationsParams {
  status?: ApplicationStatus;
  page?: number;
  pageSize?: number;
}

export interface CreatorApplicationsResponse {
  data: CreatorApplication[];
  total: number;
  page: number;
  pageSize: number;
}

export async function getCreatorApplications(
  params: GetCreatorApplicationsParams = {}
): Promise<CreatorApplicationsResponse> {
  const { status, page = 1, pageSize = 20 } = params;
  const queryParams: Record<string, string | number> = {
    page,
    pageSize,
  };

  if (status) {
    queryParams.status = status;
  }

  const res = await api.get<CreatorApplicationsResponse>('/creators/me/applications', {
    params: queryParams,
  });
  return res.data;
}


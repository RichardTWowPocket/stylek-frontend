import { api } from './axios';

export type SocialPlatformType = 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'BLOG' | 'X_TWITTER';
export type CreatorVerifyStatus = 'UNVERIFIED' | 'SOCIAL_VERIFIED' | 'KYC_VERIFIED';

export interface CreatorPlatform {
  id: string;
  type: SocialPlatformType;
  handle: string;
  profileUrl: string;
  followers: number;
  avgViews?: number;
  avgLikes?: number;
  isPrimary: boolean;
}

export interface Creator {
  id: string;
  displayName: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
  province?: string;
  mainNiche?: string;
  additionalNiches: string[];
  verificationStatus: CreatorVerifyStatus;
  platforms: CreatorPlatform[];
  stats: {
    completedCampaigns: number;
  };
}

export interface SearchCreatorsResponse {
  data: Creator[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchCreatorsParams {
  search?: string;
  mainNiche?: string;
  platform?: SocialPlatformType;
  city?: string;
  province?: string;
  page?: number;
  limit?: number;
  pageSize?: number;
}

export async function searchCreators(params: SearchCreatorsParams = {}): Promise<SearchCreatorsResponse> {
  const res = await api.get<SearchCreatorsResponse>('/brands/me/creators', { params });
  return res.data;
}

export interface InviteCreatorDto {
  creatorId: string;
  selectedPlatform: SocialPlatformType;
  selectedPlatformHandle?: string;
  message?: string;
}

export interface InviteCreatorResponse {
  application: {
    id: string;
    status: string;
    selectedPlatform: SocialPlatformType;
    createdAt: string;
  };
  tasks: Array<{
    id: string;
    deliverableType: string;
    status: string;
  }>;
}

export async function inviteCreatorToCampaign(
  campaignId: string,
  data: InviteCreatorDto,
): Promise<InviteCreatorResponse> {
  const res = await api.post<InviteCreatorResponse>(`/campaigns/${campaignId}/invite`, data);
  return res.data;
}







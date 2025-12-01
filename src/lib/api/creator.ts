import { api } from './axios';

export interface CreatorPlatform {
  id: string;
  platformType: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'BLOG' | 'OTHER';
  handle: string;
  profileUrl: string;
  followers: number;
  avgViews?: number;
  avgLikes?: number;
  isPrimary: boolean;
}

export interface CreatorProfile {
  id: string;
  userId: string;
  displayName: string;
  creatorType: 'INDIVIDUAL' | 'AGENCY_CREATOR';
  avatarUrl?: string;
  bio?: string;
  mainNiche?: string;
  additionalNiches?: string[];
  city?: string;
  province?: string;
  gender?: string;
  ageRange?: 'AGE_18_24' | 'AGE_25_34' | 'AGE_35_44' | 'AGE_45_54' | 'AGE_55_PLUS';
  verifyStatus: 'UNVERIFIED' | 'SOCIAL_VERIFIED' | 'KYC_VERIFIED';
  bankAccountName?: string;
  bankAccountNumber?: string;
  bankName?: string;
  platforms: CreatorPlatform[];
  user: {
    id: string;
    email: string | null;
    name: string | null;
    role: string;
  };
}

export interface CreatorWalletSummary {
  balance: number;
  pendingEarnings: number;
}

export interface CreatorCampaignSummary {
  ongoingCount: number;
  nearestDeadline?: string;
}

export async function getCreatorProfile(): Promise<CreatorProfile> {
  const res = await api.get<CreatorProfile>('/creators/me');
  return res.data;
}

export async function getCreatorWalletSummary(): Promise<CreatorWalletSummary> {
  const res = await api.get<CreatorWalletSummary>('/wallet/creator');
  return res.data;
}

export async function getCreatorCampaignSummary(): Promise<CreatorCampaignSummary> {
  const res = await api.get<CreatorCampaignSummary>('/creators/me/campaigns/summary');
  return res.data;
}

// Public Creator Profile (for Brand view)
export interface CreatorPublicProfile {
  id: string;
  displayName: string;
  avatarUrl?: string;
  city?: string;
  province?: string;
  mainNiche?: string;
  additionalNiches?: string[];
  verificationStatus: 'UNVERIFIED' | 'SOCIAL_VERIFIED';
  platforms: Array<{
    id: string;
    type: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'BLOG' | 'OTHER';
    handle: string;
    profileUrl?: string;
    followers?: number;
    avgViews?: number;
    avgLikes?: number;
  }>;
  stats?: {
    completedCampaigns: number;
    rating?: number;
    completionRate?: number;
  };
}

export async function getCreatorPublicProfile(creatorId: string): Promise<CreatorPublicProfile> {
  const res = await api.get<CreatorPublicProfile>(`/creators/${creatorId}/public`);
  return res.data;
}

export interface UpdateCreatorProfileDto {
  displayName?: string;
  creatorType?: 'INDIVIDUAL' | 'AGENCY_CREATOR';
  avatarUrl?: string;
  bio?: string;
  mainNiche?: string;
  additionalNiches?: string[];
  city?: string;
  province?: string;
  gender?: string;
  ageRange?: 'AGE_18_24' | 'AGE_25_34' | 'AGE_35_44' | 'AGE_45_54' | 'AGE_55_PLUS';
}

export interface CreatorPlatformDto {
  platformType: 'INSTAGRAM' | 'TIKTOK' | 'YOUTUBE' | 'BLOG' | 'OTHER';
  handle: string;
  profileUrl: string;
  followers: number;
  avgViews?: number;
  avgLikes?: number;
  isPrimary?: boolean;
}

export interface UpdateCreatorPlatformsDto {
  platforms: CreatorPlatformDto[];
}

export interface UpdateCreatorBankDto {
  bankAccountName: string;
  bankAccountNumber: string;
  bankName: string;
}

export async function updateCreatorProfile(data: UpdateCreatorProfileDto): Promise<CreatorProfile> {
  const res = await api.put<CreatorProfile>('/creators/me', data);
  return res.data;
}

export async function updateCreatorPlatforms(data: UpdateCreatorPlatformsDto): Promise<void> {
  await api.put('/creators/me/platforms', data);
}

export async function updateCreatorBank(data: UpdateCreatorBankDto): Promise<void> {
  await api.put('/creators/me/bank', data);
}


import { api } from './axios';

export interface BrandChannel {
  id: string;
  type: 'SHOPEE' | 'TOKOPEDIA' | 'TIKTOK_SHOP' | 'INSTAGRAM' | 'WEBSITE' | 'OTHER';
  label?: string;
  url: string;
}

export interface BrandProfile {
  id: string;
  name: string;
  brandType: 'BRAND' | 'AGENCY' | 'ONLINESHOP';
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  category?: string;
  city?: string;
  province?: string;
  verifyStatus: 'UNVERIFIED' | 'VERIFIED';
  verifyRejectedReason?: string;
  channels?: BrandChannel[];
}

export interface BrandWalletSummary {
  availableBalance: number;
  lockedBalance: number;
}

export interface BrandCampaignSummary {
  activeCount: number;
  pendingReviewCount: number;
  recentCampaigns: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export async function getBrandProfile(): Promise<BrandProfile> {
  const res = await api.get<BrandProfile>('/brands/me');
  return res.data;
}

export async function getBrandWalletSummary(): Promise<BrandWalletSummary> {
  const res = await api.get<BrandWalletSummary>('/wallet/brand/summary');
  return res.data;
}

export async function getBrandCampaignSummary(): Promise<BrandCampaignSummary> {
  const res = await api.get<BrandCampaignSummary>('/brands/me/campaigns/summary');
  return res.data;
}

export interface UpdateBrandProfileDto {
  name: string;
  brandType?: 'BRAND' | 'AGENCY' | 'ONLINESHOP';
  logoUrl?: string;
  bannerUrl?: string;
  description?: string;
  category?: string;
  city?: string;
  province?: string;
}

export interface BrandChannelDto {
  type: 'SHOPEE' | 'TOKOPEDIA' | 'TIKTOK_SHOP' | 'INSTAGRAM' | 'WEBSITE' | 'OTHER';
  label?: string;
  url: string;
}

export interface UpdateBrandChannelsDto {
  channels: BrandChannelDto[];
}

export interface VerifyRequestDto {
  documentUrl: string;
  notes?: string;
}

export async function updateBrandProfile(data: UpdateBrandProfileDto): Promise<BrandProfile> {
  const res = await api.put<BrandProfile>('/brands/me', data);
  return res.data;
}

export async function updateBrandChannels(data: UpdateBrandChannelsDto): Promise<void> {
  await api.put('/brands/me/channels', data);
}

export async function requestBrandVerification(data: VerifyRequestDto): Promise<void> {
  await api.post('/brands/me/verify-request', data);
}


import { api } from './axios';

export interface CreatorProfile {
  id: string;
  displayName: string;
  verificationStatus: 'UNVERIFIED' | 'SOCIAL_VERIFIED';
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


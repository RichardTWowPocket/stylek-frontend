import { useQuery } from '@tanstack/react-query';
import {
  getCreatorProfile,
  getCreatorWalletSummary,
  getCreatorCampaignSummary,
} from '@/lib/api/creator';

export function useCreatorProfile() {
  return useQuery({
    queryKey: ['creator', 'profile'],
    queryFn: getCreatorProfile,
  });
}

export function useCreatorWalletSummary() {
  return useQuery({
    queryKey: ['creator', 'wallet', 'summary'],
    queryFn: getCreatorWalletSummary,
  });
}

export function useCreatorCampaignSummary() {
  return useQuery({
    queryKey: ['creator', 'campaigns', 'summary'],
    queryFn: getCreatorCampaignSummary,
  });
}


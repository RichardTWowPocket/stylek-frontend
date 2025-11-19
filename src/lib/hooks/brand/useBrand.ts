import { useQuery } from '@tanstack/react-query';
import {
  getBrandProfile,
  getBrandWalletSummary,
  getBrandCampaignSummary,
} from '@/lib/api/brand';

export function useBrandProfile(options?: { enabled?: boolean; retry?: boolean | number }) {
  return useQuery({
    queryKey: ['brand', 'profile'],
    queryFn: getBrandProfile,
    retry: options?.retry !== undefined 
      ? options.retry 
      : (failureCount, error: any) => {
          // Don't retry on 404 errors (profile doesn't exist)
          if (error?.response?.status === 404) {
            return false;
          }
          // Retry up to 2 times for other errors
          return failureCount < 2;
        },
    retryDelay: 1000,
    enabled: options?.enabled !== false, // Default to true, can be disabled
  });
}

// Channels are included in brand profile, so we can extract them from profile
export function useBrandChannels() {
  const { data: profile } = useBrandProfile();
  return {
    data: profile?.channels || [],
    isLoading: false,
    error: null,
  };
}

export function useBrandWalletSummary() {
  return useQuery({
    queryKey: ['brand', 'wallet', 'summary'],
    queryFn: getBrandWalletSummary,
  });
}

export function useBrandCampaignSummary() {
  return useQuery({
    queryKey: ['brand', 'campaigns', 'summary'],
    queryFn: getBrandCampaignSummary,
  });
}


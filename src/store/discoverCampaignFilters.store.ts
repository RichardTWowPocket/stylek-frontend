import { create } from 'zustand';
import type { DeliverableType, RewardType, CampaignType, PromoType } from '@/lib/api/campaigns';

interface DiscoverCampaignFiltersState {
  search: string;
  category: string;
  location: string;
  city: string;
  province: string;
  platform: DeliverableType | 'ALL';
  rewardType: RewardType | 'ALL';
  campaignType: CampaignType | 'ALL';
  promoType: PromoType | 'ALL';
  page: number;
  pageSize: number;
  setSearch: (search: string) => void;
  setCategory: (category: string) => void;
  setLocation: (location: string) => void;
  setCity: (city: string) => void;
  setProvince: (province: string) => void;
  setPlatform: (platform: DeliverableType | 'ALL') => void;
  setRewardType: (rewardType: RewardType | 'ALL') => void;
  setCampaignType: (campaignType: CampaignType | 'ALL') => void;
  setPromoType: (promoType: PromoType | 'ALL') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useDiscoverCampaignFiltersStore = create<DiscoverCampaignFiltersState>((set) => ({
  search: '',
  category: '',
  location: '',
  city: '',
  province: '',
  platform: 'ALL',
  rewardType: 'ALL',
  campaignType: 'ALL',
  promoType: 'ALL',
  page: 1,
  pageSize: 20,
  setSearch: (search) => set({ search, page: 1 }),
  setCategory: (category) => set({ category, page: 1 }),
  setLocation: (location) => set({ location, page: 1 }),
  setCity: (city) => set({ city, page: 1 }),
  setProvince: (province) => set({ province, page: 1 }),
  setPlatform: (platform) => set({ platform, page: 1 }),
  setRewardType: (rewardType) => set({ rewardType, page: 1 }),
  setCampaignType: (campaignType) => set({ campaignType, page: 1 }),
  setPromoType: (promoType) => set({ promoType, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      search: '',
      category: '',
      location: '',
      city: '',
      province: '',
      platform: 'ALL',
      rewardType: 'ALL',
      campaignType: 'ALL',
      promoType: 'ALL',
      page: 1,
    }),
}));



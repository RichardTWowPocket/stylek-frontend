import { create } from 'zustand';
import type { CampaignStatus } from '@/lib/api/campaigns';

type FilterStatus = CampaignStatus | 'ALL';

interface BrandCampaignFilterState {
  status: FilterStatus;
  search: string;
  page: number;
  pageSize: number;
  setStatus: (status: FilterStatus) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useBrandCampaignFiltersStore = create<BrandCampaignFilterState>((set) => ({
  status: 'ALL',
  search: '',
  page: 1,
  pageSize: 20,
  setStatus: (status) => set({ status, page: 1 }), // Reset to page 1 when filter changes
  setSearch: (search) => set({ search, page: 1 }), // Reset to page 1 when search changes
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ status: 'ALL', search: '', page: 1, pageSize: 20 }),
}));


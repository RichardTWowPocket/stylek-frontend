import { create } from 'zustand';
import type { ApplicationStatus } from '@/lib/api/campaigns';

interface MyCampaignsFiltersState {
  status: ApplicationStatus | 'ALL';
  page: number;
  pageSize: number;
  setStatus: (status: ApplicationStatus | 'ALL') => void;
  setPage: (page: number) => void;
  resetFilters: () => void;
}

export const useMyCampaignsFiltersStore = create<MyCampaignsFiltersState>((set) => ({
  status: 'ALL',
  page: 1,
  pageSize: 20,
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  resetFilters: () =>
    set({
      status: 'ALL',
      page: 1,
    }),
}));



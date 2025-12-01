import { create } from 'zustand';
import type { ApplicationStatus, SocialPlatformType } from '@/lib/api/campaigns';

type FilterStatus = ApplicationStatus | 'ALL';
type FilterPlatform = SocialPlatformType | 'ALL';

interface BrandApplicantsFilterState {
  status: FilterStatus;
  platform: FilterPlatform;
  search: string;
  page: number;
  pageSize: number;
  setStatus: (status: FilterStatus) => void;
  setPlatform: (platform: FilterPlatform) => void;
  setSearch: (search: string) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useBrandApplicantsFiltersStore = create<BrandApplicantsFilterState>((set) => ({
  status: 'ALL',
  platform: 'ALL',
  search: '',
  page: 1,
  pageSize: 20,
  setStatus: (status) => set({ status, page: 1 }), // Reset to page 1 when filter changes
  setPlatform: (platform) => set({ platform, page: 1 }),
  setSearch: (search) => set({ search, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ status: 'ALL', platform: 'ALL', search: '', page: 1, pageSize: 20 }),
}));


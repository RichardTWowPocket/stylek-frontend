import { create } from 'zustand';
import type { TaskStatus, SocialPlatformType } from '@/lib/api/tasks';

type FilterStatus = TaskStatus | 'ALL';
type FilterPlatform = SocialPlatformType | 'ALL';

interface BrandContentFilterState {
  status: FilterStatus;
  platform: FilterPlatform;
  search: string;
  setStatus: (status: FilterStatus) => void;
  setPlatform: (platform: FilterPlatform) => void;
  setSearch: (search: string) => void;
  reset: () => void;
}

export const useBrandContentFiltersStore = create<BrandContentFilterState>((set) => ({
  status: 'ALL',
  platform: 'ALL',
  search: '',
  setStatus: (status) => set({ status }),
  setPlatform: (platform) => set({ platform }),
  setSearch: (search) => set({ search }),
  reset: () => set({ status: 'ALL', platform: 'ALL', search: '' }),
}));


import { create } from 'zustand';
import type { TopUpStatus } from '@/types/wallet';

type FilterStatus = TopUpStatus | 'ALL';

interface AdminTopupsFilterState {
  status: FilterStatus;
  page: number;
  pageSize: number;
  setStatus: (status: FilterStatus) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useAdminTopupsStore = create<AdminTopupsFilterState>((set) => ({
  status: 'PENDING',
  page: 1,
  pageSize: 20,
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ status: 'PENDING', page: 1, pageSize: 20 }),
}));


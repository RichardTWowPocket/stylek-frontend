import { create } from 'zustand';
import type { WithdrawalStatus } from '@/types/wallet';

type FilterStatus = WithdrawalStatus | 'ALL';

interface AdminWithdrawalsFilterState {
  status: FilterStatus;
  page: number;
  pageSize: number;
  setStatus: (status: FilterStatus) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  reset: () => void;
}

export const useAdminWithdrawalsStore = create<AdminWithdrawalsFilterState>((set) => ({
  status: 'PENDING',
  page: 1,
  pageSize: 20,
  setStatus: (status) => set({ status, page: 1 }),
  setPage: (page) => set({ page }),
  setPageSize: (pageSize) => set({ pageSize, page: 1 }),
  reset: () => set({ status: 'PENDING', page: 1, pageSize: 20 }),
}));

